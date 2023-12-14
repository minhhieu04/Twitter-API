import { createBrowserRouter } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Video from './Video'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login/oauth',
    element: <Login />
  },
  {
    path: '/upload-hls',
    element: <Video />
  }
])

export default router
