/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'

import { CContainer } from '@coreui/react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { usePrestamos } from '../../hooks/usePrestamos'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import { ViewDollar } from '../../utils'
export default function PrestamosPage() {
  const { getAlPrestamo, data } = usePrestamos()

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
          {data && (
            <DataTable
              className="MyDataTableEvent"
              striped
              columns={[
                {
                  cell: (row) => {
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {}}
                          className="btn btn-info btn-sm text-white"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" className="btn btn-dark btn-sm ms-2">
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </>
                    )
                  },
                },
                {
                  name: 'Cliente Nombre',
                  selector: (row) => row?.client.label ?? '',
                  minWidth: '300px',
                },
                {
                  name: 'amount',
                  selector: (row) => (row?.amount ? ViewDollar(row?.amount) : ''),
                  minWidth: '200px',
                },
                { name: 'interest rate', selector: (row) => row?.interest_rate ?? '' },
                { name: 'amount capital', selector: (row) => row?.amount_capital ? ViewDollar(row?.amount) : '' },
                { name: 'amount_interes capital', selector: (row) =>  row?.amount_interes ? ViewDollar(row?.amount) : '' },
                { name: 'Estado', selector: (row) => row?.status ?? '' },
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
              data={data ?? []}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              noDataComponent="No hay datos para mostrar"
            />
          )}
        </div>
      </CContainer>
    </div>
  )
}
