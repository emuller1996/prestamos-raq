/* eslint-disable prettier/prettier */

import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import { getAllPrestamoService, postCreatePrestamoService } from '../services/prestamos.services'

export const usePrestamos = () => {
  const [data, setData] = useState(null)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortController = new AbortController()
  const signal = abortController.signal
  const { Token, TokenClient } = useContext(AuthContext)

  const CreatePrestamo = async (data) => {
    return postCreatePrestamoService(Token, data)
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

  return { CreatePrestamo, data, loading, error, getAlPrestamo }
}
