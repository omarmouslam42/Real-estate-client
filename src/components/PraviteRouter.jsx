import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function PraviteRouter() {
    const { currentUser } = useSelector((state) => state.user)

  return (currentUser !==null? <Outlet/> :<Navigate to={'/sign-in'}/>)
}
