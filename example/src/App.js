import React from 'react'
import Smooth from 'smooth-component'
import './App.css'

function App() {
  return (
    <div>
      <Smooth.div
        borderRadius="100"
        cornerSmoothing="100"
        style={{
          width: 200,
          height: 200,
          background: "red"
        }}>
      </Smooth.div>
    </div>
  )
}

export default App
