import React from 'react'
import { AppRouter } from '@/routers'
import { Toaster } from '@/components/ui/sonner'
import { AppProvider } from './context'

function App() {
  return (
    <React.Fragment>
      <AppProvider>
        <AppRouter />
        {/* Único Toaster da app: as páginas só chamam toast(). */}
        <Toaster />
      </AppProvider>
    </React.Fragment>
  )
}

export default App
