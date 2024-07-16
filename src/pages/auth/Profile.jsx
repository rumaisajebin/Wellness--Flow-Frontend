import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileSelect, ProfileUpdate } from '../auth/services/slice/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status, error, access } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(ProfileSelect(access));
  }, [dispatch]);

  const handleUpdate = (updatedData) => {
    dispatch(ProfileUpdate(updatedData));
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Profile Details</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      {/* Render additional profile fields as needed */}
      <button onClick={() => handleUpdate({ username: 'Updated Username' })}>
        Update Username
      </button>
      {/* Add form inputs or components to update other fields */}
    </div>
  );
};

export default Profile;
