import { useState, useRef } from 'react';

import { Spring, animated } from '@react-spring/web';
import { Video, VideoSlash, Microphone, MicrophoneSlash1 } from 'iconsax-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { v4 as uuid } from 'uuid';

import { setVideoState, setAudioState } from '../store/webcam-slice';

const JoinRoom = () => {
  const [webcamLoading, setWebcamLoading] = useState(true);
  const [webcamKey, setWebcamKey] = useState(uuid());

  const video = useSelector((state) => state.webcam.video);
  const microphone = useSelector((state) => state.webcam.audio);

  const dispatch = useDispatch();

  const webcamRef = useRef();

  const turnOffVideo = () => {
    dispatch(setVideoState(false));
    const tracks = webcamRef.current.stream.getVideoTracks();
    tracks.forEach((track) => {
      track.stop();
    });
  };

  const turnOnVideo = () => {
    dispatch(setVideoState(true));
    setWebcamLoading(true);
    setWebcamKey(uuid());
    if (!microphone) turnOffMicrophone();
  };

  const turnOffMicrophone = () => {
    dispatch(setAudioState(false));
    webcamRef.current.stream.getAudioTracks()[0].enabled = false;
  };

  const turnOnMicrophone = () => {
    dispatch(setAudioState(true));
    webcamRef.current.stream.getAudioTracks()[0].enabled = true;
  };

  const { id } = useParams();

  return (
    <>
      <div
        className="grid md:grid-cols-2 place-items-center  gap-y-5 md:gap-2 p-5 md:p-10"
        style={{ height: 'calc(100vh - 64px)' }}>
        <div className="text-center order-12 md:order-1">
          <div className="text-2xl sm:text-4xl xl:text-5xl font-bold sm:font-medium">
            Ready to join ?
          </div>
          <div className="mt-3">
            <div className="text-sm sm:text-base">No users in the room</div>
            <div className="mt-3">
              <Link className="href-btn" to={`/room/${id}`}>
                Join now
              </Link>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-12">
          <Spring opacity={1}>
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
