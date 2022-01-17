import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { setVideoState, setAudioState, setWebcamKey } from './store/webcam-slice';

const useWebcam = (webcamRef) => {
  const [webcamLoading, setWebcamLoading] = useState(true);

  const video = useSelector((state) => state.webcam.video);
  const microphone = useSelector((state) => state.webcam.audio);
  const webcamKey = useSelector((state) => state.webcam.webcamKey);

  const dispatch = useDispatch();

  const turnOffVideo = () => {
    dispatch(setVideoState(false));
    webcamRef.current.stream.getVideoTracks()[0].enabled = false;
    setTimeout(() => {
      const tracks = webcamRef.current.stream.getVideoTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }, 1000);
  };

  const turnOnVideo = () => {
    dispatch(setVideoState(true));
    setWebcamLoading(true);
    dispatch(setWebcamKey());
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

  return {
    webcamLoading,
    setWebcamLoading,
    webcamKey,
    setWebcamKey,
    video,
    microphone,
    webcamRef,
    turnOffVideo,
    turnOnVideo,
    turnOffMicrophone,
    turnOnMicrophone
  };
};

export default useWebcam;
