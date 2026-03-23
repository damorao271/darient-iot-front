import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { BrowsePlaces } from './pages/BrowsePlaces'
import { PlaceSpaces } from './pages/PlaceSpaces'
import { SpaceDetail } from './pages/SpaceDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BrowsePlaces />} />
        <Route path="/places/:placeId/spaces" element={<PlaceSpaces />} />
        <Route path="/spaces/:spaceId" element={<SpaceDetail />} />
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
