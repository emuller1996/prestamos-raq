import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import { useClientes } from '../../hooks/useClientes'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import FormClientes from './components/FormClientes'

const ClientePage = () => {
  const [show, setShow] = useState(false)
  const [Draw, setDraw] = useState(1)
  const [ClienteS, setClienteS] = useState(null)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [dataFilter, setdataFilter] = useState({
    perPage: 10,
    search: '',
    page: 1,
    draw: 1,
  })

  const { getAllClientesPagination, dataP } = useClientes()

  useEffect(() => {
    getAllClientesPagination(dataFilter)
  }, [dataFilter, Draw])

  return (
    <div className="">
      <CContainer fluid>
        <div>
          <Button
            variant="success"
            className="text-white"
            onClick={() => {
              setClienteS(null)
              handleShow()
            }}
          >
            Crear Cliente
          </Button>
          <Button className="ms-2" variant="info">
            EXPORTAR CLIENTS
          </Button>
        </div>
        <div className="row g-3 my-3"></div>
        <div className="w-100">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              placeholder="Buscar por Nombre, Alias y Telefono"
              type="text"
              aria-label="First name"
              className="form-control"
              onChange={(e) => {
                setdataFilter((status) => {
                  return { ...status, search: e.target.value }
                })
              }}
            />
          </div>
        </div>
        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          {dataP && (
            <DataTable
              className="MyDataTableEvent"
              striped
              columns={[
                {
                  minWidth: '10px',
                  cell: (row) => {
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setClienteS(row)
                            handleShow()
                          }}
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
                { name: 'Nombre', selector: (row) => row?.name ?? '', width: '200px' },
                { name: 'Alias/Apodo', selector: (row) => row?.alias ?? '', width: '200px' },
                { name: 'Correo', selector: (row) => row?.email ?? '', width: '200px' },
                { name: 'Telefono', selector: (row) => row?.telefono ?? '', width: '150px' },
                {
                  name: 'Direccion',
                  selector: (row) => `${row?.direccion ?? ''}`,
                  width: '150px',
                },
                {
                  name: 'Barrio',
                  selector: (row) => `${row?.barrio ?? ''}`,
                  width: '150px',
                },
                {
                  name: 'Fecha Creacion.',
                  selector: (row) =>
                    `${new Date(row?.createdTime).toISOString().split('T')[0] ?? ''} ${new Date(row?.createdTime).toLocaleTimeString() ?? ''}`,
                  width: '250px',
                },
                {
                  name: 'Fecha Actualizacion',
                  selector: (row) =>
                    `${new Date(row?.updatedTime).toISOString().split('T')[0] ?? ''} ${new Date(row?.updatedTime).toLocaleTimeString() ?? ''}`,
                  width: '250px',
                },
                { name: '', selector: (row) => row?.city ?? '' },
              ]}
              data={dataP.data ?? []}
              pagination
              paginationComponentOptions={paginationComponentOptions}
              paginationPerPage={dataFilter.perPage}
              noDataComponent="No hay datos para mostrar"
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
          )}
        </div>
        <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
          <Modal.Body>
            <FormClientes
              onHide={handleClose}
              cliente={ClienteS}
              allClientes={() => {
                setDraw((status) => ++status)
              }}
            />
          </Modal.Body>
        </Modal>
      </CContainer>
    </div>
  )
}

export default ClientePage
