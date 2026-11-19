/**
 * One implementation of every Yunxiao operation, shared by the agent tools and
 * the sidebar panel: the panel calls these through the Host route, the tools
 * call them directly, so both surfaces share the same validation and results.
 */

import { encodeRepositoryId, YunxiaoError } from './client.js';

const fail = (message, code = 'INVALID_INPUT') => {
  const error = new YunxiaoError(message);
  error.code = code;
  throw error;
};

const text = (value, name, max = 500) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string' || value.length > max) fail(`${name} must be a string of at most ${max} characters.`);
  return value;
};

const requiredText = (value, name, max = 500) => {
  const result = text(value, name, max);
  if (!result || !result.trim()) fail(`${name} is required.`);
  return result.trim();
};

const idText = (value, name, max = 200) => {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return requiredText(value, name, max);
};

const pageInt = (value, name, min, max) => {
  if (value === undefined || value === null) return undefined;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) fail(`${name} must be an integer from ${min} to ${max}.`);
  return number;
};

const csv = value => String(value).split(',').map(part => part.trim()).filter(Boolean);

function listCondition(className, fieldIdentifier, value, format = 'list') {
  return { className, fieldIdentifier, format, operator: 'CONTAINS', toValue: null, value: csv(value) };
}

function inputCondition(className, fieldIdentifier, value) {
  return { className, fieldIdentifier, format: 'input', operator: 'CONTAINS', toValue: null, value: [String(value)] };
}

function betweenCondition(className, fieldIdentifier, from, to) {
  return {
    className,
    fieldIdentifier,
    format: 'input',
    operator: 'BETWEEN',
    toValue: to ? `${to} 23:59:59` : null,
    value: [`${from} 00:00:00`],
  };
}

function conditionGroups(conditions) {
  const present = conditions.filter(Boolean);
  return present.length ? JSON.stringify({ conditionGroups: [present] }) : undefined;
}

function workItemConditions(args) {
  if (args.conditions) return args.conditions;
  return conditionGroups([
    args.subject ? inputCondition('string', 'subject', args.subject) : undefined,
    args.status ? listCondition('status', 'status', args.status) : undefined,
    args.assignedTo ? listCondition('user', 'assignedTo', args.assignedTo) : undefined,
    args.creator ? listCondition('user', 'creator', args.creator) : undefined,
    args.sprint ? listCondition('sprint', 'sprint', args.sprint) : undefined,
    args.workitemType ? listCondition('workitemType', 'workitemType', args.workitemType) : undefined,
    args.priority ? listCondition('option', 'priority', args.priority) : undefined,
    args.tag ? listCondition('tag', 'tag', args.tag, 'multiList') : undefined,
    args.createdAfter ? betweenCondition('dateTime', 'gmtCreate', args.createdAfter, args.createdBefore) : undefined,
    args.updatedAfter ? betweenCondition('dateTime', 'gmtModified', args.updatedAfter, args.updatedBefore) : undefined,
  ]);
}

function projectConditions(args) {
  if (args.conditions) return args.conditions;
  return conditionGroups([
    args.name ? inputCondition('string', 'name', args.name) : undefined,
    args.status ? listCondition('status', 'status', args.status) : undefined,
    args.creator ? listCondition('user', 'creator', args.creator) : undefined,
    args.createdAfter ? betweenCondition('date', 'gmtCreate', args.createdAfter, args.createdBefore) : undefined,
  ]);
}

function listResult({ data, pagination }) {
  return Array.isArray(data) ? { items: data, ...(pagination ? { pagination } : {}) } : { data, ...(pagination ? { pagination } : {}) };
}

