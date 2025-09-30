import Calendar from '@/components/Calender'
import React from 'react'


const page = () => {
  return (
    <>
    {/* Background image for light mode only */}
    <div className="fixed inset-0 -z-20 dark:hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/8e/aa/5e/8eaa5ea0b87e0821b6e1bc409622f9ee.jpg)',
          filter: 'blur(2px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
    </div>
    
    <div>
      <Calendar/>
    </div>
    </>
  )
}

export default page