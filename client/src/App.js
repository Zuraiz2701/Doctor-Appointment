import './App.css';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';

function App() {
  const { loading } = useSelector(state => state.alerts);
  return (
    <>
      <div /*className="bg-dark"/>*/>

        <BrowserRouter>
          {loading ?
            (<Spinner />) :
            (
              <Routes>
                <Route path='/' element={<HomePage />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
              </Routes>
            )}
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
