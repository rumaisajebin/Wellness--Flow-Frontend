import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from "../patient/serivices/patientSlice";
import Layout from '../../component/Layout';

const ListPatients = () => {
  const dispatch = useDispatch();
  const patients = useSelector(state => state.patient.patients || []);
  const status = useSelector(state => state.patient.status);
  const error = useSelector(state => state.patient.error);
  const token = JSON.parse(localStorage.getItem("access").replace(/\\\"/g, '"'));

  useEffect(() => {
    if (token) {
      dispatch(fetchPatients(token));
    }
  }, [dispatch, token]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div className='display-block'>
        <h1>List of Patients</h1>
        {patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <ul>
            {patients.map(patient => (
              <li key={patient.id}>
                <strong>{patient.user.email}</strong> - {patient.specialization}
                <strong>{patient.full_name}</strong> - {patient.specialization}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default ListPatients;
