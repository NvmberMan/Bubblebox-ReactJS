import './App.css';
import './Responsive.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';



function App() {


  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/Register' element={<Register />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
