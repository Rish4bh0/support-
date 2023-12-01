import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import {
  RiNotification3Line,
} from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice"; 
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { getAllOrganization } from '../features/organization/organizationSlice';


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
  const {
    activeMenu,
    setactiveMenu,
    handleClick,
    isClicked,
    setisClicked,
    screenSize,
    setscreenSize,
  } = useStateContext();

  const organizations = useSelector((state) => state.organizations.organizations);
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

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
     <div className="mt-0.5">
      {user ? (
        <NavButton
          title="Menu"
          customFunc={() => setactiveMenu((prevActiveMenu) => !prevActiveMenu)}
          color="black"
          icon={<AiOutlineMenu />}
        />
      ) : (
        <AiOutlineMenu className="text-white" />
      )}
      </div>
      <div className="flex ">
        <div className="mt-2">
        {user ? (
          <NavButton
            title="Chat"
            dotColor="#03c9d7"
            customFunc={() => handleClick("chat")}
            color="black"
            icon={<BsChatLeft />}
          />
        ) : null}
        </div>
        <div className="mt-2">
        {user ? (
          <NavButton
            title="Notifications"
            dotColor="#03c9d7"
            customFunc={() => handleClick("notification")}
            color="black"
            icon={<RiNotification3Line />}
          />
        ) : null}
        
        </div>
        {user ? (
          <TooltipComponent content="Profile" position="BottomCenter">
            <div
              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
              onClick={() => handleClick("userProfile")}
            >
              <p>
                <span className="text-gray-400 text-14">Hi, </span>{" "}
                <span className="text-gray-400 font-bold ml-1 text-14">
                  {user.name}-{organizationMap[user.organization] || "Unassigned"}
                </span>
              </p>
              <MdKeyboardArrowDown className="text-gray-400 text-14" />
              <NavButton
           title="Logout"
           // dotColor="#03c9d7"
           color="black"
           customFunc={onLogout}
           icon={<LogoutIcon />}
         />
              </div>
             
              
          </TooltipComponent>

        ) : (
          <div className="flex items-center gap-2 cursor-pointer mt-1 p-1 hover-bg-light-gray rounded-lg">
            <NavButton
              title="Login"
              // dotColor="#03c9d7"
              color="black"
              customFunc={handleLoginClick}
              icon={<LoginIcon />}
            />
            <NavButton
              title="Register"
              //dotColor="#03c9d7"
              color="black"
              customFunc={handleRegisterClick}
              icon={<PersonAddIcon />}
            />
          </div>
        )}
      </div>
    </div>
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
