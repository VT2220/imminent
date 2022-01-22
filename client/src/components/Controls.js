import {
  Video,
  VideoSlash,
  Microphone,
  MicrophoneSlash1,
  CallRemove,
  Screenmirroring
} from 'iconsax-react';
import { useNavigate, useParams } from 'react-router-dom';

import useWebcam from '../useWebcam';

const Controls = ({ webcamRef, peersRef }) => {
  const { video, microphone, turnOffVideo, turnOnVideo, turnOffMicrophone, turnOnMicrophone } =
    useWebcam(webcamRef);

  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center gap-4 p-4">
        <Screenmirroring size={45} variant="Bulk" className="icon-square" />
        <button
          className="icon-square flex items-center gap-2 text-red-500"
          onClick={() => navigate(`/leave/${id}`, { replace: true })}>
          <CallRemove size={25} variant="Bulk" />
          Leave
        </button>
        {video ? (
          <Video
            size={45}
            variant="Bulk"
            className="icon-square text-sky-600"
            onClick={() => turnOffVideo(peersRef)}
          />
        ) : (
          <VideoSlash size={45} variant="Bulk" className="icon-square" onClick={turnOnVideo} />
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
    </>
  );
};

export default Controls;
