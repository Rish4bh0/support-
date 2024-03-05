import React from "react";
import NotificationsList from "./NotificationsList";

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="card bg-white border text-sm rounded-lg"
      style={{
        width: "370px",
        top: "97%",
        right: "17.7%",
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
