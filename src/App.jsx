import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import LandingPages from './pages/LandingPages'
import PageDetail from './pages/PageDetail'
import GlobalBlocks from './pages/GlobalBlocks'
import AssetLibrary from './pages/AssetLibrary'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100%' }}>
        <Sidebar />
        <div style={{ flex: 1, overflow: 'auto', background: '#F2F4F7' }}>
          <Routes>
            <Route path="/" element={<LandingPages />} />
            <Route path="/landing-pages/:lpId" element={<PageDetail />} />
            <Route path="/landing-pages/:lpId/studio/:variantId" element={<StudioStub />} />
            <Route path="/global-blocks" element={<GlobalBlocks />} />
            <Route path="/assets" element={<AssetLibrary />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

function StudioStub() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      flexDirection: 'column',
      gap: 12,
      color: '#6B6860',
    }}>
      <div style={{ fontSize: 48 }}>🎨</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1916' }}>Studio</div>
      <div style={{ fontSize: 14 }}>Studio coming soon</div>
    </div>
  )
}

export default App
