from yt_dlp import YoutubeDL
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

class VideoRequest(BaseModel):
    url: str
    format_id: str = None

@app.post("/api/video-info")
async def get_video_info(request: VideoRequest) -> Dict[str, Any]:
    try:
        with YoutubeDL() as ydl:
            info = ydl.extract_info(request.url, download=False)
            
            formats = [{
                'format_id': f.get('format_id'),
                'ext': f.get('ext'),
                'height': f.get('height'),
                'filesize': f.get('filesize'),
                'format': f.get('format', 'Unknown Format'),
                'url': f.get('url'),
                'vcodec': f.get('vcodec'),
                'acodec': f.get('acodec'),
            } for f in info['formats'] if f.get('url')]

            return {
                "videoDetails": {
                    "title": info.get('title'),
                    "thumbnail": info.get('thumbnail'),
                    "duration": info.get('duration'),
                    "view_count": info.get('view_count'),
                    "uploader": info.get('uploader'),
                    "keywords": info.get('tags', [])
                },
                "formats": formats
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/download")
async def download_video(request: VideoRequest) -> Dict[str, str]:
    try:
        with YoutubeDL() as ydl:
            info = ydl.extract_info(request.url, download=False)
            format_info = next(
                (f for f in info['formats'] if f['format_id'] == request.format_id),
                None
            )
            if not format_info:
                raise HTTPException(status_code=404, detail="Format not found")
            return {"url": format_info['url']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
