/* eslint-disable prettier/prettier */
import axios from 'axios'

export const postCreatePrestamoService = (token, data) => {
  return axios.post('/prestamos', data, { headers: { 'access-token': token } })
}

export const getAllPrestamoService = (token, signal) => {
  return axios.get('/prestamos', { headers: { 'access-token': token }, signal: signal })
}
