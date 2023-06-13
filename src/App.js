import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Weather from './components/Weather';
import './App.css';
import Search from './components/Search.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' exact element={<Weather/>}/>
        <Route path='/search' element={<Search/>}/>
      </Routes>
    </Router>
  );
}

export default App;
