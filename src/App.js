import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useActionData,
} from "react-router-dom";
import Inflatables from './pages/Inflatables';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <div>
        <Router>
          <Routes>
            {/* <Route path="/" element={<ProtectedRoutes />}> */}
              <Route index element={<Calendar />} />
              <Route path="/inflatables" element={<Inflatables />} />
              <Route path="/bookings" element={<Calendar />} />
            {/* </Route> */}
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
