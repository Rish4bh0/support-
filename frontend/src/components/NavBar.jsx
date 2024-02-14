import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdNotificationsActive, MdNotificationsNone } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";

import { getAllOrganization } from "../features/organization/organizationSlice";
import useSocketIo from "../hooks/useSocketio";
import NotificationModal from "../pages/NotificationModal";
import { Button, Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const NavButton = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
  backgroundColor,
  className,
}) => (
  <button
    type="button"
    onClick={() => customFunc()}
    style={{ color: color, backgroundColor: backgroundColor }}
    className={`cursor-pointer w-full text-start  ${className}`}
  >
    {icon}
    {title}
  </button>
);

const NavBar = () => {
  const {
    activeMenu,
    setactiveMenu,
    handleClick,
    isClicked,
    setisClicked,
    screenSize,
    setscreenSize,
  } = useStateContext();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  useEffect(() => {
    const handleResize = () => setscreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setactiveMenu(false);
    } //else {
    //  setactiveMenu(true);
    //  }
  }, [screenSize]);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch(); // Get the dispatch function
  const navigate = useNavigate();

  const [notificationsLength, setNotificationsLength] = useState(0);
  const { socket } = useSocketIo();
  const id = user ? user._id : null;

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  useEffect(() => {
    dispatch(getAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      console.log("Socket connected");

      // Set user ID for socket
      socket.emit("setUserId", id);

      // Get initial notifications length
      socket.emit("getNotificationsLength", id);

      // Listen for notifications length updates
      socket.on("notificationsLength", (data) => {
        console.log("Received notificationsLength:", data);
        setNotificationsLength(data);
      });

      // Listen for socket event to update notification length
      socket.on("updateNotificationsLength", () => {
        console.log("Received updateNotificationsLength event");
        socket.emit("getNotificationsLength", id);
      });

      // Set up periodic timer to fetch notifications length
      const timer = setInterval(() => {
        console.log("Fetching notifications length...");
        socket.emit("getNotificationsLength", id);
      }, 5000); // run every 5 seconds

      // Cleanup on component unmount
      return () => {
        console.log("Component unmounted. Cleaning up...");
        clearInterval(timer);
        socket.off("notificationsLength");
        socket.off("updateNotificationsLength");
      };
    }
  }, [id, setNotificationsLength, socket]);

  // ........

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickNew = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // ......

  return (
    <nav className={"py-4" + (user ? " px-4" : " px-40")}>
      <div class="relative flex items-center justify-between">
        <div>
          {user ? (
            <NavButton
              customFunc={() =>
                setactiveMenu((prevActiveMenu) => !prevActiveMenu)
              }
              color="black"
              icon={<AiOutlineMenu />}
            />
          ) : (
            // <AiOutlineMenu className="text-white" />
            <div class="flex flex-shrink-0 items-center">
              <img
                class="h-8 w-auto"
                src="/static/media/dryice-logo.4296ab853306efcf5617.png"
                alt="Your Company"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user
            ? ((
                <NotificationModal
                  isOpen={isNotificationModalOpen}
                  onClose={() => setIsNotificationModalOpen(false)}
                />
              ),
              (
                <button
                  type="button"
                  onClick={() => setIsNotificationModalOpen(true)}
                  className="flex align-middle"
                >
                  <div>
                    {notificationsLength ? (
                      <MdNotificationsActive
                        size={25}
                        style={{ marginTop: 8 }}
                      />
                    ) : (
                      <MdNotificationsNone size={25} />
                    )}

                    {notificationsLength > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: -8,
                          right: 266,
                          background: "#03C9D7",
                          borderRadius: "50%",
                          padding: "2px 6px",
                          fontSize: "12px",
                          color: "white",
                        }}
                      >
                        {notificationsLength}
                      </span>
                    )}
                  </div>
                </button>
              ))
            : null}

          {user ? (
            <div>
              <div>
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClickNew}
                  className="cursor-pointer"
                >
                  <PersonIcon />
                  <span className="text-gray-400 font-bold ml-1 capitalize">
                    {user.name} {organizationMap[user.organization] || ""}
                  </span>
                </Button>
                <Menu
                  id="simple-menu"
                  PaperProps={{ className: "w-48" }}
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <NavButton
                      title="Logout"
                      color="black"
                      customFunc={onLogout}
                      icon={<PowerSettingsNewIcon className="mr-2" />}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <SettingsIcon className="mr-2" /> Settings
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 hover-bg-dark-gray rounded-lg">
              <NavButton
                title="Login"
                // dotColor="#03c9d7"
                color="white"
                backgroundColor="blue"
                className="p-2 rounded text-sm"
                customFunc={handleLoginClick}
                icon={<LoginIcon />}
              />
              {/*
            <NavButton
              title="Register"
              //dotColor="#03c9d7"
              color="black"
              customFunc={handleRegisterClick}
              icon={<PersonAddIcon />}
            />
            */}
            </div>
          )}
        </div>
      </div>
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </nav>
  );
};

export default NavBar;

/*
import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";


import { Chat, Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { useSelector } from "react-redux";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);
const NavBar = () => {
  const { activeMenu, setactiveMenu, handleClick, isClicked, setisClicked, screenSize, setscreenSize} = useStateContext();
  useEffect(() => {
    const handleResize = ( ) => setscreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize)

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(screenSize <= 900) {
      setactiveMenu(false);
    } else {
      setactiveMenu(true);
    }
  }, [screenSize]);
  
  
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={() => setactiveMenu((prevActiveMenu) => !prevActiveMenu)}
        color="black"
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Chat"
          dotColor="#03c9d7"
          customFunc={() => handleClick("chat")}
          color="black"
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notifications"
          dotColor="#03c9d7"
          customFunc={() => handleClick("notification")}
          color="black"
          icon={<RiNotification3Line />}
        /> 
        <TooltipComponent content="Profile" position="BottomCenter">
          {user ? (
            <div
              className="flex items-center gap-2 cursor-pointer mt-1 p-1 hover:bg-light-gray rounded-lg"
              onClick={() => handleClick("userProfile")}
            >
              <p>
                <span className="text-gray-400 text-14">Hi, </span>{" "}
                <span className="text-gray-400 font-bold ml-1 text-14">
                  {user.name}
                </span>
              </p>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
            </div>
          ) : null}
        </TooltipComponent>

       
      </div>
    </div>
  );
};

export default NavBar;
*/
