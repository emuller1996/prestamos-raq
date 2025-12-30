/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import {
  getAllPrestamoService,
  getCountPrestamoService,
  getPagosAbonoPrestamoByIdService,
  getPagosInteresPrestamoByIdService,
  getPrestamoByIdService,
  postCreatePagoAbonoPrestamoService,
  postCreatePagoInteresPrestamoService,
  postCreatePrestamoService,
} from '../services/prestamos.services'

export const usePrestamos = () => {
  const [data, setData] = useState(null)
  const [dataDetalle, setDataDetalle] = useState(null)
  const [PagoAbonos, setPagoAbonos] = useState(null)
  const [Intereses, setIntereses] = useState(null)


  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal
  const [Count, setCount] = useState(null)
  const { Token, TokenClient } = useContext(AuthContext)

  const CreatePrestamo = async (data) => {
    return postCreatePrestamoService(Token, data)
  }

  const CreatePagoAbonoPrestamo = async (data,prestamo_id) => {
    return postCreatePagoAbonoPrestamoService(Token, data,prestamo_id)
  }

  const CreatePagoInteresPrestamo = async (data,prestamo_id) => {
    return postCreatePagoInteresPrestamoService(Token, data,prestamo_id)
  }

  const getPagoInteresPrestamoById = async (id) => {
    try {
      setLoading(true)
      const result = await getPagosInteresPrestamoByIdService(Token, signal, id)
      setIntereses(result.data)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const getPagoAbonosPrestamoById = async (id) => {
    try {
      setLoading(true)
      const result = await getPagosAbonoPrestamoByIdService(Token, signal, id)
      setPagoAbonos(result.data)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const getPrestamoById = async (id) => {
    try {
      setLoading(true)
      const result = await getPrestamoByIdService(Token, signal, id)
      setDataDetalle(result.data)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const getCountPrestamos = async (data) => {
    try {
      const result = await getCountPrestamoService(Token, data)
      setCount(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getAlPrestamo = async () => {
    setLoading(true)
    try {
      const res = await getAllPrestamoService(Token, signal)
      if (res.status !== 200) {
        let err = new Error('Error en la petición Fetch')
        err.status = res.status || '00'
        err.statusText = res.statusText || 'Ocurrió un error'
        throw err
      }
      console.log(res)
      if (!signal.aborted) {
        setData(res.data)
        setError(null)
      }
    } catch (error) {
      if (!signal.aborted) {
        setData(null)
        setError(error)
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  return {
    loading,
    error,
    CreatePrestamo,
    getAlPrestamo,
    getPrestamoById,
    getCountPrestamos,
    CreatePagoAbonoPrestamo,
    CreatePagoInteresPrestamo,
    getPagoAbonosPrestamoById,
    getPagoInteresPrestamoById,
    Intereses,
    PagoAbonos,
    Count,
    dataDetalle,
    data,
    
  }
}
