/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import { ViewDollar } from '../../../utils'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import CurrencyInput from 'react-currency-input-field'
import PropTypes from 'prop-types'
import { usePrestamos } from '../../../hooks/usePrestamos'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import DataTable from 'react-data-table-component'

export default function PrestamosInteresesPagos({ idPrestamo, prestamo }) {
  PrestamosInteresesPagos.propTypes = {
    idPrestamo: PropTypes.string,
    prestamo: PropTypes.object,
  }

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { CreatePagoInteresPrestamo, getPagoInteresPrestamoById, Intereses } = usePrestamos()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    getPagoInteresPrestamoById(idPrestamo)
  }, [])

  const onSubmit = async (data) => {
    data.year_pago = new Date(data.date_delivery).getFullYear()
    console.log(data)
    try {
      const result = await CreatePagoInteresPrestamo(data, idPrestamo)
      toast.success(result.data.message, { duration: 1500 })
      handleClose()
    } catch (error) {
      console.log(error)
    }
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
      <DataTable
        columns={[
          {
            name: 'Monto Interés',
            selector: (row) => row.amount,
            cell: (row) => ViewDollar(row.amount),
            sortable: true,
          },
          {
            name: 'Mes de Interés',
            selector: (row) => row.mes_pago,
            cell: (row) => row.mes_pago,
            sortable: true,
          },
          {
            name: 'Fecha Pago de Interés',
            selector: (row) => row.date_delivery,
            cell: (row) => row.date_delivery,
            sortable: true,
          },
          
        ]}
        data={Intereses?.data}
      />

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
                defaultValue={prestamo.amount_interes}
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
              <Form.Select
                id="mes_pago"
                isInvalid={errors.mes_pago ? true : false}
                {...register('mes_pago', {
                  required: { value: true, message: 'Mes de pago es requerido' },
                })}
              >
                <option value={''}>Seleccione un mes</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Form.Select>
              {errors.mes_pago && (
                <span className="ms-2 text-danger ">{errors.mes_pago.message}</span>
              )}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="date_delivery">Fecha de Pago</Form.Label>
              <Form.Control
                id="date_delivery"
                type="date"
                placeholder=""
                isInvalid={errors.date_delivery ? true : false}
                {...register('date_delivery', {
                  required: { value: true, message: 'Fecha de pago del interes es requerida' },
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
