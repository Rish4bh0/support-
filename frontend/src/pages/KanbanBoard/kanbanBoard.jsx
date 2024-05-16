import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Grid, InputLabel, MenuItem, Select, Tooltip, FormControl } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../features/auth/authSlice";
import { getTicket } from "../../features/tickets/ticketSlice";
import { toast } from "react-toastify";
import { BsArrowUpShort } from "react-icons/bs";
import { BsArrowDownShort } from "react-icons/bs";



export const CustomKanban = () => {
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const { ticket,  isError, message } = useSelector(
    (state) => state.tickets
  );

  const options = {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const [loading, setLoading] = useState(true); // Create a loading state variable

  useEffect(() => {
    dispatch(getTicket(ticketId))
      .then(() => setLoading(false)) // Update loading state when ticket data is fetched
      .catch((error) => {
        console.error('Error fetching ticket:', error);
        setLoading(false); // Update loading state even if there's an error
      });
  }, [ticketId]);

  return (
    <>
    <div className="ticket-header bg-slate-100 p-4 border rounded-lg text-sm mb-4">
        <div className="border-b-1 font-extrabold text-sm pb-3 mb-3">
          <div className="font-extrabold">Detail View</div>
        </div>
        {loading ? ( 
          <div className="flex justify-center items-center h-40"> 
          <CircularProgress color="primary" /> 
        </div>
        ) : (
        <Grid container spacing={3}>
      
        <Grid item xs={12}>
            <div>
              <label className="font-semibold">Ticket Title :</label>
              <span>{ticket.title}</span>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className="flex gap-2 items-center">
              <div>
                <label className="font-semibold">Ticket ID :</label>
                <span>{ticket.ticketID}</span>
              </div>
              <span className={`status status-${ticket.status}`}>
                {ticket.status}
              </span>
            </div>
          </Grid>
          
          <Grid item xs={4}>
            <div>
              <label className="font-semibold">Date Submitted :</label>
              <span>
                {new Date(ticket.createdAt).toLocaleString("en-US", options)}
              </span>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <label className="font-semibold">Priority : </label>
              <span>{ticket.priority}</span>
            </div>
          </Grid>
 
          <Grid item xs={12}>
            <div className="ticket-desc flex gap-2">
              <label className="font-semibold">Issue Description : </label>
              <p>{ticket.description}</p>
            </div>
          </Grid>
           
        </Grid>
        )}
      </div>
    <div className="h-screen w-full bg-slate-100 border rounded-lg text-neutral-500 dark:bg-neutral-900 dark:text-neutral-50">
    <div className="font-extrabold p-4 text-black text-sm">Kanban Board</div>
      <Board />
    </div>
    </>
  );
};

const Board = () => {
  const { ticketId } = useParams(); // Get the ticket ID from URL params

  const [cards, setCards] = useState([]);

  useEffect(() => {
    const storedCards = localStorage.getItem(`kanbanCards-${ticketId}`);
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, [ticketId]);

  useEffect(() => {
    localStorage.setItem(`kanbanCards-${ticketId}`, JSON.stringify(cards));
  }, [cards, ticketId]);

  const filteredCards = cards.filter((card) => card.ticketId === ticketId);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll border p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={filteredCards}
        setCards={setCards}
        ticketId={ticketId}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-400"
        cards={filteredCards}
        setCards={setCards}
        ticketId={ticketId}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-400"
        cards={filteredCards}
        setCards={setCards}
        ticketId={ticketId}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-400"
        cards={filteredCards}
        setCards={setCards}
        ticketId={ticketId}
      />
      <BurnBarrel setCards={setCards} ticketId={ticketId} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards, ticketId }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);

      // Remove card from local storage
      const storedCards = JSON.parse(
        localStorage.getItem(`kanbanCards-${ticketId}`)
      );
      const updatedCards = storedCards.filter((c) => c.id !== cardId);
      localStorage.setItem(
        `kanbanCards-${ticketId}`,
        JSON.stringify(updatedCards)
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-700 dark:text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-white dark:bg-neutral-800/50" : "dark:bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} ticketId={ticketId} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart, assignedto }) => {
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const [showFullText, setShowFullText] = useState(false);
  const { ticket, isError, message } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
  }, [isError, message, ticketId]);
  const users = useSelector((state) => state.auth.users);
  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unassigned";
  };

  const truncateText = (text, limit) => {
    const words = text.split(" ");
    if (words.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-white bg-white dark:border-neutral-700 dark:bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <div className="flex  justify-between h-full">
          <div className="flex justify-between flex-col h-full">
            <p
              className="text-sm text-neutral-700 dark:text-neutral-100 overflow-hidden"
              style={{
                maxWidth: "150px",
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
            >
              {showFullText ? title : truncateText(title, 10)}
            </p>
            {title.length > 10 && (
              <button
                onClick={toggleShowFullText}
                className="text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100 flex items-center"
              >
                {showFullText ? (
                  <BsArrowUpShort className="mr-1" />
                ) : (
                  <BsArrowDownShort className="mr-1" />
                )}
                {showFullText ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          <div className="flex -space-x-4 rtl:space-x-reverse ">
            {assignedto.length <= 2 ? (
              assignedto.map((userId, index) => (
                <Tooltip
                  key={index}
                  title={getUserNameById(userId)}
                  placement="top"
                >
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 border-2 border-white  dark:border-gray-800">
                    <span className="font-medium text-gray-600 dark:text-gray-300 ">
                      {getUserNameById(userId)[0]}
                    </span>
                  </div>
                </Tooltip>
              ))
            ) : (
              <Tooltip
                title={assignedto
                  .map((userId) => getUserNameById(userId))
                  .join(", ")}
                placement="top"
              >
                <a
                  className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +{assignedto.length}
                </a>
              </Tooltip>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards, ticketId }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-400 dark:bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-white dark:bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards, ticketId }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const users = useSelector((state) => state.auth.users);
  const dispatch = useDispatch();
 

  useEffect(() => {
    // Fetch users only if the users array is empty
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users]);

  useEffect(() => {
    // Filter users based on role
    setFilteredUsers(
      users.filter((user) =>
        ["ADMIN", "EMPLOYEE", "SUPERVISOR"].includes(user.role)
      )
    );
  }, [users]);

  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
      ticketId: `${ticketId}`,
      assignedto: selectedUsers,
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  return (
    <>
      
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-blue-400 bg-blue-400/20 p-3 text-sm text-neutral-500 dark:text-neutral-50 placeholder-blue-300 focus:outline-0"
          />
          <Grid item xs={3}>
          <FormControl fullWidth>
          <InputLabel htmlFor="assignedTo">Assign User</InputLabel>

            <Select
              name="assignedTo"
              id="assignedTo"
              value={selectedUsers}
              onChange={(e) => setSelectedUsers(e.target.value)}
              multiple
             
              className="w-full rounded border border-blue-400 bg-blue-400/20 p-3 text-sm text-neutral-500 dark:text-neutral-50 placeholder-blue-300 focus:outline-0"
            >
               <MenuItem value="" disabled>Assign Users</MenuItem>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  No users available for the selected organization
                </MenuItem>
              )}
            </Select>
            </FormControl>
          </Grid>
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-800 transition-colors hover:text-neutral-500 dark:hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-500 dark:hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};



export default CustomKanban;
