
import './features/shared/styles/global.scss'
import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.provider.jsx'
import { SongContextProvider } from './features/home/song.provider.jsx'

function App() {

  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
    
  )
}

export default App
