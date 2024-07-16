import React from 'react'
import Layout from '../../component/Layout'
import { Link } from 'react-router-dom'

const DoctorHome = () => {
  return (
    <Layout>
        <h1>Doctor</h1>
        <Link to={'/profile'}><button>Profile</button></Link>
    </Layout>
  )
}

export default DoctorHome
