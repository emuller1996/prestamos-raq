/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap'
import AsyncSelect from 'react-select/async'
import { useClientes } from '../../hooks/useClientes'
import { stylesSelect, themeSelect } from '../../utils/optionsConfig'
import CurrencyInput from 'react-currency-input-field'
import { Controller, useForm } from 'react-hook-form'
import { ViewDollar } from '../../utils'
import { usePrestamos } from '../../hooks/usePrestamos'
import toast from 'react-hot-toast'

export default function PrestamosCrearPage() {
  const { getAllClientesPaginationPromise } = useClientes()

  const { CreatePrestamo, getCountPrestamos, Count } = usePrestamos()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    getCountPrestamos()
  }, [])

  const onSubmit = async (data) => {
    data.amount_capital = data.amount + data.amount * (data.interest_rate / 100)
    data.amount_interes = data.amount * (data.interest_rate / 100)
    data.code =`PTM-${Count}` 

    console.log(data)
    try {
      const result = await CreatePrestamo(data)
      reset()
      toast.success(result.data.message)
      await getCountPrestamos()
    } catch (error) {
      console.log(error)
    }
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
    <div className='container'>
      <Card>
        <Card.Body>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-center pb-0">Crear Nuevo Prestamo</p>
            <hr />
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontWeight: '700' }}>PTM-{Count}</span>
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="cliente">Monto de Préstamo</Form.Label>
              <Controller
                name="client"
                rules={{ required: { value: true, message: 'El cliente es requeridad' } }}
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
              {errors.client && <span className='ms-2 text-danger '>{errors.client.message}</span>}
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <Form.Label htmlFor="amount">Monto de Préstamo</Form.Label>
                <Controller
                  name="amount"
                  rules={{ required: { value:true, message:"Monto del préstamo es requerida"} }}
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
                          onChange(parseFloat(value ?? 0))
                        }}
                      />
                    )
                  }}
                />
                {errors.amount && <span className='ms-2 text-danger '>{errors.amount.message}</span>}
              </div>
              <div className="col-md-2">
                <Form.Label htmlFor="interest_rate">Interés</Form.Label>
                <Controller
                  name="interest_rate"
                  rules={{ required: {value :true , message:"El Interes del préstamo es requerida"} }}
                  control={control}
                  defaultValue={20}
                  render={({ field: { name, onChange,value, ref } }) => {
                    return (
                      <CurrencyInput
                        className="form-control"
                        name={name}
                        ref={ref}
                        placeholder=""
                        decimalsLimit={2}
                        prefix="%"
                        defaultValue={value}
                        onValueChange={(value, name) => {
                          console.log(value)
                          onChange(parseFloat(value ?? 0))
                        }}
                      />
                    )
                  }}
                />
                {errors.interest_rate && <span className='ms-2 text-danger '>{errors.interest_rate.message}</span>}
              </div>
              <div className="col-md-4">
                <Form.Label htmlFor="num_day_payment">Numero del Dia de Pago</Form.Label>
                <Form.Control
                  id="num_day_payment"
                  {...register('num_day_payment', { required: { value: true, message:"El dia de pago es requeridad"} })}
                  type="number"
                  placeholder=""
                  max={31}
                  min={1}
                />
                {errors.num_day_payment && <span className='ms-2 text-danger '>{errors.num_day_payment.message}</span>}
              </div>
              <div className="col-md-6">
                <Form.Label htmlFor="date_delivery">Fecha de Entrega</Form.Label>
                <Form.Control
                  id="date_delivery"
                  type="date"
                  placeholder=""
                  {...register('date_delivery', { required: {value:true, message:"Fecha de entrega del dinero es requerida"} })}
                />
                {errors.date_delivery && <span className='ms-2 text-danger '>{errors.date_delivery.message}</span>}
              </div>
            </div>
            <div className="col-6 mt-5">
              <div className="d-flex justify-content-between">
                <span>Deuda Capital</span>
                <span>
                  {watch().interest_rate &&
                    watch().amount &&
                    ViewDollar(watch().amount + watch().amount * (watch().interest_rate / 100))}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Interes</span>
                <span>
                  {watch().interest_rate &&
                    watch().amount &&
                    ViewDollar(watch().amount * (watch().interest_rate / 100))}
                </span>
              </div>
            </div>
            <div className="mt-5 d-flex gap-4 justify-content-center">
              <Button  disabled={isSubmitting} type="submit" className="text-white" variant="success">
                {isSubmitting && (<Spinner animation="border" size="sm" />)}  Guardar Producto
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  )
}
