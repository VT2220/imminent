import { Fragment, useEffect } from 'react';

import { Tab } from '@headlessui/react';
import { Send } from 'iconsax-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Avatar from '../assets/images/avatar.jpg';

const Chat = ({ socketId, peers, message, setMessage, sendMessage }) => {
  const user = useSelector((state) => state.user.user);
  const tabs = ['Chat', 'People'];

  const { id: roomId } = useParams();
  const chat = useSelector((state) => state.chat.chat);
  const roomChat = chat[roomId] ?? [];

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('chat');
    };
  }, []);

  return (
    <div className="rounded-2xl bg-slate-100 px-3 py-2 w-[95vw] md:w-[300px] ">
      <Tab.Group>
        <Tab.List className="flex">
          {tabs.map((label, i) => (
            <Tab as={Fragment} key={i}>
              {({ selected }) => (
                <div
                  className={`text-center font-semibold cursor-pointer pb-1 w-full ${
                    selected ? 'text-sky-600 border-b-2 border-sky-600' : ''
                  }`}>
                  {label}
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="overflow-auto" style={{ height: 'calc(100vh - 190px)' }}>
          {/* CHAT TAB  */}
          <Tab.Panel className="p-2 h-full flex flex-col-reverse">
            {/* MSG INPUT FIELD AND SEND BTN  */}
            <div className="flex items-center gap-2">
              <input
                id="msgInput"
                type="text"
                className="rounded-lg p-3 py-1 w-full text-sm"
                value={message}
                onKeyUp={(e) => {
                  if (e.code === 'Enter') {
                    sendMessage();
                  }
                }}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Send
                size="40"
                variant="Bulk"
                className="text-sky-600 cursor-pointer"
                onClick={sendMessage}
              />
            </div>
            <div id="messages" className="flex flex-col-reverse h-full overflow-auto">
              {roomChat
                .slice(0)
                .reverse()
                .map((msg) =>
                  msg.user.socketId === socketId ? (
                    //  MY MESSAGE
                    <div className="mb-3" key={msg.messageId}>
                      <div className="flex items-end justify-end">
                        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                          <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-sky-600 text-white">
                              {msg.message}
                            </span>
                          </div>
                        </div>
                        <img
                          src={user.imageUrl ?? Avatar}
                          alt=""
                          className="w-6 h-6 rounded-full order-2"
                        />
                      </div>
                    </div>
                  ) : (
                    //  OTHER USERS MESSAGE
                    <div className="mb-3" key={msg.messageId}>
                      <div className="flex items-end">
                        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                          <div>
                            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                              {msg.message}
                            </span>
                          </div>
                        </div>
                        <img
                          src={msg.user.imageUrl ?? Avatar}
                          alt=""
                          className="w-6 h-6 rounded-full order-1"
                        />
                      </div>
                    </div>
                  )
                )}
            </div>
          </Tab.Panel>
          {/* PEOPLE TAB  */}
          <Tab.Panel className="p-2">
            <div className="flex items-center gap-2 mb-2">
              <img src={user.imageUrl} alt="" width={40} className="rounded-full" />
              <span className="text-sm">Me</span>
            </div>
            {peers.map((peer) => (
              <div className="flex items-center gap-2 mb-2" key={peer.user.socketId}>
                <img src={peer.user.imageUrl} alt="" width={40} className="rounded-full" />
                <span className="text-sm">{peer.user.name}</span>
              </div>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Chat;
