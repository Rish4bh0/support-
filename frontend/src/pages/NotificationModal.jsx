import React from 'react';
import NotificationsList from './NotificationsList';
import { MdClose } from 'react-icons/md';
import zIndex from '@mui/material/styles/zIndex';

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"  style={{zIndex: 999}}>
      <div className="bg-white p-4 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <MdClose size={20} />
        </button>
        <NotificationsList />
      </div>
    </div>
  );
};

export default NotificationModal;
