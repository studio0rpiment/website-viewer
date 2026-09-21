import GalleryPage from './pages/GalleryPage'
import EditPage from './pages/EditPage'
import NewPage from './pages/NewPage'
import { useRoute } from './hooks/useRoute'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { route, navigate } = useRoute()
  const { theme, toggle } = useTheme()

  switch (route.page) {
    case 'edit':
      return <EditPage slug={route.slug} navigate={navigate} />
    case 'new':
      return <NewPage navigate={navigate} />
    default:
      return <GalleryPage slug={route.slug} themeMode={theme.mode} onToggleTheme={toggle} />
  }
}
