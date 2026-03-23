import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { BrowsePlaces } from './pages/BrowsePlaces'
import { PlaceSpaces } from './pages/PlaceSpaces'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowsePlaces />} />
        <Route path="/places/:placeId/spaces" element={<PlaceSpaces />} />
      </Routes>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 5000,
        }}
      />
    </BrowserRouter>
  )
}

export default App
