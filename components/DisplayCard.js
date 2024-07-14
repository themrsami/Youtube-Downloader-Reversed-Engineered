'use client';
import React from 'react'

const DisplayCard = ({videoDetail}) => {
  return (
    <>
        <div className="card bg-gray-800 p-4 rounded-md shadow-lg w-80 m-4">
            <div 
              width={50} 
              height={40} 
              dangerouslySetInnerHTML={{ __html: `<img src="${videoDetail.thumbnail.thumbnails[2].url}" alt="Video Thumbnail" />` }} 
            />
            <h2 className="text-xl font-bold">{videoDetail.title}</h2>
            <p className="text-sm text-gray-400">Duration: {Math.floor(videoDetail.lengthSeconds / 60)}:{videoDetail.lengthSeconds % 60}</p>
            <p className="text-sm text-gray-400">Views: {videoDetail.viewCount}</p>
            <p className="text-sm text-gray-400">Author: {videoDetail.author}</p>
        </div>
    </>
  )
}

export default DisplayCard