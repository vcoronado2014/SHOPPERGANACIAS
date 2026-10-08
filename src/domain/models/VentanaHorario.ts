export interface VentanaHorario {
  inicio: string;
  fin: string;
  label: string;
}

export const ventanasHorario: VentanaHorario[] = [
  {
    inicio: '09:00',
    fin: '11:00',
    label: '09:00 - 11:00',
  },
  {
    inicio: '11:00',
    fin: '13:00',
    label: '11:00 - 13:00',
  },
  {
    inicio: '13:00',
    fin: '15:00',
    label: '13:00 - 15:00',
  },
  {
    inicio: '15:00',
    fin: '17:00',
    label: '15:00 - 17:00',
  },
  {
    inicio: '17:00',
    fin: '19:00',
    label: '17:00 - 19:00',
  },
  {
    inicio: '19:00',
    fin: '21:00',
    label: '19:00 - 21:00',
  },
];