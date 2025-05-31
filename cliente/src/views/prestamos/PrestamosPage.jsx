/* eslint-disable prettier/prettier */
import React from 'react'

import { CContainer } from '@coreui/react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
export default function PrestamosPage() {
  return (
    <div>
      <CContainer fluid>
        <div>
          <Link to={`crear`}>
          <Button
            variant="success"
            className="text-white"
           
          >
            Crear Prestamo
          </Button>
          </Link>
        </div>
      </CContainer>
    </div>
  )
}
