'use client';
import React from 'react'

const Keywords = (props) => {
  return (
    <>
        <h1 className='m-1 text-center font-semibold'>Keywords</h1>
        <div className='flex flex-row w-full sm:w-[95%] md:w-[80%] lg:w-[60%] flex-wrap gap-2'>
            {
                props.keywords.map((keyword) => (
                <div className="flex gap-2 rounded-md text-center px-2 py-1 bg-[#0E0B18] text-white text-opacity-70 " key={keyword}>
                    {keyword}
                </div>
                ))
            }
        </div>
    </>
  )
}

export default Keywords