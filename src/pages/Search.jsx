import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { FaLongArrowAltRight } from "react-icons/fa";
import { Helmet } from 'react-helmet';

export default function Search() {
    const [listing, setListing] = useState([])
    const [error, setError] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const [limit, setLimit] = useState(6)
    const [searchInputs, setSearchInputs] = useState({
        searchKey: "",
        type: "all",
        offer: false,
        parking: false,
        furnished: false,
        sort: "createdAt",
        order: "desc"
    })
    const headers = {
        "content-type": "application/json",
    }
    const navigate = useNavigate()
    const handleChange = (e) => {
        if (e.target.id == "rent" || e.target.id == "sell" || e.target.id == "all") {
            setSearchInputs({ ...searchInputs, type: e.target.id })
        }
        if (e.target.id == "searchKey") {
            setSearchInputs({ ...searchInputs, searchKey: e.target.value })
        }
        if (e.target.id == "parking" || e.target.id == "furnished" || e.target.id == "offer") {
            setSearchInputs({ ...searchInputs, [e.target.id]: e.target.checked })
        }
        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "createdAt"
            const order = e.target.value.split("_")[1] || "desc"
            setSearchInputs({ ...searchInputs, sort, order })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = new URLSearchParams();
        url.set("searchKey", searchInputs.searchKey);
        url.set("type", searchInputs.type);
        url.set("parking", searchInputs.parking);
        url.set("offer", searchInputs.offer);
        url.set("furnished", searchInputs.furnished);
        url.set("order", searchInputs.order);
        url.set("sort", searchInputs.sort);
        const searchQuery = url.toString()
        // console.log(`$${searchQuery}`);
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const url = new URLSearchParams(location.search)
        const searchKey = url.get("searchKey");
        const type = url.get("type");
        const parking = url.get("parking");
        const offer = url.get("offer");
        const furnished = url.get("furnished");
        const order = url.get("order");
        const sort = url.get("sort");
        url.set("limit", limit);
        const searchQery = url.toString()
        navigate(`/search?${searchQery}`);
        // console.log(searchKey);
        if (searchKey || type || offer || furnished || order || sort || parking) {
            setSearchInputs({
                searchKey: searchKey || "",
                type: type || "all",
                parking: parking === "true" ? true : false,
                offer: offer === "true" ? true : false,
                furnished: furnished === "true" ? true : false,
                order: order || "desc",
                sort: sort || "createdAt"
            })
        }
        const getData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/listing/get?${searchQery}`, { headers })
                // console.log(data.listing.length);
                // console.log(data.listing);
                setListing(data.listing)
                if (data.listing.length > limit - 1) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }

            } catch (error) {
                // console.log(error);
                const { msgError } = error.response.data
                setError(msgError)
            }
        }
        getData()
    }, [location.search, limit])


    return (
        <div className='pe-3'>
            <Helmet>
                <title>Real-Estate</title>
            </Helmet>
            <div className='row vh-100'>
                <div className='col-md-4 '>
                    <form onSubmit={handleSubmit} className='h-100  border-end overflow-hidden p-4 d-flex flex-column flex-wrap gap-4  shadow-sm '>
                        <div className='d-flex flex-wrap justify-content-between align-items-center'>
                            <label className='fw-semibold'>Search Term:</label>
                            <input onChange={handleChange} value={searchInputs.searchKey} id='searchKey' type="text " className='w-75 form-control shadow-sm' />
                        </div>
                        <div className='d-flex justify-content-start flex-wrap align-items-center'>
                            <span className='fw-semibold'>Type:</span>
                            <div className="form-check ms-2">
                                <input onChange={handleChange} className="form-check-input shadow-sm" checked={searchInputs.type === "all"} type="checkbox" id="all" />
                                <label className="form-check-label" htmlFor="all">
                                    Rent&Sale
                                </label>
                            </div>
                            <div className="form-check ms-2">
                                <input onChange={handleChange} className="form-check-input shadow-sm" type="checkbox" checked={searchInputs.type === "rent"} id="rent" />
                                <label className="form-check-label" htmlFor="rent">
                                    Rent
                                </label>
                            </div>
                            <div className="form-check ms-2">
                                <input onChange={handleChange} className="form-check-input shadow-sm" type="checkbox" checked={searchInputs.type === "sell"} id="sell" />
                                <label className="form-check-label" htmlFor="sell">
                                    sell
                                </label>
                            </div>
                            <div className="form-check ms-2">
                                <input onChange={handleChange} className="form-check-input shadow-sm" checked={searchInputs.offer} type="checkbox" id="offer" />
                                <label className="form-check-label" htmlFor="offer">
                                    Offer
                                </label>
                            </div>
                        </div>

                        <div className='d-flex justify-content-start flex-wrap align-items-center'>
                            <span className='fw-semibold'>Amenities:</span>
                            <div className="form-check ms-2">
                                <input onChange={handleChange} className="form-check-input shadow-sm" checked={searchInputs.parking} type="checkbox" id="parking" />
                                <label className="form-check-label" htmlFor="parking">
                                    Parking
                                </label>
                            </div>
                            <div className="form-check ms-2">
                                <input onChange={handleChange} className="form-check-input shadow-sm" checked={searchInputs.furnished} type="checkbox" id="furnished" />
                                <label className="form-check-label" htmlFor="furnished">
                                    Furnished
                                </label>
                            </div>
                        </div>

                        <div className='d-flex justify-content-start align-items-center gap-2'>
                            <span className='fw-semibold'>Sort:</span>
                            <select onChange={handleChange} defaultValue={"createdAt_desc"} className="form-select w-50 shadow-sm" id="sort_order">
                                <option value="regularPrice_desc">Price high to low</option>
                                <option value="regularPrice_asc">Price low to high </option>
                                <option value="createdAt_desc">Latest</option>
                                <option value="createdAt_asc">Oldest</option>
                            </select>

                        </div>
                        <button type='submit' className='btn btn-dark mt-4'>Search</button>
                    </form>
                </div>
                <div className='col-md-8 py-2 '>
                    <div className='  d-flex flex-column justify-content-center align-items-center '>
                        <div className='w-100'>
                            <h4 className='fw-bold mt-3'>Listing results:</h4>
                            <div className='mt-4 d-flex flex-wrap justify-content-center justify-content-md-start  align-items-center gap-2 '>
                                {listing.length ? listing.map((item) => {
                                    return <div key={item._id} className="card shadow-sm border-0 " style={{ width: " 18rem" }}>
                                        <img src={item.images[0]} className="card-img-top card-hover" height={200} alt="card-img" />
                                        <div className="card-body">
                                            <h5 className='fw-bold ' style={{ cursor: "pointer" }}> <Link className='text-dark' to={`/listing/${item._id}`}>{item.name}</Link></h5>
                                            <p className='text-muted fw-semibold d-flex justify-content-start align-items-center gap-1' style={{ fontSize: "14px" }}> <FaLocationDot className='text-success' /> Egypt-cairo</p>
                                            <p className="card-text text-muted fw-semibold lh-sm line-clamp" style={{ fontSize: "14px" }}>{item.description}</p>
                                            <span className='text-muted fw-semibold'>${item.regularPrice}/month</span>
                                            <div className='d-flex justify-content-start align-items-center gap-3 fw-bold' style={{ fontSize: "15px" }}>
                                                <span>{item.bedrooms} {item.bedrooms > 1 ? "Beds" : "Bed"}</span>
                                                <span>{item.bathrooms} {item.bathrooms > 1 ? "baths" : "Bath"}</span>
                                            </div>
                                        </div>
                                    </div>
                                }) :
                                    <p className='fw-bold fs-5 text-muted mx-auto'>Not Found</p>}
                            </div>
                        </div>
                        {showMore === true && <div className='w-100 d-flex justify-content-center mt-2 align-items-center'>
                            <span onClick={() => {
                                setLimit(limit + 6)
                                // getMore(6)
                            }} className='bg-danger p-2 rounded fw-semibold  shadow text-white' style={{ cursor: "pointer" }} >show more <FaLongArrowAltRight /> </span>
                        </div>}

                    </div>
                </div>
            </div>
        </div>
    )
}
