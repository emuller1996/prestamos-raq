/* eslint-disable prettier/prettier */

export const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
}
export const genderOptions = [
  { label: 'Hombre', value: 'men' },
  { label: 'Mujer', value: 'women' },
  { label: 'Ninos', value: 'kid' },
]

export const StatusOrderOptions = [
  { label: 'Pendiente', value: 'Pendiente' },
  { label: 'En Proceso', value: 'En Proceso' },
  { label: 'En Camino', value: 'En Camino' },
  { label: 'Entregada', value: 'Entregada' },
  { label: 'Cancelada', value: 'Cancelada' },
]



export const stylesSelect = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? '#0c1605a1' : '#dbdfe6',
    boxShadow: state.isFocused
      ? '  rgba(0, 0, 0, 0.16) 0px 1px 4px, rgba(29, 97, 1, 0.336) 0px 0px 0px 3px;'
      : '',
    borderRadius: '0.4em',
  }),
  menu: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? 'grey' : 'red',
    backgroundColor: 'white',
  }),
}

export const themeSelect = {
  colors: {
    primary: '#0c1605a1',
    primary25: '#a5dbb3',
    primary50: '#156a2b',
    primary75: '#a3d6b1',
  },
}
