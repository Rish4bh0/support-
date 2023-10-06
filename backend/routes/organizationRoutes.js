const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

// Create a new organization
router.post('/', organizationController.createOrganization);

// Get all organizations
router.get('/', organizationController.getAllOrganizations);

// Get an organization by ID
router.get('/:id', organizationController.getOrganizationById);

// Update an organization by ID
router.put('/:id', organizationController.updateOrganization);

// Delete an organization by ID
router.delete('/:id', organizationController.deleteOrganization);

module.exports = router;
