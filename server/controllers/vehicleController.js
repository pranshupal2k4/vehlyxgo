const Vehicle = require('../models/Vehicle');

// @desc    Vehicle add karo (Owner only)
// @route   POST /api/vehicles
const addVehicle = async (req, res) => {
  try {
    const {
      name, type, purpose, pricePerDay,
      description, location, registrationNumber
    } = req.body;

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      name,
      type,
      purpose,
      pricePerDay,
      description,
      location,
      registrationNumber
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle add ho gaya!',
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sabhi vehicles dekho (Client)
// @route   GET /api/vehicles
const getAllVehicles = async (req, res) => {
  try {
    const { type, purpose, location } = req.query;

    let filter = { isAvailable: true, isApproved: true };

    if (type) filter.type = type;
    if (purpose) filter.purpose = purpose;
    if (location) filter.location = new RegExp(location, 'i');

    const vehicles = await Vehicle.find(filter)
      .populate('owner', 'name phone email');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Single vehicle dekho
// @route   GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name phone email');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle nahi mila' });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Owner ke saare vehicles
// @route   GET /api/vehicles/my-vehicles
const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vehicle update karo (Owner only)
// @route   PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle nahi mila' });
    }

    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Yeh tumhara vehicle nahi hai' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Vehicle update ho gaya!',
      data: updatedVehicle
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vehicle delete karo (Owner only)
// @route   DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle nahi mila' });
    }

    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Yeh tumhara vehicle nahi hai' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Vehicle delete ho gaya!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  getMyVehicles,
  updateVehicle,
  deleteVehicle
};