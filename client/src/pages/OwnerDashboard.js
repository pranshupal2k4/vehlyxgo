import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';

const OwnerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', type: 'car', purpose: 'travelling',
    pricePerDay: '', description: '', location: '', registrationNumber: ''
  });

  useEffect(() => {
    fetchMyVehicles();
    fetchMyBookings();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const res = await API.get('/vehicles/my-vehicles');
      setVehicles(res.data.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const fetchMyBookings = async () => {
    try {
      const res = await API.get('/bookings/owner-bookings');
      setBookings(res.data.data);
    } catch (err) { console.log(err); }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await API.post('/vehicles', formData);
      alert('Vehicle add ho gaya! ✅');
      setShowAddForm(false);
      fetchMyVehicles();
      setFormData({ name: '', type: 'car', purpose: 'travelling', pricePerDay: '', description: '', location: '', registrationNumber: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error aaya!');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Vehicle delete karna chahte ho?')) {
      try {
        await API.delete(`/vehicles/${id}`);
        alert('Vehicle delete ho gaya!');
        fetchMyVehicles();
      } catch (err) { alert('Delete nahi hua!'); }
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status });
      alert(`Booking ${status} ho gayi!`);
      fetchMyBookings();
    } catch (err) { alert('Status update nahi hua!'); }
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

  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🚗 VehlyxGo — Owner Panel</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Namaste, {user?.name}! 👋</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.tabs}>
        <button style={activeTab === 'vehicles' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('vehicles')}>
          🚗 Mere Vehicles ({vehicles.length})
        </button>
        <button style={activeTab === 'bookings' ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab('bookings')}>
          📋 Bookings ({bookings.length})
        </button>
      </div>

      <div style={styles.content}>

        {activeTab === 'vehicles' && (
          <div>
            <button style={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? '✕ Band Karo' : '+ Naya Vehicle Add Karo'}
            </button>

            {showAddForm && (
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>Naya Vehicle Add Karo</h3>
                <form onSubmit={handleAddVehicle}>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Vehicle Name</label>
                      <input style={styles.input} type="text" placeholder="Jaise: Mahindra Tractor"
                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Registration Number</label>
                      <input style={styles.input} type="text" placeholder="Jaise: UP78AB1234"
                        value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Vehicle Type</label>
                      <select style={styles.input} value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="auto">Auto</option>
                        <option value="taxi">Taxi</option>
                        <option value="truck">Truck</option>
                        <option value="tractor">Tractor</option>
                        <option value="jcb">JCB</option>
                        <option value="crane">Crane</option>
                        <option value="tempo">Tempo</option>
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Purpose</label>
                      <select style={styles.input} value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}>
                        <option value="travelling">Travelling</option>
                        <option value="luggage">Luggage</option>
                        <option value="towing">Towing</option>
                        <option value="farming">Farming</option>
                        <option value="construction">Construction</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Price Per Day (₹)</label>
                      <input style={styles.input} type="number" placeholder="Jaise: 1500"
                        value={formData.pricePerDay} onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Location</label>
                      <input style={styles.input} type="text" placeholder="Jaise: Gorakhpur"
                        value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                    </div>
                    <div style={{ ...styles.inputGroup, gridColumn: '1/-1' }}>
                      <label style={styles.label}>Description</label>
                      <textarea style={{ ...styles.input, height: '80px' }} placeholder="Vehicle ke baare mein likho"
                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                  </div>
                  <button style={styles.submitBtn} type="submit">Vehicle Add Karo ✅</button>
                </form>
              </div>
            )}

            {loading ? <p>Loading... ⏳</p> : (
              <div style={styles.grid}>
                {vehicles.length === 0 ? (
                  <p style={styles.noData}>Koi vehicle nahi — pehla vehicle add karo! 🚗</p>
                ) : vehicles.map((v) => (
                  <div key={v._id} style={styles.card}>
                    <h3 style={styles.vehicleName}>{v.name}</h3>
                    <p style={styles.info}>🚗 {v.type.toUpperCase()} | 🎯 {v.purpose}</p>
                    <p style={styles.info}>📍 {v.location}</p>
                    <p style={styles.info}>💰 ₹{v.pricePerDay}/day</p>
                    <p style={styles.info}>🔖 {v.registrationNumber}</p>
                    <p style={{ ...styles.info, color: v.isApproved ? 'green' : 'orange' }}>
                      {v.isApproved ? '✅ Approved' : '⏳ Approval Pending'}
                    </p>
                    <button style={styles.deleteBtn} onClick={() => handleDeleteVehicle(v._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <p style={styles.noData}>Koi booking nahi aayi abhi tak 📋</p>
            ) : bookings.map((b) => {
              const st = getStatusStyle(b.status);
              return (
                <div key={b._id} style={styles.bookingCard}>
                  <div style={styles.bookingHeader}>
                    <h3 style={styles.bookingTitle}>{b.vehicle?.name}</h3>
                    <span style={{ ...styles.statusBadge, backgroundColor: st.bg, color: st.color }}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={styles.bookingGrid}>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>👤 Client</p>
                      <p style={styles.infoValue}>{b.client?.name}</p>
                    </div>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>📅 Dates</p>
                      <p style={styles.infoValue}>
                        {new Date(b.startDate).toLocaleDateString('hi-IN')} → {new Date(b.endDate).toLocaleDateString('hi-IN')}
                      </p>
                    </div>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>💰 Total</p>
                      <p style={{ ...styles.infoValue, color: '#f97316', fontWeight: '700' }}>₹{b.totalAmount}</p>
                    </div>
                    <div style={styles.infoBox}>
                      <p style={styles.infoLabel}>📍 Pickup</p>
                      <p style={styles.infoValue}>{b.pickupLocation}</p>
                    </div>
                  </div>

                  <div style={styles.amountRow}>
                    <span>Advance: <strong>₹{b.advanceAmount}</strong></span>
                    <span>Remaining: <strong>₹{b.remainingAmount}</strong></span>
                  </div>

                  {/* Client ko call karo */}
                  {b.client?.phone && (
                    <a href={`tel:${b.client.phone}`} style={styles.callBtn}>
                      📞 Client ko Call Karo — {b.client.phone}
                    </a>
                  )}

                  {b.status === 'pending' && (
                    <div style={styles.actionRow}>
                      <button style={styles.confirmBtn} onClick={() => handleStatusUpdate(b._id, 'confirmed')}>
                        ✅ Confirm
                      </button>
                      <button style={styles.cancelBtn} onClick={() => handleStatusUpdate(b._id, 'cancelled')}>
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <button style={{ ...styles.confirmBtn, marginTop: '12px', width: '100%' }}
                      onClick={() => handleStatusUpdate(b._id, 'completed')}>
                      ✔️ Mark as Completed
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: { backgroundColor: '#f97316', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', margin: 0, fontSize: '18px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: 'white', fontWeight: '600' },
  logoutBtn: { padding: '8px 16px', backgroundColor: 'white', color: '#f97316', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  tabs: { backgroundColor: 'white', display: 'flex', borderBottom: '2px solid #f0f2f5' },
  tab: { padding: '16px 24px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '15px', color: '#666' },
  activeTab: { padding: '16px 24px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '15px', color: '#f97316', fontWeight: '700', borderBottom: '3px solid #f97316' },
  content: { padding: '24px' },
  addBtn: { padding: '12px 24px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', marginBottom: '20px' },
  formCard: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  formTitle: { margin: '0 0 16px 0', color: '#333' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { marginBottom: '4px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontWeight: '600', fontSize: '14px' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  submitBtn: { marginTop: '16px', padding: '12px 32px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  vehicleName: { margin: '0 0 8px 0', color: '#333' },
  info: { margin: '4px 0', color: '#666', fontSize: '14px' },
  deleteBtn: { marginTop: '12px', padding: '8px 16px', backgroundColor: '#fee2e2', color: 'red', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  noData: { textAlign: 'center', color: '#666', fontSize: '16px', padding: '40px' },
  bookingCard: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '16px' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  bookingTitle: { margin: 0, color: '#333' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  bookingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  infoBox: { backgroundColor: '#f9fafb', padding: '10px', borderRadius: '8px' },
  infoLabel: { margin: '0 0 4px 0', fontSize: '12px', color: '#666' },
  infoValue: { margin: 0, fontSize: '14px', color: '#333', fontWeight: '500' },
  amountRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid #f0f2f5', paddingTop: '12px', marginTop: '12px', fontSize: '14px', color: '#555' },
  callBtn: { display: 'block', marginTop: '12px', padding: '12px', backgroundColor: '#dcfce7', color: 'green', borderRadius: '8px', textDecoration: 'none', textAlign: 'center', fontWeight: '600', fontSize: '14px' },
  actionRow: { display: 'flex', gap: '12px', marginTop: '12px' },
  confirmBtn: { padding: '8px 20px', backgroundColor: '#dcfce7', color: 'green', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '8px 20px', backgroundColor: '#fee2e2', color: 'red', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
};

export default OwnerDashboard;
