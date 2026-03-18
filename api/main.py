import asyncio, json, os
import phonenumbers
from phonenumbers import carrier, geocoder, timezone as tz, number_type
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

# --- Phone scan endpoint ---
class PhoneScanRequest(BaseModel):
    phone: str

@app.post("/api/phone")
async def phone_scan(req: PhoneScanRequest):
    raw = req.phone.strip()
    if not raw.startswith("+"):
        raw = "+" + raw
    try:
        parsed = phonenumbers.parse(raw)
    except Exception:
        return {"error": "Invalid phone number format. Include country code (e.g. +1234567890)"}

    valid = phonenumbers.is_valid_number(parsed)
    possible = phonenumbers.is_possible_number(parsed)
    nt = number_type(parsed)
    type_map = {0: "Fixed line", 1: "Mobile", 2: "Fixed line or mobile", 3: "Toll free",
                4: "Premium rate", 5: "Shared cost", 6: "VoIP", 7: "Personal number",
                8: "Pager", 9: "UAN", 10: "Unknown", 27: "Emergency", 28: "Voicemail"}

    return {
        "valid": valid,
        "possible": possible,
        "international": phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL),
        "national": phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.NATIONAL),
        "e164": phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164),
        "country_code": parsed.country_code,
        "country": geocoder.description_for_number(parsed, "en") or "Unknown",
        "carrier": carrier.name_for_number(parsed, "en") or "Unknown",
        "line_type": type_map.get(nt, "Unknown"),
        "timezones": list(tz.time_zones_for_number(parsed)),
    }

# --- Username scan via Sherlock WebSocket ---
@app.websocket("/ws/search")
async def search(ws: WebSocket):
    await ws.accept()
    try:
        data = json.loads(await ws.receive_text())
        username = data.get("username", "").strip()
        if not username or len(username) > 64:
            await ws.send_json({"type": "error", "message": "Invalid username"})
            return

        proc = await asyncio.create_subprocess_exec(
            "sherlock", username, "--print-found", "--no-color", "--timeout", "8",
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
        )

        sites_found = []
        async for line in proc.stdout:
            text = line.decode().strip()
            if not text or "http" not in text:
                continue
            if ": http" in text:
                idx = text.index(": http")
                site_name = text[:idx].replace("[+]", "").replace("[*]", "").strip()
                url = text[idx+2:].strip()
            else:
                site_name = text.split("http")[0].replace("[+]", "").replace("[*]", "").strip().rstrip(":")
                url = "http" + text.split("http", 1)[1].strip()

            sites_found.append({"site": site_name, "url": url})
            await ws.send_json({"type": "result", "site": site_name, "url": url, "count": len(sites_found)})

        await proc.wait()
        await ws.send_json({"type": "done", "total": len(sites_found), "username": username})
    except WebSocketDisconnect:
        pass
    except Exception as e:
        try: await ws.send_json({"type": "error", "message": str(e)})
        except: pass

# --- Serve frontend ---
static = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.isdir(static):
    app.mount("/assets", StaticFiles(directory=os.path.join(static, "assets")), name="assets")
    @app.get("/{path:path}")
    async def spa(path: str):
        f = os.path.join(static, path)
        if os.path.isfile(f): return FileResponse(f)
        return FileResponse(os.path.join(static, "index.html"))
