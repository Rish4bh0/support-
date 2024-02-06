
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

import DefaultSidebar from "./components/Sidebar";
import { PrivateRoute } from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewTicket from "./pages/NewTicket";
import Register from "./pages/Register";
import Tickets from "./pages/Tickets";
import Ticketss from "./pages/Ticketss";
import Ticket from "./pages/Ticket";
import ListTickets from "./pages/ListTickets";
import Dashboard from "./pages/Dashboard";
import IssueTypeList from "./pages/issues";
import ProjectList from "./pages/project";
import IssueTypeid from "./pages/issueaction";
import UpdateTicket from "./pages/updateTicket.jsx";
import ResetPassword from "./pages/Resetpassword";
import Organization from "./pages/NewOrganization";
import UpdateOrganization from "./pages/UpdateOrganization";
import Createuser from "./pages/NewUser";
import Updateuser from "./pages/UpdateUser";
import OrganizationDetail from "./pages/OrganizationDetail";
import AllOrganization from "./pages/AllOrganization";
import Forget from "./pages/Forgotpassword";
import ORGTICKET from "./pages/OrganizationTicket";
import CCTICKET from "./pages/CCticket.jsx"
import "./App.css";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { NavBar, Footer, Sidebar } from "./components";
import  Table  from "./pages/Table.jsx"
import { useStateContext } from "./contexts/ContextProvider";
import { useSelector } from "react-redux";
import  Unassigned from "./pages/unassigned";
import  Report from "./pages/report";
import One from "./pages/one"
import Dash from "./pages/Dash"
import Notification from './pages/NotificationsList.js'
import AdminPage from './pages/AdminPage.js';
import ChatBox from "./components/ChatBox.js";
import Dashboardd from "./pages/Dashboard/Dashboard.js";
import Admindash from "./pages/Dashboard.jsx"
import ImageUpload from "./pages/ImageUpload.jsx"
import OfficeUnssigned from "./pages/officeUnssigned.jsx"


function App() {
  const { activeMenu, setactiveMenu } = useStateContext();
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <Router>
        <div className="flex relative dark:bg-main-dark-bg">
        {user ? (
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Chat" position="Top">
             
                <ChatBox />
              
            </TooltipComponent>
          </div>
        ) :null }
          {user ? (
            activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white " style={{ zIndex: "1000" }}>
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )
          ) : (
            setactiveMenu(false)
          )}
          <div
            className={
              activeMenu
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
            }
          >
            <div
              className="fixed md:static
              bg-main-bg dark:bg-main-dark-bg
              navbar w-full"
            >
              <NavBar />
            </div>

            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/one" element={<One />} />
                <Route path="/table" element={<Table />} />
                <Route path="/report" element={<Report/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forget" element={<Forget />} />
                <Route path="/dash" element={<Dash />} />
                <Route path="/img" element={<ImageUpload />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

                <Route path="/new-ticket" element={<PrivateRoute />}>
                  <Route path="/new-ticket" element={<NewTicket />} />
                </Route>
                <Route path="/admindash" element={<PrivateRoute />}>
                  <Route path="/admindash" element={<Admindash />} />
                </Route>
                <Route path="/dashboardd" element={<PrivateRoute />}>
                  <Route path="/dashboardd" element={<Dashboardd />} />
                </Route>
                <Route path="/admin" element={<PrivateRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
                <Route path="/unassigned" element={<PrivateRoute />}>
                  <Route path="/unassigned" element={<Unassigned />} />
                </Route>
                <Route path="/office-unassigned" element={<PrivateRoute />}>
                  <Route path="/office-unassigned" element={<OfficeUnssigned />} />
                </Route>
                <Route path="/notifications" element={<PrivateRoute />}>
                  <Route path="/notifications" element={<Notification />} />
                </Route>
                <Route path="/org-ticket" element={<PrivateRoute />}>
                  <Route path="/org-ticket" element={<ORGTICKET />} />
                </Route>
                <Route path="/ccticket" element={<PrivateRoute />}>
                  <Route path="/ccticket" element={<CCTICKET />} />
                </Route>
                <Route path="/tickets" element={<PrivateRoute />}>
                  <Route path="/tickets" element={<Tickets />} />
                </Route>
                <Route path="/ticketss" element={<PrivateRoute />}>
                  <Route path="/ticketss" element={<Ticketss />} />
                </Route>
                <Route path="/ticket/:ticketId" element={<PrivateRoute />}>
                  <Route path="/ticket/:ticketId" element={<Ticket />} />
                </Route>
                <Route path="/allticket" element={<PrivateRoute />}>
                  <Route path="/allticket" element={<ListTickets />} />
                </Route>
                <Route path="/dashboard" element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route path="/issues" element={<PrivateRoute />}>
                  <Route path="/issues" element={<IssueTypeList />} />
                </Route>
                <Route path="/issues/:id" element={<PrivateRoute />}>
                  <Route path="/issues/:id" element={<IssueTypeid />} />
                </Route>

                <Route path="/projects" element={<PrivateRoute />}>
                  <Route path="/projects" element={<ProjectList />} />
                </Route>

                <Route
                  path="/ticket/:ticketId/update"
                  element={<PrivateRoute />}
                >
                  <Route
                    path="/ticket/:ticketId/update"
                    element={<UpdateTicket />}
                  />
                </Route>
                <Route path="/organization" element={<PrivateRoute />}>
                  <Route path="/organization" element={<Organization />} />
                </Route>
                <Route path="/organizations" element={<PrivateRoute />}>
                  <Route path="/organizations" element={<AllOrganization />} />
                </Route>
                <Route path="/organization/:id" element={<PrivateRoute />}>
                  <Route
                    path="/organization/:id"
                    element={<UpdateOrganization />}
                  />
                </Route>
                <Route path="/createuser" element={<PrivateRoute />}>
                  <Route path="/createuser" element={<Createuser />} />
                </Route>
                <Route path="/createuser/:id" element={<PrivateRoute />}>
                  <Route path="/createuser/:id" element={<Updateuser />} />
                </Route>
                <Route path="/organizations/:id" element={<PrivateRoute />}>
                  <Route
                    path="/organizations/:id"
                    element={<OrganizationDetail />}
                  />
                </Route>

                {/*
             <Route
              path='/dashboard'
              element={<PrivateRoute requiredRole="ADMIN" element={<Dashboard />} />}
            />
           */}
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
