import styles from "./page.module.css";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import Sidebar from "../../components/UserList/sidebar";
import { environment } from "../../lib/environment";


export default function Home() {
  const user = useSelector((state) => state.auth.user);

  const [data, setData] = useState(null); //state for chats in side bar
  const [value, setValue] = useState(""); //state for text input
  const [chats, setChats] = useState(null); //state for current chat messages
  const [chatInfo, setChatInfo] = useState(null); //state for current chat Info

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    
    getAllChats();
    setSocket(io());
    
  }, []);

  // show selected user chat and fetch chat
  const showChat = async (data) => {
    if (chatInfo !== null) {
       
      //leaving previous chat room
      socket.emit("leave chat", chatInfo);
    }
    await getChat(data._id);
    console.log("pls" + data._id);
    //joining new chat room
    socket.emit("join chat", data.userId);
  };

  //creating new message
  const addMessage = () => {
    socket.emit("chat message", {
      message: value,
      userId: chatInfo._id,
      sentBy: "host",
    });
    setValue("");
  };

  //Disconnect host
  const disconnectHost = () => {
    socket.emit("host disconnect");
  };

  //Connect host
  useEffect(() => {
    socket?.emit("host connect");
  }, [socket]);

  useEffect(() => {
    //socket listener for any message received in current chat
    socket?.on("chat received", (data) => {
      updateChats(data);
    });

    //socket listener in case new chat is added
    socket?.on("chat added", () => {
      toast.success("New chat",{position: "top-center"});
      getAllChats();
    });
  }, [socket]);

  const updateChats = (data) => {
    setChats((prev) => {
      return [...prev, { content: data.message, createdBy: data.createdBy }];
    });
  };

  const getAllChats = async () => {
    try {
      const response = await axios.get("/api/chat/");
     
      if (response && response.data) {
        setData(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  

  const getChat = async (id) => {
    try {
      const response = await axios.get(`/api/chat/${id}`);
      console.log("chat:" + response.data);
      if (response && response.data) {
        setChats(response.data.data.messages);
        setChatInfo(response.data.data.userId);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };
  

  useEffect(()=>{
    if(chats){
      //scrolling to current chat
      const chatMessages = document.getElementById("chat-messages");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  },[chats])

  return (
    <main className={styles.main}>
     
      <div className={styles.container}>
        <Sidebar showChat={showChat} data={data} />
       { console.log(showChat, data)}
        {chatInfo ? (
          <div className={styles.chatBox}>
            <div className={styles.chatHeader}>Hyper</div>
            <div id="chat-messages" className={styles.chats}>
              <div className={styles.chatsContainer}>
                {chats?.map((item, i) => (
                  <div
                    key={i}
                    className={`${styles.chat} ${
                      item.createdBy === "host" && styles.other
                    }`}
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="Type Here"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <button onClick={addMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div className={styles.noChat}>
            <h1>Open A Chat</h1>
          </div>
        )}
      </div>
    </main>
  );
}
