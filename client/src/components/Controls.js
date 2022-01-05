import { Video, Microphone, CallRemove, Screenmirroring } from 'iconsax-react';

const Controls = () => {
  return (
    <>
      <div className="flex justify-center gap-4 p-4">
        <Screenmirroring size={45} variant="Bulk" className="icon-square" />
        <div className="icon-square flex items-center gap-2 text-red-500 ">
          <CallRemove size={25} variant="Bulk" />
          Leave
        </div>
        <Video size={45} variant="Bulk" className="icon-square text-sky-600" />
        <Microphone size={45} variant="Bulk" className="icon-square text-sky-600" />
      </div>
    </>
  );
};

export default Controls;
