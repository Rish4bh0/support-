import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import Logo from "../assets/dryice-logo.png";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import { useSelector } from "react-redux";


const Sidebar = () => {
  const { currentColor, activeMenu, setactiveMenu, screenSize } =
    useStateContext();
  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setactiveMenu(false);
    }
  };
  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";
// Access the user's role from Redux state
const userRole = useSelector((state) => state.auth.user?.role);

// Define an array of roles that should see the "Dashboard" link
const allowedRoles = ["ADMIN", "SUPERVISOR", "EMPLOYEE", ];
const allowedRolesOrg = ["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"];

  return (
    <div
      className="ml-3 h-screen 
    md:overflow-hidden
    overflow-auto md:hover:overflow-auto pb-10"
    >
      {activeMenu && (
        <>
          <div
            className="flex justify-between
        items-center"
          >
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3
            mt-4 flex text-xl font-extrabold first-letter:tracking-tight dark:text-white
            text-slate-900"
            >
              <img src={Logo} alt="DryIce Logo" className="w-40 h-25 ml-10 mt-4" />
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() =>
                  setactiveMenu((prevActiveMenu) => !prevActiveMenu)
                }
                className="text-xl rounded-full
               p-3 hover:bg-light-gray mt-4 block
               " //md:hidden
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
          {(userRole && allowedRolesOrg.includes(userRole)) && (
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                Dashboard
              </p>

              <NavLink
                to={`/dash`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <DashboardIcon />
                <span className="capitalize">Analytics</span>
              </NavLink>
            </div>
            )}
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                New
              </p>

              <NavLink
                to={`/new-ticket`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <ConfirmationNumberIcon  />
                <span className="capitalize">Create Ticket</span>
              </NavLink>
            </div>
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                Tickets
              </p>
              {(userRole && allowedRoles.includes(userRole)) && (
                <>
              <NavLink
                to={`/tickets`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AssignmentTurnedInIcon />
                <span className="capitalize">Assigned</span>
              </NavLink>
              <NavLink
                to={`allticket`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <ListAltIcon />
                <span className="capitalize">All </span>
              </NavLink>
              
              <NavLink
                to={`/unassigned`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AssignmentLateIcon />
                <span className="capitalize">Unassigned</span>
              </NavLink>
              </>
              )}
              <NavLink
                to={`/ticketss`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AssignmentIndIcon />
                <span className="capitalize">Tickets created by me</span>
              </NavLink>
            </div>
            {(userRole && allowedRoles.includes(userRole)) && (
             
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                Manage
              </p>

              <NavLink
                to={`/createuser`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <PersonAddIcon />
                <span className="capitalize">User</span>
              </NavLink>
              <NavLink
                to={`/organizations`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <DomainAddIcon />
                <span className="capitalize">Office</span>
              </NavLink>
              <NavLink
                to={`/issues`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AddCircleIcon />
                <span className="capitalize">Issue</span>
              </NavLink>
            </div>
            )}
             {(userRole && allowedRolesOrg.includes(userRole)) && (
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                Office
              </p>

              <NavLink
                to={`/organization`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <RoomPreferencesIcon />
                <span className="capitalize">My Office</span>
              </NavLink>
              <NavLink
                to={`/org-ticket`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <CorporateFareIcon />
                <span className="capitalize">Office Tickets</span>
              </NavLink>
            </div>
            
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
