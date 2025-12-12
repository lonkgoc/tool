import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from './contexts/SidebarContext';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import SearchPage from './pages/SearchPage';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/:slug" element={<ToolPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;

