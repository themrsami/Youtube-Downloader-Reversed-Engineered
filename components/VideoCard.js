'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaEye, FaClock, FaUser } from 'react-icons/fa';

export default function VideoCard({ videoDetails, formats, onFormatSelect }) {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format the quality options for better display
  const formattedFormats = formats.map(format => ({
    ...format,
    displayName: format.height 
      ? `${format.height}p - ${format.ext} (${Math.round(format.filesize/1024/1024)}MB)${format.acodec !== 'none' ? ' with audio' : ''}`
      : `Audio - ${format.ext} (${Math.round(format.filesize/1024/1024)}MB)`,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-full md:w-[400px] relative group"
        >
          <img
            src={videoDetails.thumbnail}
            alt={videoDetails.title}
            className="w-full rounded-xl shadow-lg transform transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
            <FaDownload className="text-white text-4xl" />
          </div>
        </motion.div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-white">{videoDetails.title}</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <FaEye className="text-indigo-400" />
              <span>{Intl.NumberFormat('en-US').format(videoDetails.view_count)} views</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FaClock className="text-indigo-400" />
              <span>{Math.floor(videoDetails.duration / 60)}:{String(videoDetails.duration % 60).padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 col-span-2">
              <FaUser className="text-indigo-400" />
              <span>{videoDetails.uploader}</span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2 text-left bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              {selectedFormat ? selectedFormat.displayName : 'Select Quality'}
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {formattedFormats.map((format) => (
                  <button
                    key={format.format_id}
                    onClick={() => {
                      setSelectedFormat(format);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-600 text-white"
                  >
                    {format.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedFormat && (
            <button
              onClick={() => onFormatSelect(selectedFormat)}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
            >
              <FaDownload />
              <span>Download</span>
            </button>
          )}

          {videoDetails.keywords && (
            <>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {videoDetails.keywords.slice(0, 8).map((keyword, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                  >
                    {keyword}
                  </motion.span>
                ))}
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
