import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "https://nea-support.onrender.com"
    : window.location.host;

export default function ChatBox() {


    const user = useSelector((state) => state.auth.user);
    
    const username = user ? user.name : null;
  const uiMessagesRef = useRef(null);

  const [userName, setUserName] = useState(username);
  const [messages, setMessages] = useState([
    { from: "System", body: "Hello there, Please ask your question." },
  ]);

  const [socket, setSocket] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    if (socket) {
      socket.emit("onLogin", { name: userName });
      socket.on("message", (data) => {
        console.log(messages);
        setMessages([...messages, data]);
      });
    }
  }, [messages, socket, userName]);

  const supportHandler = () => {
    setIsOpen(true);
    if (!userName) {
      setUserName(prompt("Please enter your name"));
    }
    const sk = io(ENDPOINT);
    setSocket(sk);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Error. Please type message.");
    } else {
      setMessages([
        ...messages,
        { body: messageBody, from: userName, to: "Admin" },
      ]);
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          from: userName,
          to: "Admin",
        });
      }, 1000);
      setMessageBody("");
    }
  };

  return (
    <div className="chatbox">
      {!isOpen ? (
        <Button onClick={supportHandler} variant="contained" color="primary">
          Chat with us
        </Button>
      ) : (
        <Card>
          <CardContent>
            <Grid container justifyContent="space-between">
              <Grid item>
                <strong>Support</strong>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  color="secondary"
                  onClick={closeHandler}
                  startIcon={<CloseIcon />}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
            <hr />
            <List ref={uiMessagesRef}>
              {messages.map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${msg.from}: `}
                    secondary={msg.body}
                  />
                </ListItem>
              ))}
            </List>
            <form onSubmit={submitHandler}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Type message"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
