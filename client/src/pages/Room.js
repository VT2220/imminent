import { useState, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import Peer from 'simple-peer';
import io from 'socket.io-client';

import Controls from '../components/Controls';

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
        const peers = [];
        users.forEach((data) => {
          const peer = createPeer(data, socketRef.current.id, webcamRef.current.stream);
          const peerObj = {
            id: data.socketId,
            peer
          };
          peersRef.current.push(peerObj);
          peers.push(peerObj);
        });
        setPeers(peers);
      });

      // when some other user join, to add this user in our room
      socketRef.current.on('somebody joined', (payload) => {
        const peer = addPeer(payload.signal, payload.caller, webcamRef.current.stream);
        const peerObj = {
          id: payload.caller.socketId,
          peer
        };
        peersRef.current.push(peerObj);
        setPeers((peers) => [...peers, peerObj]);
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

  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('sending signal', {
        userToSignal,
        caller: { socketId: callerId, user },
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

  return (
    <>
      <div style={{ height: 'calc(100vh - 64px - 77px)' }} className="videos px-3">
        <Webcam ref={webcamRef} audio mirrored className="rounded-2xl" muted />
        {peers.map((peer) => (
          <Webcam key={peer.id} audio mirrored className="rounded-2xl" muted />
        ))}
      </div>
      <Controls />
    </>
  );
};

export default Room;
