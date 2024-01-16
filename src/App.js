import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Inflatables from './pages/Inflatables';

function App() {
  return (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Inflatables />} />
      <Route path="/inflatables" element={<Inflatables />} />
    </Routes>
  </HashRouter>
  );
}

export default App;
