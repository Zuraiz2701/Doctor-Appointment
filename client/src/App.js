import './App.css';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      <div className="bg-dark">

        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
