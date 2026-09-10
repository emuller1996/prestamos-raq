/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Badge, Button, Card, Dropdown, Modal, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { usePrestamos } from '../../hooks/usePrestamos'
import { useEffect } from 'react'
import { ViewDollar } from '../../utils'
import PrestamosAbonosPagos from './components/PrestamosAbonosPagos'
import PrestamosInteresesPagos from './components/PrestamosInteresesPagos'
import PrestamosCrearPage from '../prestamo-crear/PrestamosCrearPage'

export default function PrestamoDetalle() {
  const { id } = useParams()
  const [showEdit, setShowEdit] = useState(false)

  const { getPrestamoById, dataDetalle, loading } = usePrestamos()

  useEffect(() => {
    getPrestamoById(id)
  }, [])

  return (
    <div className="container">
      {loading && (
        <div className="text-center my-5">
          <Spinner />
        </div>
      )}
      {dataDetalle && (
        <Card>
          <Card.Body>
            <div className='d-flex justify-content-between align-items-center'>
              <h5>
                Detalle del Prestamo <Badge bg="secondary">{dataDetalle?.code}</Badge>
              </h5>

              <Dropdown  variant="secondary">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setShowEdit(true)}>
                    <i className="fa-solid fa-pen-to-square me-2"></i>Modificar Prestamo
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <hr />
            <div className="row g-md-3">
              <div className="col-md-3">
                <p className="fw-semibold">Datos Cliente</p>
                <div className="d-flex justify-content-between">
                  <span>Nombre</span>
                  <span>{dataDetalle?.clientData.name}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Telefono</span>
                  <span>{dataDetalle?.clientData.telefono}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Telefono</span>
                  <span>{dataDetalle?.clientData.telefono}</span>
                </div>
              </div>
              <div className="col-md-4">
                <p className="fw-semibold">Datos Préstamo</p>
                <div className="d-flex justify-content-between">
                  <span>Monto Préstamo</span>
                  <span>{ViewDollar(dataDetalle?.amount)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Interés</span>
                  <span>{dataDetalle?.interest_rate}%</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Monto de Interés</span>
                  <span>{ViewDollar(dataDetalle?.amount_interes)}</span>
                </div>
              </div>
              <div className="col-md-4">
                <p>&nbsp;</p>
                <div className="d-flex justify-content-between">
                  <span>Entrega Préstamo</span>
                  <span>{dataDetalle?.date_delivery}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Dia de Pago de Interes</span>
                  <span>{dataDetalle?.num_day_payment} de Cada Mes</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Estado</span>
                  <span>
                    <Badge>{dataDetalle?.status}</Badge>{' '}
                  </span>
                </div>
              </div>
            </div>
            <hr />
            <Tabs defaultActiveKey="payments" id="uncontrolled-tab-example" className="mb-3">
              <Tab
                eventKey="payments"
                title={
                  <span>
                    <i className="fa-solid fa-money-bills me-2"></i>Pagos / Abonos
                  </span>
                }
              >
                <PrestamosAbonosPagos idPrestamo={id} prestamo={dataDetalle} />
              </Tab>
              <Tab
                eventKey="intereses"
                title={
                  <span>
                    <i className="fa-solid fa-percent me-2"></i>Pago de Intereses
                  </span>
                }
              >
                <PrestamosInteresesPagos idPrestamo={id} prestamo={dataDetalle} />
              </Tab>
            </Tabs>
          </Card.Body>
          <Modal backdrop="static" size="lg" centered show={showEdit} onHide={() => setShowEdit(false)}>
            <Modal.Body>
              <PrestamosCrearPage
                prestamo={dataDetalle}
                onHide={() => setShowEdit(false)}
                onUpdated={() => getPrestamoById(id)}
              />
            </Modal.Body>
          </Modal>
        </Card>
      )}
    </div>
  )
}
