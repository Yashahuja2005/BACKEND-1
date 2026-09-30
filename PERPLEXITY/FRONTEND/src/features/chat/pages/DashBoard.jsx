import React from 'react'
import { useSelector } from 'react-redux'

const DashBoard = () => {

    const {user} = useSelector(state => state.auth)

    console.log(user);
    
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard