import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { environment } from '../lib/environment';



const useSocketIo = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const connect = io.connect();
    setSocket(connect);
  }, []);
  return { socket };
};

export default useSocketIo;