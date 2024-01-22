import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import axios from 'axios'
import { DeleteUser, Filure, Start, Success, Validation } from '../redux/user/userSlice'
import { MdError } from 'react-icons/md'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'


export default function Profile() {
  const { currentUser, validationErr, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadErr, setFileUploadErr] = useState(false)
  const [formData, setFormData] = useState({})
  const [userListing, setUserListing] = useState([])
  const [userListingErr, setUserListingErr] = useState(false)
  const dispatch = useDispatch()
  const closeAfter7 = (text) => toast.success(text, { autoClose: 1500 });
  const headers = {
    "content-type": "application/json",
    "authorization": `bazoka_${localStorage.getItem("token")}`
  }
  const navigate = useNavigate()
  const baseUrl='http://localhost:5000'
  const handleChange = (e) => {
    dispatch(Filure(null))
    dispatch(Validation([]))
    setFormData({ ...FormData, [e.target.id]: e.target.value })
  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // console.log(progress);
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadErr(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl })
        })
      }
    )
  }

  function sendKey(key) {
    const joiErr = validationErr?.find((err) => {
      return err.context.key == key
    })
    return joiErr;
  }

  useEffect(() => {
    dispatch(Filure(null))
    dispatch(Validation([]))
    if (file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleSubmit = async (e) => {
    // console.log(`bazoka_${localStorage.getItem("token")}`);
    e.preventDefault()

    try {
      dispatch(Start())
      const { data } = await axios.put(`${baseUrl}/api/user/updateUser/${currentUser._id}`,
        formData,
        { headers }
      )
      console.log(data);
      if (data.message == "Validation Err") {
        dispatch(Validation(data?.validationErr[0]))
      }
      if (data.message == "update is Done") {
        dispatch(Success(data.user))
        closeAfter7("updated")
      }
    } catch (error) {
      // console.log(error);
      const { msgError } = error.response.data
      dispatch(Filure(msgError))
    }
  }

  const deleteAccount = async () => {
    try {
      const { data } = await axios.delete(`${baseUrl}/api/user/deleteUser/${currentUser._id}`,
        { headers })
      // console.log(data);
      if (data.message == "Validation Err") {
        dispatch(Validation(data?.validationErr[0]))
      }
      if (data.message == "Done") {
        dispatch(DeleteUser())
        localStorage.removeItem("token")
      }
    } catch (error) {
      // console.log(error);
      const { msgError } = error.response.data
      dispatch(Filure(msgError))
    }
  }


  const signOut = () => {
    dispatch(DeleteUser())
    localStorage.removeItem("token")
  }

  const handleUserListing = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/listing/userListing`, { headers })
      // console.log(data);
      if (data.message == "Done") {
        setUserListing(data.listing)
      }
    } catch (error) {
      // console.log(error);
      // console.log(error);
      const { msgError } = error.response.data
      setUserListingErr(msgError)
    }
  }

  const handleDeleteListing = async (id) => {
    try {
      const { data } = await axios.delete(`${baseUrl}/api/listing/deleteListing/${id}`, { headers })
      // console.log(data);
      if (data.message == "Done") {
        handleUserListing()
        closeAfter7("Deleted")
        setUserListingErr(false)
      }
    } catch (error) {
      // console.log(error);
      const { msgError } = error.response.data
      setUserListingErr(msgError)
    }
  }




  return (
    <div>
      <Helmet>
        <title>profile</title>
      </Helmet>
      <div className=' w-50 mx-auto mt-4 mb-2 d-flex flex-column justify-content-center align-items-center'>
        <h3 className='text-center fw-bold'>Profile</h3>
        <div className='w-50 mx-auto d-flex flex-column justify-content-center align-items-center mt-3'>
          <input onChange={(e) => { setFile(e.target.files[0]) }} type="file" hidden ref={fileRef} accept='image/*' />
          <img onClick={() => { fileRef.current.click() }} style={{ cursor: "pointer",width:"60px",height:"60px" }} src={formData.avatar || currentUser.avatar}
            className=' rounded-circle' alt="profile img" />
          <p className='mt-2'>
            {
              filePerc > 0 > 100 ? <span className='fw-semibold '>Uploading{filePerc}%</span> :
                fileUploadErr ? <span className='text-danger fw-semibold '> Error Image upload(image must be less than 2mb)</span>
                  : filePerc == 100 ? <span className='text-success fw-semibold '>upload image!</span> : ""
            }
          </p>
        </div>
        <form onSubmit={handleSubmit} className='w-75 d-flex flex-column gap-2 mt-2'>
          <input onChange={handleChange} defaultValue={currentUser?.userName} type="text" placeholder='name' id='userName' className='form-control shadow-sm' />
          {sendKey("userName") && <p className='text-danger fw-semibold'><MdError /> in-Valid userName </p>}
          <input onChange={handleChange} defaultValue={currentUser.email} type="email" placeholder='email' id='email' className='form-control shadow-sm' />
          {sendKey("email") && <p className='text-danger fw-semibold'><MdError /> in-Valid Email </p>}
          <input onChange={handleChange} type="password" placeholder='password' id='password' className='form-control shadow-sm' />
          {sendKey("password") && <p className='text-danger fw-semibold'><MdError /> in-Valid Password (length must be at least 4 characters) </p>}
          <button type='submit' className='btn btn-white text-white' style={{ backgroundColor: "rgb(19, 19, 42)" }}>{loading ? "LOADING..." : "UPDATE"}</button>
          <button type='button' onClick={() => { navigate("/create-listing") }} className='btn btn-white text-white' style={{ backgroundColor: "#136631" }}>CREATE LISTING</button>
        </form>
        {error != null && <p className='text-danger fw-semibold'><MdError /> in-valid information</p>}

        <div className='d-flex justify-content-between align-items-center w-75 mt-2  fw-semibold'>
          <span onClick={deleteAccount} style={{ cursor: "pointer" }} className='text-danger '>Delete Account</span>
          <span onClick={signOut} style={{ cursor: "pointer" }} className='text-danger'>Sign Out</span>
        </div>
        <span onClick={handleUserListing} style={{ cursor: "pointer" }} className='text-center fw-bold text-success mt-4 border rounded shadow-sm p-2'>Show Listings</span>
        {userListing.length > 0 && <div className='mt-4 w-75'>
          <h4 className='text-center fw-bold mb-4'>Your listing</h4>
          {userListingErr && <p className='text-center text-danger fw-semibold'> {userListingErr}</p>}

          <div className='d-flex flex-column gap-2'>
            {userListing.map((listing) => {
              return <div key={listing._id} className=' d-flex justify-content-between align-items-center border p-2 rounded shadow-sm'>
                <div className='d-flex justify-content-center align-items-center'>
                  <img src={listing.images[0]} style={{ width: "85px" }} alt="" />
                  <p style={{ cursor: "pointer" }} onClick={() => { navigate(`/listing/${listing._id}`) }} className='ms-2 fw-semibold'>{listing.name}</p>
                </div>
                <div className='d-flex flex-column gap-2'>
                  <button onClick={() => { handleDeleteListing(listing._id) }} className='btn btn-outline-danger'>Delete</button>
                  <button onClick={() => { navigate(`/edit/${listing._id}`) }} className='btn btn-outline-primary'>Edite</button>
                </div>
              </div>
            })}

          </div>
        </div>}
      </div>
      <ToastContainer autoClose={3000} />

    </div>
  )
}
