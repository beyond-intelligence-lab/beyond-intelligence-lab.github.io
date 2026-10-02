import { Navigate, createBrowserRouter } from 'react-router-dom'

import Layout from './components/Layout'
import Group from './pages/Group'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Projects from './pages/Projects'
import Publications from './pages/Publications'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <Home /> },
      { path: 'publications', element: <Publications /> },
      { path: 'group', element: <Group /> },
      { path: 'projects', element: <Projects /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
