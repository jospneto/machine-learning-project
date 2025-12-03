import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';
import updateLocale from 'dayjs/plugin/updateLocale';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const monthsShort = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

dayjs.locale(ptBR);
dayjs.extend(updateLocale);
dayjs.updateLocale(ptBR.name, {
  months,
  monthsShort,
});

export default dayjs;
