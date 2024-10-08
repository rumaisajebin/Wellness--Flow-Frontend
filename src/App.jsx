import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingHome from "./pages/auth/LandingHome"; // Adjust path as per your project structure
import SignUp from "./pages/auth/SignUp"; // Adjust path as per your project structure
import LogIn from "./pages/auth/LogIn";
import DoctorHome from "./pages/doctor/DoctorHome";
import AdminHome from "./pages/admin/AdminHome";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorVerificationForm from "./pages/doctor/DoctorVerificationForm";
import DoctorUpdate from "./pages/doctor/DoctorUpdate";
import ListDoctors from "./pages/admin/ListDoctors";
import DoctorDetailView from "./pages/admin/DoctorDetailView";
import ProfileDetail from "./pages/patient/ProfileDetail";
import PatientHome from "./pages/patient/PatientHome";
import ListPatients from "./pages/admin/ListPatients";
import PatientDetailView from "./pages/admin/PatientDetailView";
import { useSelector } from "react-redux";
import ProfileUpdate from "./pages/patient/ProfileUpdate";
import PatientProfileCreate from "./pages/patient/PatientProfileCreate";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorList from "./pages/patient/DoctorList";
import DoctorView from "./pages/patient/DoctorView";
import ConfirmBooking from "./pages/patient/ConfirmBooking";
import BookingList from "./pages/patient/BookingList";
import ConfirmBookingSlots from "./pages/doctor/ConfirmBookingSlots";
import PaymentSuccess from "./pages/patient/PaymentSuccess";
import PaymentCancel from "./pages/patient/PaymentCancel ";
import TransactionHistory from "./pages/patient/TransactionHistory";
import DoctorTransactionHistory from "./pages/doctor/TransactionHistory";
// import VideoCall from "./pages/doctor/VideoCall";
import TodayAppointments from "./pages/doctor/TodayAppointments";
import NotificationPage from "./component/NotificatioPage";
import Chat from "./pages/common/Chat";
import VideoCall from "./pages/common/VideoCall";
// import VideoCall from "./pages/common/VideoCall";
// import Chat from "./pages/doctor/Chat";

const App = () => {
  const {isLogged, role} = useSelector((state) => state.auth)
  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/signin" element={<LogIn />} />
          <Route exact path="/" element={<LandingHome />} />

          <Route exact path="/patient" element={isLogged && role === 'patient' ? <PatientHome /> : <Navigate to={'/signin'} />} />
          <Route exact path="/patient/profile" element={isLogged && role === 'patient' ? <ProfileDetail /> : <Navigate to={'/signin'} />} />
          <Route exact path="/patient/profile/update" element={isLogged && role === 'patient' ? <ProfileUpdate /> : <Navigate to={'/signin'} />} />
          <Route exact path="/patient/profile/create" element={isLogged && role === 'patient' ? <PatientProfileCreate /> : <Navigate to={'/signin'} />} />
          <Route exact path="/patient/list-doctors" element={isLogged && role === 'patient' ? <DoctorList /> : <Navigate to={'/signin'} />} />
          <Route exact path="/patient/view-doctor/:doctorId" element={isLogged && role === 'patient' ? <DoctorView /> : <Navigate to={'/signin'} />} />
          <Route exact path="/patient/confirm-booking" element={isLogged && role === "patient" ? <ConfirmBooking /> : <Navigate to={"/signin"} />} />
          <Route exact path="/patient/booking-list" element={isLogged && role === "patient" ? <BookingList /> : <Navigate to={"/signin"} />} />
          <Route exact path="/patient/payment-success" element={isLogged && role === "patient" ? <PaymentSuccess /> : <Navigate to={"/signin"} />} />
          <Route exact path="/patient/payment-cancel" element={isLogged && role === "patient" ? <PaymentCancel /> : <Navigate to={"/signin"} />} />
          <Route exact path="/patient/transactions" element={isLogged && role === "patient" ? <TransactionHistory /> : <Navigate to={"/signin"} />} />

          <Route exact path="/doctor" element={isLogged && role === 'doctor' ? <DoctorHome />: <Navigate to={'/signin'} />} />
          <Route exact path="/doctor/completion" element={isLogged && role === 'doctor' ?<DoctorVerificationForm />  : <Navigate to={'/signin'}  />} />
          <Route exact path="/doctor/profile" element={isLogged && role === 'doctor' ?<DoctorProfile />: <Navigate to={'/signin'}  />} />
          <Route exact path="/doctor/profile/update" element={isLogged && role === 'doctor' ?<DoctorUpdate />  : <Navigate to={'/signin'}  />} />
          <Route exact path="/doctor/appoinment" element={isLogged && role === 'doctor' ?<DoctorSchedule /> : <Navigate to={'/signin'}  />} />
          <Route exact path="/doctor/Confirm-BookingSlots" element={isLogged && role === 'doctor' ?<ConfirmBookingSlots /> : <Navigate to={'/signin'}  />} />
          <Route exact path="/doctor/transactions" element={isLogged && role === 'doctor' ?<DoctorTransactionHistory /> : <Navigate to={'/signin'}  />} />
          <Route exact path="/doctor/todayappointments" element={isLogged && role === 'doctor' ?<TodayAppointments /> : <Navigate to={'/signin'}  />} />
          
          {/* <Route exact path="/doctor/videocall" element={isLogged && role === 'doctor' ?<VideoCall /> : <Navigate to={'/signin'}  />} /> */}
          <Route exact path="/videocall/:room_name" element={<VideoCall />} />
          <Route exact path="/notification" element={<NotificationPage />} />
          <Route exact path="/chat" element={<Chat />} />

          <Route exact path="/admin"  element={isLogged && role === 'admin' ? <AdminHome /> : <Navigate to={'/signin'} />}/>
          <Route exact path="/admin/list_patients" element={isLogged && role === 'admin' ? <ListPatients /> : <Navigate to={'/signin'} />} />
          <Route exact path="/admin/patient-view/:id" element={isLogged && role === 'admin' ? <PatientDetailView /> : <Navigate to={'/signin'} />} />
          <Route exact path="/admin/list_doctors" element={isLogged && role === 'admin' ? <ListDoctors /> : <Navigate to={'/signin'} />} />
          <Route exact path="/admin/doctor-view/:id" element={isLogged && role === 'admin' ? <DoctorDetailView /> : <Navigate to={'/signin'} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
  