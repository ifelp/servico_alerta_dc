import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './app/Home'
import ZonePage from './app/Zones'
import History from './app/History'
import { AlertProvider } from './contexts/alertContext'
import AlertPopup from './components/alertPopup'
import { useZone } from './contexts/zoneContext'

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

function AppInner() {
  const { currentZone } = useZone()
  return (
    <AlertProvider zone={currentZone}>
      <AlertPopup />
      <RouterProvider router={router} />
    </AlertProvider>
  )
}

function App() {
  return <AppInner />
}

export default App