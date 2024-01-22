import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdAddCircleOutline } from "react-icons/io";
import { Helmet } from 'react-helmet';
import dotenv from "dotenv"
// dotenv.config("dotenv")


export default function Home() {

  const [offerData, setOfferData] = useState([])
  const [rentData, setRentData] = useState([])
  const [saleData, setSaleData] = useState([])
  const baseUrl='https://real-estate-back-nine.vercel.app'

  const navigate = useNavigate()
  useEffect(() => {
    const getDataWithOffer = async () => {
      const { data } = await axios.get(`${baseUrl}/api/listing/get?offer=true&limit=4`)
      // console.log(data);
      setOfferData(data.listing)
    }
    
    const getDataWithRent = async () => {
      const { data } = await axios.get(`${baseUrl}/api/listing/get?type=rent&limit=4`)
      // console.log(data);
      setRentData(data.listing)
    }

    const getDataWithSale = async () => {
      const { data } = await axios.get(`${baseUrl}/api/listing/get?type=sell&limit=4`)
      // console.log(data);
      setSaleData(data.listing)
    }

    getDataWithOffer()
    getDataWithRent()
    getDataWithSale()


  }, [])
  // console.log(offerData);

  return (
    <div>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className='container my-5'>
        <h1 className='w-50 fw-bolder'>Find your next <span className='text-muted'>perfect</span><br /> place with ease</h1>
        <p className='text-muted fw-bolder opacity-75' >Modern Estate will help you find your home fast, easy and comfortable. <br />Our expert support are always available.</p>

        <Link to={'/search'} className='fw-bold' style={{ color: "rgb(12, 12, 106)", textDecoration: "underline" }}> Let's Start now....</Link>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        style={{ height: "600px" }}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      // onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log('slide change')}
      >
        <SwiperSlide className='w-100' style={{ backgroundImage: `url(Luxury-house-design-Top-10-tips-to-add-luxury-to-your-house-FEATURE-compressed.jpg)`, height: "600px", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
        </SwiperSlide>
        <SwiperSlide className='w-100' style={{ backgroundImage: `url(22826-ModContemporary-Accents_w-GauntletGray-a-ok.jpg)`, height: "600px", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
        </SwiperSlide>
        <SwiperSlide className='w-100' style={{ backgroundImage: `url(istockphoto-488415010-170667a.jpg)`, height: "600px", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
        </SwiperSlide>
        <SwiperSlide className='w-100' style={{ backgroundImage: `url(Home-Alone-Airbnb-12-Exterior-Credit-Sarah-Crowley.webp)`, height: "600px", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
        </SwiperSlide>


      </Swiper>

      {/* <div className='container py-4 mx-auto '>
        <div>
          <h4 className='fw-bold opacity-75 '>Recent offers</h4>
          <Link to={'/search?offer=true'} className='fw-bold' style={{ fontSize: "14px", color: "rgb(169, 7, 158)", textDecoration: "underline" }}>show more offers</Link>
        </div>
        <div className=' d-flex flex-wrap justify-content-center align-items-center gap-2 mt-2'>
          {offerData?.map((item) => {
            return <div key={item._id} className="card shadow-sm border-0 " style={{ width: " 17rem" }}>
              <img src={item.images[0]} className="card-img-top card-hover" height={200} alt="card-img" />
              <div className="card-body">
                <h5 className='fw-bold line-clamp' style={{ cursor: "pointer" }}> <Link className='text-dark' to={`/listing/${item._id}`}>{item.name}</Link></h5>
                <p className='text-muted fw-semibold d-flex justify-content-start line-clamp align-items-center gap-1' style={{ fontSize: "14px" }}> <FaLocationDot className='text-success' /> Egypt-cairo</p>
                <p className="card-text text-muted fw-semibold lh-sm line-clamp" style={{ fontSize: "14px" }}>{item.description}</p>
                <span className='text-muted fw-semibold'>${item.regularPrice}/month</span>
                <div className='d-flex justify-content-start align-items-center gap-3 fw-bold' style={{ fontSize: "15px" }}>
                  <span>{item.bedrooms} {item.bedrooms > 1 ? "Beds" : "Bed"}</span>
                  <span>{item.bathrooms} {item.bathrooms > 1 ? "baths" : "Bath"}</span>
                </div>
              </div>
            </div>
          })}
        </div>
      </div> */}

      <div className='container my-4 '>
        <div className=''>
          <h4 className=' fw-bold opacity-75 '>Recent offers</h4>
          <Link to={'/search?offer=true'} className='fw-bold' style={{ fontSize: "14px", color: "rgb(169, 7, 158)", textDecoration: "underline" }}>show more offers</Link>
        </div>
        <div className='row  justify-content-start '>
          {offerData.length > 0 ? offerData.map((item) => {
            return <div key={item._id} className='p-2 col-sm-10 col-md-6 col-lg-3 '>
              <div className="card shadow-sm border-0 w-100 " >
                <img src={item.images[0]} className="card-img-top card-hover" height={200} alt="card-img" loading='lazy' />
                <div className="card-body">
                  <h5 className='fw-bold line-clamp' style={{ cursor: "pointer" }}> <Link className='text-dark' to={`/listing/${item._id}`}>{item.name}</Link></h5>
                  <p className='text-muted fw-semibold d-flex justify-content-start line-clamp align-items-center gap-1' style={{ fontSize: "14px" }}> <FaLocationDot className='text-success' /> {item.address}</p>
                  <p className="card-text text-muted fw-semibold lh-sm line-clamp" style={{ fontSize: "14px" }}>{item.description}</p>
                  <span className='text-muted fw-semibold'>${item.regularPrice}/month</span>
                  <div className='d-flex justify-content-start align-items-center gap-3 fw-bold' style={{ fontSize: "15px" }}>
                    <span>{item.bedrooms} {item.bedrooms > 1 ? "Beds" : "Bed"}</span>
                    <span>{item.bathrooms} {item.bathrooms > 1 ? "baths" : "Bath"}</span>
                  </div>
                </div>
              </div>
            </div>
          }) :
            <div className='col-md-3 my-3'>
              <div onClick={() => { navigate('/create-listing') }} className="card border shadow-sm p-4 w-50 gap-2 d-flex flex-column justify-content-center align-items-center" style={{ cursor: "pointer" }}>
                <IoMdAddCircleOutline className='text-primary' style={{ fontSize: "40px" }} />
                <p style={{ fontSize: "14px" }} className='fw-bold '>Add post</p>
              </div>
            </div>}
        </div>
      </div>
      <hr className=' mx-auto opacity-25 w-25' />


      <div className='container my-4 '>
        <div className=''>
          <h4 className=' fw-bold opacity-75 '>Recent places for rent</h4>
          <Link to={'/search?type=rent'} className='fw-bold' style={{ fontSize: "14px", color: "rgb(169, 7, 158)", textDecoration: "underline" }}>show more places for rent </Link>
        </div>
        <div className='row  justify-content-start'>
          {rentData.length > 0 ? rentData.map((item) => {
            return <div key={item._id} className='p-2 col-sm-10 col-md-6 col-lg-3 '>
              <div className="card shadow-sm border-0 w-100 " >
                <img src={item.images[0]} className="card-img-top card-hover" height={200} alt="card-img" loading='lazy' />
                <div className="card-body">
                  <h5 className='fw-bold line-clamp' style={{ cursor: "pointer" }}> <Link className='text-dark' to={`/listing/${item._id}`}>{item.name}</Link></h5>
                  <p className='text-muted fw-semibold d-flex justify-content-start line-clamp align-items-center gap-1' style={{ fontSize: "14px" }}> <FaLocationDot className='text-success' /> {item.address}</p>
                  <p className="card-text text-muted fw-semibold lh-sm line-clamp" style={{ fontSize: "14px" }}>{item.description}</p>
                  <span className='text-muted fw-semibold'>${item.regularPrice}/month</span>
                  <div className='d-flex justify-content-start align-items-center gap-3 fw-bold' style={{ fontSize: "15px" }}>
                    <span>{item.bedrooms} {item.bedrooms > 1 ? "Beds" : "Bed"}</span>
                    <span>{item.bathrooms} {item.bathrooms > 1 ? "baths" : "Bath"}</span>
                  </div>
                </div>
              </div>
            </div>
          }) :
            <div className='col-md-3 my-3'>
              <div onClick={() => { navigate('/create-listing') }} className="card border shadow-sm p-4 w-50 gap-2 d-flex flex-column justify-content-center align-items-center" style={{ cursor: "pointer" }}>
                <IoMdAddCircleOutline className='text-primary' style={{ fontSize: "40px" }} />
                <p style={{ fontSize: "14px" }} className='fw-bold '>Add post</p>
              </div>
            </div>
          }
        </div>
      </div>
      <hr className=' mx-auto opacity-25 w-25' />

      <div className='container my-4 '>
        <div className=''>
          <h4 className=' fw-bold opacity-75 '>Recent places for sale</h4>
          <Link to={'/search?type=sell'} className='fw-bold' style={{ fontSize: "14px", color: "rgb(169, 7, 158)", textDecoration: "underline" }}>show more places for sale</Link>
        </div>
        <div className='row  justify-content-start'>
          {saleData.length > 0 ? saleData.map((item) => {
            return <div key={item._id} className='p-2 col-sm-10 col-md-6 col-lg-3 '>
              <div className="card shadow-sm border-0 w-100 " >
                <img src={item.images[0]} loading='lazy' className="card-img-top card-hover" height={200} alt="card-img" />
                <div className="card-body">
                  <h5 className='fw-bold line-clamp' style={{ cursor: "pointer" }}> <Link className='text-dark' to={`/listing/${item._id}`}>{item.name}</Link></h5>
                  <p className='text-muted fw-semibold d-flex justify-content-start line-clamp align-items-center gap-1' style={{ fontSize: "14px" }}> <FaLocationDot className='text-success' />{item.address}</p>
                  <p className="card-text text-muted fw-semibold lh-sm line-clamp" style={{ fontSize: "14px" }}>{item.description}</p>
                  <span className='text-muted fw-semibold'>${item.regularPrice}/month</span>
                  <div className='d-flex justify-content-start align-items-center gap-3 fw-bold' style={{ fontSize: "15px" }}>
                    <span>{item.bedrooms} {item.bedrooms > 1 ? "Beds" : "Bed"}</span>
                    <span>{item.bathrooms} {item.bathrooms > 1 ? "baths" : "Bath"}</span>
                  </div>
                </div>
              </div>
            </div>
          }) :
            <div className='col-md-3 my-3'>
              <div onClick={() => { navigate('/create-listing') }} className="card border shadow-sm p-4 w-50 gap-2 d-flex flex-column justify-content-center align-items-center" style={{ cursor: "pointer" }}>
                <IoMdAddCircleOutline className='text-primary' style={{ fontSize: "40px" }} />
                <p style={{ fontSize: "14px" }} className='fw-bold '>Add post</p>
              </div>
            </div>}
        </div>
      </div>
    </div>

  )
}
