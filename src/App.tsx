import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Index from './pages';
// import ILayout from '@/components/layout';
import Test from '@/components/test';
// import Home from './pages/home';
// import Card from './pages/card';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Test />}>
          {/* <Route path="/home" element={<Home />} />
          <Route path="/card" element={<Card />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
