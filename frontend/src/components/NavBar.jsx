import React, { useEffect, useState,  Suspense } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import {
  MdNotificationsActive,
  MdNotificationsNone,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";

import { getAllOrganization } from "../features/organization/organizationSlice";
import useSocketIo from "../hooks/useSocketio";
import NotificationModal from "../pages/Notification/NotificationModal";
import { Button, Menu, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useTranslation } from "react-i18next";
import nepal from "../assets/nepal.png"
import usa from "../assets/usa.png"


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
    className={`cursor-pointer w-50 text-start  ${className}`}
  >
    {icon}
    {title}
  </button>
);

const NavBar = () => {
  
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("i18nextLng") || "en"
  );

  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false); // Define the state variable

  const handleChangeLanguage = (languageCode) => {
    setSelectedLanguage(languageCode);
    i18n.changeLanguage(languageCode);
    localStorage.setItem("i18nextLng", languageCode); // Save selected language in local storage
    setIsLanguageMenuOpen(false); // Close the language menu after selection
  };
  
  const languages = [
    { code: "en", name: "English" },
    { code: "np", name: "Nepali" },
  ];
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

  const handleToggleNotificationModal = () => {
    setIsNotificationModalOpen((prevIsOpen) => !prevIsOpen);
  };

  

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
              <Link to="/">
              <img
                class="h-8 w-auto"
                src="/static/media/dryice-logo.4296ab853306efcf5617.png"
                alt="Your Company"
              />
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
        <div className="relative">
        <button className="flex items-center gap-1" onClick={() => setIsLanguageMenuOpen(prev => !prev)}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  {selectedLanguage === "en" ? "English" : "नेपाली"}
</span>
 {/* Display current selected language */}
          <svg  xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M21.056 12h-2a1 1 0 0 0 0 2v2H17.87a2.965 2.965 0 0 0 .185-1a3 3 0 0 0-5.598-1.5a1 1 0 1 0 1.732 1a1 1 0 0 1 .866-.5a1 1 0 0 1 0 2a1 1 0 0 0 0 2a1 1 0 1 1 0 2a1 1 0 0 1-.866-.5a1 1 0 1 0-1.732 1a3 3 0 0 0 5.598-1.5a2.965 2.965 0 0 0-.185-1h1.185v3a1 1 0 0 0 2 0v-7a1 1 0 1 0 0-2m-11.97-.757a1 1 0 1 0 1.94-.486l-1.757-7.03a2.28 2.28 0 0 0-4.425 0l-1.758 7.03a1 1 0 1 0 1.94.486L5.585 9h2.94ZM6.086 7l.697-2.787a.292.292 0 0 1 .546 0L8.026 7Zm7.97 0h1a1.001 1.001 0 0 1 1 1v1a1 1 0 0 0 2 0V8a3.003 3.003 0 0 0-3-3h-1a1 1 0 0 0 0 2m-4 9h-1a1.001 1.001 0 0 1-1-1v-1a1 1 0 0 0-2 0v1a3.003 3.003 0 0 0 3 3h1a1 1 0 0 0 0-2"/></svg>
        </button>
        {/* Dropdown menu */}
        {isLanguageMenuOpen && (
  <div className="absolute top-full left-0 bg-white shadow-lg mt-1 py-1 w-32 rounded-md flex flex-col">
    {languages.map((language, index) => (
      <React.Fragment key={language.code}>
        <button
          onClick={() => handleChangeLanguage(language.code)}
          className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
            index === 0 ? 'border-b border-gray-200' : ''
          }`}
        >
          {language.code === "np" && (
            <img
              src={nepal}
              alt="Nepal Flag"
              className="w-4 h-auto mr-2"
            />
          )}
          {language.code === "en" && (
            <img
              src={usa}
              alt="American Flag"
              className="w-4 h-auto mr-2"
            />
          )}
          {language.name}
        </button>
        {index === 0 && (
          <div className="border-t border-gray-200"></div>
        )}
      </React.Fragment>
    ))}
  </div>
)}

      </div>
          {user ? (
            <>
              <NotificationModal isOpen={isNotificationModalOpen} />
              <button
                type="button"
                onClick={handleToggleNotificationModal}
                className="flex align-middle"
              >
                <div>
                  {notificationsLength ? (
                    <MdNotificationsActive size={25} style={{ marginTop: 8 }} />
                  ) : (
                    <MdNotificationsNone size={25} />
                  )}

                  {notificationsLength > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -1,
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
            </>
          ) : null}

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
                  <span className="text-gray-400 font-bold ml-3 capitalize">
                    <p>{user.name}</p>
                    <p> {organizationMap[user.organization] || ""} </p>
                  </span>
                  <MdKeyboardArrowDown className="text-gray-400 text-14" />
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
                      title={t("Logout")}
                      color="black"
                      customFunc={onLogout}
                      icon={<PowerSettingsNewIcon className="mr-2" />}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <SettingsIcon className="mr-2" /> {t("settings")}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 hover-bg-dark-gray rounded-lg">
              <NavButton
                title={t("Login")}
                color="white"
                backgroundColor="blue"
                className="p-2 rounded text-sm flex-2"
                customFunc={handleLoginClick}
              />

              <NavButton
                title={t("Register")}
                color="white"
                backgroundColor="blue"
                className="p-2 rounded text-sm flex-2"
                customFunc={handleRegisterClick}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
