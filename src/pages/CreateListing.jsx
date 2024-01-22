import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { app } from '../firebase'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

export default function CreateListing() {
    const [files, setFiles] = useState([])
    const [imagesErr, setImagesErr] = useState(false)
    const [formData, setFormData] = useState({
        images: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bathrooms: 1,
        bedrooms: 1,
        furnished: true,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
    })
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [submit, setSubmit] = useState(false)
    const [validationErr, setValidatinErr] = useState(null)
    const baseUrl='https://real-estate-back-nine.vercel.app'
    
    const headers = {
        "content-type": "application/json",
        "authorization": `bazoka_${localStorage.getItem("token")}`
    }
    const closeAfter7 = (text) => toast.success(text, { autoClose: 1500 });
    const navigate = useNavigate()

    const handleImages = () => {
        const images = []
        setValidatinErr(null)
        if (files.length > 0 && files.length + formData.images.length < 7) {
            setUploading(true)
            for (const file of files) {
                images.push(storageImages(file))
            }
            Promise.all(images).then((urls) => {
                setFormData({ ...formData, images: [...formData.images, urls] })
                setUploading(false)
                setImagesErr(false)
            }).catch((err => {
                setImagesErr('images upload failed (2 bm max)')
                setUploading(false)
            }))
        }
        else {
            setImagesErr('max upload 6 images')
            setUploading(false)
        }
        console.log(formData)
    }

    const storageImages = (file) => {
        return new Promise((reslove, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    // console.log(progress);
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        reslove(downloadURL);
                    })
                })
        })
    }

    const deleteImage = (img) => {
        const newImages = formData.images.filter((url) => {
            return url !== img
        })
        setFormData({ ...formData, images: newImages })
    }

    const handleData = (e) => {
        setError(false)
        setSubmit(false)
        if (e.target.id === "rent" || e.target.id === "sell") {
            setFormData({ ...formData, type: e.target.id })
        }
        if (e.target.id === "offer" || e.target.id === "furnished" || e.target.id === "parking") {
            setFormData({ ...formData, [e.target.id]: e.target.checked })
        }
        if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }
    }


    const handleSubmit = async () => {
        // console.log(formData);
        try {
            setSubmit(true)
            const { data } = await axios.post(`${baseUrl}/api/listing/create`, formData, { headers })
            console.log(data);
            if (data.message == "Done") {
                setSubmit(false)
                setError(false)
                setValidatinErr(null)
                closeAfter7("Created Success")
                navigate(`/listing/${data.listing._id}`)
            }
            if (data.message == "Validation Err") {
                setSubmit(false)
                setValidatinErr(data.validationErr[0])
            }
        } catch (error) {
            // console.log(error);
            const { msgError } = error.response.data
            setSubmit(false)
            setError(msgError)
        }
    }


    return (
        <div>
            <Helmet>
                <title>Real-Estate</title>
            </Helmet>
            <ToastContainer autoClose={3000} />
            <div className='w-75 mx-auto mt-3'>
                <h2 className='text-center fw-bold'>create a Listing</h2>
                <div className='row '>
                    <div className='col-md-6'>
                        <div className='w-100 mt-2 d-flex flex-column gap-3 mt-3'>
                            <input onChange={handleData} value={formData.name} id='name' type="text" className='form-control shadow-sm' placeholder='Name' />
                            <textarea onChange={handleData} value={formData.description} id="description" className='form-control shadow-sm' name="" cols="3" placeholder='Description' rows="2"></textarea>
                            <input onChange={handleData} value={formData.address} id='address' type="text" className='form-control shadow-sm' placeholder='Address' />
                            <div className='d-flex flex-wrap gap-3 '>
                                <div className="form-check">
                                    <input onChange={handleData} className="form-check-input shadow-sm" type="checkbox" id="sell" checked={formData.type === "sell"} />
                                    <label className="form-check-label" htmlFor="sell">
                                        Sell
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input onChange={handleData} className="form-check-input shadow-sm" type="checkbox" id="rent" checked={formData.type === "rent"} />
                                    <label className="form-check-label" htmlFor="rent">
                                        Rent
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input onChange={handleData} checked={formData.parking} className="form-check-input shadow-sm" type="checkbox" id="parking" />
                                    <label className="form-check-label" htmlFor="parking">
                                        Parking spot
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input onChange={handleData} checked={formData.furnished} className="form-check-input shadow-sm" type="checkbox" id="furnished" />
                                    <label className="form-check-label" htmlFor="furnished">
                                        furnished
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input onChange={handleData} checked={formData.offer} className="form-check-input shadow-sm" type="checkbox" id="offer" />
                                    <label className="form-check-label" htmlFor="offer">
                                        offer
                                    </label>
                                </div>
                            </div>
                            <div className='d-flex justify-content-start  gap-3'>
                                <div className=' d-flex justify-content-start align-items-center gap-2 w-25'>
                                    <input onChange={handleData} value={formData.bedrooms} id='bedrooms' type="number" min={0} max={10} className='form-control shadow-sm' />
                                    <label htmlFor="bedrooms">Beds</label>
                                </div>
                                <div className=' d-flex justify-content-start align-items-center gap-2 w-25'>
                                    <input onChange={handleData} value={formData.bathrooms} id='bathrooms' type="number" min={0} max={10} className='form-control shadow-sm' />
                                    <label htmlFor="bathrooms">Baths</label>
                                </div>
                            </div>
                            <div className='d-flex justify-content-start align-items-center '>
                                <div className=' mt-2 d-flex justify-content-start align-items-center gap-2 '>
                                    <input onChange={handleData} value={formData.regularPrice} id='regularPrice' type="number" min={0} style={{ width: "90px" }} className='form-control shadow-sm' />
                                    <label htmlFor="regularPrice" className='w-50 fw-bold'>Regular price<span style={{ fontSize: "13px" }} className='fw-semibold'>($/Month)</span></label>
                                </div>
                                <div className=' mt-2 d-flex justify-content-start align-items-center gap-2 '>
                                    <input onChange={handleData} value={formData.discountPrice} id='discountPrice' type="number" min={0} style={{ width: "90px" }} className='form-control shadow-sm' />
                                    <label htmlFor="discountPrice" className='w-50 fw-bold'>Discount price <span style={{ fontSize: "13px" }} className='fw-semibold'>($/Month)</span></label>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className='mt-3'>
                            <p style={{ fontSize: "15px" }} className='fw-semibold' ><span className='fw-bold'>Images:</span> The first image will be the cover (max 6)</p>
                            <div className='d-flex  gap-2'>
                                <input id='images' onChange={(e) => { setFiles(e.target.files) }} type="file" className='form-control shadow-sm' accept='image/*' multiple />
                                <button onClick={handleImages} className='btn btn-outline-success shadow-sm'>{uploading ? "UPLOADING.." : "UPLOAD"}</button>
                            </div>
                            <button onClick={handleSubmit} style={{ backgroundColor: "rgb(19, 30, 80)" }} className='btn btn-dark w-100 mt-3'>{submit ? "LOADING.." : "CREATE LISTING"}</button>
                            {imagesErr && <p className='text-center text-danger fw-semibold'>{imagesErr}</p>}
                            {error && <p className='text-center text-danger fw-semibold'>{error}</p>}

                            <div className='mt-3'>
                                {formData.images.length > 0 && formData.images.map((img, idx) => {
                                    return <div key={idx} className='d-flex border rounded shadow-sm my-2  justify-content-between align-items-center w-100'>
                                        <img src={img} className='p-2 w-25' alt="image" />
                                        <button onClick={() => { deleteImage(img) }} className='btn btn-dark me-2'>Delete</button>
                                    </div>
                                })}

                                {validationErr != null && <ul>
                                    {validationErr.map((err, idx) => {
                                        return <li className='text-danger my-1' key={idx}>{err.message}</li>
                                    })}
                                </ul>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
