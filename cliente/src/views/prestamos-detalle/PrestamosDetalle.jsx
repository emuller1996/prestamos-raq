/* eslint-disable prettier/prettier */
import React from 'react'
import { Badge, Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { usePrestamos } from '../../hooks/usePrestamos'
import { useEffect } from 'react'

export default function PrestamoDetalle() {
  const { id } = useParams()

  const { getPrestamoById, dataDetalle } = usePrestamos()

  useEffect(() => {
    getPrestamoById(id)
  }, [])

  return (
    <div className="container">
      <Card>
        <Card.Body>
          <h5>
            Detalle del Prestamo <Badge bg="secondary">{dataDetalle?.code}</Badge>
          </h5>
          <hr />
          <div className="row">
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
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
