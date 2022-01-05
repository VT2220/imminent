import { useState } from 'react';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import Poster from '../assets/images/poster.png';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [isSignedIn, setIsSignedIn] = useState(true);

  const startNewMeeting = () => {
    if (!Object.keys(user).length) {
      setIsSignedIn(false);
      return;
    }
    navigate(`/join-room/${uuid()}`);
  };

  return (
    <>
      <div
        className="grid md:grid-cols-2 place-items-center  gap-y-5 md:gap-2 p-5 md:p-10"
        style={{ height: 'calc(100vh - 64px)' }}>
        <div className="text-center md:text-left order-12 md:order-1">
          <div className="text-2xl sm:text-4xl xl:text-5xl font-bold sm:font-medium">
            The new way of video meeting. Understand well,explain better
          </div>
          <div className="mt-3">
            <div className="text-sm sm:text-base">
              Augments live video meetings with interactive graphics to create a powerful and
              expressive environment.
            </div>
            <div className="flex flex-wrap flex-col sm:flex-row gap-4 align-center mt-2">
              <button className="btn-primary" onClick={startNewMeeting}>
                New meeting
              </button>
              <input type="text" placeholder="Existing meeting link" className="input" />
              <button className="kbc-button kbc-button-sm w-16 self-end">↵ Enter</button>
            </div>
            {!isSignedIn && <div className="mt-1 text-red-600">Signin to start a new meeting!</div>}
          </div>
        </div>
        <div className="order-1 md:order-12">
          <img src={Poster} width="100%" className="rounded-2xl" />
        </div>
      </div>
    </>
  );
};

export default Home;
