import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { IoHomeSharp } from "react-icons/io5";

export default function Header() {
    const { currentUser } = useSelector((state) => state.user)
    const [searchKey, setSearchKey] = useState("")
    const navigate = useNavigate()

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        const urlparams = new URLSearchParams(window.location.search)
        urlparams.set('searchKey', searchKey);
        const search = urlparams.toString();
        navigate(`/search?${search}`)
    }

    useEffect(() => {
        const url = new URLSearchParams(window.location.search)
        // console.log(url);
        const searchTerm = url.get('searchKey')
        if (searchTerm) {
            setSearchKey(searchTerm)
        }
    }, [location.search]);




    return (
        <nav className="navbar navbar-expand-lg  p-3 shadow-sm" style={{ backgroundColor: "#c9dae0" }}>
            <div className="container-fluid ">
                <Link className="navbar-brand fw-bold d-flex justify-content-start align-items-center" to="/"><span className='text-muted'> <IoHomeSharp style={{ fontSize: "22px" }} className='text-success mb-1' /> Modern</span>-Estate</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <form onSubmit={handleSubmitSearch} className="d-flex justify-content-between rounded shadow-sm align-items-center m-auto bg-white w-25" role="search">
                        <input onChange={(e) => { setSearchKey(e.target.value) }} className="form-control border-0  rounded-0 rounded-start" type="search" placeholder="Search..." aria-label="Search" />
                        <button className="btn btn-white " type="submit"><FaSearch /></button>
                    </form>

                    <ul className="navbar-nav  mb-2 mb-lg-0 me-5">
                        <li className="nav-item">
                            <Link className="nav-link fw-bold" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold  mx-1" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-bold" to="profile">
                                {currentUser ?
                                    <img src={currentUser.avatar.slice("/")} className='rounded-circle' style={{ width: "30px", height: "30px" }} alt="profile img" />
                                    :
                                    <p> Sign in</p>
                                    }
                            </Link>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    )
}
