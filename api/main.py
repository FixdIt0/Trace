import asyncio, json, subprocess, os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

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
            if not text or text.startswith("[") or text.startswith("Checking") or "username" in text.lower() and ":" not in text:
                continue
            # Sherlock outputs: "[+] SiteName: URL" for found
            if "http" in text:
                parts = text.split(":", 1) if "http" not in text.split(":")[0] else text.split(": ", 1)
                # Parse "[+] SiteName: https://..."
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
        try:
            await ws.send_json({"type": "error", "message": str(e)})
        except:
            pass

# Serve frontend
static = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.isdir(static):
    app.mount("/assets", StaticFiles(directory=os.path.join(static, "assets")), name="assets")
    @app.get("/{path:path}")
    async def spa(path: str):
        f = os.path.join(static, path)
        if os.path.isfile(f):
            return FileResponse(f)
        return FileResponse(os.path.join(static, "index.html"))
