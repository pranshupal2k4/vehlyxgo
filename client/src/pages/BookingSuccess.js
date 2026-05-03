import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;

  if (!booking) {
    navigate('/client/dashboard');
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Success Icon */}
        <div style={styles.successIcon}>✅</div>
        <h1 style={styles.title}>Booking Ho Gayi!</h1>
        <p style={styles.subtitle}>Aapki booking successfully confirm ho gayi hai 🎉</p>

        {/* Booking Details */}
        <div style={styles.detailBox}>
          <h3 style={styles.detailTitle}>📋 Booking Details</h3>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Booking ID</span>
            <span style={styles.detailValue}>#{booking.booking?._id?.slice(-8).toUpperCase()}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Status</span>
            <span style={{...styles.detailValue, color: 'orange', fontWeight: '700'}}>
              ⏳ Pending — Owner confirm karega
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Start Date</span>
            <span style={styles.detailValue}>
              {new Date(booking.booking?.startDate).toLocaleDateString('hi-IN')}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>End Date</span>
            <span style={styles.detailValue}>
              {new Date(booking.booking?.endDate).toLocaleDateString('hi-IN')}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Pickup Location</span>
            <span style={styles.detailValue}>{booking.booking?.pickupLocation}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Purpose</span>
            <span style={styles.detailValue}>{booking.booking?.purpose}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div style={styles.paymentBox}>
          <h3 style={styles.paymentTitle}>💰 Payment Details</h3>
          <div style={styles.paymentRow}>
            <span>Total Amount</span>
            <strong>₹{booking.paymentInfo?.totalAmount}</strong>
          </div>
          <div style={{...styles.paymentRow, ...styles.advanceRow}}>
            <span style={styles.advanceLabel}>🔥 Abhi Pay Karo (30%)</span>
            <strong style={styles.advanceAmount}>₹{booking.paymentInfo?.advanceAmount}</strong>
          </div>
          <div style={styles.paymentRow}>
            <span>Baad Mein Pay Karo (70%)</span>
            <strong>₹{booking.paymentInfo?.remainingAmount}</strong>
          </div>
          <p style={styles.note}>
            ⚠️ Note: Advance payment owner ko confirm karne ke baad karni hogi
          </p>
        </div>

        {/* Owner Contact */}
        <div style={styles.contactBox}>
          <h3 style={styles.contactTitle}>📞 Owner se Contact Karo</h3>
          <p style={styles.contactText}>
            Owner aapki booking confirm karega — unhe call kar sakte ho:
          </p>
          <p style={styles.ownerName}>👤 {booking.booking?.vehicle?.owner?.name || 'Owner'}</p>
        </div>

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button
            style={styles.dashboardBtn}
            onClick={() => navigate('/client/dashboard')}
          >
            🏠 Dashboard Pe Jao
          </button>
          <button
            style={styles.bookingsBtn}
            onClick={() => navigate('/client/my-bookings')}
          >
            📋 Meri Bookings
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', backgroundColor: '#f0f2f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px'
  },
  card: {
    backgroundColor: 'white', borderRadius: '16px',
    padding: '40px', maxWidth: '560px', width: '100%',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  successIcon: { fontSize: '64px', textAlign: 'center', marginBottom: '16px' },
  title: { textAlign: 'center', color: '#16a34a', margin: '0 0 8px 0', fontSize: '28px' },
  subtitle: { textAlign: 'center', color: '#666', margin: '0 0 24px 0' },
  detailBox: {
    backgroundColor: '#f9fafb', padding: '20px',
    borderRadius: '12px', marginBottom: '16px'
  },
  detailTitle: { margin: '0 0 16px 0', color: '#333' },
  detailRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '8px 0',
    borderBottom: '1px solid #e5e7eb'
  },
  detailLabel: { color: '#666', fontSize: '14px' },
  detailValue: { color: '#333', fontSize: '14px', fontWeight: '600' },
  paymentBox: {
    backgroundColor: '#fff7ed', padding: '20px',
    borderRadius: '12px', marginBottom: '16px',
    border: '1px solid #fed7aa'
  },
  paymentTitle: { margin: '0 0 16px 0', color: '#f97316' },
  paymentRow: {
    display: 'flex', justifyContent: 'space-between',
    marginBottom: '8px', color: '#555'
  },
  advanceRow: {
    backgroundColor: '#f97316', borderRadius: '8px',
    padding: '10px 12px', margin: '8px 0'
  },
  advanceLabel: { color: 'white', fontWeight: '700' },
  advanceAmount: { color: 'white', fontSize: '20px' },
  note: { margin: '12px 0 0 0', color: '#9a3412', fontSize: '13px' },
  contactBox: {
    backgroundColor: '#eff6ff', padding: '16px',
    borderRadius: '12px', marginBottom: '24px',
    border: '1px solid #bfdbfe'
  },
  contactTitle: { margin: '0 0 8px 0', color: '#1d4ed8' },
  contactText: { margin: '0 0 8px 0', color: '#555', fontSize: '14px' },
  ownerName: { margin: 0, fontWeight: '700', color: '#333', fontSize: '16px' },
  btnRow: { display: 'flex', gap: '12px' },
  dashboardBtn: {
    flex: 1, padding: '14px', backgroundColor: '#f97316',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer'
  },
  bookingsBtn: {
    flex: 1, padding: '14px', backgroundColor: '#1d4ed8',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer'
  },
};

export default BookingSuccess;