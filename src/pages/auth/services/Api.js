// service/api.js
import axios from 'axios';
import Swal from 'sweetalert2';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (userData) => {
  try {
    const response = await API.post('account/signup', userData);
    Swal.fire({
      title: "Account created successfully",
      text: "Your acount created successfully. \nPlease verify your account by the link that we send to your mail!",
      icon: "warning",
      timerProgressBar: true,
      toast: true,
      timer: 6000,
      position: 'center',
      showConfirmButton: false
    })
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('account/signin', credentials);
    Swal.fire({
      title: "User logged successfully",
      icon: "success",
      timerProgressBar: true,
      toast: true,
      timer: 3000,
      position: 'center',
      showConfirmButton: false
    })
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    throw error.response.data;
  }
};

export const fetchProfile = async (token) => {
  try {
    const response = await API.get('account/profile', {
      headers: {
        Authorization: `Berear ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    throw error.response.data;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await API.put('account/profile', userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    throw error.response.data;
  }
};

// Add other API calls as needed

export default API;
