import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import {
  getAllOrganization,
  reset,
} from "../../features/organization/organizationSlice";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Spinner from "../../components/Spinner";
import CustomButton from "../../components/CustomButton";

function OrganizationList() {
  const organizations = useSelector(
    (state) => state.organizations.organizations
  );
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.organizations
  );
  const userRole = useSelector((state) => state.auth.user.role);
  const organizationId = useSelector((state) => state.auth.user.organization); // Retrieve the user's organization ID from Redux state

  // Filter organizations to include only the organization with the user's organizationId
  const userOrganization = organizations.find(
    (org) => org._id === organizationId
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // Load the initial issue list when the component mounts
    dispatch(getAllOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
      toast.success("Organization added");
      dispatch(getAllOrganization());
    }
  }, [dispatch, isError, isSuccess, message]);

  // Check if the user has one of the allowed roles
  if (!["ADMIN", "SUPERVISOR", "EMPLOYEE", "ORGAGENT"].includes(userRole)) {
    // Handle unauthorized access, e.g., redirect or show an error message
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  const columns = [
    { field: "id", headerName: "Office ID", flex: 1 },
    { field: "name", headerName: "Office name", flex: 1 },
    { field: "email", headerName: "Office email", flex: 1 },
    { field: "contact", headerName: "Office contact", flex: 1 },
    { field: "focalPersonName", headerName: "Focal Person Name", flex: 1 },
    { field: "focalPersonEmail", headerName: "Focal Person Email", flex: 1 },
    {
      field: "focalPersonContact",
      headerName: "Focal Person Contact",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Link to={`/organization/${params.row.id}`}>
            <CustomButton icon={<ModeEditIcon />}></CustomButton>
          </Link>
          <Link to={`/organizations/${params.row.id}`}>
            <CustomButton
              icon={<VisibilityIcon />}
              color="success"
            ></CustomButton>
          </Link>
        </div>
      ),
    },
  ];

  const rows = userOrganization
    ? [
        {
          id: userOrganization._id,
          name: userOrganization.name,
          email: userOrganization.email,
          contact: userOrganization.contact,
          focalPersonName: userOrganization.focalPersonName,
          focalPersonEmail: userOrganization.focalPersonEmail,
          focalPersonContact: userOrganization.focalPersonContact,
        },
      ]
    : [];

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="border border-gray-300 rounded-2xl bg-white w-full mb-48">
        <div className="border-b-1 p-4 text-sm">
          <div className="font-extrabold">Manage my office</div>
        </div>
        <div className="p-4">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
          />
        </div>
      </div>
    </>
  );
}

export default OrganizationList;
