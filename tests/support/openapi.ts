export const httpMethods = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
] as const;

export type HttpMethod = (typeof httpMethods)[number];
export type SecurityRequirement = Record<string, string[]>;

export interface OpenApiOperation {
  security?: SecurityRequirement[];
}

export interface OpenApiDocument {
  openapi: string;
  info: { title: string };
  paths: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>>;
  security?: SecurityRequirement[];
  securitySchemes: Record<string, Record<string, unknown>>;
}

function object(value: unknown, location: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${location} must be an object`);
  }
  return value as Record<string, unknown>;
}

function string(value: unknown, location: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${location} must be a string`);
  }
  return value;
}

function security(value: unknown, location: string): SecurityRequirement[] {
  if (!Array.isArray(value)) {
    throw new Error(`${location} must be an array`);
  }
  return value.map((entry: unknown, index) => {
    const requirement = object(entry, `${location}[${index}]`);
    return Object.fromEntries(
      Object.entries(requirement).map(([name, scopes]) => {
        if (!Array.isArray(scopes)) {
          throw new Error(`${location}[${index}].${name} must be an array`);
        }
        return [
          name,
          scopes.map((scope: unknown) =>
            string(scope, `${location}[${index}].${name} scope`),
          ),
        ];
      }),
    );
  });
}

function optionalSecurity(
  value: Record<string, unknown>,
  location: string,
): SecurityRequirement[] | undefined {
  return Object.hasOwn(value, 'security')
    ? security(value.security, `${location}.security`)
    : undefined;
}

// Validate only the document structure consumed by the contract tests.
export function parseOpenApiDocument(value: unknown): OpenApiDocument {
  const document = object(value, 'document');
  const info = object(document.info, 'info');
  const paths = object(document.paths, 'paths');
  const parsedPaths: OpenApiDocument['paths'] = {};

  for (const [path, value] of Object.entries(paths)) {
    const item = object(value, `paths[${path}]`);
    const operations: Partial<Record<HttpMethod, OpenApiOperation>> = {};
    for (const method of httpMethods) {
      if (Object.hasOwn(item, method)) {
        const location = `paths[${path}].${method}`;
        const operation = object(item[method], location);
        operations[method] = {
          security: optionalSecurity(operation, location),
        };
      }
    }
    parsedPaths[path] = operations;
  }

  const components =
    document.components === undefined
      ? {}
      : object(document.components, 'components');
  const schemes =
    components.securitySchemes === undefined
      ? {}
      : object(components.securitySchemes, 'components.securitySchemes');

  return {
    openapi: string(document.openapi, 'openapi'),
    info: { title: string(info.title, 'info.title') },
    paths: parsedPaths,
    security: optionalSecurity(document, 'document'),
    securitySchemes: Object.fromEntries(
      Object.entries(schemes).map(([name, scheme]) => [
        name,
        object(scheme, `components.securitySchemes.${name}`),
      ]),
    ),
  };
}

export function getEffectiveSecurity(
  document: OpenApiDocument,
  operation: OpenApiOperation,
): SecurityRequirement[] {
  return operation.security ?? document.security ?? [];
}
