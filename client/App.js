import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './views/Index';
import Login from './views/Login';
import Signup from './views/Signup';
import WebChat from './views/WebChat';
import { io } from 'socket.io-client';


export const SocketContext = React.createContext();
const socket = io('http://localhost:8888');

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index socket={socket} />}/>
        <Route path='/login' element={<Login /> }/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/webchat' element={<WebChat socket={socket} />}/>
      </Routes>
    </BrowserRouter>
    </SocketContext.Provider>
    
  );
}

export default App;
