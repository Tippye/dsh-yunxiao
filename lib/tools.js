/**
 * Agent tools for Alibaba Cloud Yunxiao (云效).
 *
 * Endpoint coverage follows the official alibabacloud-devops-mcp-server
 * (organization / Projex work items / Codeup repositories + merge requests /
 * Flow pipelines), with a generic escape hatch for the rest of the OpenAPI
 * surface (Testhub, Packages, AppStack, ...).
 *
 * Operations shared with the sidebar panel delegate to the same service methods,
 * so the tool and the UI cannot drift apart.
 */

import {
  encodeFilePath,
  encodeFilePathSegment,
  encodeRepositoryId,
  YunxiaoError,
} from './client.js';

const str = description => ({ type: 'string', ...(description ? { description } : {}) });
const num = description => ({ type: 'number', ...(description ? { description } : {}) });
const bool = description => ({ type: 'boolean', ...(description ? { description } : {}) });

const OUTPUT_LIMIT = 60_000;

function renderJson(args, value) {
  let text;
  try {
    text = JSON.stringify(value, null, 1);
  } catch {
    text = String(value);
  }
  if (text === undefined) text = 'null';
  if (text.length > OUTPUT_LIMIT) {
    text = `${text.slice(0, OUTPUT_LIMIT)}\n…[truncated ${text.length - OUTPUT_LIMIT} characters]`;
  }
  return [{ type: 'text', text }];
}

function listResult({ data, pagination }) {
  return Array.isArray(data)
    ? { items: data, ...(pagination ? { pagination } : {}) }
    : { data, ...(pagination ? { pagination } : {}) };
}

async function currentUserId(yunxiao) {
  const { data } = await yunxiao.request({ path: '/oapi/v1/platform/user' });
  if (!data?.id) throw new YunxiaoError('Could not resolve the current Yunxiao user id; pass assignedTo explicitly.');
  return data.id;
}

async function numericRepositoryId(yunxiao, scope, repositoryId, encoded) {
  if (/^\d+$/.test(String(repositoryId).trim())) return Number(repositoryId);
  const { data } = await yunxiao.request({ path: `${scope}/repositories/${encoded}` });
  const id = Number(data?.id);
  if (!Number.isFinite(id)) {
    throw new YunxiaoError(
      `Could not resolve the numeric id of repository "${repositoryId}"; pass sourceProjectId and targetProjectId explicitly.`,
    );
  }
  return id;
}

