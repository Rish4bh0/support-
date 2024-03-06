import React, { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import Report from "./report";
import { getAllTickets, getTickets } from "../../features/tickets/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import TicketStatusPie from "../../components/TicketStatusPie";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewIcon from "@mui/icons-material/RateReview";
import DraftsIcon from "@mui/icons-material/Drafts";
import FiberNewIcon from "@mui/icons-material/FiberNew";

const Dashboard = () => {
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

  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const organizationMap = {};
  organizations.forEach((organization) => {
    organizationMap[organization._id] = organization.name;
  });

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  useEffect(() => {
    dispatch(getTickets());
    dispatch(getAllTickets());
  }, [dispatch]);
  const uniqueProductTypes = [
    ...new Set(allTickets.map((ticket) => ticket.product)),
  ];
  const totalUniqueProducts = uniqueProductTypes.length;

  useEffect(() => {
    if (user.organization) {
      dispatch(getAllTickets(user.organization)).then((response) => {
        if (response.payload) {
          setAllTicketsCount(response.payload.length);
          setNewTicketsCount(
            response.payload.filter((ticket) => ticket.status === "new").length
          );
          setDraftTicketCount(
            response.payload.filter((ticket) => ticket.status === "draft")
              .length
          );
          setOpenTicketsCount(
            response.payload.filter((ticket) => ticket.status === "open").length
          );
          setReviewTicketsCount(
            response.payload.filter((ticket) => ticket.status === "review")
              .length
          );
          setClosedTicketsCount(
            response.payload.filter((ticket) => ticket.status === "close")
              .length
          );
        }
      });
    }
  }, [user, dispatch]);

  return (
    <>
      <div className="font-medium mb-5">
        Welcome to Dashboard , {user.name}{" "}
        {organizationMap[user.organization] || ""} !
      </div>
      <div>
        <div className="flex flex-wrap justify-between items-center mb-5">
          <div className="bg-white md:w-48 py-4 px-3 rounded-2xl border">
            <Link
              to="/ticketss"
              className="flex gap-1 w-full justify-between items-end"
            >
              <div>
                <div className="text-sm font-semibold">All Ticket</div>
                <div className="text-lg font-semibold my-4">
                  {allTicketsCount}
                </div>
                <div className="text-xs hover:underline">View All Tickets</div>
              </div>
              <button
                type="button"
                style={{ backgroundColor: getRandomColor() }}
                className="text-2xl opacity-0.9 text-white rounded-lg p-4 h-8 w-8 flex flex-col items-center justify-center"
              >
                <ConfirmationNumberIcon />
              </button>
            </Link>
          </div>

          <div className="bg-white md:w-48 py-4 px-3 rounded-2xl border">
            <Link
              to="/ticketss"
              className="flex gap-1 w-full justify-between items-end"
            >
              <div>
                <div className="text-sm font-semibold">Draft</div>
                <div className="text-lg font-semibold my-4">
                  {draftTicketCount}
                </div>
                <div className="text-xs hover:underline">View All Draft</div>
              </div>
              <button
                type="button"
                style={{ backgroundColor: "#fbe032" }}
                className="text-2xl opacity-0.9 text-white rounded-lg p-4 h-8 w-8 flex flex-col items-center justify-center"
              >
                <DraftsIcon />
              </button>
            </Link>
          </div>

          <div className="bg-white md:w-48 py-4 px-3 rounded-2xl border">
            <Link
              to="/ticketss"
              className="flex gap-1 w-full justify-between items-end"
            >
              <div>
                <div className="text-sm font-semibold">New Ticket</div>
                <div className="text-lg font-semibold my-4">
                  {newTicketsCount}
                </div>
                <div className="text-xs hover:underline">View New Ticket</div>
              </div>
              <button
                type="button"
                style={{ backgroundColor: "#008000" }}
                className="text-2xl opacity-0.9 text-white rounded-lg p-4 h-8 w-8 flex flex-col items-center justify-center"
              >
                <FiberNewIcon />
              </button>
            </Link>
          </div>

          <div className="bg-white md:w-48 py-4 px-3 rounded-2xl border">
            <Link
              to="/ticketss"
              className="flex gap-1 w-full justify-between items-end"
            >
              <div>
                <div className="text-sm font-semibold">Open Ticket</div>
                <div className="text-lg font-semibold my-4">
                  {openTicketsCount}
                </div>
                <div className="text-xs hover:underline">View Open Ticket</div>
              </div>
              <button
                type="button"
                style={{ backgroundColor: "#4682b4" }}
                className="text-2xl opacity-0.9 text-white rounded-lg p-4 h-8 w-8 flex flex-col items-center justify-center"
              >
                <ConfirmationNumberIcon />
              </button>
            </Link>
          </div>

          <div className="bg-white md:w-48 py-4 px-3 rounded-2xl border">
            <Link
              to="/ticketss"
              className="flex gap-1 w-full justify-between items-end"
            >
              <div>
                <div className="text-sm font-semibold">Review</div>
                <div className="text-lg font-semibold my-4">
                  {reviewTicketsCount}{" "}
                </div>
                <div className="text-xs hover:underline">View All Review</div>
              </div>
              <button
                type="button"
                style={{ backgroundColor: "#f8a54c" }}
                className="text-2xl opacity-0.9 text-white rounded-lg p-4 h-8 w-8 flex flex-col items-center justify-center"
              >
                <RateReviewIcon />
              </button>
            </Link>
          </div>

          <div className="bg-white md:w-48 py-4 px-3 rounded-2xl border">
            <Link
              to="/ticketss"
              className="flex gap-1 w-full justify-between items-end"
            >
              <div>
                <div className="text-sm font-semibold">Closed Ticket</div>
                <div className="text-lg font-semibold my-4">
                  {" "}
                  {closedTicketsCount}{" "}
                </div>
                <div className="text-xs hover:underline">
                  View Closed Ticket
                </div>
              </div>
              <button
                type="button"
                style={{ backgroundColor: "#8b0000" }}
                className="text-2xl opacity-0.9 text-white rounded-lg p-4 h-8 w-8 flex flex-col items-center justify-center"
              >
                <CloseIcon />
              </button>
            </Link>
          </div>
        </div>
        <TicketStatusPie allTicket={allTickets} className="mt-20 border" />
        <Report className="mt-4" />
      </div>
    </>
  );
};

export default Dashboard;
