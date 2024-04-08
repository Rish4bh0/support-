import React from "react";
import NotificationsList from "./NotificationsList";
import { MdClose } from "react-icons/md";

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  

  return (
    <div
      className="card bg-white border text-sm rounded-lg"
      style={{
        width: "400px",
        top: "70%",
        right: "14%",
        position: "absolute",
        zIndex: 1,
      }}
    >
      <div className="relative">
        {/*
        <button
          onClick={onClose}
          className="absolute -right-4 -top-4 text-white bg-red-500 p-2 rounded-lg"
        >
          <MdClose size={20} />
        </button>
        */}
        <NotificationsList />
      </div>
    </div>
  );
};

export default NotificationModal;
