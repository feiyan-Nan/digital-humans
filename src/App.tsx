import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Index from './pages';
import Home from './pages/home';
import Card from './pages/card';
import Video from './pages/video';
import Index from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="/home" element={<Home />} />
          <Route path="/card" element={<Card />} />
          <Route path="/video" element={<Video />} />
        </Route>

        <Route path="*" element={<Navigate to="/workbench" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
