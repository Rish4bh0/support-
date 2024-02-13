import React, { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { useStateContext } from "../contexts/ContextProvider";
import product9 from "../data/product9.jpg";
import Report from "./report";
import { getAllTickets, getTickets } from "../features/tickets/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TicketStatusChart from '../components/TicketStatusChart';
import TicketStatusPie from '../components/TicketStatusPie';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DraftsIcon from '@mui/icons-material/Drafts';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import { getAllOrganization } from "../features/organization/organizationSlice";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
  const [newTicketsCount, setNewTicketsCount] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);
  const [reviewTicketsCount, setReviewTicketsCount] = useState(0);
  const [closedTicketsCount, setClosedTicketsCount] = useState(0);
  const [allTicketsCount, setAllTicketsCount] = useState(0);
  const [draftTicketCount, setDraftTicketCount] = useState(0);
  const dispatch = useDispatch();
  const allTickets = useSelector((state) => state.tickets.allTickets);
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

 

  useEffect(() => {
    dispatch(getTickets());
    dispatch(getAllTickets());
    dispatch(getAllOrganization());
  }, [dispatch]);
  const uniqueProductTypes = [
    ...new Set(allTickets.map((ticket) => ticket.product)),
  ];
  const totalUniqueProducts = uniqueProductTypes.length;
  const organizationTickets = allTickets.filter(
    (ticket) => ticket.organization === user.organization
  );
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });
  useEffect(() => {
    if (user.organization) {
      console.log("Fetching tickets for organization:", user.organization);

      const organizationTickets = allTickets.filter(
        (ticket) => ticket.organization === user.organization
      );

      setAllTicketsCount(organizationTickets.length);
      setNewTicketsCount(
        organizationTickets.filter((ticket) => ticket.status === "new").length
      );
      setDraftTicketCount(
        organizationTickets.filter((ticket) => ticket.status === "draft").length
      );
      setOpenTicketsCount(
        organizationTickets.filter((ticket) => ticket.status === "open").length
      );
      setReviewTicketsCount(
        organizationTickets.filter((ticket) => ticket.status === "review")
          .length
      );
      setClosedTicketsCount(
        organizationTickets.filter((ticket) => ticket.status === "close").length
      );
    }
  }, [user.organization, allTickets, dispatch]);

  {
    /*

useEffect(() => {
  

  if (user.organization) {
    dispatch(getAllTickets(user.organization)).then((response) => {
      if (response.payload) {
        setAllTicketsCount(response.payload.length);
        setNewTicketsCount(
          response.payload.filter((ticket) => ticket.status === "new").length
        );
        setOpenTicketsCount(
          response.payload.filter((ticket) => ticket.status === "open").length
        );
        setReviewTicketsCount(
          response.payload.filter((ticket) => ticket.status === "review").length
        );
        setClosedTicketsCount(
          response.payload.filter((ticket) => ticket.status === "close").length
        );
      }
    });
  }
}, [user, dispatch]);

*/
  }
  return (
    <>
            <div className="flex justify-around items-center mb-4">
        <div className="flex items-center space-x-2">
          <Typography variant="h6" className="text-sm">
          Welcome to {organizationMap[user.organization] || ""} Dashboard
          </Typography>
        </div>
        <div className="flex-1"></div>
      </div>
      <div>
        <div className="flex flex-wrap justify-between items-center mb-5">
          <div className="bg-white h-40 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-48 p-4 rounded-2xl border border-gray-300 flex flex-col items-center">
            <Link to="/ticketss">
              <button
                type="button"
                style={{ backgroundColor: getRandomColor() }}
                className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 h-12 w-12 flex flex-col items-center justify-center mb-3"
              ></button>
            </Link>
            <div className="text-lg font-semibold">{allTicketsCount}</div>
            <div className="text-sm font-semibold">All Ticket</div>
          </div>

          <div className="bg-white h-40 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-48 p-4 rounded-2xl border border-gray-300 flex flex-col items-center">
            <Link to="/ticketss">
              <button
                type="button"
                style={{ backgroundColor: "#fbe032" }}
                className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 h-12 w-12 flex flex-col items-center justify-center mb-3"
              >
                <DraftsIcon />
              </button>
            </Link>
            <div className="text-lg font-semibold">{draftTicketCount}</div>
            <div className="text-sm font-semibold">Draft</div>
          </div>

          <div className="bg-white h-40 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-48 p-4 rounded-2xl border border-gray-300 flex flex-col items-center">
            <button
              type="button"
              style={{ backgroundColor: "#008000" }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 h-12 w-12 flex flex-col items-center justify-center mb-3"
            >
              <FiberNewIcon />
            </button>
            <div className="text-lg font-semibold">{newTicketsCount}</div>
            <div className="text-sm font-semibold">New Ticket</div>
          </div>

          <div className="bg-white h-40 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-48 p-4 rounded-2xl border border-gray-300 flex flex-col items-center">
            <Link to="/ticketss">
              <button
                type="button"
                style={{ backgroundColor: "#4682b4" }}
                className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 h-12 w-12 flex flex-col items-center justify-center mb-3"
              >
                <ConfirmationNumberIcon />
              </button>
            </Link>
            <div className="text-lg font-semibold">{openTicketsCount}</div>
            <div className="text-sm font-semibold">Open Ticket</div>
          </div>

          <div className="bg-white h-40 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-48 p-4 rounded-2xl border border-gray-300 flex flex-col items-center">
            <Link to="/ticketss">
              <button
                type="button"
                style={{ backgroundColor: "#f8a54c" }}
                className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 h-12 w-12 flex flex-col items-center justify-center mb-3"
              >
                <RateReviewIcon />
              </button>
            </Link>
            <div className="text-lg font-semibold">{reviewTicketsCount} </div>
            <div className="text-sm font-semibold">Review</div>
          </div>

          <div className="bg-white h-40 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-48 p-4 rounded-2xl border border-gray-300 flex flex-col items-center">
            <Link to="/ticketss">
              <button
                type="button"
                style={{ backgroundColor: "#8b0000" }}
                className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4 h-12 w-12 flex flex-col items-center justify-center mb-3"
              >
                <CloseIcon />
              </button>
            </Link>
            <div className="text-lg font-semibold"> {closedTicketsCount} </div>
            <div className="text-sm font-semibold">Closed Ticket</div>
          </div>
        </div>
          <TicketStatusPie allTicket={organizationTickets} className="mt-2" />
        
       
        </div>
      
    </>
  );
};

export default Ecommerce;
