import { useState } from 'react';

import './App.css';
import 'keyboard-css';
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import JoinRoom from './pages/JoinRoom';
import Leave from './pages/Leave';
import Room from './pages/Room';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <div>
        <Toaster
          toastOptions={{
            className: 'text-sm'
          }}
          containerStyle={{
            top: 10
          }}
        />
      </div>
      <Header isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join-room/:id" element={<JoinRoom />} />
        <Route
          path="/room/:id"
          element={<Room isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />}
        />
        <Route path="/leave/:id" element={<Leave />} />
      </Routes>
    </>
  );
};

export default App;
