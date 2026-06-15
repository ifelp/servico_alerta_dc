import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './app/Home'
import ZonePage from './app/Zones'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/zona',
    element: <ZonePage/>
  }
])

function App(){
  return <RouterProvider router={router}/>
}

export default App
