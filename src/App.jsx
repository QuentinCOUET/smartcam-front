import { Navigate, Route, Routes } from 'react-router-dom'
import MobileLayout from './components/layout/MobileLayout'
import StreamPage from './pages/StreamPage'
import LibraryPage from './pages/LibraryPage'
import CameraProvisioning from './pages/CameraProvisioning'

export default function App() {
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<Navigate to="/stream" replace />} />
        <Route path="/stream" element={<StreamPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/config" element={<CameraProvisioning />} />
      </Route>
    </Routes>
  )
}