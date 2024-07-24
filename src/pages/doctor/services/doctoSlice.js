import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../axiosConfig";

const INITIAL_STATE = {
  doctors: [],
  doctor: {},
  status: "idle",
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (token) => {
    const response = await axios.get(`${BASE_URL}doctor/doctor-profiles/`,{
        headers:{
            Authorization: `Bearer ${token}`,
        }
    });
    console.log(response);
    return response.data;
  }
);

export const createDoctor = createAsyncThunk(
  "doctor/createDoctor",
  async ({ formData, token }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}doctor/doctor-profiles/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating doctor:", error.response);
      throw error;
    }
  }
);

export const fetchDoctor = createAsyncThunk(
  "doctor/fetchDoctor",
  async (id) => {
    const response = await axios.get(
      `${BASE_URL}doctor/doctor-profiles/${id}/`
    );
    console.log("id", id);
    console.log(response.data);
    return response.data.data;
  }
);

export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ id, doctorData }) => {
    const response = await axios.put(
      `${BASE_URL}doctor/doctor-profiles/${id}/update/`,
      doctorData
    );
    return response.data.data;
  }
);

export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (id) => {
    await axios.put(`${BASE_URL}doctor/doctor-profiles/${id}/delete/`);
    return id;
  }
);

export const verifyDoctor = createAsyncThunk(
  "doctor/verifyDoctor",
  async (id) => {
    await axios.put(`${BASE_URL}doctor/doctor-profiles/${id}/verify/`);
    return id;
  }
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: INITIAL_STATE,
  reducers: {
    setDoctorField: (state, action) => {
      const { field, value } = action.payload;
      state.doctor[field] = value;
    },
    setDoctorData: (state, action) => {
      state.doctor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.doctors.push(action.payload);
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchDoctor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDoctor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.doctor = action.payload;
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctors.findIndex(
          (doctor) => doctor.id === action.payload.id
        );
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(
          (doctor) => doctor.id !== action.payload
        );
      })
      .addCase(verifyDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(
          (doctor) => doctor.id !== action.payload
        );
      });
  },
});

export const { setDoctorField, setDoctorData } = doctorSlice.actions;

export default doctorSlice.reducer;
