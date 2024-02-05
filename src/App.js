import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Inflatables from './pages/Inflatables';
import Bookings from './pages/Bookings';
import Calendar from './pages/Calendar';

function App() {
  return (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Inflatables />} />
      <Route path="/inflatables" element={<Inflatables />} />
      <Route path="/bookings" element={<Calendar />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  </HashRouter>
  );
}

export default App;
