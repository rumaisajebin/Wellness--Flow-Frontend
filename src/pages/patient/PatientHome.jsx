import React from 'react'
import { Link } from 'react-router-dom'
import PatientLayout from '../../component/PatientLayout'

const PatientHome = () => {

  return (
    <PatientLayout>
      <div>
        <h1>patient</h1>
       <Link to={`/patient/profile`}><button className='btn btn-primary ms-2'>Profile</button></Link>
    </div>
    </PatientLayout>
  )
}

export default PatientHome
