const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Payment = require('../models/Payment');

// @desc    Booking banao (Client only)
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, pickupLocation, dropLocation, purpose } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle nahi mila' });
    }
    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: 'Vehicle available nahi hai' });
    }

    // Total amount calculate karo
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = days * vehicle.pricePerDay;
    const advanceAmount = Math.ceil(totalAmount * 0.30);
    const remainingAmount = totalAmount - advanceAmount;

    const booking = await Booking.create({
      client: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalAmount,
      advanceAmount,
      remainingAmount,
      pickupLocation,
      dropLocation,
      purpose,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    res.status(201).json({
      success: true,
      message: 'Booking ban gayi!',
      data: {
        booking,
        paymentInfo: {
          totalAmount,
          advanceAmount,
          remainingAmount,
          message: `Abhi ${advanceAmount} rupees pay karo (30%), baaki ${remainingAmount} baad mein`
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Client ki saari bookings
// @route   GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user._id })
      .populate('vehicle', 'name type pricePerDay images location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Owner ki saari bookings
// @route   GET /api/bookings/owner-bookings
const getOwnerBookings = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    const vehicleIds = vehicles.map(v => v._id);

    const bookings = await Booking.find({ vehicle: { $in: vehicleIds } })
      .populate('client', 'name phone email')
      .populate('vehicle', 'name type')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Booking status update karo (Owner)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking nahi mili' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} ho gayi!`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Single booking dekho
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'name type pricePerDay location images')
      .populate('client', 'name phone email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking nahi mili' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  getBookingById
};