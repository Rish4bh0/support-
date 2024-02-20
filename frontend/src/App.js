import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoute } from "./components/PrivateRoute";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import NewTicket from "./pages/NewTicket";
import Register from "./pages/Auth/Register.jsx";
import Tickets from "./pages/Tickets";
import Ticketss from "./pages/Ticketss";
import Ticket from "./pages/Tickets/Ticket.jsx";
import ListTickets from "./pages/ListTickets";
import Dashboard from "./pages/Dashboard/AdminDashboard.jsx";
import IssueTypeList from "./pages/Issue/issues.jsx";
import ProjectList from "./pages/Project/project.jsx";
import IssueTypeid from "./pages/Issue/issueaction.jsx";
import UpdateTicket from "./pages/updateTicket.jsx";
import ResetPassword from "./pages/Auth/Resetpassword.jsx";
import Organization from "./pages/Office/NewOrganization.jsx";
import UpdateOrganization from "./pages/Office/UpdateOrganization.jsx";
import Createuser from "./pages/User/NewUser.jsx";
import Updateuser from "./pages/User/UpdateUser.jsx";
import OrganizationDetail from "./pages/Office/OrganizationDetail.jsx";
import AllOrganization from "./pages/Office/AllOrganization.jsx";
import Forget from "./pages/Auth/Forgotpassword.jsx";
import ORGTICKET from "./pages/OrganizationTicket";
import CCTICKET from "./pages/CCticket.jsx";
import "./App.css";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { NavBar, Footer, Sidebar } from "./components";
import { useStateContext } from "./contexts/ContextProvider";
import { useSelector } from "react-redux";
import Report from "./pages/Dashboard/report.jsx";
import Dash from "./pages/Dashboard/OfficeDashboard.jsx";
import Notification from "./pages/Notification/NotificationsList.js";
import ChatBox from "./pages/ChatWidget/page.js";
import Admindash from "./pages/Dashboard/AdminDashboard.jsx";
import ImageUpload from "./pages/Media/ImageUpload.jsx";
import OfficeUnssigned from "./pages/Office/officeUnssigned.jsx";
import BasicBreadcrumbs from "./components/Breadcrumb.jsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AdminChat from "./pages/AdminPanelChat/page.jsx";
import Assigned from "./pages/Tickets/Assigned.jsx";
import CC from "./pages/Tickets/Ticketscc.jsx";
import MyTickets from "./pages/Tickets/MyTickets.jsx";
import AllTickets from "./pages/Tickets/AllTicket.jsx";
import Unassigned from "./pages/Tickets/unassigned.jsx";
import OfficeTicket from "./pages/Office/OfficeTickets.jsx";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    h6: {
      fontSize: 14,
      fontWeight: 600,
    },
  },
});

function App() {
  const { activeMenu, setactiveMenu } = useStateContext();
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <Router>
        <div>
          {user ? (
            <div className="fixed right-4 bottom-4 z-10">
              <TooltipComponent content="Chat" position="Top">
                <ChatBox />
              </TooltipComponent>
            </div>
          ) : (
            ""
          )}
          {user ? (
            activeMenu ? (
              <div className="w-64 fixed top-0 left-0 sidebar dark:bg-secondary-dark-bg bg-white z-10">
                <Sidebar />
              </div>
            ) : (
              <div className="w-16 fixed top-0 left-0 dark:bg-secondary-dark-bg sidebar">
                <Sidebar />
              </div>
            )
          ) : (
            setactiveMenu(false)
          )}
          <div
            className={
              "relative dark:bg-main-dark-bg bg-main-bg" +
              (activeMenu ? " md:ml-64" : "")
            }
          >
            <div className="navbar sticky top-0 left-0 right-0 bg-white w-full z-10">
              <NavBar />
            </div>
            <div
              className={
                user ? "p-4 " : " min-h-screen flex items-center justify-center"
              }
            >
              <BasicBreadcrumbs />
              <div
                className={
                  !user &&
                  "banner-image min-h-screen after:bg-black after:absolute after:inset-0 after:opacity-50"
                }
              ></div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<Report />} />
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
                <Route path="/assigned" element={<PrivateRoute />}>
                  <Route path="/assigned" element={<Assigned />} />
                </Route>
                <Route path="/cc" element={<PrivateRoute />}>
                  <Route path="/cc" element={<CC />} />
                </Route>
                <Route path="/my-tickets" element={<PrivateRoute />}>
                  <Route path="/my-tickets" element={<MyTickets />} />
                </Route>
                <Route path="/all-tickets" element={<PrivateRoute />}>
                  <Route path="/all-tickets" element={<AllTickets />} />
                </Route>
                <Route path="/office-tickets" element={<PrivateRoute />}>
                  <Route path="/office-tickets" element={<OfficeTicket />} />
                </Route>
                <Route path="/admin-chat" element={<PrivateRoute />}>
                  <Route path="/admin-chat" element={<AdminChat />} />
                </Route>
                <Route path="/admindash" element={<PrivateRoute />}>
                  <Route path="/admindash" element={<Admindash />} />
                </Route>
                <Route path="/unassigned" element={<PrivateRoute />}>
                  <Route path="/unassigned" element={<Unassigned />} />
                </Route>
                <Route path="/office-unassigned" element={<PrivateRoute />}>
                  <Route
                    path="/office-unassigned"
                    element={<OfficeUnssigned />}
                  />
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
            {/* <Footer /> */}
          </div>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

const ThemedApp = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

export default ThemedApp;
