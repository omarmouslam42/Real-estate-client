import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaLocationDot } from "react-icons/fa6";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MdError } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user)
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contact, setContact] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const baseUrl = 'https://real-estate-back-nine.vercel.app'
  const headers = {
    "content-type": "application/json",
    "authorization": `bazoka_${localStorage.getItem("token")}`
  }
  const closeAfter7 = (text) => toast.success(text, { autoClose: 1500 });

  useEffect(() => {
    const handleListing = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/listing/getById/${id}`)
        // console.log(data);
        if (data.message === 'Done') {
          setListing(data.listing)
          setLoading(false)
          setError(false)
        }
      } catch (error) {
        // console.log(error);
        const { msgError } = error.response.data
        if (msgError) {
          setError("Sorry, it`s wrong with server")
        }
        setLoading(false)
      }

    }
    handleListing()
  }, [id])

  const handleContact = () => {
    if (currentUser) {
      setContact(true)
    }
    else {
      navigate('/sign-in')
    }
  }


  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${baseUrl}/api/listing/sendEmail`, { message }, { headers })
      // console.log(data);
      if (data.message === "Validation Err") {
        setError("Validation Err")
      }
      if (data.message === "Done") {
        closeAfter7("Done")
        setError(false)
      }
    } catch (error) {
      const { msgError } = error.response.data
      if (msgError) {
        setError("Sorry, it`s wrong with server")
      }
    }
  }
  // console.log(currentUser);
  return (
    <div className=''>

      {error === "Sorry, it`s wrong with server" && <h4 className='text-center mt-5'>Sorry, it`s wrong with server..</h4>}
      <ToastContainer autoClose={3000} />
      {loading === true && <div className='d-flex justify-content-center align-items-center'> <h4>Lodaing..</h4> </div>}
      {listing != null && <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade">
          <div className="carousel-inner">
            {listing.images?.map((item) => {
              return <div key={item} className={`carousel-item ${listing.images.indexOf(item) === 0 ? " active" : ""}`}>
                <img src={item} className="d-block w-100" style={{ height: "600px" }} alt="..." />
              </div>
            })}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className='my-3 container'>
          <h4 className='fw-bold'>{listing.name}- ${listing.regularPrice}/month</h4>
          <span className='d-flex text-success justify-content-start align items-center gap-1 '>
            <FaLocationDot />
            <p className='text-muted fw-bold '> {listing.address}</p>
          </span>
          <button className='btn btn-white text-white px-5 shadow-sm' style={{ backgroundColor: "rgb(156, 20, 20)" }}> {listing.type === "rent" ? "For Rent" : "For Sale"} </button>
          <p className='mt-2'> <span className='fw-semibold '>Description-</span> {listing.description} </p>
          <div className='d-flex justify-content-start align-items-center gap-4'>
            <span className='d-flex justify-content-start align-items-center gap-1 text-success fw-semibold'>
              <FaBed />
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
            </span>
            <span className='d-flex justify-content-start align-items-center gap-1 text-success fw-semibold'>
              <FaBath />
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
            </span>
            <span className='d-flex justify-content-start align-items-center gap-1 text-success fw-semibold'>
              <FaParking />
              {listing.parking == true ? "parking" : "not parking"}
            </span>
            <span className='d-flex justify-content-start align-items-center gap-1 text-success fw-semibold'>
              <FaChair />
              {listing.furnished == true ? "furnished" : "not furnished"}
            </span>
          </div>
          <div className='w-75 d-flex flex-column m-auto justify-content-center align-items-center gap-3'>
            {contact === false && currentUser?._id !== listing.createdBy && <button onClick={handleContact} className='btn btn-dark w-100  mt-3'>CONTACT US</button>}
            {contact === true && <textarea onChange={(e) => { setMessage(e.target.value) }} value={message} className='w-100 form-control shadow-sm mt-2' placeholder='Enter your Message Here...' rows="4"></textarea>}
            {contact === true && <div className='d-flex justify-content-start align-self-end gap-2 align-items-end '>
              <button onClick={() => {
                setContact(false)
                setError(false)
              }} className='btn btn btn-white text-white px-5' style={{ backgroundColor: "rgb(156, 20, 20)" }} >Cancle</button>
              <button onClick={handleSubmit} className='btn btn-white text-white px-5 shadow-sm' style={{ backgroundColor: "rgb(19, 19, 42)" }}>Send Message</button>
            </div>}
            {error === "Validation Err" && <p className='text-start text-danger align-self-start fw-semibold d-flex justify-content-center align-items-center gap-1 '><MdError /> in-valid Message</p>}
            {error === "Sorry, it`s wrong with server" && <p className='text-start text-danger align-self-start fw-semibold d-flex justify-content-center align-items-center gap-1 '><MdError /> error</p>}
          </div>


        </div>
      </div>}

    </div>
  )
}
