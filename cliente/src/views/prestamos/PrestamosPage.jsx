/* eslint-disable prettier/prettier */
import React from 'react'

import { CContainer } from '@coreui/react'
import { Button } from 'react-bootstrap'

export default function PrestamosPage() {
  return (
    <div>
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
            Crear Prestamo
          </Button>
        </div>
      </CContainer>
    </div>
  )
}
