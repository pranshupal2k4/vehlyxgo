import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const BookVehicle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '', endDate: '', pickupLocation: '', dropLocation: '', purpose: 'travelling'
  });
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    try {
      const res = await API.get(`/vehicles/${id}`);
      setVehicle(res.data.data);
    } catch (err) {
      alert('Vehicle nahi mila!');
      navigate('/client/dashboard');
    }
    setLoading(false);
  };

  const calculateAmount = () => {
    if (formData.startDate && formData.endDate && vehicle) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days <= 0) {
        setCalculation(null);
        return;
      }
      const totalAmount = days * vehicle.pricePerDay;
      const advanceAmount = Math.ceil(totalAmount * 0.30);
      const remainingAmount = totalAmount - advanceAmount;
      setCalculation({ days, totalAmount, advanceAmount, remainingAmount });
    }
  };

  useEffect(() => {
    calculateAmount();
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!calculation || calculation.days <= 0) {
      alert('Sahi dates daalo!');
      return;
    }
    setBooking(true);
    try {
      const res = await API.post('/bookings', {
        vehicleId: id,
        ...formData
      });
      navigate('/client/booking-success', { state: { booking: res.data.data } });
    } catch (err) {
      alert(err.response?.data?.message || 'Booking nahi hui!');
    }
    setBooking(false);
  };

  if (loading) return <div style={styles.loading}>Loading... ⏳</div>;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🚗 VehlyxGo</h2>
        <button style={styles.backBtn} onClick={() => navigate('/client/dashboard')}>
          ← Wapas Jao
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>

          {/* Vehicle Info */}
          <div style={styles.vehicleCard}>
            <div style={styles.vehicleHeader}>
              <span style={styles.emoji}>
                {vehicle?.type === 'car' ? '🚗' :
                 vehicle?.type === 'bike' ? '🏍️' :
                 vehicle?.type === 'truck' ? '🚛' :
                 vehicle?.type === 'tractor' ? '🚜' :
                 vehicle?.type === 'taxi' ? '🚕' :
                 vehicle?.type === 'auto' ? '🛺' : '🚐'}
              </span>
              <span style={styles.typeBadge}>{vehicle?.type?.toUpperCase()}</span>
            </div>
            <h2 style={styles.vehicleName}>{vehicle?.name}</h2>
            <div style={styles.infoList}>
              <p style={styles.info}>📍 Location: <strong>{vehicle?.location}</strong></p>
              <p style={styles.info}>🎯 Purpose: <strong>{vehicle?.purpose}</strong></p>
              <p style={styles.info}>👤 Owner: <strong>{vehicle?.owner?.name}</strong></p>
              <p style={styles.info}>📞 Phone: <strong>{vehicle?.owner?.phone}</strong></p>
              <p style={styles.info}>📝 {vehicle?.description}</p>
            </div>

            <div style={styles.priceBox}>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Price per day</span>
                <span style={styles.priceValue}>₹{vehicle?.pricePerDay}</span>
              </div>
              <div style={styles.priceRow}>
                <span style={styles.priceLabel}>Advance (30%)</span>
                <span style={styles.advanceValue}>₹{Math.ceil(vehicle?.pricePerDay * 0.30)}/day</span>
              </div>
            </div>

            {/* Calculation */}
            {calculation && (
              <div style={styles.calcBox}>
                <h3 style={styles.calcTitle}>💰 Payment Calculation</h3>
                <div style={styles.calcRow}>
                  <span>Total Days</span>
                  <strong>{calculation.days} din</strong>
                </div>
                <div style={styles.calcRow}>
                  <span>Total Amount</span>
                  <strong>₹{calculation.totalAmount}</strong>
                </div>
                <div style={{...styles.calcRow, backgroundColor: '#fff7ed', borderRadius: '8px', padding: '8px'}}>
                  <span style={{color: '#f97316', fontWeight: '700'}}>Abhi Pay Karo (30%)</span>
                  <strong style={{color: '#f97316', fontSize: '18px'}}>₹{calculation.advanceAmount}</strong>
                </div>
                <div style={styles.calcRow}>
                  <span>Baad Mein Pay Karo</span>
                  <strong>₹{calculation.remainingAmount}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>📋 Booking Details</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Start Date 📅</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>End Date 📅</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Pickup Location 📍</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Kahan se lena hai?"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Drop Location 📍</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Kahan chhodna hai? (optional)"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({...formData, dropLocation: e.target.value})}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Purpose 🎯</label>
                <select
                  style={styles.input}
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                >
                  <option value="travelling">Travelling ✈️</option>
                  <option value="luggage">Luggage 📦</option>
                  <option value="towing">Towing 🔗</option>
                  <option value="farming">Farming 🌾</option>
                  <option value="construction">Construction 🏗️</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {calculation && (
                <div style={styles.summaryBox}>
                  <p style={styles.summaryText}>
                    ✅ {calculation.days} din ke liye booking
                  </p>
                  <p style={styles.summaryAmount}>
                    Abhi pay karo: <strong style={{color: '#f97316'}}>₹{calculation.advanceAmount}</strong>
                  </p>
                </div>
              )}

              <button
                style={{...styles.bookBtn, opacity: booking ? 0.7 : 1}}
                type="submit"
                disabled={booking}
              >
                {booking ? 'Booking Ho Rahi Hai... ⏳' : '🚀 Booking Confirm Karo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' },
  navbar: {
    backgroundColor: '#f97316', padding: '16px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  logo: { color: 'white', margin: 0 },
  backBtn: {
    padding: '8px 16px', backgroundColor: 'white',
    color: '#f97316', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600'
  },
  content: { padding: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  vehicleCard: {
    backgroundColor: 'white', padding: '24px',
    borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  vehicleHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  emoji: { fontSize: '48px' },
  typeBadge: {
    backgroundColor: '#fff7ed', color: '#f97316',
    padding: '6px 12px', borderRadius: '8px', fontWeight: '700'
  },
  vehicleName: { margin: '0 0 16px 0', color: '#333', fontSize: '22px' },
  infoList: { marginBottom: '16px' },
  info: { margin: '6px 0', color: '#555', fontSize: '15px' },
  priceBox: {
    backgroundColor: '#f9fafb', padding: '16px',
    borderRadius: '10px', marginBottom: '16px'
  },
  priceRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  priceLabel: { color: '#666' },
  priceValue: { fontWeight: '700', color: '#333', fontSize: '18px' },
  advanceValue: { fontWeight: '700', color: '#f97316' },
  calcBox: {
    backgroundColor: '#f0fdf4', padding: '16px',
    borderRadius: '10px', border: '1px solid #bbf7d0'
  },
  calcTitle: { margin: '0 0 12px 0', color: '#16a34a' },
  calcRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#555' },
  formCard: {
    backgroundColor: 'white', padding: '24px',
    borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  formTitle: { margin: '0 0 20px 0', color: '#333' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontWeight: '600' },
  input: {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box'
  },
  summaryBox: {
    backgroundColor: '#fff7ed', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', border: '1px solid #fed7aa'
  },
  summaryText: { margin: '0 0 4px 0', color: '#555' },
  summaryAmount: { margin: 0, color: '#555', fontSize: '16px' },
  bookBtn: {
    width: '100%', padding: '14px', backgroundColor: '#f97316',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer'
  },
};

export default BookVehicle;