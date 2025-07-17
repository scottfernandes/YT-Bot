import React from 'react'
import YTInput from '../components/YTInput'

export default function page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-400 text-white'>
        <div className='pt-20'>
            <p className='text-center text-7xl font-bold'>Welcome to YT-Bot</p>
            <YTInput/>
        </div>
    </div>
  )
}
