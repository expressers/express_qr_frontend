import { SiteHeader } from '@/components'
import React from 'react'
import { Outlet } from 'react-router-dom'

function AppLayouPrivateSub() {
 
  return (
    <React.Fragment>
      <section className="min-h-dvh w-full relative">
        <SiteHeader variant="app" />
        <main>
          <Outlet />
        </main>
      </section>
    </React.Fragment>
  );
}

export {AppLayouPrivateSub}