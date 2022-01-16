import { Link, useParams } from 'react-router-dom';

import LeaveImg from '../assets/images/leave.png';

const Leave = () => {
  const { id } = useParams();
  return (
    <div
      className="grid place-items-center"
      style={{ height: 'calc(100vh - 64px)', transform: 'translateX(-10px)' }}>
      <div className="flex flex-col items-center">
        <img src={LeaveImg} alt="leaving-image" className="w-96  translate-x-12" />
        <span className="text-2xl md:text-3xl font-semibold">You left the meeting.</span>
        <div className="mt-3">
          <Link className="btn-border mr-2" to={`/join-room/${id}`}>
            Rejoin
          </Link>
          <Link className="href-btn" to="/">
            Return to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Leave;
