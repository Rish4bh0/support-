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

  const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  
  useEffect(() => {
    dispatch(getTickets());
    dispatch(getAllTickets());
  }, [dispatch]);
  const uniqueProductTypes = [...new Set(allTickets.map((ticket) => ticket.product))];
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
          response.payload.filter((ticket) => ticket.status === "draft").length
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


  return (
    <>
     <div className="mt-24 md:mr-0 md:ml-20">
     <div className=" p-4 text-white mt-10 rounded-2xl mx-auto" style={{ backgroundColor: getRandomColor(), width: "50%"  }}>
      <div className="flex items-center justify-center">
        <DashboardIcon fontSize="large" className="mr-2 mb-3" />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to NEA Admin Dashboard
        </Typography>
      </div>
    </div>
    <div className="mt-24 mr-20">
      
    <div className="flex flex-wrap lg:flex-nowrap justify-center mb-20">
  
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center border border-gray-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-400">All Ticket</p>
            <p className="text-2xl">{allTicketsCount}</p>
          </div>
          <Link to="/ticketss">
          <button
            type="button"
            style={{ backgroundColor: getRandomColor() }}
            className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4"
            
          >
            
          </button>
          </Link>
        </div>
        <div className="mt-6"></div>
      </div>
  <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
    <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl border border-gray-300">
      <button
        type="button"
        style={{ backgroundColor: getRandomColor() }}
        className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4"
      >
        <FiberNewIcon/>
      </button>
      <p className="mt-3">
        <span className="text-lg font-semibold">{newTicketsCount}</span>
        <span className={`text-sm text-14 ml-2`}></span>
      </p>
      <p className="text-sm text-gray-400 mt-1">New Ticket</p>
    </div>
  </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl border border-gray-300">
          <Link to="/ticketss">
            <button
             type="button"
             style={{ backgroundColor: getRandomColor() }}
             className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <DraftsIcon/>
            </button>
            </Link>
            <p className="mt-3">
              <span className="text-lg font-semibold">{draftTicketCount}</span>
              <span className={`text-sm text-14 ml-2`}>
               
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Tickets in draft</p>
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl border border-gray-300">
          <Link to="/ticketss">
            <button
             type="button"
             style={{ backgroundColor: getRandomColor() }}
             className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <ConfirmationNumberIcon/>
            </button>
            </Link>
            <p className="mt-3">
              <span className="text-lg font-semibold">{openTicketsCount}</span>
              <span className={`text-sm text-14 ml-2`}>
                
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Open Ticket</p>
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl border border-gray-300">
          <Link to="/ticketss">
            <button
             type="button"
             style={{ backgroundColor: getRandomColor() }}
             className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <RateReviewIcon/>
            </button>
            </Link>
            <p className="mt-3">
              <span className="text-lg font-semibold">{reviewTicketsCount}</span>
              <span className={`text-sm text-14 ml-2`}>
                
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Tickets in review</p>
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl border border-gray-300">
          <Link to="/ticketss">
            <button
             type="button"
             style={{ backgroundColor: getRandomColor() }}
             className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <CloseIcon/>
            </button>
            </Link>
            <p className="mt-3">
              <span className="text-lg font-semibold">{closedTicketsCount}</span>
              <span className={`text-sm text-14 ml-2`}>
              
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Closed Ticket</p>
          </div>
        </div>
      </div>
{/*
      <div className="flex gap-10 flex-wrap justify-center mb-20">
        
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoAlert />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoAlert />
                </span>
                <span>Budget</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className=" border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">$93,438</span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    23%
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Budget</p>
              </div>
              <div className="mt-8">
                <p className="text-3xl font-semibold">$48,487</p>

                <p className="text-gray-500 mt-1">Expense</p>
              </div>

              <div className="mt-5">
                <SparkLine
                  currentColor={currentColor}
                  id="line-sparkLine"
                  type="Line"
                  height="80px"
                  width="250px"
                  data={SparklineAreaData}
                  color={currentColor}
                />
              </div>
              <div className="mt-10">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Download Report"
                  borderRadius="10px"
                />
              </div>
            </div>
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>
       
       
        <div>
          <div
            className=" rounded-2xl md:w-400 p-4 m-3"
            style={{ backgroundColor: currentColor }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Total projects</p>

              <div>
                <p className="text-2xl text-white font-semibold mt-8">
                {totalUniqueProducts}
                </p>

               <p className="text-gray-200">All active projects</p>
              </div>
            </div>

            <div className="mt-4">
              <SparkLine
                currentColor={currentColor}
                id="column-sparkLine"
                height="100px"
                type="Column"
                data={SparklineAreaData}
                width="320"
                color="rgb(242, 252, 253)"
              />
            </div>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <div>
              <p className="text-2xl font-semibold ">$43,246</p>
              <p className="text-gray-400">Yearly sales</p>
            </div>

            <div className="w-40">
              <Pie
                id="pie-chart"
                data={ecomPieChartData}
                legendVisiblity={false}
                height="160px"
              />
            </div>
          </div>
          
        </div>
      </div>
      */}
{/*
      <div className="flex gap-10 m-4 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Recent Transactions</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="mt-10 w-72 md:w-400">
            {recentTransactions.map((item) => (
              <div key={item.title} className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{
                      color: item.iconColor,
                      backgroundColor: item.iconBg,
                    }}
                    className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                  >
                    {item.icon}
                  </button>
                  <div>
                    <p className="text-md font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
                <p className={`text-${item.pcColor}`}>{item.amount}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-5 border-t-1 border-color">
            <div className="mt-3">
              <Button
                color="white"
                bgColor={currentColor}
                text="Add"
                borderRadius="10px"
              />
            </div>

            <p className="text-gray-400 text-sm">36 Recent Transactions</p>
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">Sales Overview</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="md:w-full overflow-auto">
            <LineChart />
          </div>
        </div>
      </div>
                  */}
                  <TicketStatusPie allTicket={allTickets} className="mt-20 border"/>


      <Report className="mt-20"/>
      
    </div>
    </div>
    </>
  );
};

export default Dashboard;
