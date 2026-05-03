import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/register', formData);
      login(res.data.data, res.data.data.token);
      if (res.data.data.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🚗 VehlyxGo</h1>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Naam</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Apna naam daalo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email daalo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              style={styles.input}
              type="text"
              name="phone"
              placeholder="Phone number daalo"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Password daalo"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <select
              style={styles.input}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="client">Client — Vehicle book karna hai</option>
              <option value="owner">Owner — Vehicle dena hai</option>
            </select>
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <p style={styles.link}>
          Pehle se account hai? <Link to="/login">Login karo</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  logo: {
    textAlign: 'center',
    color: '#f97316',
    marginBottom: '8px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '24px',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f97316',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '12px',
  },
  link: {
    textAlign: 'center',
    marginTop: '16px',
    color: '#555',
  },
};

export default Register;