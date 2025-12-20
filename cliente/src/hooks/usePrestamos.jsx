/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import {
  getAllPrestamoService,
  getCountPrestamoService,
  getPrestamoByIdService,
  postCreatePrestamoService,
} from '../services/prestamos.services'

export const usePrestamos = () => {
  const [data, setData] = useState(null)
  const [dataDetalle, setDataDetalle] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal
  const [Count, setCount] = useState(null)
  const { Token, TokenClient } = useContext(AuthContext)

  const CreatePrestamo = async (data) => {
    return postCreatePrestamoService(Token, data)
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
    Count,
    dataDetalle,
    data,
  }
}
