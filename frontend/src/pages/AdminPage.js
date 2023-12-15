import React, { useState, useEffect, useRef } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { io } from 'socket.io-client';

const ENDPOINT =
    window.location.host.indexOf('localhost') >= 0
        ? 'http://localhost:5000'
        : window.location.host;

export default function AdminPage() {
    const [selectedUser, setSelectedUser] = useState({});
    const [socket, setSocket] = useState(null);
    const uiMessagesRef = useRef(null);
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (uiMessagesRef.current) {
            uiMessagesRef.current.scrollBy({
                top: uiMessagesRef.current.scrollHeight,
                left: 0,
                behavior: 'smooth',
            });
        }
        if (socket) {
            socket.on('message', (data) => {
                if (selectedUser.name === data.from) {
                    setMessages([...messages, data]);
                } else {
                    const existUser = users.find((user) => user.name === data.from);
                    if (existUser) {
                        setUsers(
                            users.map((user) =>
                                user.name === existUser.name ? { ...user, unread: true } : user
                            )
                        );
                    }
                }
            });

            socket.on('updateUser', (updatedUser) => {
                const existUser = users.find((user) => user.name === updatedUser.name);
                if (existUser) {
                    setUsers(
                        users.map((user) =>
                            user.name === existUser.name ? updatedUser : user
                        )
                    );
                } else {
                    setUsers([...users, updatedUser]);
                }
            });
            socket.on('listUsers', (updatedUsers) => {
                setUsers(updatedUsers);
            });
            socket.on('selectUser', (user) => {
                setMessages(user.messages);
            });
        } else {
            const sk = io(ENDPOINT);
            setSocket(sk);
            sk.emit('onLogin', {
                name: 'Admin',
            });
        }
    }, [messages, selectedUser.name, socket, users]);

    const selectUser = (user) => {
        setSelectedUser(user);
        const existUser = users.find((x) => x.name === user.name);
        if (existUser) {
            setUsers(
                users.map((x) =>
                    x.name === existUser.name ? { ...x, unread: false } : x
                )
            );
        }
        socket.emit('onUserSelected', user);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
            alert('Error. Please type a message.');
        } else {
            setMessages([
                ...messages,
                { body: messageBody, from: 'Admin', to: selectedUser.name },
            ]);
            setTimeout(() => {
                socket.emit('onMessage', {
                    body: messageBody,
                    from: 'Admin',
                    to: selectedUser.name,
                });
            }, 1000);
            setMessageBody('');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    {users.filter((x) => x.name !== 'Admin').length === 0 && (
                        <Alert severity="info">No User Found</Alert>
                    )}
                    <List>
                        {users
                            .filter((x) => x.name !== 'Admin')
                            .map((user) => (
                                <ListItem
                                    button
                                    key={user.name}
                                    selected={user.name === selectedUser.name}
                                    onClick={() => selectUser(user)}
                                >
                                    <Badge
                                        color={
                                            selectedUser.name === user.name
                                                ? user.online
                                                    ? 'primary'
                                                    : 'secondary'
                                                : user.unread
                                                ? 'error'
                                                : user.online
                                                ? 'primary'
                                                : 'secondary'
                                        }
                                    >
                                        {selectedUser.name === user.name
                                            ? user.online
                                                ? 'Online'
                                                : 'Offline'
                                            : user.unread
                                            ? 'New'
                                            : user.online
                                            ? 'Online'
                                            : 'Offline'}
                                    </Badge>
                                    &nbsp;
                                    {user.name}
                                </ListItem>
                            ))}
                    </List>
                </div>
                <div className="admin">
                    {!selectedUser.name ? (
                        <Alert severity="info">Select a user to start chat</Alert>
                    ) : (
                        <div>
                            <h2>Chat with {selectedUser.name}</h2>
                            <List ref={uiMessagesRef}>
                                {messages.length === 0 && (
                                    <ListItem>No message</ListItem>
                                )}
                                {messages.map((msg, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={<strong>{`${msg.from}: `}</strong>}
                                            secondary={msg.body}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <form onSubmit={submitHandler}>
                                <FormControl fullWidth>
                                    <Input
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        type="text"
                                        placeholder="type message"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Send
                                                </Button>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
