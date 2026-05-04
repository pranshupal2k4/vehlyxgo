import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [filter, setFilter] = useState({ type: '', purpose: '' });

  useEffect(() => {
    fetchVehicles();
    fetchMyBookings();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await API.get('/vehicles');
      setVehicles(res.data.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const fetchMyBookings = async () => {
    try {
      const res = await API.get('/bookings/my-bookings');
      setBookings(res.data.data);
    } catch (err) { console.log(err); }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      let query = '';
      if (filter.type) query += `type=${filter.type}&`;
      if (filter.purpose) query += `purpose=${filter.purpose}`;
      const res = await API.get(`/vehicles?${query}`);
      setVehicles(res.data.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#dcfce7', color: 'green' };
      case 'pending': return { bg: '#fef9c3', color: '#b45309' };
      case 'cancelled': return { bg: '#fee2e2', color: 'red' };
      case 'completed': return { bg: '#e0f2fe', color: 'blue' };
      default: return { bg: '#f3f4f6', color: '#666' };
    }
  };

  const vehicleEmoji = (type) => {
    const map = { car:'🚗', bike:'🏍️', truck:'🚛', tractor:'🚜', taxi:'🚕', auto:'🛺', jcb:'🏗️', crane:'🏗️', tempo:'🚐' };
    return map[type] || '🚗';
  };

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🚗 VehlyxGo</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Namaste, {user?.name}! 👋</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.tabs}>
        <button style={activeTab === 'vehicles' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('vehicles')}>
          🚗 Vehicles ({vehicles.length})
        </button>
        <button style={activeTab === 'bookings' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('bookings')}>
          📋 Meri Bookings ({bookings.length})
        </button>
      </div>

      {activeTab === 'vehicles' && (
        <div>
          <div style={styles.filterSection}>
            <h3 style={styles.filterTitle}>Vehicle Dhundo 🔍</h3>
            <div style={styles.filterRow}>
              <select style={styles.select} value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                <option value="">Sabhi Vehicles</option>
                <option value="car">Car 🚗</option>
                <option value="bike">Bike 🏍️</option>
                <option value="auto">Auto 🛺</option>
                <option value="taxi">Taxi 🚕</option>
                <option value="truck">Truck 🚛</option>
                <option value="tractor">Tractor 🚜</option>
                <option value="jcb">JCB 🏗️</option>
                <option value="crane">Crane 🏗️</option>
                <option value="tempo">Tempo 🚐</option>
              </select>
              <select style={styles.select} value={filter.purpose}
                onChange={(e) => setFilter({ ...filter, purpose: e.target.value })}>
                <option value="">Sabhi Purpose</option>
                <option value="travelling">Travelling ✈️</option>
                <option value="luggage">Luggage 📦</option>
                <option value="towing">Towing 🔗</option>
                <option value="farming">Farming 🌾</option>
                <option value="construction">Construction 🏗️</option>
                <option value="other">Other</option>
              </select>
              <button style={styles.filterBtn} onClick={handleFilter}>Filter Karo</button>
              <button style={styles.resetBtn} onClick={() => { setFilter({ type: '', purpose: '' }); fetchVehicles(); }}>Reset</button>
            </div>
          </div>

          <div style={styles.content}>
            {loading ? <p style={styles.centerText}>Loading... ⏳</p>
              : vehicles.length === 0 ? <p style={styles.centerText}>Koi vehicle nahi mila 😕</p>
              : (
                <div style={styles.grid}>
                  {vehicles.map((vehicle) => (
                    <div key={vehicle._id} style={styles.card}>
                      <div style={styles.cardHeader}>
                        <span style={{ fontSize: '32px' }}>{vehicleEmoji(vehicle.type)}</span>
                        <span style={styles.typeBadge}>{vehicle.type.toUpperCase()}</span>
                      </div>
                      <h3 style={styles.vehicleName}>{vehicle.name}</h3>
                      <p style={styles.vehicleInfo}>📍 {vehicle.location}</p>
                      <p style={styles.vehicleInfo}>🎯 {vehicle.purpose}</p>
                      <p style={styles.vehicleInfo}>👤 {vehicle.owner?.name}</p>
                      <div style={styles.priceRow}>
                        <span style={styles.price}>₹{vehicle.pricePerDay}/day</span>
                        <span style={styles.advance}>30% advance: ₹{Math.ceil(vehicle.pricePerDay * 0.30)}</span>
                      </div>
                      <div style={styles.actionRow}>
                        <a href={`tel:${vehicle.owner?.phone}`} style={styles.callBtn}>
                          📞 Call Owner
                        </a>
                        <button style={styles.bookBtn}
                          onClick={() => navigate(`/client/book/${vehicle._id}`)}>
                          Book Karo 🚀
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div style={styles.content}>
          {bookings.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={{ fontSize: '48px', margin: '0 0 12px' }}>📋</p>
              <p style={{ fontSize: '18px', color: '#666', margin: '0 0 16px' }}>Abhi tak koi booking nahi ki</p>
              <button style={{ ...styles.bookBtn, width: 'auto', padding: '10px 24px' }}
                onClick={() => setActiveTab('vehicles')}>Vehicle Dhundo 🚗</button>
            </div>
          ) : (
            bookings.map((b) => {
              const st = getStatusStyle(b.status);
              return (
                <div key={b._id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <div>
                      <h3 style={styles.bookingTitle}>{b.vehicle?.name}</h3>
                      <p style={styles.bookingSubtitle}>{b.vehicle?.type?.toUpperCase()} • {b.vehicle?.location}</p>
                    </div>
                    <span style={{ ...styles.statusBadge, backgroundColor: st.bg, color: st.color }}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={styles.bookingGrid}>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>📅 Dates</p>
                      <p style={styles.infoValue}>
                        {new Date(b.startDate).toLocaleDateString('hi-IN')} → {new Date(b.endDate).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>📍 Pickup</p>
                      <p style={styles.infoValue}>{b.pickupLocation}</p>
                    </div>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>💰 Total</p>
                      <p style={{ ...styles.infoValue, color: '#f97316', fontWeight: '700' }}>₹{b.totalAmount}</p>
                    </div>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>💳 Payment</p>
                      <p style={styles.infoValue}>{b.paymentStatus.replace(/_/g, ' ').toUpperCase()}</p>
                    </div>
                  </div>

                  <div style={styles.amountRow}>
                    <span>Advance: <strong>₹{b.advanceAmount}</strong></span>
                    <span>Remaining: <strong>₹{b.remainingAmount}</strong></span>
                  </div>

                  {/* Owner ko call karo */}
                  {b.vehicle?.owner?.phone && (
                    <a href={`tel:${b.vehicle.owner.phone}`} style={styles.callBtnFull}>
                      📞 Owner ko Call Karo — {b.vehicle.owner.phone}
                    </a>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#f97316', padding: '16px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  logo: { color: 'white', margin: 0 },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: 'white', fontWeight: '600' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: 'white',
    color: '#f97316', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600'
  },
  tabs: { backgroundColor: 'white', display: 'flex', borderBottom: '2px solid #f0f2f5' },
  tab: { padding: '16px 24px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '15px', color: '#666' },
  activeTab: { padding: '16px 24px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '15px', color: '#f97316', fontWeight: '700', borderBottom: '3px solid #f97316' },
  filterSection: { backgroundColor: 'white', padding: '20px 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  filterTitle: { margin: '0 0 12px 0', color: '#333' },
  filterRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer' },
  filterBtn: { padding: '10px 20px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  resetBtn: { padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  content: { padding: '24px' },
  centerText: { textAlign: 'center', fontSize: '18px', color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  typeBadge: { backgroundColor: '#fff7ed', color: '#f97316', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' },
  vehicleName: { margin: '0 0 8px 0', color: '#333', fontSize: '18px' },
  vehicleInfo: { margin: '4px 0', color: '#666', fontSize: '14px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0', padding: '8px', backgroundColor: '#f9fafb', borderRadius: '8px' },
  price: { fontWeight: '700', color: '#f97316', fontSize: '16px' },
  advance: { fontSize: '12px', color: '#666' },
  actionRow: { display: 'flex', gap: '8px', marginTop: '12px' },
  callBtn: {
    flex: 1, padding: '10px', backgroundColor: '#dcfce7',
    color: 'green', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    textDecoration: 'none', textAlign: 'center', display: 'block'
  },
  bookBtn: {
    flex: 1, padding: '10px', backgroundColor: '#f97316',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  emptyBox: { textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  bookingCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '16px' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  bookingTitle: { margin: '0 0 4px 0', color: '#333', fontSize: '18px' },
  bookingSubtitle: { margin: 0, color: '#666', fontSize: '13px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' },
  bookingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  infoBox: { backgroundColor: '#f9fafb', padding: '10px', borderRadius: '8px' },
  infoLabel: { margin: '0 0 4px 0', fontSize: '12px', color: '#666' },
  infoValue: { margin: 0, fontSize: '14px', color: '#333', fontWeight: '500' },
  amountRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid #f0f2f5', paddingTop: '12px', marginTop: '12px', fontSize: '14px', color: '#555' },
  callBtnFull: {
    display: 'block', marginTop: '12px', padding: '12px',
    backgroundColor: '#dcfce7', color: 'green',
    borderRadius: '8px', textDecoration: 'none',
    textAlign: 'center', fontWeight: '600', fontSize: '14px'
  },
};

export default ClientDashboard;