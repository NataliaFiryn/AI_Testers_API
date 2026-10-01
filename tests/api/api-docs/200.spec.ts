import { test, expect } from '../../fixtures/api.fixture.js';
import {
  getEffectiveSecurity,
  parseOpenApiDocument,
  type HttpMethod,
} from '../../support/openapi.js';

// Explicit expectations from api-docs.json, independent of the live security fields.
const protectedOperations: Record<string, HttpMethod[]> = {
  '/api/v1/users/{username}': ['get', 'put', 'delete'],
  '/api/v1/users/tool-system-prompt': ['get', 'put'],
  '/api/v1/users/chat-system-prompt': ['get', 'put'],
  '/api/v1/products/{id}': ['get', 'put', 'delete'],
  '/api/v1/orders/{id}/status': ['put'],
  '/api/v1/cart/items/{productId}': ['put', 'delete'],
  '/api/v1/users/logout': ['post'],
  '/api/v1/users/2fa/setup': ['post'],
  '/api/v1/users/2fa/recovery-codes': ['post'],
  '/api/v1/users/2fa/disable': ['post'],
  '/api/v1/users/2fa/confirm': ['post'],
  '/api/v1/qr/create': ['post'],
  '/api/v1/products': ['get', 'post'],
  '/api/v1/orders': ['get', 'post'],
  '/api/v1/orders/{id}/cancel': ['post'],
  '/api/v1/ollama/generate': ['post'],
  '/api/v1/ollama/chat': ['post'],
  '/api/v1/ollama/chat/tools': ['post'],
  '/api/v1/email': ['post'],
  '/api/v1/cart/items': ['post'],
  '/api/v1/admin/inventory/{productId}/adjustments': ['post'],
  '/api/v1/users': ['get'],
  '/api/v1/users/me': ['get'],
  '/api/v1/users/me/email-events': ['get'],
  '/api/v1/users/2fa/status': ['get'],
  '/api/v1/orders/{id}': ['get'],
  '/api/v1/orders/admin': ['get'],
  '/api/v1/ollama/chat/tools/definitions': ['get'],
  '/api/v1/cart': ['get', 'delete'],
  '/api/v1/admin/inventory': ['get'],
  '/api/v1/admin/inventory/{productId}': ['get'],
  '/api/v1/admin/inventory/{productId}/movements': ['get'],
  '/api/v1/users/{username}/right-to-be-forgotten': ['delete'],
};

const publicOperations: Record<string, HttpMethod[]> = {
  '/api/v1/users/signin': ['post'],
  '/api/v1/users/password/forgot': ['post'],
  '/api/v1/users/sso/exchange': ['post'],
  '/api/v1/users/signup': ['post'],
  '/api/v1/users/signin/2fa': ['post'],
  '/api/v1/users/refresh': ['post'],
  '/api/v1/users/password/reset': ['post'],
  '/api/v1/traffic/logs': ['get'],
  '/api/v1/traffic/logs/{correlationId}': ['get'],
  '/api/v1/traffic/info': ['get'],
};

test('GET /v3/api-docs returns an OpenAPI 3 document with the expected authentication contract', async ({
  apiDocsClient,
}) => {
  const response = await apiDocsClient.getDocument();
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^application\/json\b/i);
  const body: unknown = await response.json();
  const document = parseOpenApiDocument(body);

  expect(document.openapi).toMatch(/^3\./);
  expect(document.info.title.trim()).not.toBe('');
  expect(document.paths['/api/v1/users/signin']).toBeDefined();
  expect(document.paths['/api/v1/users/password/forgot']).toBeDefined();
  expect(document.securitySchemes.bearerAuth).toMatchObject({
    type: 'http',
    scheme: 'bearer',
  });

  for (const [path, methods] of Object.entries(protectedOperations)) {
    for (const method of methods) {
      await test.step(`${method.toUpperCase()} ${path} requires bearerAuth`, async () => {
        const operation = document.paths[path]?.[method];
        expect(operation).toBeDefined();
        const security = getEffectiveSecurity(document, operation!);
        expect(security.length).toBeGreaterThan(0);
        // Every alternative must require bearerAuth; an anonymous option is invalid.
        for (const requirement of security) {
          expect(requirement.bearerAuth).toEqual([]);
        }
      });
    }
  }

  for (const [path, methods] of Object.entries(publicOperations)) {
    for (const method of methods) {
      await test.step(`${method.toUpperCase()} ${path} permits anonymous access`, async () => {
        const operation = document.paths[path]?.[method];
        expect(operation).toBeDefined();
        const security = getEffectiveSecurity(document, operation!);
        expect(
          security.length === 0 ||
            security.some(
              (requirement) => Object.keys(requirement).length === 0,
            ),
        ).toBe(true);
      });
    }
  }
});
