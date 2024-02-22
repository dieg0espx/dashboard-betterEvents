import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Inflatables from './pages/Inflatables';
import Bookings from './pages/Bookings';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
  <HashRouter>
    <Routes>
      <Route path="/" element={<ProtectedRoutes />}>
        <Route index element={<Calendar />} />
        <Route path="/inflatables" element={<Inflatables />} />
        <Route path="/calendar" element={<Calendar />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  </HashRouter>
  );
}

export default App;
