import axios from "axios";

const API_URL = "http://127.0.0.1:8000/patient/";

// Get profile ID for the current user
export const getProfileId = async (token) => {
  try {
    const response = await axios.get(`${API_URL}patient-profiles/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data[0];
  } catch (error) {
    throw error;
  }
};

// Get profile details by ID
export const getProfile = async (id, token) => {
  const response = await axios.get(`${API_URL}patient-profiles/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
