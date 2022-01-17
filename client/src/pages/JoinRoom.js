import { useEffect, useMemo, useRef } from 'react';

import { Spring, animated } from '@react-spring/web';
import { Video, VideoSlash, Microphone, MicrophoneSlash1 } from 'iconsax-react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';

import { setAudioState, setVideoState } from '../store/webcam-slice';
import useWebcam from '../useWebcam';

const JoinRoom = () => {
  const webcamRef = useRef();
  // console.log(webcamRef, webcamRef.current);
  const {
    webcamLoading,
    webcamKey,
    setWebcamLoading,
    video,
    microphone,
    turnOffMicrophone,
    turnOnMicrophone,
    turnOffVideo,
    turnOnVideo
  } = useWebcam(webcamRef);

  const { id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setVideoState(true));
    dispatch(setAudioState(true));
  }, []);

  const navigate = useNavigate();

  const tips = [
    <>
      You can press <kbd className="kbc-button no-container">V</kbd> to toggle video and{' '}
      <kbd className="kbc-button no-container">M</kbd> to toggle microphone
    </>,
    'You can enter both id and meeting url in the input field which is given on home page to join the room',
    <>
      Press <kbd className="kbc-button no-container">C</kbd> to toggle the chat section inside room
    </>
  ];

  const tipIndex = useMemo(() => Math.floor(Math.random() * tips.length), []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyV') {
        if (video) {
          turnOffVideo();
        } else {
          turnOnVideo();
        }
      }
      if (e.code === 'KeyM') {
        if (microphone) {
          turnOffMicrophone();
        } else {
          turnOnMicrophone();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [video, microphone]);

  return (
    <>
      <div
        className="grid md:grid-cols-2 place-items-center  gap-y-5 md:gap-2 p-5 md:p-10"
        style={{ height: 'calc(100vh - 64px)' }}>
        <div className="text-center order-12 md:order-1">
          <div className="text-2xl sm:text-4xl xl:text-5xl font-bold sm:font-medium">
            Ready to join ?
          </div>
          <div className="mt-2">
            <div className="text-sm sm:text-base">No users in the room</div>
            <div className="mt-2">
              <button
                className="btn-primary"
                onClick={() => navigate(`/room/${id}`, { replace: true })}>
                Join now
              </button>
            </div>
          </div>
          <div className="rounded-lg border-2 border-dark p-3 mt-12 max-w-sm">
            <p>
              <strong>Tip: </strong> {tips[tipIndex]}
            </p>
          </div>
        </div>
        <div className="order-1 md:order-12">
          <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} delay={1500}>
            {(styles) => (
              <animated.div
                style={styles}
                className={`border-[3px] border-sky-800 rounded-2xl p-3 ${
                  webcamLoading ? 'hidden' : ''
                }`}>
                <div className="bg:black relative">
                  <Webcam
                    key={webcamKey}
                    ref={webcamRef}
                    audio
                    mirrored
                    className="rounded-2xl"
                    onUserMedia={() => {
                      setWebcamLoading(false);
                    }}
                    muted
                  />
                  {!video && (
                    <span
                      className="absolute top-1/2 left-1/2 z-10 text-3xl text-white font-semibold"
                      style={{ transform: 'translate(-50%,-50%)' }}>
                      Camera is off
                    </span>
                  )}
                </div>

                <div className="flex justify-center gap-4 mt-3">
                  {video ? (
                    <Video
                      size={45}
                      variant="Bulk"
                      className="icon-square text-sky-600"
                      onClick={turnOffVideo}
                    />
                  ) : (
                    <VideoSlash
                      size={45}
                      variant="Bulk"
                      className="icon-square"
                      onClick={turnOnVideo}
                    />
                  )}
                  {microphone ? (
                    <Microphone
                      size={45}
                      variant="Bulk"
                      className="icon-square text-sky-600"
                      onClick={turnOffMicrophone}
                    />
                  ) : (
                    <MicrophoneSlash1
                      size={45}
                      variant="Bulk"
                      className="icon-square"
                      onClick={turnOnMicrophone}
                    />
                  )}
                </div>
              </animated.div>
            )}
          </Spring>
          {webcamLoading && (
            <div className="flex flex-col items-center">
              <div className="loader"></div>
              <span className="mt-2 text-lg text-slate-500 font-semibold">Camera is starting</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JoinRoom;
