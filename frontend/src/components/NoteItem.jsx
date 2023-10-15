import { useSelector } from "react-redux";

function NoteItem({ note }) {
  const user = useSelector((state) => state.auth.users);
  const userMap = {};

  // Create a mapping of organization IDs to their names
  user.forEach((user) => {
    userMap[user._id] = user.name;
  });
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: '2-digit', minute: '2-digit'
  };

  return (
    <div
      className="note"
      style={{
        backgroundColor: note.isStaff ? "rgba(0,0,0,0.7)" : "#fff",
        color: note.isStaff ? "#fff" : "#000",
      }}
    >
      <h4>
        Note from {note.isStaff ? <span>Staff</span> : <span>{note.user
                    ? userMap[note.user]
                    : "Unassigned"}</span>}
      </h4>
      <p>{note.text}</p>
      <p>{new Date(note.toTime).toLocaleString("en-US", options)}</p>
      <p>{new Date(note.fromTime).toLocaleString("en-US", options)}</p>
      <div className="note-date">
        {new Date(note.createdAt).toLocaleString("en-US", options)}
      </div>
    </div>
  );
}

export default NoteItem;
