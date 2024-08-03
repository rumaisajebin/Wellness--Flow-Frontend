import axios from "axios";

const Base_URL = "http://127.0.0.1:8000/"

const axiosIn = axios.create({
    baseURL: Base_URL,
})

export const docProfile = async (token) => {
  try {
    const response = await axiosIn.get(`doctor/doctor-profiles/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
  } catch (error) {
    throw error;
  }
};

export const uploadDoctorDocs = async (docId, formData, token) => {
  try {
    console.log(docId, formData, token);
    const response = await axiosIn.put(`doctor/doctor-profiles/${docId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response
  } catch (error) {
    throw error
  }
}

export const updateDoctorDocs = async (docId, formData, token) => {
  try {
    console.log(docId, formData, token);
    const response = await axiosIn.patch(`doctor/doctor-profiles/${docId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response
  } catch (error) {
    throw error
  }
}
