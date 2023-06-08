import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './views/Index';
import Login from './views/Login';
import Signup from './views/Signup';
import WebChat from './views/WebChat';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8888');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index socket={socket} />}/>
        <Route path='/login' element={<Login /> }/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/webchat' element={<WebChat socket={socket} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