export function createTools(yunxiao, service) {
  const read = (name, title, description, parameters, execute) => ({
    name,
    description,
    parameters: { type: 'object', properties: parameters, additionalProperties: false },
    output: { schema: {}, render: renderJson },
    isConcurrencySafe: () => true,
    presentCall: () => ({ card: 'generic', title, kind: 'read' }),
    execute,
  });

  const write = (name, title, description, parameters, execute) => ({
    name,
    description,
    parameters: { type: 'object', properties: parameters, additionalProperties: false },
    output: { schema: {}, render: renderJson },
    isConcurrencySafe: () => false,
    presentCall: () => ({ card: 'generic', title, kind: 'edit' }),
    execute,
  });

  return [
    read(
      'yunxiao_whoami',
      'Yunxiao · whoami',
      'Show the Yunxiao account behind the configured token, its organizations, and the effective API endpoint/edition. Call this first when the organization, project, or repository ids are unknown.',
      {},
      async () => {
        const status = await service.status(true);
        const result = {
          endpoint: { baseUrl: status.settings.baseUrl, edition: status.settings.edition },
          tokenSource: status.tokenSource,
          credentials: status.credentials,
          ...(status.user ? { user: status.user } : {}),
          ...(status.error ? { error: status.error } : {}),
        };
        if (status.user) {
          result.organizationId = status.user.lastOrganization || status.settings.organizationId;
          try {
            const organizations = await yunxiao.request({ path: '/oapi/v1/platform/organizations' });
            result.organizations = organizations.data;
          } catch (error) {
            result.organizationsError = error.message;
          }
        }
        return result;
      },
    ),

    read(
      'yunxiao_list_projects',
      'Yunxiao · list projects',
      'Search Projex projects in the organization. Returns project ids used as spaceId for work items.',
      {
        name: str('Filter by project name (substring).'),
        status: str('Comma-separated project statuses, e.g. "doing".'),
        creator: str('Comma-separated creator user ids.'),
        conditions: str('Raw Projex condition JSON, overrides the simple filters.'),
        orderBy: str('gmtCreate or name.'),
        sort: str('asc or desc.'),
        page: num('1-based page number.'),
        perPage: num('Page size, usually 20.'),
      },
      args => service.listProjects(args),
    ),

    read(
      'yunxiao_list_sprints',
      'Yunxiao · list sprints',
      'List the sprints of a Projex project.',
      {
        projectId: str('Project id (from yunxiao_list_projects).'),
        status: str('Comma-separated sprint statuses, e.g. "TODO,DOING".'),
        page: num('1-based page number.'),
        perPage: num('Page size.'),
      },
      args => service.listSprints(args),
    ),

    read(
      'yunxiao_list_work_items',
      'Yunxiao · search work items',
      'Search Projex work items (requirements, bugs, tasks) in one project. Use assignedTo "self" semantics by passing your own user id from yunxiao_whoami.',
      {
        spaceId: str('Project id that holds the work items.'),
        category: str('Work item category, e.g. Req, Bug, Task. Defaults to Req.'),
        subject: str('Match the subject (substring).'),
        status: str('Comma-separated status names, e.g. "待处理,处理中".'),
        assignedTo: str('Comma-separated assignee user ids.'),
        creator: str('Comma-separated creator user ids.'),
        sprint: str('Comma-separated sprint ids.'),
        workitemType: str('Comma-separated work item type ids.'),
        priority: str('Comma-separated priorities.'),
        tag: str('Comma-separated tag names.'),
        createdAfter: str('YYYY-MM-DD lower bound on creation time.'),
        createdBefore: str('YYYY-MM-DD upper bound on creation time.'),
        updatedAfter: str('YYYY-MM-DD lower bound on update time.'),
        updatedBefore: str('YYYY-MM-DD upper bound on update time.'),
        conditions: str('Raw Projex condition JSON, overrides every filter above.'),
        orderBy: str('Sort field, defaults to gmtCreate.'),
        sort: str('asc or desc, defaults to desc.'),
        page: num('1-based page number.'),
        perPage: num('Page size.'),
      },
      args => service.searchWorkItems(args),
    ),

    read(
      'yunxiao_get_work_item',
      'Yunxiao · get work item',
      'Read one Projex work item in full, including its description and custom fields.',
      { workItemId: str('Work item id.') },
      args => service.getWorkItem(args.workItemId),
    ),

    write(
      'yunxiao_create_work_item',
      'Yunxiao · create work item',
      'Create a Projex work item. assignedTo defaults to the token owner; workitemTypeId comes from the project work item types.',
      {
        spaceId: str('Project id.'),
        subject: str('Title.'),
        workitemTypeId: str('Work item type id of the project.'),
        assignedTo: str('Assignee user id; defaults to the token owner.'),
        description: str('Body text.'),
        formatType: str('RICHTEXT or MARKDOWN, defaults to MARKDOWN.'),
        labels: { type: 'array', items: { type: 'string' }, description: 'Label ids.' },
        sprint: str('Sprint id.'),
        verifier: str('Verifier user id.'),
        participants: { type: 'array', items: { type: 'string' }, description: 'Participant user ids.' },
        versions: { type: 'array', items: { type: 'string' }, description: 'Version ids.' },
        parentId: str('Parent work item id.'),
        customFieldValues: { type: 'object', additionalProperties: true, description: 'Map of custom field id to value.' },
      },
      async args => {
        const scope = await yunxiao.scope('projex');
        const body = {
          spaceId: args.spaceId,
          subject: args.subject,
          workitemTypeId: args.workitemTypeId,
          assignedTo: args.assignedTo || (await currentUserId(yunxiao)),
          description: args.description,
          formatType: args.formatType || 'MARKDOWN',
          labels: args.labels,
          sprint: args.sprint,
          verifier: args.verifier,
          participants: args.participants,
          versions: args.versions,
          parentId: args.parentId,
          ...(args.customFieldValues ? { customFieldValues: args.customFieldValues } : {}),
        };
        const { data } = await yunxiao.request({ method: 'POST', path: `${scope}/workitems`, body });
        return data;
      },
    ),

    write(
      'yunxiao_update_work_item',
      'Yunxiao · update work item',
      'Update fields of an existing work item. Only the fields you pass are changed.',
      {
        workItemId: str('Work item id.'),
        subject: str('New title.'),
        description: str('New body text.'),
        formatType: str('RICHTEXT or MARKDOWN.'),
        status: str('New status name or id. Names are resolved through the work item workflow; the API requires the status id.'),
        assignedTo: str('New assignee user id.'),
        priority: str('New priority.'),
        labels: { type: 'array', items: { type: 'string' }, description: 'Replacement label ids.' },
        sprint: str('New sprint id.'),
        participants: { type: 'array', items: { type: 'string' }, description: 'Replacement participant user ids.' },
        verifier: str('New verifier user id.'),
        versions: { type: 'array', items: { type: 'string' }, description: 'Replacement version ids.' },
        customFieldValues: { type: 'object', additionalProperties: true, description: 'Map of custom field id to value.' },
      },
      args => service.updateWorkItem(args.workItemId, args),
    ),

    write(
      'yunxiao_add_work_item_comment',
      'Yunxiao · comment on work item',
      'Add a comment to a work item.',
      {
        workItemId: str('Work item id.'),
        content: str('Comment text.'),
        formatType: str('RICHTEXT or MARKDOWN, defaults to MARKDOWN.'),
      },
      args => service.addWorkItemComment(args.workItemId, args.content, args.formatType),
    ),

    read(
      'yunxiao_list_repositories',
      'Yunxiao · list repositories',
      'List Codeup repositories in the organization.',
      {
        search: str('Filter by repository name or path.'),
        archived: bool('Include archived repositories when true.'),
        orderBy: str('Sort field, e.g. last_activity_at.'),
        sort: str('asc or desc.'),
        page: num('1-based page number.'),
        perPage: num('Page size.'),
      },
      args => service.listRepositories(args),
    ),

    read(
      'yunxiao_list_branches',
      'Yunxiao · list branches',
      'List branches of a Codeup repository. repositoryId accepts a numeric id or "orgId/repo-name".',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name".'),
        search: str('Filter branches by name.'),
        sort: str('name_asc, name_desc, updated_asc, or updated_desc.'),
        page: num('1-based page number.'),
        perPage: num('Page size.'),
      },
      args => service.listBranches(args),
    ),

    write(
      'yunxiao_create_branch',
      'Yunxiao · create branch',
      'Create a branch from an existing ref.',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name".'),
        branch: str('New branch name.'),
        ref: str('Source branch or commit, defaults to master.'),
      },
      async args => {
        const scope = await yunxiao.scope('codeup');
        const repo = encodeRepositoryId(args.repositoryId);
        const { data } = await yunxiao.request({
          method: 'POST',
          path: `${scope}/repositories/${repo}/branches`,
          query: { branch: args.branch, ref: args.ref || 'master' },
        });
        return data;
      },
    ),

    read(
      'yunxiao_get_file',
      'Yunxiao · read file',
      'Read one file from a repository branch, optionally at a specific commit. Base64 content is also decoded into `text` when it is UTF-8 text of at most 256 KiB.',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name".'),
        filePath: str('Repository-relative file path, e.g. src/index.ts.'),
        ref: str('Branch or commit, defaults to master.'),
      },
      async args => {
        const scope = await yunxiao.scope('codeup');
        const repo = encodeRepositoryId(args.repositoryId);
        const path = encodeFilePathSegment(args.filePath);
        const { data } = await yunxiao.request({
          path: `${scope}/repositories/${repo}/files/${path}`,
          query: { ref: args.ref || 'master' },
        });
        if (data && data.encoding === 'base64' && typeof data.content === 'string') {
          const bytes = Buffer.from(data.content, 'base64');
          data.decodedBytes = bytes.length;
          if (bytes.length <= 262_144) {
            const text = bytes.toString('utf8');
            if (!text.includes('\u0000') && Buffer.from(text, 'utf8').equals(bytes)) data.text = text;
          }
        }
        return data;
      },
    ),

    write(
      'yunxiao_write_file',
      'Yunxiao · write file',
      'Commit a file to a branch: set create=true for a new file (POST), otherwise the existing file is updated (PUT).',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name".'),
        filePath: str('Repository-relative file path.'),
        content: str('Full new file content (text, or base64 when encoding is base64).'),
        commitMessage: str('Commit message.'),
        branch: str('Target branch, defaults to master.'),
        create: bool('Create instead of update; defaults to false.'),
        encoding: str('text or base64, defaults to text.'),
      },
      async args => {
        const scope = await yunxiao.scope('codeup');
        const repo = encodeRepositoryId(args.repositoryId);
        const encoding = args.encoding || 'text';
        const branch = args.branch || 'master';
        if (args.create) {
          const { data } = await yunxiao.request({
            method: 'POST',
            path: `${scope}/repositories/${repo}/files`,
            body: {
              branch,
              filePath: encodeFilePath(args.filePath),
              content: args.content,
              commitMessage: args.commitMessage,
              encoding,
            },
          });
          return data;
        }
        const { data } = await yunxiao.request({
          method: 'PUT',
          path: `${scope}/repositories/${repo}/files/${encodeFilePathSegment(args.filePath)}`,
          body: { branch, content: args.content, commitMessage: args.commitMessage, encoding },
        });
        return data;
      },
    ),

    read(
      'yunxiao_list_commits',
      'Yunxiao · list commits',
      'List commits on a branch or ref.',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name".'),
        refName: str('Branch or commit to walk from, defaults to master.'),
        path: str('Limit to commits touching this path.'),
        search: str('Filter by message.'),
        since: str('ISO-8601 lower bound.'),
        until: str('ISO-8601 upper bound.'),
        page: num('1-based page number.'),
        perPage: num('Page size.'),
      },
      async args => {
        const scope = await yunxiao.scope('codeup');
        const repo = encodeRepositoryId(args.repositoryId);
        return listResult(
          await yunxiao.request({
            path: `${scope}/repositories/${repo}/commits`,
            query: {
              refName: args.refName || 'master',
              path: args.path,
              search: args.search,
              since: args.since,
              until: args.until,
              page: args.page,
              perPage: args.perPage,
            },
          }),
        );
      },
    ),

    read(
      'yunxiao_list_change_requests',
      'Yunxiao · list merge requests',
      'List Codeup merge requests across the organization, restricted to one repository when repositoryId is given.',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name"; omit to search the whole organization.'),
        state: str('opened, merged, or closed.'),
        search: str('Filter by title.'),
        authorIds: str('Comma-separated author user ids.'),
        reviewerIds: str('Comma-separated reviewer user ids.'),
        orderBy: str('created_at or updated_at.'),
        sort: str('asc or desc.'),
        page: num('1-based page number.'),
        perPage: num('Page size.'),
      },
      args => service.listChangeRequests(args),
    ),

    read(
      'yunxiao_get_change_request',
      'Yunxiao · get merge request',
      'Read one merge request, including its branches, reviewers, and merge status.',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name".'),
        localId: str('Merge request local id inside the repository.'),
      },
      args => service.getChangeRequest(args),
    ),

    write(
      'yunxiao_create_change_request',
      'Yunxiao · create merge request',
      'Open a merge request from sourceBranch into targetBranch. sourceProjectId/targetProjectId default to the repository id.',
      {
        repositoryId: str('Numeric repository id or "orgId/repo-name".'),
        title: str('Merge request title.'),
        sourceBranch: str('Source branch.'),
        targetBranch: str('Target branch.'),
        description: str('Body text.'),
        reviewerUserIds: { type: 'array', items: { type: 'string' }, description: 'Reviewer user ids.' },
        workItemIds: str('Comma-separated work item ids to link.'),
        sourceProjectId: num('Numeric source repository id; resolved automatically when omitted.'),
        targetProjectId: num('Numeric target repository id; resolved automatically when omitted.'),
        triggerAIReviewRun: bool('Request an AI review run.'),
      },
      async args => {
        const scope = await yunxiao.scope('codeup');
        const encoded = encodeRepositoryId(args.repositoryId);
        const source = args.sourceProjectId ?? (await numericRepositoryId(yunxiao, scope, args.repositoryId, encoded));
        const target = args.targetProjectId ?? source;
        const body = {
          title: args.title,
          sourceBranch: args.sourceBranch,
          targetBranch: args.targetBranch,
          sourceProjectId: String(source),
          targetProjectId: String(target),
          createFrom: 'WEB',
          description: args.description,
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
      },
    ),

    read(
      'yunxiao_list_pipelines',
      'Yunxiao · list pipelines',
      'List Flow pipelines in the organization, optionally filtered by name or creation time.',
      {
        pipelineName: str('Filter by pipeline name.'),
        statusList: str('Comma-separated pipeline statuses.'),
        createStartTime: str('Creation lower bound, e.g. 2026-01-01.'),
        createEndTime: str('Creation upper bound, e.g. 2026-01-31.'),
        page: num('1-based page number.'),
        perPage: num('Page size.'),
      },
      args => service.listPipelines(args),
    ),

    read(
      'yunxiao_get_pipeline',
      'Yunxiao · get pipeline',
      'Read one pipeline definition, including its sources and stages.',
      { pipelineId: str('Pipeline id.') },
      async args => {
        const scope = await yunxiao.scope('flow');
        const { data } = await yunxiao.request({ path: `${scope}/pipelines/${encodeURIComponent(args.pipelineId)}` });
        return data;
      },
    ),

    read(
      'yunxiao_get_pipeline_run',
      'Yunxiao · get pipeline run',
      'Read one pipeline run, or the latest run when pipelineRunId is omitted.',
      {
        pipelineId: str('Pipeline id.'),
        pipelineRunId: str('Pipeline run id; omit for the latest run.'),
      },
      args => service.getPipelineRun(args),
    ),

    write(
      'yunxiao_run_pipeline',
      'Yunxiao · run pipeline',
      'Trigger a pipeline run and return its run id. Pass per-repository branches with branch, or a raw run params object with params.',
      {
        pipelineId: str('Pipeline id.'),
        branch: str('Branch to run every repository source at.'),
        params: {
          type: 'object',
          additionalProperties: true,
          description: 'Raw Flow run params, e.g. { "envs": {...}, "runningBranchs": {...} }. Overrides branch.',
        },
      },
      async args => {
        const scope = await yunxiao.scope('flow');
        let params;
        if (args.params) {
          params = JSON.stringify(args.params);
        } else if (args.branch) {
          const detail = await yunxiao.request({ path: `${scope}/pipelines/${encodeURIComponent(args.pipelineId)}` });
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
          path: `${scope}/pipelines/${encodeURIComponent(args.pipelineId)}/runs`,
          body: params ? { params } : {},
        });
        return { pipelineRunId: Number(data) };
      },
    ),

    read(
      'yunxiao_api_request',
      'Yunxiao · raw API request',
      'Call any Yunxiao OpenAPI path not covered by the dedicated tools (Testhub, Packages, AppStack, organization members, work item types, ...). The path must start with /oapi/v1/. Prefer a dedicated tool when one exists.',
      {
        method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'], description: 'HTTP method, defaults to GET.' },
        path: str('OpenAPI path, e.g. /oapi/v1/platform/organizations.'),
        query: { type: 'object', additionalProperties: true, description: 'Query string values.' },
        body: { type: 'object', additionalProperties: true, description: 'JSON request body for POST/PUT.' },
      },
      async args => {
        if (!/^\/oapi\/v1\//.test(args.path)) {
          throw new YunxiaoError(`Refusing a non-OpenAPI path: ${args.path} (it must start with /oapi/v1/)`);
        }
        return listResult(
          await yunxiao.request({
            method: args.method || 'GET',
            path: args.path,
            query: args.query,
            body: args.body,
          }),
        );
      },
    ),

    {
      name: 'yunxiao_auth',
      description:
        'Inspect, save, or clear the Yunxiao personal access token used by the yunxiao_* tools and the 云效 panel. Saving stores the token in the DSH credentials store, not in conversation or plugin config.',
      parameters: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['status', 'save', 'clear'], description: 'Defaults to status.' },
          token: str('Personal access token; required for save.'),
          probe: bool('With status, verify the token against the API.'),
        },
        additionalProperties: false,
      },
      output: { schema: {}, render: renderJson },
      isConcurrencySafe: () => false,
      presentCall: () => ({ card: 'generic', title: 'Yunxiao · auth', kind: 'edit' }),
      execute: async args => {
        const action = args.action || 'status';
        if (action === 'save') {
          const token = String(args.token ?? '').trim();
          if (!token) throw new YunxiaoError('A non-empty token is required for action "save".');
          const status = await service.saveSettings({ token });
          return { saved: true, endpoint: status.settings, tokenSource: status.tokenSource };
        }
        if (action === 'clear') {
          await service.clearToken();
          return { cleared: true };
        }
        const status = await service.status(Boolean(args.probe));
        const result = {
          endpoint: status.settings,
          tokenSource: status.tokenSource,
          configured: status.configured,
          credentials: status.credentials,
        };
        if (status.user) result.user = status.user;
        if (status.error) result.error = status.error;
        return result;
      },
    },
  ];
}