/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'

import { CContainer } from '@coreui/react'
import { Accordion, Button, Form, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { usePrestamos } from '../../hooks/usePrestamos'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import { ViewDollar } from '../../utils'
import { useForm } from 'react-hook-form'
export default function PrestamosPage() {
  const { loading, getAllPrestamosPagination, dataP } = usePrestamos()
  const [dataFilter, setdataFilter] = useState({
    perPage: 10,
    search: '',
    page: 1,
    draw: 1,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    getAllPrestamosPagination(dataFilter)
  }, [dataFilter])

  const onSubmit = async (data) => {
    console.log(data)
    setdataFilter((status) => {
      return { ...status, ...data }
    })
  }

  return (
    <div>
      <CContainer fluid>
        <Accordion className="mb-3" defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <i className="fa-solid fa-magnifying-glass me-2"></i>Busqueda Avanzadas
            </Accordion.Header>
            <Accordion.Body>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Label>Nombre/Telefono</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('search')}
                      placeholder="Buscar por nombre, telefono"
                    />
                  </div>
                  <div className="col-md-3">
                    <Form.Label>Dia de Pago de Interes</Form.Label>
                    <Form.Control
                      type="text"
                      {...register('num_day_payment')}
                      placeholder="1, 30 ,15"
                    />
                  </div>
                </div>
                <div className="mt-5 d-flex gap-4 justify-content-center">
                  <button
                    type="button"
                    onClick={() => {
                      reset()
                    }}
                    className="btn btn-danger text-white"
                  >
                    <i className="fa-solid fa-trash  me-2"></i>Limpiar Filtro
                  </button>
                  <Button type="submit" className="text-white" variant="success">
                    <i className="fa-solid fa-magnifying-glass me-2"></i>Buscar
                  </Button>
                </div>
              </form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <div>
          <Link to={`crear`}>
            <Button variant="success" className="text-white">
              Crear Prestamo
            </Button>
          </Link>
        </div>
        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          <DataTable
            className="MyDataTableEvent"
            striped
            columns={[
              {
                cell: (row) => {
                  return (
                    <>
                      <Link to={`detalle/${row._id}/`}>
                        <button type="button" className="btn btn-dark btn-sm ms-2">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </Link>
                    </>
                  )
                },
              },
              {
                name: 'Id Préstamo',
                selector: (row) => row?.code ?? '',
                minWidth: '70px',
              },
              {
                name: 'Cliente Nombre',
                selector: (row) => row?.client.label ?? '',
                minWidth: '250px',
              },
              {
                name: 'Monto Préstamo',
                selector: (row) => (row?.amount ? ViewDollar(row?.amount) : ''),
                minWidth: '200px',
              },
              { name: 'Interés', selector: (row) => row?.interest_rate ?? '', width: '70px' },
              {
                name: 'Monto Interés',
                selector: (row) => (row?.amount_interes ? ViewDollar(row?.amount_interes) : ''),
                minWidth: '200px',
              },
              { name: 'Estado', selector: (row) => row?.status ?? '', minWidth: '120px' },
              {
                name: 'Fecha Creacion.',
                selector: (row) =>
                  `${new Date(row?.createdTime).toISOString().split('T')[0] ?? ''} ${new Date(row?.createdTime).toLocaleTimeString() ?? ''}`,
                width: '200px',
              },
              {
                name: 'Fecha Actualizacion',
                selector: (row) =>
                  `${new Date(row?.updatedTime).toISOString().split('T')[0] ?? ''} ${new Date(row?.updatedTime).toLocaleTimeString() ?? ''}`,
                width: '200px',
              },
              { name: '', selector: (row) => row?.city ?? '' },
            ]}
            data={dataP?.data}
            pagination
            paginationServer
            progressPending={loading}
            progressComponent={
              <div className="d-flex justify-content-center my-5">
                <div
                  className="spinner-border text-success"
                  style={{ width: '3em', height: '3em' }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            }
            paginationTotalRows={dataP?.total}
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent={
              <div className="d-flex justify-content-center my-5">No hay productos.</div>
            }
            onChangeRowsPerPage={(perPage, page) => {
              console.log(perPage, page)
              setdataFilter((status) => {
                return { ...status, perPage }
              })
            }}
            onChangePage={(page) => {
              setdataFilter((status) => {
                return { ...status, page }
              })
            }}
          />
        </div>
        {/* <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          {
            <DataTable
              className="MyDataTableEvent"
              striped
              columns={[
                {
                  cell: (row) => {
                    return (
                      <>
                        <Link to={`detalle/${row._id}/`}>
                          <button type="button" className="btn btn-dark btn-sm ms-2">
                            <i className="fa-solid fa-eye"></i>
                          </button>
                        </Link>
                      </>
                    )
                  },
                },
                {
                  name: 'Id Préstamo',
                  selector: (row) => row?.code ?? '',
                  minWidth: '100px',
                },
                {
                  name: 'Cliente Nombre',
                  selector: (row) => row?.client.label ?? '',
                  minWidth: '200px',
                },
                {
                  name: 'Monto Préstamo',
                  selector: (row) => (row?.amount ? ViewDollar(row?.amount) : ''),
                  minWidth: '200px',
                },
                { name: 'Interés', selector: (row) => row?.interest_rate ?? '' },
                {
                  name: 'Deuda capital',
                  selector: (row) => (row?.amount_capital ? ViewDollar(row?.amount) : ''),
                  minWidth: '200px',
                },
                {
                  name: 'Monto Interés',
                  selector: (row) => (row?.amount_interes ? ViewDollar(row?.amount) : ''),
                  minWidth: '200px',
                },
                { name: 'Estado', selector: (row) => row?.status ?? '', minWidth: '120px' },
                {
                  name: 'Fecha Creacion.',
                  selector: (row) =>
                    `${new Date(row?.createdTime).toISOString().split('T')[0] ?? ''} ${new Date(row?.createdTime).toLocaleTimeString() ?? ''}`,
                  width: '200px',
                },
                {
                  name: 'Fecha Actualizacion',
                  selector: (row) =>
                    `${new Date(row?.updatedTime).toISOString().split('T')[0] ?? ''} ${new Date(row?.updatedTime).toLocaleTimeString() ?? ''}`,
                  width: '200px',
                },
                { name: '', selector: (row) => row?.city ?? '' },
              ]}
              progressPending={loading}
              progressComponent={
                <>
                  <div className="my-5">
                    <Spinner color="success" animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                </>
              }
              data={data ?? []}
              pagination
              paginationTotalRows={data?.length}
              paginationComponentOptions={paginationComponentOptions}
              noDataComponent="No hay datos para mostrar"
            />
          }
        </div> */}
      </CContainer>
    </div>
  )
}
