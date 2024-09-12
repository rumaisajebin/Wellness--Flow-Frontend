import React from "react";
import Modal from "react-modal";
import {capitalizeFirstLetter} from '../../utils/textUtils'
// Set the app element for accessibility
Modal.setAppElement("#root"); // Ensure the ID matches your root element

const BookingDetailsModal = ({ isOpen, onRequestClose, booking }) => {

  // Check if booking is null or undefined, set default values
  const {
    patient_name = 'N/A',
    doctor_name = 'N/A',
    schedule = 'N/A',
    schedule_date = 'N/A',
    status = 'N/A',
    consultation_type = 'N/A',
    confirmation_required = false,
    booking_time = null,
    paid = false,
  } = booking || {};

  // Inline styles
  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      width: '90%',
      maxWidth: '600px', // Maximum width for larger screens
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Shadow effect
      margin: 'auto',
      animation: 'fadeIn 0.3s ease', // Simple fade-in animation
    },
    header: {
        display: 'flex',
        justifyContent: 'center', // Center the content horizontally
        alignItems: 'center', // Align items vertically
        marginBottom: '20px', // Space below the header
        position: 'relative', // For positioning the close button
      },
    closeButton: {
      background: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    bodyText: {
      margin: '10px 0',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    buttonPrimary: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonPrimaryHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{ overlay: modalStyles.overlay, content: modalStyles.content }}
      ariaHideApp={true}
    >
       <div style={modalStyles.header}>
        <h2>Booking Details</h2>
      </div>
      <div>
        <p style={modalStyles.bodyText}><strong>Patient Name:</strong> {capitalizeFirstLetter(patient_name)}</p>
        <p style={modalStyles.bodyText}><strong>Doctor Name:</strong> {capitalizeFirstLetter(doctor_name)}</p>
        <p style={modalStyles.bodyText}><strong>Schedule:</strong> {schedule}</p>
        <p style={modalStyles.bodyText}><strong>Schedule Date:</strong> {schedule_date}</p>
        <p style={modalStyles.bodyText}><strong>Status:</strong> {status}</p>
        <p style={modalStyles.bodyText}><strong>Consultation Type:</strong> {consultation_type}</p>
        <p style={modalStyles.bodyText}><strong>Confirmation Required:</strong> {confirmation_required ? "Yes" : "No"}</p>
        <p style={modalStyles.bodyText}><strong>Booking Time:</strong> {booking_time ? new Date(booking_time).toLocaleString() : 'N/A'}</p>
        <p style={modalStyles.bodyText}><strong>Paid:</strong> {paid ? "Yes" : "No"}</p>
      </div>
      <div style={modalStyles.footer}>
        <button
          onClick={onRequestClose}
          style={modalStyles.buttonPrimary}
          onMouseOver={(e) => (e.target.style.backgroundColor = modalStyles.buttonPrimaryHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = modalStyles.buttonPrimary.backgroundColor)}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
