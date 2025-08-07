import React from 'react'

function AlertCard(props) {
  return (
    <div className=' w-full h-[8rem] flex justify-center items-center'>
      <div className='alert-content w-[75%]'>
        <h2 className='alert-title text-gray-300 text-sm pb-1 font-light'>{props.title}</h2>
        <h2 className='alert-description text-white text-lg font-semibold'>{props.location}</h2>
        <h2 className='alert-description text-gray-400 text-xs font-light'>{props.description}</h2>
        <h2 className='alert-time text-gray-400 text-xs font-light'>{props.time}</h2>
      </div>
      <div className='alert-img flex-1 h-full bg-amber-950'></div>
    </div>
  )
}

export default AlertCard
