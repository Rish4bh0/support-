import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  MdArrowForwardIos,
  MdDeleteOutline,
  MdDeleteSweep,
  MdDoneAll,
  MdOutlineCheckCircleOutline,
} from "react-icons/md";
import useSocketIo from "../../hooks/useSocketio";
import Spinner from "../../components/Spinner";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { environment } from "../../lib/environment";
import { Link } from "react-router-dom";

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

          "/api/notifications",

          {
            id: user._id,
            limit: 2,
            page,
          },
          {
            signal: controller.signal,
          }
        );

        console.log("Database Response:", result);
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
      const result = await axios.patch(

        "/api/notifications",

        { id: notificationId }
      );

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
      const result = await axios.patch(
         "/api/notifications/all",

        { id: user._id }
      );

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
      const result = await axios.delete(
        "/api/notifications",

        { data: { id: notificationId } }
      );
      const newNotifications = data?.notifications?.filter(
        (item) => item._id !== notificationId
      );
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
      const result = await axios.delete(

         "/api/notifications/all",

        { data: { id: user._id } }
      );
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
  if (isLoading) return <Spinner />;

  let content;
  if (data && data.notifications && data.notifications.length > 0) {
    content = (
      <>
        <div className="card-header border-b-2 p-4 flex justify-between items-center">
          <div className="font-semibold">Notifications list</div>
          <div className="flex gap-3 text-xs">
            <button
              type="button"
              disabled={!data?.notifications?.length}
              className={` text-dark ${
                !data?.notifications?.length && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
            <button
              type="button"
              disabled={!data?.notifications?.length}
              className={`text-black ${
                !data?.notifications?.length && "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleDeleteAll}
            >
              <MdDeleteSweep size={20} className="mr-2" />
            </button>
          </div>
        </div>
        
        <div className="card-body">
          {data.notifications.map((notification) => (
            <div
              key={notification._id}
              className={
                "flex items-start justify-between gap-8 border-b-1 p-4" +
                (notification.read ? " bg-white" : " bg-blue-50")
              }
            >
                <Link to={`/ticket/${notification.id}`} className="flex items-start gap-2">
              <div className={"flex items-start gap-2"}>
                <div className="bg-blue-200 text-blue-950 flex items-center justify-center h-10 w-10 rounded-full">
                  <ConfirmationNumberIcon />
                </div>
                <div>
                  <p className="font-semibold mb-1">{notification.title}</p>
                  <p className="break-words w-64 text-xs">
                    {notification.text}
                  </p>
                </div>
              </div>
              </Link>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleMarkOneAsRead(notification._id);
                  }}
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
            </div>
          ))}
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="card-header border-b-2 p-4 flex justify-between items-center">
          <div className="font-semibold">Notifications list</div>
        </div>
        <div className="card-body p-4">No data to show</div>
      </>
    );
  }

  return (
    <div>
      {content}
  
      {data && data.notifications && data.notifications.length > 0 && (
        <div className="flex items-center justify-center space-x-2 my-4 font-semibold">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => {
              setPage((prev) => prev - 1);
            }}
            className={`px-4 ${page === 0 && "cursor-not-allowed"}`}
          >
            {"<"}
          </button>
          <div className="flex items-center">
            <div className="mx-2 text-gray-500">
              {page + 1} / {data?.totalpage ?? "-"}
            </div>
          </div>
          <button
            type="button"
            disabled={data?.totalpage === page + 1}
            onClick={() => {
              setPage((prev) => prev + 1);
            }}
            className={`px-4 ${
              data?.totalpage === page + 1 && "cursor-not-allowed"
            }`}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
  
};

export default NotificationsList;
