
import './App.css';
import Home from './pages/home';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SingleCountry from './pages/singleCountry';
import NavBar from './components/navBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:countryName" element={<SingleCountry />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
