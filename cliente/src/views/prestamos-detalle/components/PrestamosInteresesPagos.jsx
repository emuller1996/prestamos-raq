/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import { ViewDollar } from '../../../utils'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CurrencyInput from 'react-currency-input-field'
import PropTypes from 'prop-types'

export default function PrestamosInteresesPagos({ idPrestamo }) {
  PrestamosInteresesPagos.propTypes = {
    idPrestamo: PropTypes.string,
  }

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    console.log(data)
  }

  const months = [
    { value: 'Enero', label: 'Enero' },
    { value: 'Febrero', label: 'Febrero' },
    { value: 'Marzo', label: 'Marzo' },
    { value: 'Abril', label: 'Abril' },
    { value: 'Mayo', label: 'Mayo' },
    { value: 'Junio', label: 'Junio' },
    { value: 'Julio', label: 'Julio' },
    { value: 'Agosto', label: 'Agosto' },
    { value: 'Septiembre', label: 'Septiembre' },
    { value: 'Octubre', label: 'Octubre' },
    { value: 'Noviembre', label: 'Noviembre' },
    { value: 'Diciembre', label: 'Diciembre' },
  ]

  return (
    <>
      <div className="mb-2">
        <Button className="text-white" variant="success" onClick={handleShow}>
          <i className="fa-solid fa-plus me-2"></i>Agregar Pago de Interés
        </Button>
      </div>
      <hr className="my-1" />
      <div className="d-flex justify-content-between mx-4">
        <span className="fw-semibold"> Monto</span>
        <span className="fw-semibold"> Mes de Pago</span>
        <span>Fecha</span>
      </div>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <span className="fw-semibold text-success"> {ViewDollar(52222)}</span>
            <span>Agosto</span>
              <span> {new Date().toLocaleString()}</span>
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Pago de Interés</Modal.Title>
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
              <Form.Label htmlFor="mes_pago">Mes de Pago</Form.Label>
              <Form.Select id="mes_pago">
                <option value="" disabled>
                  Seleccione un mes
                </option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Form.Select>
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
        </form>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="success" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
