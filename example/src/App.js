import React from 'react'
import Smooth from 'smooth-component'

function App() {
    return (
        <div>
            Hello
            <Smooth.div borderRadius={100}
                cornerSmoothing={'100%'}
                className="example"></Smooth.div>
        </div>
    )
}

export default App
