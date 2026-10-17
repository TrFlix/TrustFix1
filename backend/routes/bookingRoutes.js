const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Booking routes
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/customer/:customerId', bookingController.getCustomerBookings);
router.get('/bookings/provider/:providerId', bookingController.getProviderBookings);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);
router.put('/bookings/:id/cancel', bookingController.cancelBooking);

// Stats route
router.get('/provider/:providerId/stats', bookingController.getProviderStats);

module.exports = router;
