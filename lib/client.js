/**
 * Yunxiao (云效) OpenAPI client for the DSH host plugin.
 *
 * Request model follows the official `alibabacloud-devops-mcp-server`:
 *   - central station  -> https://openapi-rdc.aliyuncs.com, paths carry /organizations/{orgId}
 *   - region station   -> https://<org-domain>.devops.aliyuncs.com, paths omit the organization
 *   - auth             -> `x-yunxiao-token: <personal access token>`
 *
 * Settings resolve per request from the panel's stored record (edited in the UI),
 * then the plugin config, then the environment. The token lives in the DSH
 * credentials store and is written by the panel or by `yunxiao_auth`.
 */

import { readFile } from 'node:fs/promises';

export const DEFAULT_BASE_URL = 'https://openapi-rdc.aliyuncs.com';
export const CREDENTIAL_REF = 'YUNXIAO_ACCESS_TOKEN';
const CENTRAL_HOST = 'openapi-rdc.aliyuncs.com';

const TOKEN_KEYS = ['YUNXIAO_ACCESS_TOKEN', 'ALIBABA_CLOUD_YUNXIAO_ACCESS_TOKEN'];
const ORG_KEYS = ['YUNXIAO_ORGANIZATION_ID', 'ALIBABA_CLOUD_YUNXIAO_ORGANIZATION_ID'];

export class YunxiaoError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'YunxiaoError';
    this.status = details.status;
    this.path = details.path;
    this.body = details.body;
  }
}

export function normalizeBaseUrl(value) {
  const raw = String(value ?? '').trim();
  const withScheme = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
  return (withScheme || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

export function resolveEdition(editionSetting, baseUrl) {
  const explicit = String(editionSetting ?? '').trim().toLowerCase();
  if (explicit === 'central' || explicit === 'region') return explicit;
  return baseUrl.includes(CENTRAL_HOST) ? 'central' : 'region';
}

/** Parse a `KEY=VALUE` credentials file; used only for the one-time token import. */
export function parseEnvFile(text) {
  const values = new Map();
  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values.set(match[1], value);
  }
  return values;
}

function firstDefined(values, keys) {
  for (const key of keys) {
    const value = values.get(key);
    if (value) return value;
  }
  return undefined;
}

/** Encode a repository id the way Codeup expects: `orgId/repo-name` -> `orgId%2Frepo-name`. */
export function encodeRepositoryId(repositoryId) {
  const value = String(repositoryId ?? '').trim();
  if (!value.includes('/')) return value;
  const index = value.indexOf('/');
  const namespace = value.slice(0, index);
  const name = value.slice(index + 1);
  return `${namespace}%2F${encodeURIComponent(name).replace(/%20/g, '%20')}`;
}

export function encodeFilePath(filePath) {
  return encodeURIComponent(String(filePath)).replace(/%2F/gi, '/');
}

export function encodeFilePathSegment(filePath) {
  const value = String(filePath).replace(/^\/+/, '');
  return encodeURIComponent(value);
}

function buildQuery(query) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    search.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
}

function collectPagination(headers) {
  const read = name => headers.get(name) ?? undefined;
  const page = read('x-page');
  const perPage = read('x-per-page');
  const total = read('x-total');
  const totalPages = read('x-total-pages');
  if (!page && !total && !totalPages && !perPage) return undefined;
  const number = value => (value === undefined ? undefined : Number(value));
  return {
    page: number(page),
    perPage: number(perPage),
    total: number(total),
    totalPages: number(totalPages),
    nextPage: number(read('x-next-page')) ?? null,
    prevPage: number(read('x-prev-page')) ?? null,
  };
}

function describeHttpError(status, body, path) {
  let detail;
  if (body && typeof body === 'object') {
    detail = body.errorMessage || body.message || body.error_description || body.error || JSON.stringify(body);
  } else if (typeof body === 'string') {
    detail = body;
  }
  const text = String(detail ?? '').slice(0, 1200);
  const hint =
    status === 401
      ? ' The personal access token is missing, expired, or lacks the required permission scope.'
      : status === 403
        ? ' The token is valid but lacks permission for this resource.'
        : status === 404
          ? ' The organization, repository, project, or id does not exist (or the token cannot see it).'
          : '';
  return `Yunxiao API ${status} for ${path}${text ? `: ${text}` : ''}${hint}`;
}

/**
 * @param {object} options
 * @param {object} options.ctx Cordis host context.
 * @param {object} options.config Plugin row config.
 * @param {{ get: () => object | undefined, put: (value: object) => Promise<void> }} [options.settingsStore]
 *   Persisted settings edited in the panel. Kept outside plugin config so a save
 *   does not restart the plugin.
 */
