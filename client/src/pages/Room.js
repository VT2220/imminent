import { useState, useEffect, useRef, useMemo } from 'react';

import { Transition, animated } from '@react-spring/web';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import { v4 as uuid } from 'uuid';

import Chat from '../components/Chat';
import Controls from '../components/Controls';
import MsgNotification from '../components/MsgNotification';
import { setChat } from '../store/chat-slice';
import useWebcam from '../useWebcam';

const { largestSquare } = require('rect-scaler');

const PeerWebcam = (props) => {
  const { peer, style, width, height } = props;
  const videoRef = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <animated.div
      style={{ ...style, width, height }}
      className="flex items-center rounded-2xl bg-black">
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'inherit' }} />
    </animated.div>
  );
};

const Room = ({ isChatOpen, setIsChatOpen }) => {
  const { id } = useParams();

  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const socketRef = useRef();
  socketRef.current = useMemo(() => io.connect(), []);

  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);

  const webcamRef = useRef();
  const {
    video,
    microphone,
    turnOnVideo,
    turnOffVideo,
    turnOnMicrophone,
    turnOffMicrophone,
    webcamKey,
    setWebcamLoading
  } = useWebcam(webcamRef);

  const [message, setMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      if (webcamRef.current.stream) {
        if (!video) {
          turnOffVideo();
        }
        if (!microphone) {
          turnOffMicrophone();
        }
      }
    }, 100);
  }, [webcamRef?.current?.stream]);

  useEffect(() => {
    if (Object.keys(user).length) {
      // emitting event to tell user has joined the room.
      socketRef.current.emit('joined room', {
        roomId: id,
        user
      });
      // server will fire all user event when joined the room to get info about other users.
      socketRef.current.on('all users', (users) => {
        // creating peers for all the users
        users.forEach((data) => {
          const peer = createPeer(
            data,
            { socketId: socketRef.current.id, user },
            webcamRef.current.stream
          );
          const peerObj = {
            user: data,
            peer
          };
          peersRef.current.push(peerObj);
        });
        setPeers([...peersRef.current]);
      });

      // when some other user join, to add this user in our room
      socketRef.current.on('somebody joined', (payload) => {
        const peer = addPeer(payload.signal, payload.caller, webcamRef.current.stream);
        const peerObj = {
          user: payload.caller,
          peer
        };
        setPeers([...peersRef.current, peerObj]);
        peersRef.current.push(peerObj);
      });

      socketRef.current.on('receiving returned signal', (payload) => {
        const peer = peersRef.current.find((peer) => peer.user.socketId === payload.id);
        peer.peer.signal(payload.signal);
      });

      socketRef.current.on('somebody left', (id) => {
        const peer = peersRef.current.find((peer) => peer.user.socketId === id);
        if (peer) peer.peer.destroy();
        peersRef.current = peersRef.current.filter((peer) => peer.user.socketId !== id);
        setTimeout(() => {
          setPeers([...peersRef.current]);
        }, 0);
      });

      // chat related event
      socketRef.current.on('somebody sent message', (msg) => {
        dispatch(setChat({ msg, roomId: id }));
        if (!isChatOpen) {
          //FIXME: because of state is inside an socket event it doesn't get updated.
          toast.custom((t) => (
            <MsgNotification t={t} img={msg.user.imageUrl} name={msg.user.name} msg={msg.message} />
          ));
        }
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      socketRef.current.disconnect();
      setIsChatOpen(false);
    };
  }, []);

  const createPeer = (userToSignal, caller, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        caller,
        signal
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, caller, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning signal', { signal, caller });
    });

    peer.signal(incomingSignal);

    return peer;
  };

  const sendMessage = () => {
    const msg = {
      user: { ...user, socketId: socketRef.current.id },
      message,
      messageId: uuid()
    };
    dispatch(setChat({ msg, roomId: id }));
    setMessage('');
    socketRef.current.emit('send message', msg);
  };

  // for managing layout for users' video area
  const containerRef = useRef();
  const [camWidth, setCamWidth] = useState();

  const calculateLayout = () => {
    const w = containerRef.current.getBoundingClientRect().width;
    const h = containerRef.current.getBoundingClientRect().height;
    const count = peers.length + 1;
    const { width } = largestSquare(w, h, count);

    setCamWidth(width - 16);
  };

  useEffect(() => {
    calculateLayout();
  }, [peers.length, isChatOpen]);

  useEffect(() => {
    window.onresize = () => {
      calculateLayout();
    };
  });

  // for keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyV') {
        if (video) {
          turnOffVideo();
        } else {
          turnOnVideo(peersRef);
          socketRef.current.emit("replace user's video track");
        }
      }
      if (e.code === 'KeyM') {
        if (microphone) {
          turnOffMicrophone();
        } else {
          turnOnMicrophone();
        }
      }
      if (e.code === 'KeyC') {
        setIsChatOpen(!isChatOpen);
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [video, microphone, isChatOpen]);

  return (
    <>
      <div className="videos-section">
        <div
          ref={containerRef}
          className="flex justify-center items-center"
          style={{ height: 'calc(100vh - 64px - 77px)' }}>
          <div className="flex flex-wrap justify-center gap-4">
            <Transition
              items={true}
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
              delay={1000}>
              {(styles, item) =>
                item && (
                  <animated.div
                    style={{ ...styles, width: camWidth, height: camWidth }}
                    className="flex items-center rounded-2xl bg-black">
                    <Webcam
                      key={webcamKey}
                      ref={webcamRef}
                      audio
                      mirrored
                      muted
                      style={{ width: '100%', height: 'inherit' }}
                      onUserMedia={() => {
                        setWebcamLoading(false);
                      }}
                    />
                  </animated.div>
                )
              }
            </Transition>
            <Transition
              keys={(item) => item.user.socketId}
              items={peers}
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
              delay={1000}>
              {(styles, item) => (
                <PeerWebcam style={styles} peer={item.peer} width={camWidth} height={camWidth} />
              )}
            </Transition>
          </div>
        </div>
        <Transition
          items={isChatOpen}
          from={{ opacity: 0, transform: 'translateX(300px)' }}
          enter={{ opacity: 1, transform: 'translateX(0px)' }}
          leave={{ opacity: 0, transform: 'translateX(300px)' }}>
          {(styles, item) =>
            item && (
              <animated.div style={styles} className="absolute left-0 px-2 md:px-0 md:relative">
                <Chat
                  socketId={socketRef.current.id}
                  peers={peers}
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                />
              </animated.div>
            )
          }
        </Transition>
      </div>
      <Controls webcamRef={webcamRef} peersRef={peersRef} />
    </>
  );
};

export default Room;
