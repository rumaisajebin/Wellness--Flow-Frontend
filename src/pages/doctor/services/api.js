import axios from "axios";
import { BASE_URL } from "../../../axiosConfig";


const axiosIn = axios.create({
    baseURL: BASE_URL,
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
