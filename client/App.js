import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './views/Index';
import Login from './views/Login';
import Signup from './views/Signup';
import Dashboard from './views/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />}/>
        <Route path='/login' element={<Login /> }/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
