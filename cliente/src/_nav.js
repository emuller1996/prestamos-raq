import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Gestion de Productos',
  },
  {
    component: CNavItem,
    name: 'Prestamos',
    to: '/prestamos',
    icon: <i className="fa-solid fa-file-invoice-dollar  nav-icon"></i>,
  },
  {
    component: CNavTitle,
    name: 'Tabla de Control',
  },
  {
    component: CNavItem,
    name: 'Clientes',
    to: '/clientes',
    icon: <i className="fa-solid fa-users  nav-icon"></i>,
  },
  {
    component: CNavTitle,
    name: 'Configuraciones',
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/usuarios',
    icon: <i style={{ width: '30px' }} className="fa-solid fa-users nav-icon"></i>,
  },
  {
    component: CNavItem,
    name: 'LOGS',
    to: '/logs',
    icon: <i className="fa-solid fa-terminal nav-icon"></i>,
  },
]

export default _nav
