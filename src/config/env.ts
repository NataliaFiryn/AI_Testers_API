import 'dotenv/config';

const baseURL = process.env.BASE_URL;

if (!baseURL) {
  throw new Error('Brak BASE_URL. Uzupełnij .env na podstawie .env.example.');
}

const url = new URL(baseURL);
if (!['http:', 'https:'].includes(url.protocol)) {
  throw new Error('BASE_URL musi używać protokołu http lub https.');
}

export const env = { baseURL: url.toString() };
