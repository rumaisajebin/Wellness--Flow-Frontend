import { jwtDecode } from 'jwt-decode'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../../component/Layout'

const PatientHome = () => {

  return (
    <Layout>
      <div>
        <h1>patient</h1>
       <Link to={`/patient/profile`}><button className='btn btn-primary ms-2'>Profile</button></Link>
    </div>
    </Layout>
  )
}

export default PatientHome
