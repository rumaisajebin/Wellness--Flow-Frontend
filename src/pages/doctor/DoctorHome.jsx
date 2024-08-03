import React from 'react'
import { Link } from 'react-router-dom'
import DoctorLayout from '../../component/DoctorLayout'

const DoctorHome = () => {
  return (
    <DoctorLayout>
        <h1>Doctor</h1>
        {/* <Link to={'profile'}><button className='btn btn-primary ms-2'>Profile</button></Link> */}
    </DoctorLayout>
  )
}

export default DoctorHome
