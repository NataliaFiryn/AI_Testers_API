import { randomUUID } from 'node:crypto';
import { Faker, ar, base, de, en, fr, pl, pt_BR } from '@faker-js/faker';
import type { RegistrationData } from '../src/clients/registration.client.js';

const countryLocales = { US: en, PL: pl, DE: de, FR: fr, BR: pt_BR, EG: ar };
export type RegistrationCountry = keyof typeof countryLocales;
export const registrationCountries = Object.keys(
  countryLocales,
) as RegistrationCountry[];

export interface RegistrationGeneratorOptions {
  country?: RegistrationCountry;
  overrides?: Partial<RegistrationData>;
}

// Resample short names rather than padding or corrupting localized names.
function validName(generate: () => string): string {
  for (let attempt = 0; attempt < 1_000; attempt++) {
    const name = generate().normalize('NFC').trim();
    if (name.length >= 4 && name.length <= 255) return name;
  }
  throw new Error(
    'Unable to generate a name within the registration length limits',
  );
}

/** Creates an independent account. Overrides are applied last for boundary tests. */
export function generateRegistrationData({
  country = 'US',
  overrides = {},
}: RegistrationGeneratorOptions = {}): RegistrationData {
  const locale = countryLocales[country];
  if (!locale) throw new Error(`Unsupported registration country: ${country}`);
  const faker = new Faker({ locale: [locale, en, base] });
  const sex = faker.person.sexType();
  const firstName = validName(() => faker.person.firstName(sex));
  const lastName = validName(() => faker.person.lastName(sex));
  // UUIDs keep identities independent across workers and repeated runs.
  const suffix = randomUUID().replaceAll('-', '');
  const handle =
    faker.internet
      .username({ firstName, lastName })
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 16) || 'user';
  return {
    username: `test_${handle}_${suffix}`,
    email: `${handle.toLowerCase()}.${suffix}@example.com`,
    password: faker.internet.password({ length: 24 }),
    firstName,
    lastName,
    ...overrides,
  };
}
