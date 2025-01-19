from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
from typing import Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoURL(BaseModel):
    url: str
    format_id: Optional[str] = None  # Add format_id to the model

@app.post("/api/video-info")
async def get_video_info(video: VideoURL):
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'format': 'bestvideo+bestaudio/best',  # Get best quality available
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video.url, download=False)
            
            # Better format filtering
            formats = [{
                'format_id': f.get('format_id'),
                'ext': f.get('ext'),
                'height': f.get('height'),
                'filesize': f.get('filesize'),
                'format': f.get('format', 'Unknown Format'),
                'url': f.get('url'),
                'vcodec': f.get('vcodec'),
                'acodec': f.get('acodec'),
                'abr': f.get('abr'),  # Audio bitrate
                'tbr': f.get('tbr'),  # Total bitrate
            } for f in info['formats'] if (
                f.get('url') and 
                not f.get('format_note', '').startswith('DRM') and
                (f.get('vcodec') != 'none' or f.get('acodec') != 'none')
            )]

            # Sort formats by quality
            formats.sort(key=lambda x: (x.get('height') or 0, x.get('tbr') or 0), reverse=True)

            return {
                "videoDetails": {
                    "title": info.get('title', 'Untitled'),
                    "description": info.get('description', ''),
                    "thumbnail": info.get('thumbnail'),
                    "duration": info.get('duration'),
                    "view_count": info.get('view_count'),
                    "uploader": info.get('uploader'),
                    "thumbnails": info.get('thumbnails', []),
                    "keywords": info.get('tags', [])
                },
                "formats": formats
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/download")
async def download_video(video: VideoURL):
    try:
        ydl_opts = {
            'format': video.format_id if video.format_id else 'best',
            'quiet': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video.url, download=False)
            # Get the specific format
            selected_format = next(
                (f for f in info['formats'] if f['format_id'] == video.format_id),
                None
            )
            
            if not selected_format:
                raise HTTPException(status_code=404, detail="Format not found")
                
            return {"url": selected_format['url']}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
