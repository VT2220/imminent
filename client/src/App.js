import './App.css';
import 'keyboard-css';
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import JoinRoom from './pages/JoinRoom';
import Room from './pages/Room';

const App = () => {
  return (
    <>
      <div>
        <Toaster
          toastOptions={{
            className: 'text-sm'
          }}
        />
      </div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join-room/:id" element={<JoinRoom />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </>
  );
};

export default App;
