



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
