import axios from "axios";

// Adjust the base URL according to your setup
const API_BASE_URL = "http://127.0.0.1:8000/admin_side/";

export const fetchAllPatients = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}patients/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all patients:", error);
    throw error;
  }
};

export const fetchPatientById = async (id, accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}patients/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Patient by ID", error);
    throw error;
  }
};

export const fetchAllDoctors = async (accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}doctors/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

export const fetchDoctorById = async (id, accessToken) => {
  try {
    const response = await axios.get(`${API_BASE_URL}doctors/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    throw error;
  }
};

export const blockUnblockDoctor = async (id, action, accessToken) => {
  try {
    await axios.post(
      `${API_BASE_URL}doctors/${id}/block/`,
      { action }, // Send the action as a string
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(action);
  } catch (error) {
    console.error(`Error  ${action}ing doctor:`, error);
    throw error;
  }
};

export const updateDoctorStatus = async (
  id,
  status,
  accessToken,
  rejectionReason = ""
) => {
  try {
    await axios.post(
      `${API_BASE_URL}doctors/${id}/verify/`,
      { status, reason: rejectionReason }, // Include the reason here
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error("Error updating doctor status:", error);
    throw error;
  }
};

export const blockUnblockPatient = async (id, action, accessToken) => {
  try {
    await axios.post(
      `${API_BASE_URL}patients/${id}/block-unblock/`,
      { action },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error(`Error ${action}ing patient:`, error);
    throw error;
  }
};

export const fetchVerificationChoices = async (accessToken) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}doctors/verification-choices/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching verification choices:", error);
    throw error;
  }
};
