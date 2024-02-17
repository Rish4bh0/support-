import React from "react";
import NotificationsList from "./NotificationsList";
import { MdClose } from "react-icons/md";
import zIndex from "@mui/material/styles/zIndex";

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
      style={{ zIndex: 999 }}
    >
      <div className="card bg-white text-sm rounded-lg w-98 relative">
        <button
          onClick={onClose}
          className="absolute -right-4 -top-4 text-white bg-red-500 p-2 rounded-lg"
        >
          <MdClose size={20} />
        </button>
        <NotificationsList />
      </div>
    </div>
  );
};

export default NotificationModal;
