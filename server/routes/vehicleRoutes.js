const express = require('express');
const router = express.Router();
const {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  getMyVehicles,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { protect, ownerOnly } = require('../middleware/authMiddleware');

router.get('/', getAllVehicles);
router.get('/my-vehicles', protect, ownerOnly, getMyVehicles);
router.get('/:id', getVehicleById);
router.post('/', protect, ownerOnly, addVehicle);
router.put('/:id', protect, ownerOnly, updateVehicle);
router.delete('/:id', protect, ownerOnly, deleteVehicle);

module.exports = router;