import HomePage from './pages/HomePage'
import GalleryPage from './pages/GalleryPage'
import AdminPage from './pages/AdminPage'
import EditPage from './pages/EditPage'
import NewPage from './pages/NewPage'
import { useRoute } from './hooks/useRoute'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { route, navigate } = useRoute()
  const { theme, toggle } = useTheme()

  switch (route.page) {
    case 'admin':
      return <AdminPage navigate={navigate} />
    case 'edit':
      return <EditPage slug={route.slug} navigate={navigate} />
    case 'new':
      return <NewPage navigate={navigate} />
    case 'gallery':
      return <GalleryPage slug={route.slug} navigate={navigate} themeMode={theme.mode} onToggleTheme={toggle} />
    default:
      return <HomePage navigate={navigate} themeMode={theme.mode} onToggleTheme={toggle} />
  }
}
