import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MdArrowForwardIos, MdDeleteOutline, MdDeleteSweep, MdDoneAll, MdOutlineCheckCircleOutline } from 'react-icons/md';
import useSocketIo from "../hooks/useSocketio";
const NotificationsList = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState({ notifications: [] });

  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const messageRef = useRef(null); // Initialize messageRef with null
  const { socket } = useSocketIo();
  const id = user ? user._id : null;
  useEffect(() => {
    setIsLoading(true);
    const controller = new AbortController();

    const getNotifications = async () => {
      try {
        const result = await axios.post(
          'https://nea-support.onrender.com/api/notifications',
          {
            id: user._id,
            limit: 2,
            page,
          },
          {
            signal: controller.signal,
          }
        );

        console.log('Database Response:', result);
        setData(result?.data);
      } catch (err) {
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    getNotifications();

    return () => {
      controller?.abort();
    };
  }, [user._id, page]);


  const handleMarkOneAsRead = async (notificationId) => {
    try {
      const result = await axios.patch('https://nea-support.onrender.com/api/notifications', { id: notificationId });

      // Create a new array with updated read status for the specific notification
      const newData = {
        ...data,
        notifications: data.notifications.map((element) => {
          if (element._id === notificationId) {
            return {
              ...element,
              read: true,
            };
          }
          return element;
        }),
      };
      socket.emit("updateNotificationsLength", id);

      setData(newData);
      setMessage(result?.data?.message);
      messageRef.current && messageRef.current.focus();
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current && messageRef.current.focus();
    }
  };


  const handleMarkAllAsRead = async () => {
    try {
      const result = await axios.patch('https://nea-support.onrender.com/api/notifications/all', { id: user._id });

      // Create a new array with updated read status
      const newData = {
        ...data,
        notifications: data.notifications.map((element) => ({
          ...element,
          read: true,
        })),
      };
      socket.emit("updateNotificationsLength", id);
      setData(newData);
      setMessage(result?.data?.message);
      messageRef.current && messageRef.current.focus();
    } catch (err) {
      setMessage(err?.response?.data?.message);

      // Check if messageRef is defined before calling focus
      messageRef.current && messageRef.current.focus();
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const result = await axios.delete('https://nea-support.onrender.com/api/notifications', { data: { id: notificationId } });
      const newNotifications = data?.notifications?.filter((item) => item._id !== notificationId);
      console.log(newNotifications);

      socket.emit("updateNotificationsLength", id);

      setData({ ...data, notifications: newNotifications });
      setMessage(result?.data?.message);
      messageRef.current && messageRef.current.focus(); // Check if messageRef is defined before calling focus
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current && messageRef.current.focus(); // Check if messageRef is defined before calling focus
    }
  };
  
  

  const handleDeleteAll = async () => {
    try {
      const result = await axios.delete('https://nea-support.onrender.com/api/notifications/all', { data: { id: user._id } });
      setData(null);
      setMessage(result?.data?.message);
       socket.emit("updateNotificationsLength", id);
      messageRef.current && messageRef.current.focus(); // Check if messageRef is defined before calling focus
    } catch (err) {
      setMessage(err?.response?.data?.message);
      messageRef.current && messageRef.current.focus(); // Check if messageRef is defined before calling focus
    }
  };
  

  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  
  let content;
  if (data && data.notifications && data.notifications.length > 0) {
    content = (
      <>
        <h1 className="text-2xl font-bold mb-4">Notifications list</h1>
        <ul>
          {data.notifications.map((notification) => (
            <div key={notification._id} className="mb-4">
              <li className="flex items-center justify-between" style={{ height: '100%' }}>
                <div className="flex-1 mr-4">
                  <h3 className="flex items-center text-lg">
                    <MdArrowForwardIos className="mr-2" />
                    {notification.title}
                  </h3>
                  <hr className="border-t border-gray-300 my-2" />
                  <p className="break-words">{notification.text}</p>
                  <p className="mt-2">{notification.read ? '✅ read' : '❌ Not read'}</p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      handleMarkOneAsRead(notification._id);
                    }}
                    className="mr-2"
                  >
                    <MdOutlineCheckCircleOutline />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteNotification(notification._id);
                    }}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </>
    );
  } else {
    content = (
      <>
        <h1 className="text-2xl font-bold mb-4">Notifications list</h1>
        <div>No data to show</div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {content}
    
      <div className="flex space-x-4 mt-4">
  <button
    type="button"
    disabled={!data?.notifications?.length}
    className={`bg-blue-500 text-white px-4 py-2 rounded ${
      !data?.notifications?.length && 'opacity-50 cursor-not-allowed'
    }`}
    onClick={handleMarkAllAsRead}
    style={{ width: '150px' }}
  >
    <MdDoneAll size={20} className="mr-2" />
    Mark all as read
  </button>
  <button
    type="button"
    disabled={!data?.notifications?.length}
    className={`bg-red-500 text-white px-4 py-2 rounded ${
      !data?.notifications?.length && 'opacity-50 cursor-not-allowed'
    }`}
    onClick={handleDeleteAll}
    style={{ width: '150px' }} 
  >
    <MdDeleteSweep size={20} className="mr-2" />
    Delete all
  </button>
</div>

<div className="flex items-center space-x-4 mt-4">
  <button
    type="button"
    disabled={page === 0}
    onClick={() => {
      setPage((prev) => prev - 1);
    }}
    className={`text-blue-500 px-4 py-2 ${page === 0 && 'cursor-not-allowed'}`}
  >
    {'<'}
  </button>
  <div className="flex items-center">
    <div className="mx-2 text-gray-500">
      Page: {page + 1} / {data?.totalpage ?? '-'}
    </div>
  </div>
  <button
    type="button"
    disabled={data?.totalpage === page + 1}
    onClick={() => {
      setPage((prev) => prev + 1);
    }}
    className={`text-blue-500 px-4 py-2 ${data?.totalpage === page + 1 && 'cursor-not-allowed'}`}
  >
    {'>'}
  </button>
</div>

    </div>
  );
};

export default NotificationsList;

{/*
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const NotificationsList = () => {
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const getNotifications = async () => {
      try {
        const result = await axios.post(
          'http://localhost:5000/api/notifications',
          {
            id: user._id,
            limit: 3,
            page,
          },
          {
            signal: controller.signal,
          }
        );

        console.log('Database Response:', result);
        setData(result?.data);
      } catch (err) {
        setData(null);
      }
    };

    getNotifications();

    return () => {
      controller?.abort();
    };
  }, [user._id, page]);

  return (
    <div>
     {data && (
  <div>
    {data.notifications.map((notification) => (
      <div key={notification._id}>{notification.text}</div>
    ))}
   
  </div>
)}

      <button
        type="button"
        disabled={page === 0}
        onClick={() => {
          setPage((prev) => prev - 1);
        }}
      >
        {'<'}
      </button>
      <div style={{ marginLeft: '5px', marginRight: '5px' }}>
        page: {page + 1} / {data?.totalpage}
      </div>
      <button
        type="button"
        disabled={data?.totalpage === page + 1}
        onClick={() => {
          setPage((prev) => prev + 1);
        }}
      >
        {'>'}
      </button>
    </div>
  );
};

export default NotificationsList;
*/}