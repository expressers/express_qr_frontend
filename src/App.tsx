import React from 'react'
import { AppRouter } from '@/routers'
import { AppProvider } from './context'

function App() {


  return (
    <React.Fragment>
      <AppProvider>

      <AppRouter/>
      </AppProvider>
    </React.Fragment>
  )
}

export default App
