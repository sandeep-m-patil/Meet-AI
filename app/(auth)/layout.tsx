import React from 'react'

interface Props {
    children: React.ReactNode
}
function layout({children}: Props) {
  return (
    <div className='min-h-screen'>
      {children}
    </div>
  )
}

export default layout
