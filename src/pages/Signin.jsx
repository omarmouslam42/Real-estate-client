import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdError } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { Filure, Start, Success, Validation } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function () {
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()
  const { error, loading, validationErr } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const baseUrl = 'https://real-estate-back-nine.vercel.app'

  const handleChange = (e) => {
    dispatch(Filure(null))
    dispatch(Validation([]))
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true)
      dispatch(Start())
      const { data } = await axios.post(`${baseUrl}/api/auth/sign-in`, formData)
      // console.log(data);
      if (data.message === "Validation Err") {
        dispatch(Validation(data.validationErr[0]))
      }
      if (data.message == "Done") {
        dispatch(Success(data.user))
        localStorage.setItem("token", data.token)
        navigate('/')
      }

    } catch (error) {
      const { msgError } = error.response.data
      dispatch(Filure(msgError))
    }
  }

  function sendKey(key) {
    const joiErr = validationErr?.find((err) => {
      return err.context.key == key
    })
    return joiErr;
  }
  return (
    <main className='d-flex justify-content-center align-items-center w-75 mx-auto'>
      <div className='w-50 mt-4'>
        <h2 className='text-center fw-bold'>Sign in</h2>
        <div className='mt-4'>
          <form onSubmit={handleSubmit} className='d-flex flex-column gap-3' >
            <div>
              <input onChange={handleChange} id='email' type="email" className='form-control border-0 shadow-sm p-2' placeholder='Email' />
              {sendKey("email") && <p className='text-danger fw-semibold'><MdError /> in-Valid Email </p>}
            </div>
            <div>
              <input onChange={handleChange} id='password' type="password" className='form-control border-0 shadow-sm p-2' placeholder='Password' />
              {sendKey("password") && <p className='text-danger fw-semibold'><MdError /> in-Valid Password </p>}
            </div>
            <button type='submit' className='btn btn-white signup-btn text-white'>{loading ? "Loading..." : "SIGN IN"}</button>
            <OAuth />
            <p className='fw-bold' style={{ fontSize: "14px" }}>Don't have an account? <Link to={'/sign-up'} style={{ textDecoration: "underline" }}>Sign up</Link></p>
          </form>
        </div>
        {error != null && <p className='text-danger fw-semibold'><MdError /> in-valid email or password</p>}
      </div>
    </main>
  )
}