export function createYunxiao({ ctx, config, settingsStore } = {}) {
  const timeoutMs = Number(config?.timeoutMs) > 0 ? Number(config.timeoutMs) : 60_000;
  let organizationCache;

  function stored() {
    try {
      return settingsStore?.get?.() ?? {};
    } catch {
      return {};
    }
  }

  function settings() {
    const saved = stored();
    const baseUrl = normalizeBaseUrl(saved.baseUrl || config?.apiBaseUrl || process.env.YUNXIAO_API_BASE_URL);
    return {
      baseUrl,
      edition: resolveEdition(saved.edition || config?.edition || process.env.YUNXIAO_EDITION, baseUrl),
      organizationId: String(saved.organizationId || config?.organizationId || process.env.YUNXIAO_ORGANIZATION_ID || ''),
    };
  }

  async function credentialService() {
    try {
      return ctx?.get?.('credentials');
    } catch {
      return undefined;
    }
  }

  async function resolveToken() {
    const credentials = await credentialService();
    if (credentials) {
      try {
        const resolved = await credentials.resolve(CREDENTIAL_REF);
        if (resolved?.value) return { token: resolved.value, source: resolved.source ?? 'credentials store' };
      } catch {
        /* fall through */
      }
    }
    const literal = String(config?.accessToken ?? '').trim();
    if (literal) return { token: literal, source: 'plugin config' };
    const ambient = String(process.env[CREDENTIAL_REF] ?? '').trim();
    if (ambient) return { token: ambient, source: 'environment' };
    return undefined;
  }

  async function organizationId() {
    const current = settings();
    if (current.edition === 'region') return current.organizationId || 'default';
    if (current.organizationId) return current.organizationId;
    if (organizationCache && organizationCache.baseUrl === current.baseUrl && Date.now() - organizationCache.at < 300_000) {
      return organizationCache.id;
    }
    const { data } = await request({ path: '/oapi/v1/platform/user' });
    const discovered = data?.lastOrganization;
    if (!discovered) {
      throw new YunxiaoError(
        'The Yunxiao token has no lastOrganization; set the organization id in the Yunxiao panel settings.',
      );
    }
    organizationCache = { id: discovered, baseUrl: current.baseUrl, at: Date.now() };
    return discovered;
  }

  async function scope(section) {
    const current = settings();
    if (current.edition === 'region') return `/oapi/v1/${section}`;
    const org = await organizationId();
    return `/oapi/v1/${section}/organizations/${encodeURIComponent(org)}`;
  }

  async function request({ method = 'GET', path, query, body }) {
    if (!path || !path.startsWith('/oapi/v1/')) {
      throw new YunxiaoError(`Refusing a non-OpenAPI path: ${path}`);
    }
    const token = await resolveToken();
    if (!token) {
      throw new YunxiaoError(
        'No Yunxiao access token is configured. Open the Yunxiao panel and save a personal access token, or run yunxiao_auth with action "save".',
      );
    }

    const current = settings();
    const url = `${current.baseUrl}${path}${buildQuery(query)}`;
    const headers = { Accept: 'application/json', 'x-yunxiao-token': token.token };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    let response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      const reason = error?.name === 'TimeoutError' ? `timed out after ${timeoutMs}ms` : (error?.message ?? String(error));
      throw new YunxiaoError(`Yunxiao API request failed for ${path}: ${reason}`);
    }

    const text = await response.text();
    let data;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      throw new YunxiaoError(describeHttpError(response.status, data, path), {
        status: response.status,
        path,
        body: data,
      });
    }

    return { data, headers: response.headers, pagination: collectPagination(response.headers) };
  }

  async function credentialsStatus() {
    const credentials = await credentialService();
    if (!credentials) return { available: false };
    try {
      const info = await credentials.describe?.(CREDENTIAL_REF);
      return { available: true, configured: Boolean(info?.configured), source: info?.source, writable: info?.writable };
    } catch (error) {
      return { available: true, error: error?.message ?? String(error) };
    }
  }

  async function saveToken(token) {
    const credentials = await credentialService();
    if (!credentials?.set) {
      throw new YunxiaoError('The credentials service is unavailable; this DSH profile cannot store secrets.');
    }
    await credentials.set(CREDENTIAL_REF, token);
  }

  async function clearToken() {
    const credentials = await credentialService();
    if (!credentials?.unset) throw new YunxiaoError('The credentials service is unavailable.');
    await credentials.unset(CREDENTIAL_REF);
  }

  async function importTokenFile(path) {
    if (!path) return undefined;
    try {
      const values = parseEnvFile(await readFile(path, 'utf8'));
      const token = firstDefined(values, TOKEN_KEYS);
      const organizationId = firstDefined(values, ORG_KEYS);
      return { token, organizationId };
    } catch {
      return undefined;
    }
  }

  function resetCache() {
    organizationCache = undefined;
  }

  return {
    settings,
    timeoutMs,
    config: config ?? {},
    request,
    organizationId,
    scope,
    resolveToken,
    credentialsStatus,
    saveToken,
    clearToken,
    importTokenFile,
    resetCache,
  };
}