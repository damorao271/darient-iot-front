import { Toaster } from 'sonner'
import { BrowsePlaces } from './pages/BrowsePlaces'

function App() {
  return (
    <>
      <BrowsePlaces />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 5000,
        }}
      />
    </>
  )
}

export default App
