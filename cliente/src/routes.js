import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UsuariosPage = React.lazy(() => import('./views/usuarios/UsuariosPage'))
const ClientePage = React.lazy(() => import('./views/clientes/ClientePage'))
const PrestamosPage = React.lazy(() => import('./views/prestamos/PrestamosPage'))
const PrestamosCrearPage = React.lazy(() => import('./views/prestamo-crear/PrestamosCrearPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/usuarios', name: 'Usuarios', element: UsuariosPage },
  { path: '/clientes', name: 'Clientes', element: ClientePage },
  { path: '/prestamos', name: 'Clientes', element: PrestamosPage },
  { path: '/prestamos/crear', name: 'Clientes', element: PrestamosCrearPage },
]

export default routes
