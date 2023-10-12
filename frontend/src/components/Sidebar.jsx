import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";


const Sidebar = () => {
  const { currentColor, activeMenu, setactiveMenu, screenSize } = useStateContext();
  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setactiveMenu(false);
    }
  };
  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

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
              <SiShopware /> <span>DryIce Support</span>
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
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                Dashboard
              </p>

              <NavLink
                to={`/dashboard`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">Analytics</span>
              </NavLink>
            </div>
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                Tickets
              </p>

              <NavLink
                to={`/tickets`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">My tickets</span>
              </NavLink>
              <NavLink
                to={`allticket`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">All tickets</span>
              </NavLink>
              <NavLink
                to={`/org-ticket`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">My organization Tickets</span>
              </NavLink>
              <NavLink
                to={`/ticketss`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">Tickets Assigned to me</span>
              </NavLink>
            </div>
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                New
              </p>

              <NavLink
                to={`/createuser`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">Add user</span>
              </NavLink>
              <NavLink
                to={`/organizations`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">Add organization</span>
              </NavLink>
              <NavLink
                to={`/issues`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">Add issue</span>
              </NavLink>
              <NavLink
                to={`/new-ticket`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">Create Ticket</span>
              </NavLink>
            </div>
            <div>
              <p
                className="text-gray-400 m-3
                mt-4 uppercase"
              >
                Organization
              </p>

              <NavLink
                to={`/organization`}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <SiShopware />
                <span className="capitalize">My Organization</span>
              </NavLink>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
