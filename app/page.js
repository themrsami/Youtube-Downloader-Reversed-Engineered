'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaYoutube, FaSearch } from 'react-icons/fa';
import VideoCard from '@/components/VideoCard';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/python/video-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to fetch video data');
      
      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatSelect = async (format, action) => {
    try {
      const response = await fetch('/api/python/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          format_id: format.format_id,
        }),
      });

      if (!response.ok) throw new Error(`${action} failed`);
      
      const data = await response.json();
      if (!data.url) throw new Error('No URL received');

      if (action === 'stream') {
        // Open in new tab for streaming
        window.open(data.url, '_blank');
      } else {
        // Download file
        const link = document.createElement('a');
        link.href = data.url;
        link.download = `${videoData.videoDetails.title}.${format.ext || 'mp4'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <FaYoutube className="text-6xl text-red-500" />
            <h1 className="text-4xl font-bold text-white">YouTube Downloader</h1>
          </motion.div>
          <p className="text-gray-400">Download your favorite YouTube videos in any quality</p>
        </div>

        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full px-6 py-4 rounded-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 hover:bg-indigo-600 rounded-full transition-colors"
          >
            <FaSearch className="text-white text-xl" />
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        {videoData && (
          <VideoCard
            videoDetails={videoData.videoDetails}
            formats={videoData.formats}
            onFormatSelect={handleFormatSelect}
          />
        )}
      </motion.div>
    </main>
  );
}