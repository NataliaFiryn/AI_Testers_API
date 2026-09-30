import 'dotenv/config';

const baseURL = process.env.BASE_URL;

if (!baseURL) {
  throw new Error('BASE_URL is required. Configure .env using .env.example.');
}

const url = new URL(baseURL);
if (!['http:', 'https:'].includes(url.protocol)) {
  throw new Error('BASE_URL must use HTTP or HTTPS.');
}

export const env = { baseURL: url.toString() };

export function getLoginCredentials() {
  const username = process.env.LOGIN_USERNAME;
  const password = process.env.LOGIN_PASSWORD;
  if (!username || !password) {
    throw new Error(
      'LOGIN_USERNAME and LOGIN_PASSWORD are required in .env or the environment.',
    );
  }
  return { username, password };
}
