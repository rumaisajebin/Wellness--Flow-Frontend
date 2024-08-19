import axios from "axios";

const API_URL = "http://127.0.0.1:8000/patient/";

// Get profile ID for the current user
export const getProfileId = async (token) => {
  try {
    const response = await axios.get(`${API_URL}patient-profiles/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data[0]; // Return the first profile
  } catch (error) {
    throw error;
  }
};

// Get profile details by ID
export const getProfile = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}patient-profiles/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update profile by ID
export const updateProfile = async (id, profileData, token) => {
  try {
    const response = await axios.put(`${API_URL}patient-profiles/${id}/`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new profile
export const createProfile = async (profileData, token) => {
  try {
    const response = await axios.post(`${API_URL}patient-profiles/`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
