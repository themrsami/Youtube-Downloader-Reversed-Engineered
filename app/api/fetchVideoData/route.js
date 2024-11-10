// app/api/fetchVideoData/route.js
import ytdl from 'ytdl-core';

export async function POST(request) {
  try {
    const { videoUrl } = await request.json();

    if (!ytdl.validateURL(videoUrl)) {
      throw new Error('Invalid YouTube URL');
    }

    const info = await ytdl.getInfo(videoUrl);

    const formats = info.formats.map(format => ({
      itag: format.itag,
      url: format.url,
      mimeType: format.mimeType,
      qualityLabel: format.qualityLabel,
      bitrate: format.bitrate,
      audioQuality: format.audioQuality,
      fps: format.fps,
      width: format.width,
      height: format.height,
    }));

    const response = {
      videoDetails: {
        title: info.videoDetails.title,
        description: info.videoDetails.description,
        thumbnails: info.videoDetails.thumbnails,
        lengthSeconds: info.videoDetails.lengthSeconds,
        viewCount: info.videoDetails.viewCount,
        author: info.videoDetails.author.name,
        keywords: info.videoDetails.keywords,
      },
      formats: formats,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error in fetchVideoData:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}