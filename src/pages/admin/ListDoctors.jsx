import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from "../doctor/services/doctoSlice";
import { getUserIdFromLocalStorage } from "../../utils/auth";
import Layout from '../../component/Layout';

const ListDoctors = () => {
  const dispatch = useDispatch();
  const doctors = useSelector(state => state.doctor.doctors || []);
  const status = useSelector(state => state.doctor.status);
  const error = useSelector(state => state.doctor.error);
  const token = JSON.parse(localStorage.getItem("access").replace(/\\\"/g, '"'));

  useEffect(() => {
    if (token) {
      dispatch(fetchDoctors(token));
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
      <h1>List of Doctors</h1>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul>
          {doctors.map(doctor => (
            <li key={doctor.id}>
              <strong>{doctor.user.email}</strong> - {doctor.specialization}
              <strong>{doctor.full_name}</strong> - {doctor.specialization}
              {/* <button>verify</button> */}
            </li>
          ))}
        </ul>
      )}
      </div>
    </Layout>
  );
};

export default ListDoctors;
