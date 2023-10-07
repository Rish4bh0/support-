import React, { useEffect } from "react";
import {
  getAllOrganization,
  selectOrganizationById,
} from "../features/organization/organizationSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const UpdateOrganization = () => {
  const organization = useSelector(
    (state) => state.organizations.selectedOrganization
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrganization());
    dispatch(selectOrganizationById(id));
  }, [id, dispatch]);
  return (
    <>
      <div>{organization ? organization._id : "Loading..."}</div>
      <div>{organization ? organization.name : "Loading..."}</div>
      <div>{organization ? organization.email : "Loading..."}</div>
      <div>{organization ? organization.contact : "Loading..."}</div>
      <div>{organization ? organization.description : "Loading..."}</div>
    </>
  );
};

export default UpdateOrganization;
