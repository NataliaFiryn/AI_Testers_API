import { generateRegistrationData } from '../../../Generators/registration.generator.js';
import { test, expect } from '../../fixtures/api.fixture.js';
import { expectJsonResponse } from '../../support/api.assertions.js';

const fields = [
  'username',
  'email',
  'password',
  'firstName',
  'lastName',
] as const;

test.describe('400 - POST /api/v1/users/signup', () => {
  for (const field of fields) {
    for (const value of ['omitted', 'null'] as const) {
      const fieldValue = value === 'omitted' ? undefined : null;

      test(`rejects ${value} ${field}`, async ({ registrationClient }) => {
        const user = {
          ...generateRegistrationData(),
          [field]: fieldValue,
        };
        const response = await registrationClient.signUp(user);
        expectJsonResponse(response, 400);
        expect(await response.json()).toEqual({
          [field]: expect.stringMatching(/\S/),
        });
      });
    }
  }

  const limits = {
    username: 4,
    password: 8,
    firstName: 4,
    lastName: 4,
  } as const;
  for (const [field, minimum] of Object.entries(limits)) {
    for (const length of [0, minimum - 1, 256]) {
      test(`rejects ${field} with ${length} characters`, async ({
        registrationClient,
      }) => {
        const user = generateRegistrationData();
        const response = await registrationClient.signUp({
          ...user,
          [field]: user.password.repeat(11).slice(0, length),
        });
        expectJsonResponse(response, 400);
        expect(await response.json()).toEqual({
          [field]: expect.stringMatching(/\S/),
        });
      });
    }
  }

  for (const invalidEmail of [
    'missing-at',
    'missing-local',
    'whitespace',
  ] as const) {
    test(`rejects an email with ${invalidEmail}`, async ({
      registrationClient,
    }) => {
      const user = generateRegistrationData();
      const emails = {
        'missing-at': user.email.replace('@', ''),
        'missing-local': '@example.com',
        whitespace: ` ${user.email}`,
      };
      const response = await registrationClient.signUp({
        ...user,
        email: emails[invalidEmail],
      });
      expectJsonResponse(response, 400);
      expect(await response.json()).toEqual({
        email: expect.stringMatching(/\S/),
      });
    });
  }

  test('reports all missing required fields together', async ({
    registrationClient,
  }) => {
    const response = await registrationClient.signUp({});
    expectJsonResponse(response, 400);
    expect(await response.json()).toEqual(
      Object.fromEntries(
        fields.map((field) => [field, expect.stringMatching(/\S/)]),
      ),
    );
  });

  for (const field of ['username', 'email'] as const) {
    test(`rejects a duplicate ${field}`, async ({ registrationClient }) => {
      const original = generateRegistrationData();
      expect((await registrationClient.signUp(original)).status()).toBe(201);
      const duplicate = generateRegistrationData({
        overrides: { [field]: original[field] },
      });
      const response = await registrationClient.signUp(duplicate);
      expectJsonResponse(response, 400);
      expect(await response.json()).toEqual({
        message: `${field === 'username' ? 'Username' : 'Email'} is already in use`,
      });
    });
  }
});
