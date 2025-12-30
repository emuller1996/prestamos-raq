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
import DataTable from 'react-data-table-component'
export default function PrestamosAbonosPagos({ idPrestamo, prestamo }) {
  PrestamosAbonosPagos.propTypes = {
    idPrestamo: PropTypes.string,
    prestamo: PropTypes.object,
  }
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { CreatePagoAbonoPrestamo, getPagoAbonosPrestamoById, PagoAbonos, loading } = usePrestamos()

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
      <DataTable
        columns={[
          {
            name: 'Monto Abono',
            selector: (row) => row.amount,
            cell: (row) => ViewDollar(row.amount),
            sortable: true,
          },
          {
            name: 'Fecha Pago',
            selector: (row) => row.date_delivery,
            cell: (row) => row.date_delivery,
            sortable: true,
          },
          {
            name: 'Acciones',
            cell: (row) => (
              <>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button type="button" className="btn btn-primary btn-sm">
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button type="button" className="btn btn-danger text-white btn-sm">
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </>
            ),
          },
        ]}
        progressPending={loading}
        data={PagoAbonos?.data}
      />
      <hr className="my-1" />
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="table-responsive">
            <table className="table text-start">
              <thead>
                <tr>
                  <th scope="col">Prestamo</th>
                  <th scope="col">{prestamo && ViewDollar(prestamo.amount)}</th>
                </tr>
                <tr>
                  <th scope="col">Total Abono</th>
                  <th scope="col" className="text-success">
                    {PagoAbonos && ViewDollar(PagoAbonos?.suma_pagos?.value)}
                  </th>
                </tr>
                <tr>
                  <th scope="col">Saldo Total</th>
                  <th scope="col" className="text-warning">
                    {PagoAbonos &&
                      prestamo &&
                      ViewDollar(prestamo.amount - PagoAbonos?.suma_pagos?.value)}
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
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
