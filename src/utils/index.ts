import * as moment from 'moment';

export default function generateSecret() {
  const randomNumber = Math.floor(Math.random() * 100 + 180901);
  const secret = `${moment().format('MMMM')}-${randomNumber}`;
  return secret;
}
