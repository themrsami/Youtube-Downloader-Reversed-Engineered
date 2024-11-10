// app/api/streamVideo/route.js
import ytdl from 'ytdl-core';

export async function POST(request) {
  try {
    const { videoUrl, itag } = await request.json();

    if (!videoUrl || !itag) {
      return new Response('Missing videoUrl or itag', { status: 400 });
    }

    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: itag });

    if (!format) {
      return new Response('No valid format found', { status: 404 });
    }

    // Instead of streaming, we'll return the direct URL
    return new Response(JSON.stringify({ url: format.url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in streamVideo:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}