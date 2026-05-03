import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', purpose: '' });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await API.get('/vehicles');
      setVehicles(res.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      let query = '';
      if (filter.type) query += `type=${filter.type}&`;
      if (filter.purpose) query += `purpose=${filter.purpose}`;
      const res = await API.get(`/vehicles?${query}`);
      setVehicles(res.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🚗 VehlyxGo</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Namaste, {user?.name}! 👋</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <h3 style={styles.filterTitle}>Vehicle Dhundo 🔍</h3>
        <div style={styles.filterRow}>
          <select
            style={styles.select}
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
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
          <select
            style={styles.select}
            value={filter.purpose}
            onChange={(e) => setFilter({ ...filter, purpose: e.target.value })}
          >
            <option value="">Sabhi Purpose</option>
            <option value="travelling">Travelling ✈️</option>
            <option value="luggage">Luggage 📦</option>
            <option value="towing">Towing 🔗</option>
            <option value="farming">Farming 🌾</option>
            <option value="construction">Construction 🏗️</option>
            <option value="other">Other</option>
          </select>
          <button style={styles.filterBtn} onClick={handleFilter}>
            Filter Karo
          </button>
          <button style={styles.resetBtn} onClick={() => {
            setFilter({ type: '', purpose: '' });
            fetchVehicles();
          }}>
            Reset
          </button>
        </div>
      </div>

      {/* Vehicles List */}
      <div style={styles.content}>
        {loading ? (
          <p style={styles.loading}>Loading vehicles... ⏳</p>
        ) : vehicles.length === 0 ? (
          <p style={styles.noData}>Koi vehicle nahi mila 😕</p>
        ) : (
          <div style={styles.grid}>
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.vehicleType}>
                    {vehicle.type === 'car' ? '🚗' :
                     vehicle.type === 'bike' ? '🏍️' :
                     vehicle.type === 'truck' ? '🚛' :
                     vehicle.type === 'tractor' ? '🚜' :
                     vehicle.type === 'taxi' ? '🚕' :
                     vehicle.type === 'auto' ? '🛺' :
                     vehicle.type === 'jcb' ? '🏗️' :
                     vehicle.type === 'crane' ? '🏗️' : '🚐'}
                  </span>
                  <span style={styles.vehicleTypeBadge}>{vehicle.type.toUpperCase()}</span>
                </div>
                <h3 style={styles.vehicleName}>{vehicle.name}</h3>
                <p style={styles.vehicleInfo}>📍 {vehicle.location}</p>
                <p style={styles.vehicleInfo}>🎯 {vehicle.purpose}</p>
                <p style={styles.vehicleInfo}>👤 {vehicle.owner?.name}</p>
                <p style={styles.vehicleInfo}>📞 {vehicle.owner?.phone}</p>
                <div style={styles.priceRow}>
                  <span style={styles.price}>₹{vehicle.pricePerDay}/day</span>
                  <span style={styles.advance}>30% advance: ₹{Math.ceil(vehicle.pricePerDay * 0.30)}</span>
                </div>
                <button
                  style={styles.bookBtn}
                  onClick={() => navigate(`/client/book/${vehicle._id}`)}
                >
                  Book Karo 🚀
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
  filterSection: {
    backgroundColor: 'white', padding: '20px 24px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  filterTitle: { margin: '0 0 12px 0', color: '#333' },
  filterRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  select: {
    padding: '10px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer'
  },
  filterBtn: {
    padding: '10px 20px', backgroundColor: '#f97316',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600'
  },
  resetBtn: {
    padding: '10px 20px', backgroundColor: '#6b7280',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600'
  },
  content: { padding: '24px' },
  loading: { textAlign: 'center', fontSize: '18px', color: '#666' },
  noData: { textAlign: 'center', fontSize: '18px', color: '#666' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  vehicleType: { fontSize: '32px' },
  vehicleTypeBadge: {
    backgroundColor: '#fff7ed', color: '#f97316',
    padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700'
  },
  vehicleName: { margin: '0 0 8px 0', color: '#333', fontSize: '18px' },
  vehicleInfo: { margin: '4px 0', color: '#666', fontSize: '14px' },
  priceRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', margin: '12px 0',
    padding: '8px', backgroundColor: '#f9fafb', borderRadius: '8px'
  },
  price: { fontWeight: '700', color: '#f97316', fontSize: '16px' },
  advance: { fontSize: '12px', color: '#666' },
  bookBtn: {
    width: '100%', padding: '12px', backgroundColor: '#f97316',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer'
  },
};

export default ClientDashboard;