import {
  generateRegistrationData,
  registrationCountries,
} from '../../../Generators/registration.generator.js';
import { test, expect } from '../../fixtures/api.fixture.js';

test.describe('Registration data generator', () => {
  for (const country of registrationCountries) {
    test(`generates independent valid profiles for ${country}`, () => {
      const users = Array.from({ length: 100 }, () =>
        generateRegistrationData({ country }),
      );
      expect(new Set(users.map((user) => user.username)).size).toBe(
        users.length,
      );
      expect(new Set(users.map((user) => user.email)).size).toBe(users.length);
      for (const user of users) {
        expect(user.username.length).toBeGreaterThanOrEqual(4);
        expect(user.username.length).toBeLessThanOrEqual(255);
        expect(user.email).toMatch(/^[a-z0-9]+\.[a-f0-9]{32}@example\.com$/);
        expect(user.password.length).toBeGreaterThanOrEqual(8);
        expect(user.password.length).toBeLessThanOrEqual(255);
        for (const name of [user.firstName, user.lastName]) {
          expect(name.length).toBeGreaterThanOrEqual(4);
          expect(name.length).toBeLessThanOrEqual(255);
          expect(name).toBe(name.normalize('NFC').trim());
        }
      }
    });
  }

  test('applies explicit overrides without sharing mutable data', () => {
    const overrides = { firstName: 'Łucja', password: '' };
    const user = generateRegistrationData({ country: 'PL', overrides });
    expect(user).toMatchObject(overrides);
    user.firstName = 'changed';
    expect(overrides.firstName).toBe('Łucja');
  });
});
