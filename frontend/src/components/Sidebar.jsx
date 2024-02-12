import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import Logo from "../assets/dryice-logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import { useSelector } from "react-redux";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const Sidebar = () => {
  const { currentColor, activeMenu, setactiveMenu, screenSize } =
    useStateContext();
  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 700) {
      setactiveMenu(false);
    }
  };
  const activeLink =
    "flex items-center gap-3 p-2 mt-2 rounded-lg text-white text-sm";
  const normalLink =
    "flex items-center gap-3 p-2 mt-2 rounded-lg text-sm text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray";
  // Access the user's role from Redux state
  const userRole = useSelector((state) => state.auth.user?.role);

  // Define an array of roles that should see the "Dashboard" link
  const allowedRoles = ["ADMIN", "SUPERVISOR", "EMPLOYEE"];
  const allowedRolesOrg = ["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"];
  const allowedRolesAdmin = ["ADMIN"];

  return (
    <div className="sidebar h-screen border-r-1">
      {activeMenu && (
        <>
          <div className="h-16 mb-4 sticky top-0 bg-white z-10">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="flex items-center justify-center p-3"
            >
              <img src={Logo} alt="DryIce Logo" className="w-24 h-25" />
            </Link>
          </div>
          <div className="mt-2 px-4 overflow-auto h-screen">
            {userRole && allowedRoles.includes(userRole) && (
              <div className="mb-4">
                <p
                  className="text-gray-500
                mb-2 uppercase text-xs font-semibold"
                >
                  Admin Dashboard
                </p>

                <NavLink
                  to={`/admindash`}
                  onClick={handleCloseSideBar}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? currentColor : "",
                  })}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  <DashboardIcon />
                  <span className="capitalize">Admin Analytics</span>
                </NavLink>
              </div>
            )}
            {userRole && allowedRolesOrg.includes(userRole) && (
              <div className="mb-4">
                <p
                  className="text-gray-500
                 mb-2 uppercase text-xs font-semibold"
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
                  <span className="capitalize">Office Analytics</span>
                </NavLink>
              </div>
            )}
            <div className="mb-4">
              <p className="text-gray-500 mb-2 uppercase text-xs font-semibold">
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
                <ConfirmationNumberIcon />
                <span className="capitalize">Create Ticket</span>
              </NavLink>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 mb-2 uppercase text-xs font-semibold">
                Tickets
              </p>
              {userRole && allowedRoles.includes(userRole) && (
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
                    to={`/ccticket`}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    <GroupAddIcon />
                    <span className="capitalize">CC</span>
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
                <span className="capitalize">My tickets</span>
              </NavLink>
            </div>
            {userRole && allowedRoles.includes(userRole) && (
              <div className="mb-4">
                <p className="text-gray-500 mb-4 uppercase text-xs font-semibold">
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
                <NavLink
                  to={`/projects`}
                  onClick={handleCloseSideBar}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? currentColor : "",
                  })}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  <PlaylistAddIcon />
                  <span className="capitalize">Project</span>
                </NavLink>
              </div>
            )}
            {userRole && allowedRolesOrg.includes(userRole) && (
              <div className="mb-4">
                <p className="text-gray-500 mb-4 uppercase text-xs font-semibold">
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
                {/*
              <NavLink
                to={`/office-assigned`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SpellcheckIcon />
                <span className="capitalize">Office Assigned Tickets</span>
              </NavLink>
              */}
                <NavLink
                  to={`/office-unassigned`}
                  onClick={handleCloseSideBar}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? currentColor : "",
                  })}
                  className={({ isActive }) =>
                    isActive ? activeLink : normalLink
                  }
                >
                  <ReportGmailerrorredIcon />
                  <span className="capitalize">Office Unassigned Tickets</span>
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
