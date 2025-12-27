/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import { ViewDollar } from '../../../utils'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CurrencyInput from 'react-currency-input-field'
import PropTypes from 'prop-types'
import { usePrestamos } from '../../../hooks/usePrestamos'
import toast from 'react-hot-toast'
export default function PrestamosAbonosPagos({ idPrestamo }) {
  PrestamosAbonosPagos.propTypes = {
    idPrestamo: PropTypes.string,
  }
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { CreatePagoAbonoPrestamo, getPagoAbonosPrestamoById, PagoAbonos } = usePrestamos()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    getPagoAbonosPrestamoById(idPrestamo)
  }, [])

  const onSubmit = async (data) => {
    try {
      const result = await CreatePagoAbonoPrestamo(data, idPrestamo)
      toast.success(result.data.message || 'Registro creado')
      handleClose()
      getPagoAbonosPrestamoById(idPrestamo)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="mb-2">
        <Button className="text-white" variant="success" onClick={handleShow}>
          <i className="fa-solid fa-plus me-2"></i>Agregar Pago / Abono
        </Button>
      </div>
      <hr className="my-1" />
      <div className="d-flex justify-content-between mx-4 mb-1">
        <span className="fw-semibold"> Monto</span>
        <span>Fecha</span>
      </div>
      {PagoAbonos &&
        Array.isArray(PagoAbonos) &&
        PagoAbonos.map((pago) => (
          <Card key={pago._id} className="mb-2">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <span className="fw-semibold text-success"> {ViewDollar(pago.amount)}</span>
                <span>{pago.date_delivery}</span>
              </div>
            </Card.Body>
          </Card>
        ))}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agrega nuevo Pago / Abono</Modal.Title>
        </Modal.Header>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <div className="mb-3">
              <Form.Label htmlFor="amount">Monto del Abono</Form.Label>
              <Controller
                name="amount"
                rules={{ required: { value: true, message: 'Monto del préstamo es requerida' } }}
                control={control}
                render={({ field: { name, onChange, ref, value } }) => {
                  return (
                    <CurrencyInput
                      className="form-control"
                      name={name}
                      ref={ref}
                      placeholder=""
                      value={value}
                      decimalsLimit={2}
                      prefix="$"
                      intlConfig={{ locale: 'es-US', currency: 'COP' }}
                      onValueChange={(value, name) => {
                        console.log(value)
                        onChange(parseFloat(value ?? 0))
                      }}
                    />
                  )
                }}
              />
              {errors.amount && <span className="ms-2 text-danger ">{errors.amount.message}</span>}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="date_delivery">Fecha de Entrega</Form.Label>
              <Form.Control
                id="date_delivery"
                type="date"
                placeholder=""
                {...register('date_delivery', {
                  required: { value: true, message: 'Fecha de entrega del dinero es requerida' },
                })}
              />
              {errors.date_delivery && (
                <span className="ms-2 text-danger ">{errors.date_delivery.message}</span>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="success" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
