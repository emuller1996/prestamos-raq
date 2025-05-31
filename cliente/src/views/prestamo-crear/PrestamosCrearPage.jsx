/* eslint-disable prettier/prettier */
import React from 'react'
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import AsyncSelect from 'react-select/async'
import { useClientes } from '../../hooks/useClientes'
import { stylesSelect, themeSelect } from '../../utils/optionsConfig'
import CurrencyInput from 'react-currency-input-field'
import { Controller, useForm } from 'react-hook-form'

export default function PrestamosCrearPage() {
  const { getAllClientesPaginationPromise } = useClientes()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    console.log(data)
  }

  const searchLeadOptions = async (value) => {
    try {
      const result = await getAllClientesPaginationPromise({
        search: value,
        page: 1,
      })
      return result.data.data.map((c) => {
        return {
          label: `${c.name ?? ''} - ${c.alias ?? ''} - ${c.telefono ?? ''}`,
          value: c._id,
        }
      })
    } catch (error) {
      console.log(error)
      return []
    }
  }
  return (
    <>
      <Card>
        <Card.Body>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-center pb-0">Crear Nuevo Prestamo</p>
            <hr />
            <div className="mb-3">
              <Form.Label htmlFor="cliente_id">Monto de Prestamo</Form.Label>
              <Controller
                name="cliente_id"
                rules={{ required: true }}
                control={control}
                render={({ field: { name, onChange, ref } }) => {
                  return (
                    <AsyncSelect
                      isClearable
                      cacheOptions
                      defaultOptions
                      loadOptions={searchLeadOptions}
                      placeholder="Selecionar Cliente"
                      onChange={(e) => {
                        onChange(e)
                      }}
                      name={name}
                      ref={ref}
                      styles={stylesSelect}
                      theme={themeSelect}
                    />
                  )
                }}
              />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Label htmlFor="amount">Monto de Prestamo</Form.Label>
                <Controller
                  name="amount"
                  rules={{ required: true }}
                  control={control}
                  render={({ field: { name, onChange, ref } }) => {
                    return (
                      <CurrencyInput
                        className="form-control"
                        name={name}
                        ref={ref}
                        placeholder=""
                        decimalsLimit={2}
                        prefix="$"
                        intlConfig={{ locale: 'es-US', currency: 'COP' }}
                        onValueChange={(value, name) => {
                          console.log(value)
                          onChange(value)
                        }}
                      />
                    )
                  }}
                />
              </div>
              <div className="col-md-2">
                <Form.Label htmlFor="interest_rate">Interes (%)</Form.Label>
                <Form.Control
                  {...register('interest_rate', { required: true })}
                  id="interest_rate"
                  type="number"
                  placeholder=""
                />
              </div>
              <div className="col-md-4">
                <Form.Label htmlFor="num_day_payment">Numero del Dia de Pago</Form.Label>
                <Form.Control
                  id="num_day_payment"
                  {...register('num_day_payment', { required: true })}
                  type="number"
                  placeholder=""
                />
              </div>
              <div className="col-md-6">
                <Form.Label htmlFor="date_delivery">Fecha de Entrega</Form.Label>
                <Form.Control
                  id="date_delivery"
                  type="date"
                  placeholder=""
                  {...register('date_delivery', { required: true })}
                />
              </div>
            </div>
            <div className="mt-5 d-flex gap-4 justify-content-center">
              <Button type="submit" className="text-white" variant="success">
                Guardar Producto
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </>
  )
}
