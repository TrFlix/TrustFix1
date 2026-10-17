const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Category routes
router.get('/categories', serviceController.getAllCategories);

// Provider routes
router.get('/providers', serviceController.getAllProviders);
router.get('/providers/:id', serviceController.getProviderById);

// Service routes
router.get('/providers/:providerId/services', serviceController.getServicesByProvider);
router.post('/services', serviceController.addService);
router.put('/services/:id', serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;
