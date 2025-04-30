
import './App.css';
import Home from './pages/home';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SingleCountry from './pages/singleCountry';
import NavBar from './components/navBar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Profile/protectedRoute';
import Profile from './components/Profile/Profile';
import ChangePassword from './components/Auth/ChangePassword';
import LandingPage from './pages/landingPage';
import { Footer } from './components/footer';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/countries" element={<Home />} />
          <Route path="/:countryName" element={<SingleCountry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/change-password' element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
