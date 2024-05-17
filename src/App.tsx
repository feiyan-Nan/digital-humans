import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages';
import Home from './pages/home';
import Card from './pages/card';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="/home" element={<Home />} />
          <Route path="/card" element={<Card />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
