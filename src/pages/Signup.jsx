import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdError } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import OAuth from '../components/OAuth';

export default function Signup() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [validationErr, setValidationErr] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const baseUrl = 'https://real-estate-back-nine.vercel.app'

  const handleChange = (e) => {
    setError(null)
    setValidationErr([])
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      // dispatch(signInStart())
      const { data } = await axios.post(`${baseUrl}/api/auth/sign-up`, formData)
      console.log(data);
      if (data.message === "Validation Err") {
        setValidationErr(data?.validationErr[0])
        // console.log(data.validationErr);
        setLoading(false)
        setError(null)
      }
      if (data.message === "Done") {
        navigate('/sign-in')
        setLoading(false)
        setError(null)
      }
    } catch (error) {
      setLoading(false)
      setError(error.response?.data)
    }
  }

  function sendKey(key) {
    // console.log(validationErr);
    const joiErr = validationErr?.find((err) => {
      return err.context.key == key
    })
    return joiErr;
  }

  return (
    <main className='d-flex justify-content-center align-items-center w-75 mx-auto'>
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      <div className='w-50 mt-4'>
        <h2 className='text-center fw-bold'>Sign Up</h2>
        <div className='mt-4'>
          <form onSubmit={handleSubmit} className='d-flex flex-column gap-2'>
            <div>
              <input onChange={handleChange} id='userName' type="text" className='mb-1 form-control border-0 shadow-sm p-2' placeholder='UserName' />
              {sendKey("userName") && <p className=' text-danger fw-semibold'><MdError /> in-valid userName </p>}
            </div>
            <div>
              <input onChange={handleChange} id='email' type="email" className='mb-1 form-control border-0 shadow-sm p-2' placeholder='Email' />
              {sendKey("email") && <p className='mt-1 text-danger fw-semibold'><MdError /> in-valid Email </p>}
            </div>
            <input onChange={handleChange} id='password' type="password" className='mb-1 form-control border-0 shadow-sm p-2' placeholder='Password' />
            {sendKey("password") && <p className=' text-danger fw-semibold'><MdError /> in-valid Password </p>}

            <button type='submit' className='btn btn-white signup-btn text-white mt-1'>{loading ? "Loading.." : "SIGN UP"}</button>
            {/* <button className='btn btn-danger signup-google mt-1'>SIGN UP WITH GOOGLE</button> */}
            <OAuth />
            <p className='fw-bold ' style={{ fontSize: "14px" }}>Have an account? <Link to={'/sign-in'} style={{ textDecoration: "underline" }}>Sign in</Link></p>
          </form>
        </div>
        {error != null && <p className='text-danger fw-semibold'><MdError /> in-valid email or password</p>}
      </div>
    </main>
  )
}
