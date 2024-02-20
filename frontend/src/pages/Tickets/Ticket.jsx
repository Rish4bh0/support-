import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../components/BackButton";
import {
  getTicket,
  closeTicket,
  reviewTicket,
  saveElapsedTime,
  report,
  openTicket,
} from "../../features/tickets/ticketSlice";
import {
  getNotes,
  createNote,
  reset as notesReset,
} from "../../features/notes/noteSlice";
import Spinner from "../../components/Spinner";
import MediaUpload from "../Media/ImageUpload";
import DoneIcon from "@mui/icons-material/Done";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
//import NoteItem from "../components/NoteItem";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import { fetchAllUsers } from "../../features/auth/authSlice";
import { getAllIssueTypes } from "../../features/issues/issueSlice";
import { getAllOrganization } from "../../features/organization/organizationSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { getAllProject } from "../../features/project/projectSlice";
import { Grid } from "@mui/material";

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
  const allowedRoles = ["ADMIN", "SUPERVISOR"];

  const allowedRolesReview = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [text, settext] = useState("");
  const [fromTimee, setfromTimee] = useState("");
  const [toTimee, settoTimee] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerIntervalId, setTimerIntervalId] = useState(null);

  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};

  // Create a mapping of organization IDs to their names
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  const projects = useSelector((state) => state.project.project);
  const projectMap = {};

  // Create a mapping of organization IDs to their names
  projects.forEach((project) => {
    projectMap[project._id] = project.projectName;
  });

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

  // Access CC users from the Redux state
  const ccUsers =
    ticket && ticket.cc
      ? ticket.cc.map((ccUserId) => {
          const ccUser = users.find((user) => user._id === ccUserId);
          return ccUser ? ccUser.name : "Unknown User";
        })
      : [];

  // Extract the name of the assigned user (if found)
  const assignedToName = assignedUser ? assignedUser.name : "Unassigned";

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
    dispatch(report());
    // eslint-disable-next-line
  }, [isError, message, ticketId]);

  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
    dispatch(getAllProject());
  }, [dispatch]);

  // Access user data from the Redux store
  const userss = useSelector((state) => state.auth.users);

  const getNameByID = (userId) => {
    const user = userss.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  // Function to get the user's name based on their ID
  const getUserNameById = (userId) => {
    const user = userss.find((user) => user._id === userId);
    return user ? user.name : "Unassigned";
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
    navigate("/allticket");
  };

  // Close ticket
  const onTicketOpen = () => {
    dispatch(openTicket(ticketId));
    toast.success("Ticket Opened");
    navigate("/allticket");
  };
  // Close ticket
  const onTicketSendForReview = () => {
    dispatch(reviewTicket(ticketId));
    toast.success("Ticket Sent For Review");
    navigate("/allticket");
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
    const toTime = new Date(toTimee);
    const fromTime = new Date(fromTimee);
    console.log(toTime, fromTime);

    const timeEntries = [
      {
        fromTime,
        toTime,
      },
    ];
    const noteData = {
      text,
      timeEntries,
    };
    console.log(noteData);
    dispatch(createNote({ ticketId, noteData }));
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
  const options = {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const columns = [
    { field: "noteId", headerName: "Note ID", flex: 1.5 },
    { field: "text", headerName: "Task details", flex: 1 },
    {
      field: "toTime",
      headerName: "Start Time",
      flex: 1.5,
      valueGetter: (params) => {
        // Access "toTime" inside "timeEntries" array
        const formattedTime = new Date(
          params.row.toTime[0].toTime
        ).toLocaleString("en-US", options);
        return formattedTime;
      },
    },
    {
      field: "fromTime",
      headerName: "End Time",
      flex: 1.5,
      valueGetter: (params) => {
        // Access "fromTime" inside "timeEntries" array
        const formattedTime = new Date(
          params.row.fromTime[0].fromTime
        ).toLocaleString("en-US", options);
        return formattedTime;
      },
    },
    {
      field: "timeDifference",
      headerName: "Time Difference",
      flex: 1,
      valueGetter: (params) => {
        const toTime = new Date(params.row.toTime[0].toTime);
        const fromTime = new Date(params.row.fromTime[0].fromTime);

        // Calculate the absolute time difference in milliseconds
        const timeDiff = Math.abs(toTime - fromTime);

        // Convert milliseconds to a formatted time difference
        const hours = Math.floor(timeDiff / 3600000);
        const minutes = Math.floor((timeDiff % 3600000) / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);

        const formattedTimeDifference = `${hours}h ${minutes}m ${seconds}s`;

        return formattedTimeDifference;
      },
    },
  ];

  // Map notes data to rows for the DataGrid
  const rows = notes.map((note) => ({
    id: note._id,
    noteId: note._id,
    text: note.text,
    toTime: note.timeEntries,
    fromTime: note.timeEntries,
  }));

  return (
    <div className="ticket-page">
      <div className="ticket-header bg-white p-4 border rounded-lg text-sm mb-4">
        <div className="border-b-1 font-extrabold text-sm pb-3 mb-3">
          <div className="font-extrabold">Detail View</div>
        </div>
        <Grid container spacing={3}>
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
              <label className="font-semibold">Ticket Title :</label>
              <span>{ticket.title}</span>
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
              <label className="font-semibold">Project:</label>
              <span>
                {ticket.project ? projectMap[ticket.project] : "HRMS"}
              </span>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <label className="font-semibold">Created By : </label>
              <span>{getNameByID(ticket.user)}</span>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <label className="font-semibold">Assigned To : </label>
              <span>{getUserNameById(ticket.assignedTo)}</span>
            </div>
          </Grid>
          <Grid item xs={12}>
            {ccUsers.length > 0 && (
              <div className="cc-tags w-full">
                <div className="w-full flex gap-2">
                  <label className="font-semibold">CC : </label>
                  {ccUsers.map((ccUser, index) => (
                    <div key={index} className="tag">
                      {ccUser}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Grid>
          <Grid item xs={4}>
            <div>
              <label className="font-semibold">Priority : </label>
              <span>{ticket.priority}</span>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <label className="font-semibold">Issue Type : </label>
              <span>{issueById(ticket.issueType)}</span>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>
              <label className="font-semibold">Office : </label>
              <span>
                {" "}
                {ticket.organization
                  ? organizationMap[ticket.organization]
                  : "Unassigned"}
              </span>
            </div>
          </Grid>
          {ticket.status === "close" && (
            <Grid item xs={4}>
              <div>
                <label className="font-semibold">Closed At : </label>
                <span>
                  {" "}
                  {new Date(ticket.closedAt).toLocaleString(
                    "en-US",
                    options
                  )}{" "}
                </span>
              </div>
            </Grid>
          )}

          <Grid item xs={12}>
            <div className="ticket-desc flex gap-2">
              <label className="font-semibold">Issue Description : </label>
              <p>{ticket.description}</p>
            </div>
          </Grid>
          <Grid item xs={12}>
            {ticket.status !== "close" &&
              userRole &&
              allowedRoles.includes(userRole) && (
                <label className="font-semibold">Notes : </label>
              )}
          </Grid>
        </Grid>
      </div>

      <div className="border border-gray-300 rounded-2xl bg-white w-full mb-28">
        <div className="border-b-1 p-4 text-sm flex justify-between">
          <div className="font-extrabold">Added Task</div>
          <div>
            {ticket.status !== "close" &&
              userRole &&
              allowedRolesReview.includes(userRole) && (
                <Button
                  onClick={openModal}
                  className="btn cursor-pointer flex gap-2"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  variant="contained"
                >
                  <FaPlus /> Add Task
                </Button>
              )}
          </div>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            ...customStyles,
            zIndex: 1,
            position: "absolute",
          }}
          contentLabel="Add Task"
        >
          <h2>Add task</h2>
          <button className="btn-close" onClick={closeModal}>
            X
          </button>
          <form onSubmit={onNoteSubmit}>
            <div className="form-group">
              <label htmlFor="text">Text:</label>
              <textarea
                name="Task Detail"
                id="text"
                className="form-control"
                placeholder="Text"
                value={text}
                onChange={(e) => settext(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label htmlFor="toTimee">Start Time:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    value={toTimee}
                    onChange={(newToTime) => settoTimee(newToTime)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div>
              <label htmlFor="fromTimee">End Time:</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    value={fromTimee}
                    onChange={(newFromTime) => setfromTimee(newFromTime)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="form-group mt-10">
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
          </form>
        </Modal>

        <div className="p-4">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5} // You can adjust the number of rows per page
          />
        </div>

        {ticket.status !== "close" && <MediaUpload ticketID={ticket._id} />}
        <div className="card-footer p-4 border-t-1 space-x-6 text-end">
          {userRole &&
            allowedRolesReview.includes(userRole) &&
            ticket.status !== "review" &&
            ticket.status !== "close" && (
              <Button
                variant="contained"
                color="success"
                endIcon={<SendIcon />}
                onClick={onTicketSendForReview}
              >
                Send ticket for review
              </Button>
            )}

          {ticket.status !== "close" &&
            userRole &&
            allowedRoles.includes(userRole) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloseIcon />}
                onClick={onTicketClose}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Close Ticket
              </Button>
            )}

          {(ticket.status === "draft" ||
            (ticket.status === "close" &&
              userRole &&
              allowedRoles.includes(userRole))) && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<DoneIcon />}
              onClick={onTicketOpen}
            >
              Open Ticket
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ticket;
