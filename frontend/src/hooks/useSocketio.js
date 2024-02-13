import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const useSocketIo = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const connect = io.connect("https://dryicesupport.onrender.com");
    setSocket(connect);
  }, []);
  return { socket };
};

export default useSocketIo;