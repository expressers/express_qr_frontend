import { Header3 } from '@/components'
import React from 'react'
import { Outlet } from 'react-router-dom'

function AppLayouPrivateSub() {
 
  return (
    <React.Fragment>
      <section className="h-screen w-full relative">
        <Header3 />
        <main>
          <Outlet />
        </main>
      </section>
    </React.Fragment>
  );
}

export {AppLayouPrivateSub}