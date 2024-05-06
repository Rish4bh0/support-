import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import {
  createIssueType,
  reset,
  deleteIssueType,
  updateIssueType,
  selectIssueTypeById,
  getAllIssueTypes,
} from "../../features/issues/issueSlice";
import { getAllOrganization } from "../../features/organization/organizationSlice"; // Replace with your actual import statements
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Spinner from "../../components/Spinner";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { FiPenTool } from "react-icons/fi";
import { FiDelete } from "react-icons/fi";
import BarLoader from "../../components/Loader";



const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
    padding: 0,
  },
};

const CustomLoader = () => (
  
  <div className="grid place-content-center bg-violet-600 px-4 py-24">
  <BarLoader />
</div>
);

function IssueList() {
  const issueTypesData = useSelector((state) => state.issueTypes.issueTypes);
  console.log("1", issueTypesData);
  const issue = issueTypesData.issueTypes || [];
  console.log("2", issue);
  const count = issueTypesData.count || 0;
  console.log("3", count);


  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Initially set loading to true
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1); // Current page
  const [pageSize, setPageSize] = useState(5);

  // Simulate 2-second loading delay before fetching data initially
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(); // Fetch data after 2 seconds
    }, 0);

    return () => clearTimeout(timer); // Cleanup function
  }, [page, pageSize]);

  const fetchData = () => {
    setIsLoading(true);
    dispatch(getAllIssueTypes({ page, pageSize }))
      .then(() => {
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    dispatch(getAllIssueTypes());
    dispatch(getAllOrganization());
  }, [dispatch]);

  const [rowCountState, setRowCountState] = React.useState(count || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      count !== undefined ? count : prevRowCountState
    );
  }, [count, setRowCountState]);

  const { isError, isSuccess, message } = useSelector(
    (state) => state.issueTypes
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const [newIssueName, setNewIssueName] = useState(""); // Change to 'newIssueName'
  const [updateName, setUpdateName] = useState(""); // Change to 'updateName'

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [issueIdToDelete, setIssueIdToDelete] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
/*
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      dispatch(reset());
      toast.success("Issue added");
      dispatch(getAllIssueTypes());
    }
  }, [dispatch, isError, isSuccess, message]);
*/
  const handleUpdateIssue = (issueId) => {
    setSelectedIssueId(issueId);

    // Check if it's a new user or an existing user being updated
    if (!issueId) {
      // It's a new user, open the modal for creating
      setIsUpdateModalOpen(true);
    } else {
      // It's an existing user, set the update form state variables
      const selectedIssue = issue.find((issue) => issue._id === issueId);
      if (selectedIssue) {
        setUpdateName(selectedIssue.name);
        dispatch(getAllIssueTypes());
      }

      // Open the modal for updating
      setIsUpdateModalOpen(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const issueData = {
      name: selectedIssueId ? updateName : newIssueName,
    };

    if (selectedIssueId) {
      console.log(selectedIssueId);
      dispatch(updateIssueType({ id: selectedIssueId, issueData }))
        .then(() => {
          closeUpdateModal();
          toast.success("Issue updated successfully");
          fetchData();
        })
        .catch((error) => {
          toast.error(`Error updating issue: ${error.message}`);
        });
    } else {
      dispatch(createIssueType(issueData))
        .then(() => {
          closeModal();
          toast.success("Issue added");
          fetchData();
        })
        .catch((error) => {
          toast.error(`Error creating issue: ${error.message}`);
        });
    }

    setNewIssueName(""); // Change to 'newIssueName'
    setUpdateName("");
  };

  useEffect(() => {
    dispatch(selectIssueTypeById(selectedIssueId));
  }, [selectedIssueId, dispatch]);

  const handleDeleteIssue = (issueId) => {
    setIssueIdToDelete(issueId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const token = "your-token-here";

    dispatch(deleteIssueType(issueIdToDelete, token))
      .then(() => {
        toast.success(`Issue deleted successfully`);
        fetchData();
      })
      .catch((error) => {
        toast.error(`Error deleting issue: ${error.message}`);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setIssueIdToDelete(null);
      });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIssueIdToDelete(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIssueId("");
    setNewIssueName(""); // Change to 'newIssueName'
    setUpdateName("");
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedIssueId("");
    setNewIssueName(""); // Change to 'newIssueName'
    setUpdateName("");
  };
  const handleChangeRowsPerPage = (event) => {
    setIsLoading(true);
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(1); // Set page number to 1 when rows per page changes
  };


  const handlePageChange = (event, value) => {
    setIsLoading(true)  
    setPage(value)
  }



  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE"].includes(userRole)) {
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }
 
  return (
    <>
      <div className="border border-gray-300 rounded-2xl bg-white w-full mb-48">
        <div className="border-b-1 p-4 text-sm flex justify-between">
          <div className="font-extrabold">Issue List</div>
          <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
      >
        <AddCircleOutlineIcon className="me-2" /> Add issue
      </button>
        </div>

        <div className="p-4">
          <DataGrid
            rows={
              issue
                ? issue.map((issue, index) => ({ ...issue, id: index }))
                : []
            }
            columns={[
              {
                field: "name",
                headerName: "Issue Name",
                flex: 1,
                minWidth: 150,
              },
              {
                field: "_id",
                headerName: "Issue ID",
                flex: 1,
                minWidth: 150,
              },
              {
                field: "actions",
                headerName: "Action",
                flex: 1,
                minWidth: 150,
                renderCell: (params) => (
                  <div>
                    <button onClick={() => handleUpdateIssue(params.row._id)}>
                      <ModeEditIcon className="text-blue-500 group-hover:text-blue-700 mr-8" />
                    </button>
                    <button
                      onClick={() => handleDeleteIssue(params.row._id)}
                      className="group"
                    >
                      <DeleteIcon className="text-red-500 group-hover:text-red-700 mr-8" />
                    </button>
                  </div>
                ),
              },
            ]}
            sx={{ height: "370px" }}
            loading={isLoading}
          
            components={{ Pagination: null }}
            className="min-w-full overflow-x-auto md:w-full"
          />

            <div className="flex justify-between items-center">
              <div className="flex items-center py-4">
                <FormControl fullWidth sx={{ width: "90px"}}>
                  <InputLabel id="row-per-page">Rows</InputLabel>
                  <Select
                    labelId="rows-per-page"
                    id="demo-simple-select"
                    value={pageSize}
                    label="Rows"
                    onChange={handleChangeRowsPerPage}
                    className="h-10"
                  >
                    {[5, 10, 25, 50].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/*
<Typography variant="body2" className="mr-2">
    Rows per page:
  </Typography>
  <Select
    value={pageSize}
    onChange={handleChangeRowsPerPage}
    variant="standard"
    size="small"
  >
    {[5, 10, 25, 50].map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </Select>
  */}
              </div>

              {issueTypesData && issueTypesData.count > 0 && (
                <div className="flex items-center">
                  <Pagination
                    count={Math.ceil(issueTypesData.count / pageSize)} // Total number of pages
                    page={page}
                    onChange={handlePageChange} // Handle page change
                    renderItem={(item) => (
                      <PaginationItem
                        component={Link}
                        to={`/issues?page=${item.page}`}
                        {...item}
                      />
                    )}
                    showFirstButton
                    showLastButton
                    boundaryCount={2}
                    siblingCount={2}
                    shape="rounded"
                  />

                  {issueTypesData && (
                    <div className="flex items-center ml-3">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Showing{" "}
                        {Math.min(
                          (page - 1) * pageSize + 1,
                          issueTypesData.count
                        )}{" "}
                        - {Math.min(page * pageSize, issueTypesData.count)} of{" "}
                        {issueTypesData.count}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>


          <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
           <FiPlusCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                <FiPlusCircle />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                Add issue
              </h3>
            <form onSubmit={handleFormSubmit}>
              <div className="p-4 pb-10">
                <div className="form-group">
                  <label htmlFor="name" className="mb-2 block font-semibold">
                    New Issue Name
                  </label>
                  <TextField
                 
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                    size="small"
                    value={newIssueName}
                    onChange={(e) => setNewIssueName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
              
                <button
                type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  No, go back
                </button>
                <button
              type="submit"
                  onClick={() => setIsOpen(false)}
                  className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                >
                  Create Issue
                </button>
              </div>
            </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    

         {/* Update issue Modal */}
         {isUpdateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            onClick={closeUpdateModal}
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
            >
              <FiPenTool className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
              <div className="relative z-10">
                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                  <FiPenTool />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                  Update Issue
                </h3>
                <form onSubmit={handleFormSubmit}>
                  <div className="p-4 pb-10">
                    <div className="form-group">
                      <label
                        htmlFor="name"
                        className="mb-2 block font-semibold"
                      >
                        Issue Name
                      </label>
                      <TextField
                        id="name"
                        name="name"
                        className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                        size="small"
                        placeholder="Enter new issue name"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    
                    <button
                      type="button"
                      onClick={closeUpdateModal}
                      className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                    >
                      No go back
                    </button>
                    <button
                      type="submit"
                      className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                    >
                      Update Issue
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}


         {/* Delete Confirmation Modal */}
         {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
            >
              <FiDelete className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
              <div className="relative z-10">
                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                  <FiDelete />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                  Confirm Delete
                </h3>
                <div className="p-4 pb-10 text-center">
                  <p>Are you sure you want to delete the issue?</p>
                </div>
                <div className="flex gap-2">
                  
                  <button
                    onClick={cancelDelete}
                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                  >
                    No, go back
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-400 hover:bg-red-500 text-white font-semibold w-full py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      
        </div>
      </div>
    </>
  );
}



export default IssueList;
