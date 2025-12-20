/* eslint-disable prettier/prettier */
import React from 'react'
import { Badge, Button, Card, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { usePrestamos } from '../../hooks/usePrestamos'
import { useEffect } from 'react'
import { ViewDollar } from '../../utils'

export default function PrestamoDetalle() {
  const { id } = useParams()

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
            <h5>
              Detalle del Prestamo <Badge bg="secondary">{dataDetalle?.code}</Badge>
            </h5>
            <hr />
            <div className="row g-3">
              <div className="col-md-3">
                <p>Datos Cliente</p>
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
                <p>Datos Préstamo</p>
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
                <div className="mb-2">
                  <Button className="text-white" variant="success">
                    <i className="fa-solid fa-plus me-2"></i>Agregar Pago / Abono
                  </Button>
                </div>
                <hr className='my-1'/>
                <div className="d-flex justify-content-between mx-4">
                  <span className="fw-semibold"> Monto</span>
                  <span>Fecha</span>
                </div>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold text-success"> {ViewDollar(52222)}</span>
                      <span> {new Date().toLocaleString()}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
              <Tab
                eventKey="intereses"
                title={
                  <span>
                    <i className="fa-solid fa-percent me-2"></i>Pago de Intereses
                  </span>
                }
              >
                <div className="mb-3">
                  <Button className="text-white" variant="success">
                    <i className="fa-solid fa-plus me-2"></i>Agregar Pago Interes
                  </Button>
                </div>
                <hr className='my-1'/>
                <div className="d-flex justify-content-between mx-4">
                  <span className="fw-semibold"> Monto</span>
                  <span>Fecha</span>
                </div>
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold text-success"> {ViewDollar(52222)}</span>
                      <span> {new Date().toLocaleString()}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
