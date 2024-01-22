import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth"
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Filure, Start, Success } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
    const dispatch = useDispatch()
    const navigate =useNavigate()
    const baseUrl='https://real-estate-back-nine.vercel.app'

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            // console.log(result);
            const { data } = await axios.post(`${baseUrl}/api/auth/google`,
                {
                    userName: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            // console.log(data);
            if (data.message != "Done") {
                dispatch(Filure(error.response.data.msgError))
                return;
            }
            // done
            dispatch(Success(data.user))
            localStorage.setItem("token", data.token)
            navigate('/')
        } catch (error) {
            // console.log(error);
            dispatch(Filure(error))
        }
    }

    return (
        <button type='button' onClick={handleGoogle} className='btn btn-danger signup-google'>CONTINUE WITH GOOGLE</button>
    )
}
