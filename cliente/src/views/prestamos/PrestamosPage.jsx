/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'

import { CContainer } from '@coreui/react'
import { Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { usePrestamos } from '../../hooks/usePrestamos'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import { ViewDollar } from '../../utils'
export default function PrestamosPage() {
  const { getAlPrestamo, data, loading } = usePrestamos()

  useEffect(() => {
    getAlPrestamo()
  }, [])

  return (
    <div>
      <CContainer fluid>
        <div>
          <Link to={`crear`}>
            <Button variant="success" className="text-white">
              Crear Prestamo
            </Button>
          </Link>
        </div>
        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
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
                    <Spinner color='success' animation="border" role="status">
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
        </div>
      </CContainer>
    </div>
  )
}
