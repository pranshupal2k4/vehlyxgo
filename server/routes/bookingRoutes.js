const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  getBookingById
} = require('../controllers/bookingController');
const { protect, ownerOnly, clientOnly } = require('../middleware/authMiddleware');

router.post('/', protect, clientOnly, createBooking);
router.get('/my-bookings', protect, clientOnly, getMyBookings);
router.get('/owner-bookings', protect, ownerOnly, getOwnerBookings);
router.put('/:id/status', protect, ownerOnly, updateBookingStatus);
router.get('/:id', protect, getBookingById);

module.exports = router;