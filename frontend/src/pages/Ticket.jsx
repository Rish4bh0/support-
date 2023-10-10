import { useDispatch, useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import {
  getTicket,
  closeTicket,
  reviewTicket,
  saveElapsedTime,
} from "../features/tickets/ticketSlice";
import {
  getNotes,
  createNote,
  reset as notesReset,
} from "../features/notes/noteSlice";
import Spinner from "../components/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import { fetchAllUsers } from "../features/auth/authSlice";
import { getAllIssueTypes } from "../features/issues/issueSlice";

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  // Access the user's role from Redux state
  const userRole = useSelector((state) => state.auth.user?.role);

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];

  const allowedRolesReview = ["ADMIN", "SUPERVISOR"];
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  // Define a function to start the timer
  const startTimer = () => {
    setIsTimerRunning(true);
    const startTime = Date.now() - elapsedTime;
    const timerInterval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    // Store the timer interval ID in the component's state
    setTimerIntervalId(timerInterval);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    clearInterval(timerIntervalId);

    // Calculate elapsed time in seconds
    const timeSpent = Math.floor(elapsedTime / 1000);

    // Calculate the updated total elapsed time by adding to the existing timeSpent
    const updatedTimeSpent = ticket.timeSpent + timeSpent;

    // Dispatch an action to save the updated elapsed time to the server
    dispatch(saveElapsedTime({ ticketId, timeSpent: updatedTimeSpent }));
  };

  // Handle timer start/stop button click
  const handleTimerButtonClick = () => {
    if (isTimerRunning) {
      // If the timer is running, stop it
      stopTimer();
    } else {
      // If the timer is not running, start it
      startTimer();
    }
  };

  // Format the elapsed time in HH:MM:SS format
  const formatElapsedTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );

  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access the users array from the Redux state
  const users = useSelector((state) => state.auth.users);

  // Find the user object with the same ID as the ticket's assignedTo ID
  const assignedUser = users.find((user) => user._id === ticket.assignedTo);

  // Extract the name of the assigned user (if found)
  const assignedToName = assignedUser ? assignedUser.name : "Unassigned";

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
    // eslint-disable-next-line
  }, [isError, message, ticketId]);

  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
  }, [dispatch]);

  // Access user data from the Redux store
  const userss = useSelector((state) => state.auth.users);

  // Function to get the user's name based on their ID
  const getUserNameById = (userId) => {
    const user = userss.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  // Access user data from the Redux store
  const issues = useSelector((state) => state.issueTypes.issueTypes);

  // Function to get the user's name based on their ID
  const issueById = (issueId) => {
    const issue = issues.find((issue) => issue._id === issueId);
    return issue ? issue.name : "Unknown User";
  };

  if (isLoading || notesIsLoading) return <Spinner />;

  if (isError) {
    return <h3>Something went wrong</h3>;
  }

  // Close ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket Closed");
    navigate("/tickets");
  };
  // Close ticket
  const onTicketSendForReview = () => {
    dispatch(reviewTicket(ticketId));
    toast.success("Ticket Sent For Review");
    navigate("/tickets");
  };

  // Open/Close Modal
  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Create Note Submit
  const onNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(createNote({ ticketId, noteText }));
    closeModal();
  };
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formattedTimeSpent = formatTime(ticket.timeSpent);
  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted:{" "}
          {new Date(ticket.createdAt).toLocaleString("en-US", options)}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <h3>Assigned To: {getUserNameById(ticket.assignedTo)}</h3>
        <h3>Priority: {ticket.priority}</h3>
        <h3>Time spent: {formattedTimeSpent}</h3>
        <h3>Issue Type: {issueById(ticket.issueType)}</h3>
        {ticket.status === "close" && (
          <h3>
            Closed At:{" "}
            {new Date(ticket.closedAt).toLocaleString("en-US", options)}
          </h3>
        )}
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <div className="ticket-timer">
          <h3>Elapsed Time: {formatElapsedTime(elapsedTime)}</h3>
          <button onClick={handleTimerButtonClick} className="btn">
            {isTimerRunning ? "Stop Timer" : "Start Timer"}
          </button>
        </div>
        {ticket.status !== "close" &&
          userRole &&
          allowedRoles.includes(userRole) && <h2>Notes</h2>}
      </header>

      {ticket.status !== "close" &&
        userRole &&
        allowedRoles.includes(userRole) && (
          <button onClick={openModal} className="btn">
            <FaPlus /> Add Note
          </button>
        )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Note Text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notes && Array.isArray(notes) ? (
        notes.map((note) => <NoteItem key={note._id} note={note} />)
      ) : (
        <p>No notes available</p>
      )}

      {ticket.media && ticket.media.length > 0 ? (
        <div className="media-container">
          {ticket.media.map((mediaItem) => (
            <div key={mediaItem.public_id} className="media-item">
              {mediaItem.url.startsWith("https://res.cloudinary.com") ? (
                mediaItem.url.endsWith(".mp4") ? (
                  <video
                    src={mediaItem.url}
                    controls // This adds video controls (play, pause, volume, etc.)
                    className="media-video" // Apply the media-video style
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={mediaItem.url}
                    alt={`Image ${mediaItem.public_id}`}
                    className="media-image" // Apply the media-image style
                  />
                )
              ) : (
                <p>Unsupported media format</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No media available</p>
      )}

      {userRole &&
        allowedRolesReview.includes(userRole) &&
        ticket.status !== "review" &&
        ticket.status !== "close" && (
          <button
            onClick={onTicketSendForReview}
            className="btn btn-reverse btn-block"
          >
            Send ticket for review
          </button>
        )}

      {ticket.status !== "close" &&
        userRole &&
        allowedRoles.includes(userRole) && (
          <button onClick={onTicketClose} className="btn btn-block btn-danger">
            Close Ticket
          </button>
        )}

      {/*
      {ticket.status !== "close" && (
        <button onClick={onTicketClose} className="btn btn-block btn-danger">
          Close Ticket
        </button>
      )}
*/}
    </div>
  );
}

export default Ticket;
