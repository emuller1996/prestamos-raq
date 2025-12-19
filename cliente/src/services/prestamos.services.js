/* eslint-disable prettier/prettier */
import axios from 'axios'

export const postCreatePrestamoService = (token, data) => {
  return axios.post('/prestamos', data, { headers: { 'access-token': token } })
}

export const getAllPrestamoService = (token, signal) => {
  return axios.get('/prestamos', { headers: { 'access-token': token }, signal: signal })
}

export const getPrestamoByIdService = (token, signal, id) => {
  return axios.get(`/prestamos/${id}`, { headers: { 'access-token': token }, signal: signal })
}

export const getCountPrestamoService = (token, signal) => {
  return axios.get('/prestamos/getcount', { headers: { 'access-token': token }, signal: signal })
}
