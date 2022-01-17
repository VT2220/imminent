import toast from 'react-hot-toast';

const MsgNotification = ({ t, img, name, msg }) => {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-xl flex`}>
      <div className="flex-1 w-0 p-2">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={img} alt="" />
          </div>
          <div className="ml-3 flex-1">
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{msg}</div>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-sky-600 hover:text-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500">
          Close
        </button>
      </div>
    </div>
  );
};

export default MsgNotification;
