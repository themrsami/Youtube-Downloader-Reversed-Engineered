// app/api/fetchVideoData/route.js

export async function POST(request) {
    const { videoId, context } = await request.json();
  
    const postDataVideo = {
      videoId,
      context,
    };
  
    const videourl = 'https://www.youtube.com/youtubei/v1/player';
    const headers = {
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await fetch(videourl, {
        method: 'POST',
        headers,
        body: JSON.stringify(postDataVideo),
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data from YouTube API' }), {
          status: response.status,
        });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
      });
    }
  }
  