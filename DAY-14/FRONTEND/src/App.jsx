
import AppRoutes from "./AppRoutes"
import "./features/shared/globle.scss"
import { AuthProvider } from "./features/auth/AuthProvider"
import { PostContextProvider } from "./features/post/PostContextProvider"
import { ThemeProvider } from "./features/shared/ThemeProvider"


function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <PostContextProvider>
          <AppRoutes />
        </PostContextProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
