
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicRouter } from '../publicRoutes'
import { PrivateRoute } from '../privateRoutes'
import { NotFound } from '@/pages';

function AppRouter() {

  return (
    <BrowserRouter>
      <Routes>
        {PublicRouter()}
        {PrivateRoute()}
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
  
}

export {AppRouter}