export function createService(yunxiao, { settingsStore } = {}) {
  async function numericRepositoryId(scope, repositoryId) {
    const encoded = encodeRepositoryId(repositoryId);
    if (/^\d+$/.test(String(repositoryId).trim())) return Number(repositoryId);
    const { data } = await yunxiao.request({ path: `${scope}/repositories/${encoded}` });
    const id = Number(data?.id);
    if (!Number.isFinite(id)) fail(`Could not resolve the numeric id of repository ${repositoryId}.`, 'NOT_RESOLVED');
    return id;
  }

  async function status(probe = false) {
    const settings = yunxiao.settings();
    const result = {
      settings: {
        baseUrl: settings.baseUrl,
        edition: settings.edition,
        organizationId: settings.organizationId,
        defaultBaseUrl: settings.baseUrl === 'https://openapi-rdc.aliyuncs.com',
      },
      tokenSource: (await yunxiao.resolveToken())?.source ?? null,
      credentials: await yunxiao.credentialsStatus(),
      configured: Boolean((await yunxiao.resolveToken())?.token),
    };
    if (probe && result.configured) {
      try {
        const { data } = await yunxiao.request({ path: '/oapi/v1/platform/user' });
        result.user = { id: data?.id, name: data?.name, lastOrganization: data?.lastOrganization };
        if (!settings.organizationId && data?.lastOrganization) result.settings.organizationId = data.lastOrganization;
      } catch (error) {
        result.error = error.message;
        if (error.status === 401 || error.status === 403) result.errorStatus = error.status;
      }
    }
    return result;
  }

  async function saveSettings(input = {}) {
    const token = input.token === undefined ? undefined : String(input.token);
    if (token !== undefined && token.length > 4096) fail('token is too long.');

    const baseUrlRaw = input.baseUrl === undefined ? undefined : text(input.baseUrl, 'baseUrl', 300);
    const edition = input.edition === undefined ? undefined : text(input.edition, 'edition', 20);
    if (edition !== undefined && !['auto', 'central', 'region'].includes(edition)) fail('edition must be auto, central, or region.');
    const organizationId = input.organizationId === undefined ? undefined : text(input.organizationId, 'organizationId', 120);

    const next = {
      baseUrl: baseUrlRaw === undefined ? yunxiao.settings().baseUrl : baseUrlRaw.trim(),
      edition: edition === undefined ? yunxiao.settings().edition : edition,
      organizationId: organizationId === undefined ? yunxiao.settings().organizationId : organizationId.trim(),
    };
    if (next.baseUrl && !/^https?:\/\/[^\s]+$/i.test(next.baseUrl)) fail('baseUrl must start with http:// or https://.');
    if (token !== undefined && token.trim()) await yunxiao.saveToken(token.trim());
    if (token !== undefined && !token.trim()) await yunxiao.clearToken();
    await settingsStore.put(next);
    yunxiao.resetCache();
    return status(true);
  }

  async function clearToken() {
    await yunxiao.clearToken();
    return status(false);
  }

  async function testConnection() {
    const info = await status(false);
    if (!info.configured) fail('Save a personal access token first.', 'NO_TOKEN');
    const { data } = await yunxiao.request({ path: '/oapi/v1/platform/user' });
    return { user: { id: data?.id, name: data?.name, lastOrganization: data?.lastOrganization }, settings: yunxiao.settings() };
  }

  async function listProjects(args = {}) {
    const scope = await yunxiao.scope('projex');
    const body = {
      ...(projectConditions(args) ? { conditions: projectConditions(args) } : {}),
      ...(args.orderBy ? { orderBy: text(args.orderBy, 'orderBy', 40) } : {}),
      ...(args.sort ? { sort: text(args.sort, 'sort', 10) } : {}),
      ...(pageInt(args.page, 'page', 1, 100000) ? { page: Number(args.page) } : {}),
      ...(pageInt(args.perPage, 'perPage', 1, 100) ? { perPage: Number(args.perPage) } : {}),
    };
    return listResult(await yunxiao.request({ method: 'POST', path: `${scope}/projects:search`, body }));
  }

  async function listSprints(args = {}) {
    const scope = await yunxiao.scope('projex');
    return listResult(
      await yunxiao.request({
        path: `${scope}/projects/${encodeURIComponent(idText(args.projectId, 'projectId', 100))}/sprints`,
        query: {
          status: text(args.status, 'status', 200),
          page: pageInt(args.page, 'page', 1, 100000),
          perPage: pageInt(args.perPage, 'perPage', 1, 100),
        },
      }),
    );
  }

  async function searchWorkItems(args = {}) {
    const scope = await yunxiao.scope('projex');
    const body = {
      category: text(args.category, 'category', 40) || 'Req',
      spaceId: idText(args.spaceId, 'spaceId', 100),
      ...(workItemConditions(args) ? { conditions: workItemConditions(args) } : {}),
      orderBy: text(args.orderBy, 'orderBy', 40) || 'gmtCreate',
      sort: text(args.sort, 'sort', 10) || 'desc',
      ...(pageInt(args.page, 'page', 1, 100000) ? { page: Number(args.page) } : {}),
      ...(pageInt(args.perPage, 'perPage', 1, 100) ? { perPage: Number(args.perPage) } : {}),
    };
    return listResult(await yunxiao.request({ method: 'POST', path: `${scope}/workitems:search`, body }));
  }

  async function getWorkItem(workItemId) {
    const scope = await yunxiao.scope('projex');
    const { data } = await yunxiao.request({ path: `${scope}/workitems/${encodeURIComponent(idText(workItemId, 'workItemId', 100))}` });
    return data;
  }

  /** Yunxiao updates expect a status id; names are resolved through the item's workflow. */
  async function resolveStatusId(workItemId, value) {
    const raw = String(value ?? '').trim();
    if (/^\d+$/.test(raw)) return raw;
    const item = await getWorkItem(workItemId);
    const projectId = item?.space?.id;
    const workitemTypeId = item?.workitemType?.id;
    if (!projectId || !workitemTypeId) {
      throw new YunxiaoError('Could not read the work item workflow; pass the status id instead of its name.');
    }
    const flow = await listWorkItemStatuses({ projectId, workitemTypeId });
    const found = flow.items.find(status => [status.name, status.displayName, status.nameEn].filter(Boolean).includes(raw));
    if (!found) {
      const names = flow.items.map(status => status.name).filter(Boolean).join('、');
      throw new YunxiaoError(`Unknown work item status "${raw}". Valid statuses: ${names}.`);
    }
    return found.id;
  }

  async function updateWorkItem(workItemId, args = {}) {
    const scope = await yunxiao.scope('projex');
    const body = {};
    for (const key of ['subject', 'description', 'formatType', 'status', 'assignedTo', 'priority', 'sprint', 'verifier']) {
      if (args[key] !== undefined) body[key] = text(args[key], key, key === 'description' ? 20000 : 500);
    }
    for (const key of ['labels', 'participants', 'versions']) {
      if (args[key] !== undefined) {
        if (!Array.isArray(args[key]) || args[key].some(value => typeof value !== 'string')) fail(`${key} must be an array of strings.`);
        body[key] = args[key];
      }
    }
    if (args.customFieldValues) {
      if (typeof args.customFieldValues !== 'object' || Array.isArray(args.customFieldValues)) fail('customFieldValues must be an object.');
      Object.assign(body, args.customFieldValues);
    }
    if (!Object.keys(body).length) fail('Nothing to update.');
    if (body.status !== undefined) body.status = await resolveStatusId(workItemId, body.status);
    const { data } = await yunxiao.request({
      method: 'PUT',
      path: `${scope}/workitems/${encodeURIComponent(idText(workItemId, 'workItemId', 100))}`,
      body,
    });
    return data ?? { updated: true };
  }

  async function listWorkItemComments(args = {}) {
    const id = encodeURIComponent(idText(args.workItemId, 'workItemId', 100));
    const query = {
      page: pageInt(args.page, 'page', 1, 100000) ?? 1,
      perPage: pageInt(args.perPage, 'perPage', 1, 100) ?? 20,
    };
    const scope = await yunxiao.scope('projex');
    const result = await yunxiao.request({ path: `${scope}/workitems/${id}/comments`, query });
    return listResult({ ...result, data: result.data?.result ?? result.data });
  }

  async function listWorkItemRelations(args = {}) {
    const id = encodeURIComponent(idText(args.workItemId, 'workItemId', 100));
    const relationType = args.relationType ?? 'ASSOCIATED';
    if (!['PARENT', 'SUB', 'ASSOCIATED', 'DEPEND_ON', 'DEPENDED_BY'].includes(relationType)) fail('Invalid relationType.');
    const scope = await yunxiao.scope('projex');
    const result = await yunxiao.request({ path: `${scope}/workitems/${id}/relationRecords`, query: { relationType } });
    return listResult({ ...result, data: result.data?.result ?? result.data });
  }

  async function addWorkItemComment(workItemId, content, formatType) {
    const scope = await yunxiao.scope('projex');
    const { data } = await yunxiao.request({
      method: 'POST',
      path: `${scope}/workitems/${encodeURIComponent(idText(workItemId, 'workItemId', 100))}/comments`,
      body: { content: requiredText(content, 'content', 20000), formatType: text(formatType, 'formatType', 20) || 'MARKDOWN' },
    });
    return data?.result ?? data ?? { created: true };
  }

  async function listRepositories(args = {}) {
    const scope = await yunxiao.scope('codeup');
    return listResult(
      await yunxiao.request({
        path: `${scope}/repositories`,
        query: {
          search: text(args.search, 'search', 200),
          archived: args.archived === undefined ? undefined : String(Boolean(args.archived)),
          orderBy: text(args.orderBy, 'orderBy', 40),
          sort: text(args.sort, 'sort', 10),
          page: pageInt(args.page, 'page', 1, 100000),
          perPage: pageInt(args.perPage, 'perPage', 1, 100),
        },
      }),
    );
  }

  async function createBranch(args = {}) {
    const scope = await yunxiao.scope('codeup');
    const repo = encodeRepositoryId(idText(args.repositoryId, 'repositoryId'));
    const { data } = await yunxiao.request({
      method: 'POST',
      path: `${scope}/repositories/${repo}/branches`,
      query: { branch: requiredText(args.branch, 'branch', 255), ref: text(args.ref, 'ref', 255) || 'master' },
    });
    return data;
  }

  async function createChangeRequest(args = {}) {
    const scope = await yunxiao.scope('codeup');
    const encoded = encodeRepositoryId(idText(args.repositoryId, 'repositoryId'));
    const source = args.sourceProjectId ?? (await numericRepositoryId(scope, idText(args.repositoryId, 'repositoryId')));
    const target = args.targetProjectId ?? source;
    const body = {
      title: requiredText(args.title, 'title', 200),
      sourceBranch: requiredText(args.sourceBranch, 'sourceBranch', 255),
      targetBranch: requiredText(args.targetBranch, 'targetBranch', 255),
      sourceProjectId: String(source),
      targetProjectId: String(target),
      createFrom: 'WEB',
      description: text(args.description, 'description', 20000),
      reviewerUserIds: args.reviewerUserIds,
      workItemIds: args.workItemIds,
      triggerAIReviewRun: args.triggerAIReviewRun ?? false,
    };
    const { data } = await yunxiao.request({
      method: 'POST',
      path: `${scope}/repositories/${encoded}/changeRequests`,
      body,
    });
    return data;
  }

  async function listCommits(args = {}) {
    const scope = await yunxiao.scope('codeup');
    const repo = encodeRepositoryId(idText(args.repositoryId, 'repositoryId'));
    return listResult(
      await yunxiao.request({
        path: `${scope}/repositories/${repo}/commits`,
        query: {
          refName: text(args.refName, 'refName', 255) || undefined,
          path: text(args.path, 'path', 1000),
          search: text(args.search, 'search', 200),
          since: text(args.since, 'since', 50),
          until: text(args.until, 'until', 50),
          page: pageInt(args.page, 'page', 1, 100000),
          perPage: pageInt(args.perPage, 'perPage', 1, 100),
        },
      }),
    );
  }

  async function listBranches(args = {}) {
    const scope = await yunxiao.scope('codeup');
    const repo = encodeRepositoryId(idText(args.repositoryId, 'repositoryId', 200));
    return listResult(
      await yunxiao.request({
        path: `${scope}/repositories/${repo}/branches`,
        query: {
          search: text(args.search, 'search', 200),
          sort: text(args.sort, 'sort', 20),
          page: pageInt(args.page, 'page', 1, 100000),
          perPage: pageInt(args.perPage, 'perPage', 1, 100),
        },
      }),
    );
  }

  async function listChangeRequests(args = {}) {
    const scope = await yunxiao.scope('codeup');
    const query = {
      state: text(args.state, 'state', 20),
      search: text(args.search, 'search', 200),
      authorIds: text(args.authorIds, 'authorIds', 400),
      reviewerIds: text(args.reviewerIds, 'reviewerIds', 400),
      orderBy: text(args.orderBy, 'orderBy', 40),
      sort: text(args.sort, 'sort', 10),
      page: pageInt(args.page, 'page', 1, 100000),
      perPage: pageInt(args.perPage, 'perPage', 1, 100),
    };
    if (args.repositoryId) query.projectIds = String(await numericRepositoryId(scope, idText(args.repositoryId, 'repositoryId', 200)));
    return listResult(await yunxiao.request({ path: `${scope}/changeRequests`, query }));
  }

  async function getChangeRequest(args = {}) {
    const scope = await yunxiao.scope('codeup');
    const repo = encodeRepositoryId(idText(args.repositoryId, 'repositoryId', 200));
    const { data } = await yunxiao.request({
      path: `${scope}/repositories/${repo}/changeRequests/${encodeURIComponent(idText(args.localId, 'localId', 40))}`,
    });
    return data;
  }

  async function listPipelines(args = {}) {
    const scope = await yunxiao.scope('flow');
    return listResult(
      await yunxiao.request({
        path: `${scope}/pipelines`,
        query: {
          pipelineName: text(args.pipelineName, 'pipelineName', 200),
          statusList: text(args.statusList, 'statusList', 200),
          ...Object.fromEntries(['createStartTime', 'createEndTime', 'executeStartTime', 'executeEndTime'].flatMap(key => {
            const value = text(args[key], key, 40);
            if (!value) return [];
            const timestamp = /^\d{13}$/.test(value) ? Number(value) : Date.parse(value);
            if (!Number.isFinite(timestamp)) fail(`${key} must be an ISO date, date-time, or millisecond timestamp.`);
            return [[key, timestamp]];
          })),
          page: pageInt(args.page, 'page', 1, 100000),
          perPage: pageInt(args.perPage, 'perPage', 1, 100),
        },
      }),
    );
  }

  async function runPipeline(args = {}) {
    const pipelineId = idText(args.pipelineId, 'pipelineId', 100);
    const scope = await yunxiao.scope('flow');
    let params;
    if (args.params) {
      params = JSON.stringify(args.params);
    } else if (args.branch) {
      const detail = await yunxiao.request({ path: `${scope}/pipelines/${encodeURIComponent(pipelineId)}` });
      const sources = detail.data?.pipelineConfig?.sources ?? [];
      const runningBranchs = {};
      for (const source of sources) {
        const repo = source?.data?.repo;
        if (repo) runningBranchs[repo] = args.branch;
      }
      params = JSON.stringify({
        branchModeBranchs: [args.branch],
        ...(Object.keys(runningBranchs).length ? { runningBranchs } : {}),
      });
    }
    const { data } = await yunxiao.request({
      method: 'POST',
      path: `${scope}/pipelines/${encodeURIComponent(pipelineId)}/runs`,
      body: params ? { params } : {},
    });
    return { pipelineRunId: Number(data) };
  }

  async function getPipelineRun(args = {}) {
    const scope = await yunxiao.scope('flow');
    const pipelineId = encodeURIComponent(idText(args.pipelineId, 'pipelineId', 100));
    const path = args.pipelineRunId
      ? `${scope}/pipelines/${pipelineId}/runs/${encodeURIComponent(idText(args.pipelineRunId, 'pipelineRunId', 100))}`
      : `${scope}/pipelines/${pipelineId}/runs/latestPipelineRun`;
    const { data } = await yunxiao.request({ path });
    return data;
  }

  async function searchAssignees(args = {}) {
    const query = text(args.query, 'query', 100)?.trim();
    const scope = await yunxiao.scope('platform');
    const { data } = await yunxiao.request({ method: 'POST', path: `${scope}/members:search`, body: {
      page: 1, perPage: 20, ...(query ? { query } : {}), statuses: ['ENABLED'],
    } });
    const rows = data?.result ?? data;
    if (!Array.isArray(rows)) fail('Unexpected Yunxiao member search response.');
    const users = new Map();
    for (const row of rows) {
      if (typeof row?.userId === 'string' && row.userId) {
        users.set(row.userId, { id: row.userId, name: row.name || row.userId });
      }
    }
    return { items: [...users.values()] };
  }

  async function createWorkItem(args = {}) {
    const spaceId = idText(args.spaceId, 'spaceId', 100);
    const subject = requiredText(args.subject, 'subject', 200);
    const workitemTypeId = idText(args.workitemTypeId, 'workitemTypeId', 100);
    const description = text(args.description, 'description', 100000);
    const formatType = args.formatType || 'MARKDOWN';
    if (!['MARKDOWN', 'RICHTEXT'].includes(formatType)) fail('Invalid formatType.');
    let assignedTo = text(args.assignedTo, 'assignedTo', 100);
    const scope = await yunxiao.scope('projex');
    if (!assignedTo) {
      const { data: user } = await yunxiao.request({ path: '/oapi/v1/platform/user' });
      if (!user?.id) fail('Could not resolve the current Yunxiao user id; pass assignedTo explicitly.');
      assignedTo = user.id;
    }
    const { data } = await yunxiao.request({ method: 'POST', path: `${scope}/workitems`, body: {
      spaceId, subject, workitemTypeId, assignedTo, description, formatType,
      labels: args.labels, sprint: args.sprint, verifier: args.verifier, participants: args.participants,
      versions: args.versions, parentId: args.parentId, customFieldValues: args.customFieldValues ?? undefined,
    } });
    return data;
  }

  async function listWorkItemTypes(args = {}) {
    const scope = await yunxiao.scope('projex');
    return listResult(
      await yunxiao.request({
        path: `${scope}/projects/${idText(args.projectId, 'projectId', 100)}/workitemTypes`,
        query: { category: text(args.category, 'category', 40) },
      }),
    );
  }

  async function listWorkItemStatuses(args = {}) {
    const scope = await yunxiao.scope('projex');
    const { data } = await yunxiao.request({
      path: `${scope}/projects/${idText(args.projectId, 'projectId', 100)}/workitemTypes/${idText(args.workitemTypeId, 'workitemTypeId', 100)}/workflows`,
    });
    const statuses = Array.isArray(data?.statuses) ? data.statuses : [];
    return {
      workflow: data?.name,
      items: statuses.map(status => ({
        id: String(status.id),
        name: status.name,
        displayName: status.displayName || status.name,
        nameEn: status.nameEn,
      })),
    };
  }

  return {
    status,
    saveSettings,
    clearToken,
    testConnection,
    listProjects,
    listSprints,
    listWorkItemTypes,
    listWorkItemStatuses,
    searchWorkItems,
    getWorkItem,
    createWorkItem,
    searchAssignees,
    updateWorkItem,
    addWorkItemComment,
    listWorkItemComments,
    listWorkItemRelations,
    listRepositories,
    listBranches,
    createBranch,
    createChangeRequest,
    listCommits,
    listChangeRequests,
    getChangeRequest,
    listPipelines,
    getPipelineRun,
    runPipeline,
  };
}