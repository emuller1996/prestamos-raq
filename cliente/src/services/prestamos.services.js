/* eslint-disable prettier/prettier */
import axios from 'axios'

export const postCreatePrestamoService = (token, data) => {
  return axios.post('/prestamos', data, { headers: { 'access-token': token } })
}

export const postCreatePagoAbonoPrestamoService = (token, data, id) => {
  return axios.post(`/prestamos/${id}/pago_abono`, data, { headers: { 'access-token': token } })
}

export const postCreatePagoInteresPrestamoService = (token, data, id) => {
  return axios.post(`/prestamos/${id}/pago_interes`, data, { headers: { 'access-token': token } })
}

export const getAllPrestamoService = (token, signal) => {
  return axios.get('/prestamos', { headers: { 'access-token': token }, signal: signal })
}

export const getPrestamoByIdService = (token, signal, id) => {
  return axios.get(`/prestamos/${id}`, { headers: { 'access-token': token }, signal: signal })
}

export const getPagosInteresPrestamoByIdService = (token, signal, id) => {
  return axios.get(`/prestamos/${id}/pago_interes`, {
    headers: { 'access-token': token },
    signal: signal,
  })
}

export const getPagosAbonoPrestamoByIdService = (token, signal, id) => {
  return axios.get(`/prestamos/${id}/pago_abono`, {
    headers: { 'access-token': token },
    signal: signal,
  })
}

export const getCountPrestamoService = (token, signal) => {
  return axios.get('/prestamos/getcount', { headers: { 'access-token': token }, signal: signal })
}


export const getPrestamoSearchPaginationServices = async (token, ...params) => {
  const searchs = new URLSearchParams()
  
  Object.entries(params[0]).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchs.append(key, value)
    }
  })

  return axios.get(`/prestamos/pagination/?${searchs.toString()}`, {
    headers: { 'access-token': token },
  })
}
