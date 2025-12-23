/* eslint-disable prettier/prettier */

import React from 'react'
import { createContext, useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  }

  const [tokenAccess, setTokenAccess] = useLocalStorage('tokenAccessRAQ', null)
  const [Token, setToken] = useState(tokenAccess ? tokenAccess : null)

  const [user, setUser] = useState(tokenAccess ? jwtDecode(tokenAccess) : null)
  const navigate = useNavigate()

  const cerrarSessionAdmin = () => {
    setTokenAccess(null)
    setToken(null)
    localStorage.removeItem("tokenAccessRAQ")
    navigate("/login")
  }

  let contextData = {
    user,
    setUser,
    setToken,
    Token,
    cerrarSessionAdmin
  }

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}
