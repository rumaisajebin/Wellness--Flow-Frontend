import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../axiosConfig";

const INITIAL_STATE = {
  patients: [],
  patient: {},
  status: "idle",
  error: null,
};

export const fetchPatients = createAsyncThunk(
  "patient/fetchPatients",
  async (token) => {
    const response = await axios.get(`${BASE_URL}patient/patient-profiles/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const createPatient = createAsyncThunk(
  "patient/createPatient",
  async ({ formData, token }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}patient/patient-profiles/`,
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
      console.error("Error creating patient:", error.response);
      throw error;
    }
  }
);

export const fetchPatient = createAsyncThunk(
  "patient/fetchPatient",
  async (id) => {
    const response = await axios.get(
      `${BASE_URL}patient/patient-profiles/${id}/`
    );
    return response.data.data;
  }
);

export const updatePatient = createAsyncThunk(
  "patient/updatePatient",
  async ({ id, patientData }) => {
    const response = await axios.put(
      `${BASE_URL}patient/patient-profiles/${id}/update/`,
      patientData
    );
    return response.data.data;
  }
);

export const deletePatient = createAsyncThunk(
  "patient/deletePatient",
  async (id) => {
    await axios.delete(`${BASE_URL}patient/patient-profiles/${id}/delete/`);
    return id;
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState: INITIAL_STATE,
  reducers: {
    setPatientField: (state, action) => {
      const { field, value } = action.payload;
      state.patient[field] = value;
    },
    setPatientData: (state, action) => {
      state.patient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPatient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.patient = action.payload;
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.patients.findIndex(
          (patient) => patient.id === action.payload.id
        );
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.patients = state.patients.filter(
          (patient) => patient.id !== action.payload
        );
      });
  },
});

export const { setPatientField, setPatientData } = patientSlice.actions;

export default patientSlice.reducer;
