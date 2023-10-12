import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createTicket, reset } from "../features/tickets/ticketSlice";
import { fetchAllUsers } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";
import { getAllIssueTypes } from "../features/issues/issueSlice";
import { getAllOrganization } from "../features/organization/organizationSlice";

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );
  const users = useSelector((state) => state.auth.users);
  const issues = useSelector((state) => state.issueTypes.issueTypes);
  const organizations = useSelector((state) => state.organizations.organizations);

  const [name] = useState(user.name);
  const [email] = useState(user.email);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [customerContact, setCustomerContact] = useState("");
  const [product, setProduct] = useState("Ecommerce");
  const [priority, setPriority] = useState("High");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [media, setMedia] = useState([]);
  const [organization, setOrganization ] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of registered users when the component loads
    dispatch(fetchAllUsers());
    // Load the initial issue list when the component mounts
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);

  const handleMedia = (e) => {
    const selectedMedia = e.target.files;
    const mediaArray = [];

    for (let i = 0; i < selectedMedia.length; i++) {
      const file = selectedMedia[i];
      setFileToBase(file, (base64Media) => {
        mediaArray.push(base64Media);

        if (i === selectedMedia.length - 1) {
          setMedia(mediaArray);
        }
      });
    }
  };

  const setFileToBase = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Media = reader.result;
      callback(base64Media);
    };
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
     
     
      dispatch(reset());
    }
  }, [dispatch, isError, isSuccess, navigate, message]);

  const onSubmit = (e) => {
 //   e.preventDefault();
  //  if (!isEmailValid) {
      // Email is not valid, display an error or take appropriate action
  //    toast.error("Please enter a valid email address.");
   //   return;
  //  }

    const ticketData = {
      product,
      media, // Include the images array
      description,
      priority,
      assignedTo,
      issueType,
      customerName,
      customerEmail,
      customerContact,
      organization
    };

    dispatch(createTicket(ticketData));
  };
/*
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsEmailValid(emailPattern.test(email));
  };
*/
  if (isLoading) return <Spinner />;

  return (
    <>
      <BackButton url="/" />
      <section className="heading">
        <h1>Create New Ticket</h1>
        <p>Please fill out the form below</p>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Creators Name</label>
          <input type="text" className="form-control" value={name} disabled />
        </div>
      </section>

      <section className="form">
        <div className="form-group">
          <label htmlFor="name">Creators Email</label>
          <input type="text" className="form-control" value={email} disabled />
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="customerName">Customer Name</label>
            <input
              className="form-control"
              placeholder="customerName"
              value={customerName}
              name="customerName"
              id="customerName"
              onChange={(e) => setCustomerName(e.target.value)}
            ></input>
          </div>
          <div className="form-group"/*className={`form-group ${isEmailValid ? "valid" : "invalid"}`}*/>
            <label htmlFor="customerEmail">Customer Email</label>
            <input
              className="form-control"
              placeholder="customerEmail"
              value={customerEmail}
              name="customerEmail"
              id="customerEmail"
              onChange={(e) => {
                setCustomerEmail(e.target.value);
                //validateEmail(e.target.value);
              }}
            />
           {/* {isEmailValid ? null : (
              <p className="error-message">
                Please enter a valid email address.
              </p>
           )}*/}
          </div>

          <div className="form-group">
            <label htmlFor="customerContact">Customer Contact</label>
            <input
              className="form-control"
              placeholder="customerContact"
              value={customerContact}
              name="customerContact"
              id="customerContact"
              onChange={(e) => setCustomerContact(e.target.value)}
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="organization">Organization</label>
            <select
              name="organization"
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            >
              <option value="">Select One</option>
              {organizations && organizations.length > 0 ? (
                organizations.map((organization) => (
                  <option key={organization._id} value={organization._id}>
                    {organization.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No organization available
                </option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              name="assignedTo"
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select One</option>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No users available
                </option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="product">Product Name</label>
            <select
              name="product"
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="Ecommernce">Ecommerce</option>
              <option value="Employee management system">
                Employee management system
              </option>
              <option value="HR management system">HR management system</option>
              <option value="CMS">CMS</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              name="priority"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="issueType">Issue Type</label>
            <select
              name="issueType"
              id="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="">Select One</option>
              {issues && issues.length > 0 ? (
                issues.map((issue) => (
                  <option key={issue._id} value={issue._id}>
                    {issue.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No issue available
                </option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description of the issue</label>
            <textarea
              className="form-control"
              placeholder="Description"
              value={description}
              name="description"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <div className="form-outline mb-4">
              <input
                onChange={handleMedia}
                type="file"
                id="formupload"
                name="media"
                className="form-control"
                multiple // Allow multiple file selection
              />
              <label className="form-label" htmlFor="formupload">
                Media (Images and Videos)
              </label>
            </div>
            {media.length > 0 && (
              <div className="selected-media">
                <div className="media-items-container">
                  {media.map((mediaItem, index) => (
                    <div key={index} className="media-item">
                      {mediaItem.startsWith("data:image") ? (
                        <img
                          className="img-fluid"
                          src={mediaItem}
                          alt={`Selected Image ${index + 1}`}
                          style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust the dimensions as needed
                        />
                      ) : (
                        <video
                          controls
                          className="video-fluid"
                          src={mediaItem}
                          alt={`Selected Video ${index + 1}`}
                          style={{ maxWidth: "100px", maxHeight: "100px" }} // Adjust the dimensions as needed
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
}

export default NewTicket;
