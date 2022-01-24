/* eslint-disable */
import { Menu } from '@headlessui/react';
import {
  Video,
  VideoSlash,
  Microphone,
  MicrophoneSlash1,
  CallRemove,
  ArrowCircleUp,
  Copy
} from 'iconsax-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import useWebcam from '../useWebcam';

const Controls = ({ webcamRef, peersRef }) => {
  const { video, microphone, turnOffVideo, turnOnVideo, turnOffMicrophone, turnOnMicrophone } =
    useWebcam(webcamRef);

  const { id } = useParams();
  const navigate = useNavigate();

  const moreOptions = [
    {
      title: 'Copy link',
      icon: <Copy size={20} variant="Bulk" className="text-sky-600 mr-2" />,
      onClick: () => {
        window.navigator.clipboard.writeText(window.location.href.replace(/\/room/g, '/join-room'));
        toast.success('Meeting link has been copied');
      }
    }
  ];

  return (
    <>
      <div className="flex justify-center gap-4 p-4">
        <Menu as="div" className="relative">
          <Menu.Button as="div">
            <ArrowCircleUp size={45} variant="Bulk" className="icon-square text-sky-600" />
          </Menu.Button>
          <Menu.Items className="absolute bottom-14 w-56 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              {moreOptions.map((option) => (
                <Menu.Item key={option.title}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-slate-300' : ''
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={option.onClick}>
                      {option.icon}
                      {option.title}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>
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
            onClick={turnOffVideo}
          />
        ) : (
          <VideoSlash
            size={45}
            variant="Bulk"
            className="icon-square"
            onClick={() => turnOnVideo(peersRef)}
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
    </>
  );
};

export default Controls;
