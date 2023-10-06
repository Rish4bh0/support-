const asyncHandler = require('express-async-handler');
const Organization = require('../models/organizationModel');
const User = require("../models/userModel");

// Create a new organization
const createOrganization = asyncHandler (async (req, res) => {
  try {
    const { name, description } = req.body;
    const organization = await Organization.create({ name, description });
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

// Get all organizations
const getAllOrganizations = asyncHandler (async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// Get an organization by ID
const getOrganizationById = asyncHandler (async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Update an organization by ID
const updateOrganization = asyncHandler (async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedOrganization = await Organization.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedOrganization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json(updatedOrganization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

// Delete an organization by ID
const deleteOrganization = asyncHandler (async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrganization = await Organization.findByIdAndRemove(id);
    if (!deletedOrganization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json(deletedOrganization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

module.exports = {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
};
