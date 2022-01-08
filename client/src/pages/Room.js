import { useState, useEffect, useRef } from 'react';

import { Transition, animated } from '@react-spring/web';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import Peer from 'simple-peer';
import io from 'socket.io-client';

import Controls from '../components/Controls';

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
      <video ref={videoRef} width="100%" height="100%" muted autoPlay playsInline />
    </animated.div>
  );
};

const Room = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.user.user);

  const webcamRef = useRef();
  const socketRef = useRef();

  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    if (Object.keys(user).length) {
      socketRef.current = io.connect();
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
            id: data.socketId,
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
          id: payload.caller.socketId,
          peer
        };
        setPeers([...peersRef.current, peerObj]);
        peersRef.current.push(peerObj);
      });

      socketRef.current.on('receiving returned signal', (payload) => {
        const peer = peersRef.current.find((peer) => peer.id === payload.id);
        peer.peer.signal(payload.signal);
      });

      socketRef.current.on('somebody left', (id) => {
        const peer = peersRef.current.find((peer) => peer.id === id);
        if (peer) peer.peer.destroy();
        peersRef.current = peersRef.current.filter((peer) => peer.id !== id);
        setTimeout(() => {
          setPeers([...peersRef.current]);
        }, 0);
      });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      socketRef.current.disconnect();
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
  }, [peers.length]);

  useEffect(() => {
    window.onresize = () => {
      calculateLayout();
    };
  });

  return (
    <>
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
                  <Webcam ref={webcamRef} audio mirrored muted width="100%" height="100%" />
                </animated.div>
              )
            }
          </Transition>
          <Transition
            keys={(item) => item.id}
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
      <Controls />
    </>
  );
};

export default Room;
