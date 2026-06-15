import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './app/Home'
import ZonePage from './app/Zones'
import History from './app/History'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/zona',
    element: <ZonePage/>
  },
  {
    path: '/historico',
    element: <History/>
  }
])

function App(){
  return <RouterProvider router={router}/>
}

export default App
