window.__ModuleLoader__.load({
  id: '@local/dsh-yunxiao',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useRef } = React;
    const NS = 'dsh-yunxiao';

    const en = {
      attachments: "Attachments", getAttachment: "Get download link", downloadAttachment: "Download", noDownload: "No download link was returned.",
      editWork: "Edit work item", runNow: "Run pipeline", confirmRun: "Run {name} with its default configuration?", runQueued: "Pipeline run requested", assigneeEdit: "Type @ to change the assignee. Leave blank to keep the current assignee.",
      newWork: 'New work item', create: 'Create', creating: 'Creating…', cancelCreate: 'Cancel',
      itemTitle: 'Title', itemTemplate: 'Template', noTemplates: 'No enabled templates for this category.',
      createdWork: 'Work item created.', assigneeId: 'Assignee (optional)', assigneePlaceholder: 'Type @ to find a person', noAssignees: 'No matching members.', chooseAssignee: 'Choose a member from the list or clear the search.', assigneeResults: 'Organization members', defaultAssignee: 'Leave blank to assign to your account.',
      sendingComment: 'Sending…', missingWorkLink: 'Yunxiao did not provide a link for this work item.',
      activity: 'Activity', noActivity: 'No activity yet',
      'workitem.created': 'Work item created', 'workitem.updated': 'Work item updated', 'workitem.transitioned': 'Status changed',
      'workitem.association.changed': 'Relationship changed', 'workitem.attachment.changed': 'Attachment changed',
      reviewComments: 'Review comments', globalComments: 'General comments', inlineComments: 'Inline comments',
      commentType: 'Comment type', resolution: 'Resolution', unresolved: 'Unresolved', resolved: 'Resolved',
      runHistory: 'Run history', runNumber: 'Run #{id}', runJobs: 'Jobs for run #{id}', noJobs: 'No jobs available for this run',
      jobLog: 'Job log', noJobLog: 'No log available for this job', moreJobLog: 'Yunxiao reports more log output. Refresh to request the available output again.',
      createdTime: 'Created', updatedTime: 'Updated', statusTime: 'Status changed',
      comments: 'Comments', noComments: 'No comments yet', relations: 'Related work', noRelations: 'No records of this type',
      relationFilter: 'Relationship type', PARENT: 'Parent', SUB: 'Children', ASSOCIATED: 'Related', DEPEND_ON: 'Depends on', DEPENDED_BY: 'Required by',
      previousItem: 'Back to previous work item', openWorkItem: 'Open work item in Yunxiao', unknownAuthor: 'Unknown author',

      forbidden: 'You don’t have permission for this operation.', unauthorized: 'Authentication failed. Check your access token in Settings.', sessionUnauthorized: 'Your DSH session has expired. Sign in again.',
      panel: 'Yunxiao', loadedCount: '{count} on this page', connectionOk: 'Connection verified', settingsSaved: 'Settings saved', removeConfirm: 'Remove the saved Yunxiao token?',
      title: 'Yunxiao',
      subtitle: 'Work items, repositories, merge requests and pipelines from Alibaba Cloud DevOps.',
      work: 'Work items', code: 'Repositories', pipelines: 'Pipelines', settings: 'Settings',
      noMine: 'No items assigned to you match these filters.', showAll: 'Show all',
      loading: 'Loading…', retry: 'Retry', refresh: 'Refresh', empty: 'Nothing to show',
      notConfigured: 'Add a personal access token to start.', openSettings: 'Open settings',
      project: 'Project', category: 'Type', requirement: 'Requirement', bug: 'Bug', task: 'Task',
      mine: 'Assigned to me', all: 'All', status: 'Status', allStatus: 'All statuses',
      todo: 'To do', doing: 'In progress', done: 'Done',
      subject: 'Subject', assignee: 'Assignee', priority: 'Priority', updated: 'Updated',
      detail: 'Details', description: 'Description', noDescription: 'No description.',
      changeStatus: 'Change status', comment: 'Comment', commentPlaceholder: 'Write a comment…',
      send: 'Send', sent: 'Comment added', saved: 'Status updated', back: 'Back to list',
      total: '{count} items', page: 'Page {page}', previous: 'Previous', next: 'Next',
      searchRepos: 'Search repositories', searchPipelines: 'Search pipelines', repo: 'Repository', branches: 'Recent branches · up to 12',
      mergeRequests: 'Merge requests', openMRs: 'Open merge requests · first 20', noMRs: 'No open merge requests',
      author: 'Author', target: 'Target', source: 'Source', openInCodeup: 'Open in Codeup',
      pipeline: 'Pipeline', pipelineRun: 'Latest run', runStatus: 'Run status', noRun: 'No run information',
      trigger: 'Triggered by', started: 'Started', finished: 'Finished',
      endpoint: 'API endpoint', token: 'Personal access token', tokenHint: 'Saved in the DSH credentials store. Leave empty to keep the current token.',
      tokenSaved: 'Token saved', tokenCleared: 'Token removed', baseUrl: 'Base URL', baseUrlHint: 'Region edition uses your organization domain, e.g. https://your-org.devops.aliyuncs.com.',
      edition: 'Edition', auto: 'Auto', central: 'Central', region: 'Region', organization: 'Organization id',
      organizationHint: 'Optional. Defaults to the token last organization.', save: 'Save', saving: 'Saving…',
      test: 'Test connection', clearToken: 'Remove token', configured: 'Token configured', notConfiguredShort: 'No token',
      connectedAs: 'Connected as {name}', tokenSource: 'Source: {source}', error: 'Something went wrong',
      requiredProject: 'Choose a project to list work items.', search: 'Search', cancel: 'Cancel',
    };
    const zh = {
      attachments: "附件", getAttachment: "获取下载链接", downloadAttachment: "下载", noDownload: "云效未返回下载链接。",
      editWork: "编辑工作项", runNow: "运行流水线", confirmRun: "使用默认配置运行「{name}」？", runQueued: "已发起流水线运行", assigneeEdit: "输入 @ 更换负责人，留空则保留当前负责人。",
      newWork: '新建工作项', create: '创建', creating: '创建中…', cancelCreate: '取消',
      itemTitle: '标题', itemTemplate: '工作项模板', noTemplates: '此分类下没有已启用的模板。',
      createdWork: '工作项已创建。', assigneeId: '负责人（选填）', assigneePlaceholder: '输入 @ 选人', noAssignees: '未找到匹配的成员。', chooseAssignee: '请从列表选择成员，或清空搜索。', assigneeResults: '组织成员', defaultAssignee: '留空时指派给当前账号。',
      sendingComment: '发送中…', missingWorkLink: '云效未提供此工作项的网页链接。',
      activity: '动态', noActivity: '暂无动态',
      'workitem.created': '创建工作项', 'workitem.updated': '更新工作项', 'workitem.transitioned': '变更状态',
      'workitem.association.changed': '变更关联项', 'workitem.attachment.changed': '变更附件',
      reviewComments: '评审评论', globalComments: '全局评论', inlineComments: '行内评论',
      commentType: '评论类型', resolution: '解决状态', unresolved: '未解决', resolved: '已解决',
      runHistory: '运行历史', runNumber: '运行 #{id}', runJobs: '运行 #{id} 的任务', noJobs: '本次运行暂无任务',
      jobLog: '任务日志', noJobLog: '此任务暂无日志', moreJobLog: '云效提示还有日志输出，可刷新以重新获取当前可用的日志。',
      createdTime: '创建于', updatedTime: '更新于', statusTime: '状态变更于',
      comments: '评论', noComments: '暂无评论', relations: '关联项', noRelations: '暂无此类关联记录',
      relationFilter: '关联类型', PARENT: '父项', SUB: '子项', ASSOCIATED: '关联', DEPEND_ON: '依赖项', DEPENDED_BY: '支撑项',
      previousItem: '返回上一条工作项', openWorkItem: '在云效中打开工作项', unknownAuthor: '未知作者',

      forbidden: '当前账号没有此操作的权限。', unauthorized: '身份验证失败，请在设置中检查访问令牌。', sessionUnauthorized: 'DSH 会话已失效，请重新登录。',
      loadedCount: '本页 {count} 条', connectionOk: '连接成功', settingsSaved: '设置已保存', removeConfirm: '移除已保存的云效令牌？',
      panel: '云效', title: '云效', subtitle: '读取和操作阿里云云效的工作项、代码库、合并请求与流水线。',
      work: '工作项', code: '代码库', pipelines: '流水线', settings: '设置',
      noMine: '当前筛选下没有指派给你的工作项。', showAll: '查看全部',
      loading: '加载中…', retry: '重试', refresh: '刷新', empty: '暂无数据',
      notConfigured: '先在设置里填入个人访问令牌。', openSettings: '去设置',
      project: '项目', category: '类型', requirement: '需求', bug: '缺陷', task: '任务',
      mine: '指派给我', all: '全部', status: '状态', allStatus: '全部状态',
      todo: '待处理', doing: '处理中', done: '已完成',
      subject: '标题', assignee: '负责人', priority: '优先级', updated: '更新于',
      detail: '详情', description: '描述', noDescription: '暂无描述。',
      changeStatus: '修改状态', comment: '评论', commentPlaceholder: '写一条评论…',
      send: '发送', sent: '评论已添加', saved: '状态已更新', back: '返回列表',
      total: '共 {count} 条', page: '第 {page} 页', previous: '上一页', next: '下一页',
      searchRepos: '搜索代码库', searchPipelines: '搜索流水线', repo: '代码库', branches: '最近分支 · 最多 12 条',
      mergeRequests: '合并请求', openMRs: '开启中的合并请求 · 前 20 条', noMRs: '没有开启中的合并请求',
      author: '作者', target: '目标', source: '来源', openInCodeup: '在云效中打开',
      pipeline: '流水线', pipelineRun: '最近一次运行', runStatus: '运行状态', noRun: '没有运行信息',
      trigger: '触发人', started: '开始', finished: '结束',
      endpoint: 'API 地址', token: '个人访问令牌', tokenHint: '保存在 DSH 凭据库中；留空表示沿用当前令牌。',
      tokenSaved: '令牌已保存', tokenCleared: '令牌已移除', baseUrl: 'API 地址', baseUrlHint: 'Region 站填写组织专属域名，如 https://your-org.devops.aliyuncs.com。',
      edition: '站点类型', auto: '自动', central: '中心站', region: 'Region 站', organization: '组织 ID',
      organizationHint: '可选，默认使用令牌的最近组织。', save: '保存', saving: '保存中…',
      test: '测试连接', clearToken: '移除令牌', configured: '令牌已配置', notConfiguredShort: '未配置令牌',
      connectedAs: '已连接：{name}', tokenSource: '来源：{source}', error: '出错了',
      requiredProject: '先选择一个项目才能查看工作项。', search: '搜索', cancel: '取消',
    };

    const ICON = {
      edit: "m4 16 12-12 4 4-12 12H4zM14 6l4 4", play: "M7 4l14 8-14 8z",
      plus: 'M12 5v14M5 12h14',
      branch: 'M6 3v12m0 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-18v3a6 6 0 0 1-6 6H6m12-9a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z',
      work: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
      code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
      pipeline: 'M4 5h5v5H4zm11 9h5v5h-5zm-6-6h5a4 4 0 0 1 4 4v2M6.5 10v8H15',
      settings: 'M4 7h6m4 0h6M4 17h10m4 0h2M10 4v6m4 4v6',
      refresh: 'M20 7v5h-5M4 17v-5h5m-4-1a7 7 0 0 1 12-5l3 4M4 14l3 4a7 7 0 0 0 12-5',
      back: 'm11 5-7 7 7 7M4 12h16', prev: 'm15 6-6 6 6 6', next: 'm9 6 6 6-6 6',
      user: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
      folder: 'M3 6h7l2 2h9v11H3z', filter: 'M3 5h18l-7 8v5l-4 2v-7z',
      search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm-2 5 6 6',
      external: 'M14 4h6v6m0-6-9 9m8 0v7H4V5h7', history: 'M3 12a9 9 0 1 1 3 7m-3-7V6m0 6h6m3-5v5l3 2',
      send: 'm3 4 18 8-18 8 3-8zm3 8h15', comment: 'M4 4h16v12h-9l-5 4v-4H4z',
      save: 'M5 3h12l4 4v14H3V3zm2 0v6h9V3M7 21v-8h10v8',
      test: 'M2 12h5l3-7 4 14 3-7h5', key: 'M15 12a5 5 0 1 0-4-8 5 5 0 0 0 0 6l-7 7v3h3v-3h3l3-3',
      remove: 'M4 6h16M9 6V3h6v3M6 6l1 14h10l1-14M10 10v6m4-6v6',
      warning: 'M12 3 2 20h20zM12 9v4m0 3h.01', check: 'm5 12 4 4L19 6',
    };

    const CSS = `
.yxx{height:100%;min-height:0;overflow:auto;container-type:inline-size;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit}
.yxx *{box-sizing:border-box}
.yxx button,.yxx input,.yxx select,.yxx textarea{font:inherit;color:inherit}
.yxx button{cursor:pointer}
.yxx :disabled{opacity:.55;cursor:default}
.yxx :focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.yxx-shell{max-width:1440px;margin:0 auto;padding:0 22px 28px}
.yxx-head{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:16px;min-height:56px;margin-bottom:14px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base)}
.yxx h1,.yxx h2,.yxx h3,.yxx p{margin:0}
.yxx h1{font-size:16px;font-weight:680;white-space:nowrap}
.yxx h2{font-size:16px;font-weight:650;overflow-wrap:anywhere}
.yxx h3{font-size:13px;font-weight:650}
.yxx-tabs,.yxx-actions,.yxx-item-meta,.yxx-status-line{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-width:0}
.yxx-tabs{flex-wrap:nowrap}.yxx-head-end{margin-inline-start:auto;flex-wrap:nowrap}.yxx-head-end .yxx-chip{max-width:170px}
.yxx-btn{display:inline-flex;flex:none;align-items:center;justify-content:center;min-width:34px;min-height:34px;gap:6px;padding:5px 9px;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);text-decoration:none;white-space:nowrap}
.yxx-btn-icon{width:34px;padding:0}.yxx-btn:hover,.yxx-item:hover{background:var(--dsw-alias-bg-layer-2)}
.yxx-btn[aria-pressed=true],.yxx-btn[aria-current=page],.yxx-btn-primary{color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l1)}
.yxx-btn-danger,.yxx-error{color:var(--dsw-alias-state-error-primary)!important}
.yxx-bar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:9px;min-height:36px}.yxx-spacer{flex:1}
.yxx-field{display:grid;gap:5px;min-width:0;font-size:12px;color:var(--dsw-alias-label-secondary)}
.yxx-control{display:inline-flex;align-items:center;gap:6px;min-width:0;color:var(--dsw-alias-label-secondary)}
.yxx-field input,.yxx-field select,.yxx-field textarea,.yxx-input,.yxx-control input,.yxx-control select{min-width:0;max-width:100%;min-height:34px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:7px;padding:5px 8px;font-size:13px}
.yxx-control select{max-width:180px}.yxx-search{flex:0 1 290px}.yxx-search input{width:100%}
.yxx-muted,.yxx-help,.yxx-item-meta,.yxx-status-line{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}
.yxx-chip,.yxx-state{display:inline-block;min-width:0;max-width:100%;padding:2px 7px;border-radius:5px;background:var(--dsw-alias-bg-layer-2);font-size:11px;line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.yxx-chip-ok{color:var(--dsw-alias-state-success-primary)}
.yxx-list{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1)}
.yxx-item{display:flex;align-items:center;gap:9px;width:100%;padding:8px 10px;border:0;border-bottom:1px solid var(--dsw-alias-border-l1);background:transparent;color:inherit;text-align:left;text-decoration:none;min-height:44px}
.yxx-item:first-child{border-start-start-radius:8px;border-start-end-radius:8px}.yxx-item:last-child{border:0;border-end-start-radius:8px;border-end-end-radius:8px}
.yxx-item[aria-pressed=true]{background:var(--dsw-alias-bg-layer-2);box-shadow:inset 2px 0 var(--dsw-alias-brand-primary)}
.yxx-item-main{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.yxx-item-title{font-size:13px;line-height:1.45;overflow-wrap:anywhere}.yxx-item-meta{column-gap:9px;overflow-wrap:anywhere}
.yxx-serial{font-family:ui-monospace,monospace;font-size:11px;color:var(--dsw-alias-label-secondary);white-space:nowrap}.yxx-end-icon{color:var(--dsw-alias-label-secondary);margin-inline-start:auto}
.yxx-notice{display:flex;align-items:center;gap:8px;min-height:38px;padding:6px 10px;margin-bottom:9px;border-radius:7px;background:var(--dsw-alias-bg-layer-2);font-size:13px;overflow-wrap:anywhere}.yxx-notice span{min-width:0}
.yxx-empty{display:flex;justify-content:center;align-items:center;gap:8px;min-height:92px;padding:14px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:13px}
.yxx-detail{display:grid;gap:11px;align-content:start;min-width:0;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:9px;padding:12px}
.yxx-detail-head{display:flex;align-items:flex-start;gap:7px;min-width:0}.yxx-detail-head .yxx-item-main{align-self:center}.yxx-detail-head .yxx-item-main > *{min-width:0;overflow-wrap:anywhere}.yxx-detail-body{display:grid;gap:6px;min-width:0}.yxx-body-head{display:flex;align-items:center;gap:7px}
.yxx-prose{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.65;max-height:50vh;overflow:auto;padding:9px 10px;border-radius:6px;background:var(--dsw-alias-bg-layer-2)}
.yxx-comment{display:flex;align-items:flex-end;gap:6px}.yxx-comment textarea{width:100%;min-height:56px;resize:vertical}.yxx-form{display:grid;gap:12px;max-width:620px}.yxx-form-row{display:grid;gap:10px;grid-template-columns:minmax(0,2fr) minmax(0,1fr)}
.yxx-settings-group{display:grid;gap:9px;padding:12px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px}.yxx-pager{display:flex;align-items:center;gap:5px;justify-content:flex-end;margin-top:7px}.yxx-pager .yxx-muted:first-child{margin-inline-end:auto}
.yxx-times{display:flex;flex-wrap:wrap;gap:8px 16px;margin:0;font-size:12px}.yxx-times dt{color:var(--dsw-alias-label-secondary)}.yxx-times dd{margin:2px 0 0}
.yxx-work-section{padding-top:10px;border-top:1px solid var(--dsw-alias-border-l1)}
.yxx-comments{list-style:none;margin:0;padding:0}.yxx-comments li{padding:7px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.yxx-comments li:last-child{border-bottom:0}
.yxx-comment-text{margin-top:3px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.6}
.yxx-disclosure > summary{cursor:pointer;padding:5px 0;font-size:13px;font-weight:650}
.yxx-disclosure > .yxx-detail-body{margin-top:4px}
.yxx-row-actions{display:flex;align-items:center;min-width:0;border-bottom:1px solid var(--dsw-alias-border-l1);padding-inline-end:4px}
.yxx-row-actions:last-child{border-bottom:0}.yxx-row-actions .yxx-item{border:0;min-width:0}
.yxx-inline-detail{padding:9px 10px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.yxx-inline-detail:last-child{border-bottom:0}
.yxx-comments .yxx-comment-replies{padding-inline-start:12px;border-inline-start:1px solid var(--dsw-alias-border-l1);margin-top:6px}
.yxx-history-row:not(:last-child){border-bottom:1px solid var(--dsw-alias-border-l1)}
.yxx-history-row .yxx-item{border:0}
.yxx-job-log{margin:0;font-family:ui-monospace,monospace}
.yxx-assignee{min-width:0}.yxx-assignee-results{margin-top:4px;padding:4px;max-height:180px;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:6px}
.yxx-assignee-results [role=option]{cursor:pointer}.yxx-assignee-results [aria-selected=true]{background:var(--dsw-alias-bg-layer-2)}
.yxx-create-dialog{width:min(540px,calc(100% - 24px));max-height:calc(100% - 24px);overflow:auto;padding:16px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
.yxx-create-dialog::backdrop{background:rgba(0,0,0,.48)}.yxx-create-dialog textarea{resize:vertical}
.yxx-split{display:grid;gap:12px;align-items:start}.yxx-split> *{min-width:0}
@container (min-width:880px){.yxx-split-open{grid-template-columns:minmax(0,5fr) minmax(0,7fr)}.yxx-split-open .yxx-master{position:sticky;top:66px;max-height:calc(100vh - 88px);overflow:auto;padding:2px}}
@container (max-width:879px){.yxx-split-open .yxx-master{display:none}}
@container (max-width:530px){.yxx-shell{padding-inline:10px}.yxx-head{gap:8px}.yxx-head-end .yxx-chip{display:none}.yxx-form-row{grid-template-columns:minmax(0,1fr)}}
`;

    async function api(input, signal) {
      const response = await fetch('/api/dsh-yunxiao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal,
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        const error = new Error(payload?.error?.message || `HTTP ${response.status}`);
        error.code = payload?.error?.code;
        error.status = response.status;
        throw error;
      }
      return payload.value;
    }

    function officialRead(name, args, signal) {
      return api({ action: 'officialRead', name, args }, signal);
    }

    const PROJECT_KEY = 'dsh-yunxiao.work.project';
    function readPreferredProject() {
      try { return localStorage.getItem(PROJECT_KEY) || ''; } catch { return ''; }
    }
    function rememberProject(projectId) {
      try { if (projectId) localStorage.setItem(PROJECT_KEY, projectId); } catch { /* storage unavailable */ }
    }

    function Icon({ kind = 'branch', size = 17, className }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false, className,
        style: { flex: 'none', display: 'block' } },
      h('path', { d: ICON[kind], fill: 'none', stroke: 'currentColor', strokeWidth: 1.65, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    }

    function Action({ icon, label, primary, danger, href, children, ...props }) {
      const className = ['yxx-btn', children ? '' : 'yxx-btn-icon', primary ? 'yxx-btn-primary' : '', danger ? 'yxx-btn-danger' : ''].join(' ');
      const element = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { type: 'button' };
      return h(href ? 'a' : 'button', { ...element, className, title: label, 'aria-label': label, ...props }, h(Icon, { kind: icon }), children);
    }

    function Control({ label, icon, children, className = '' }) {
      return h('label', { className: `yxx-control ${className}`, title: label },
        h(Icon, { kind: icon, size: 15 }), React.cloneElement(children, { 'aria-label': label }));
    }

    function Empty({ children, loading }) {
      return h('div', { className: 'yxx-empty', role: 'status' }, loading ? h(Icon, { kind: 'refresh' }) : null, children);
    }

    function Pager({ t, page, size, count, pagination, setPage, loading }) {
      const totalPages = pagination?.totalPages ?? (Number.isFinite(pagination?.total) ? Math.ceil(pagination.total / size) : undefined);
      const more = Number.isFinite(totalPages) ? page < totalPages : count === size;
      return h('div', { className: 'yxx-pager' },
        h('span', { className: 'yxx-muted' }, pagination?.total != null ? t('total', { count: pagination.total }) : t('loadedCount', { count })),
        page > 1 || more ? h(React.Fragment, null,
          h(Action, { icon: 'prev', label: t('previous'), disabled: loading || page <= 1, onClick: () => setPage(page - 1) }),
          h('span', { className: 'yxx-muted' }, t('page', { page })),
          h(Action, { icon: 'next', label: t('next'), disabled: loading || !more, onClick: () => setPage(page + 1) })) : null);
    }

    function DetailHeader({ t, title, meta, onBack, backLabel, children }) {
      const heading = useRef(null);
      useEffect(() => { heading.current?.focus(); }, []);
      return h('header', { className: 'yxx-detail-head' },
        h(Action, { icon: 'back', label: backLabel || t('back'), onClick: onBack }),
        h('div', { className: 'yxx-item-main' }, h('h2', { ref: heading, tabIndex: -1 }, title), meta), children);
    }

    function safeLink(value) {
      try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined; }
      catch { return undefined; }
    }

    function Field({ label, hint, children }) {
      return h('label', { className: 'yxx-field' }, h('span', null, label), children, hint ? h('span', { className: 'yxx-help' }, hint) : null);
    }

    function permissionMessage(error, t) {
      if (error?.status === 403 || error?.code === 'FORBIDDEN') return t('forbidden');
      if (error?.code === 'UNAUTHORIZED') return t('unauthorized');
      if (error?.status === 401) return t('sessionUnauthorized');
      return null;
    }

    function statusError(value) {
      return value?.error ? { message: value.error, status: value.errorStatus, code: value.errorStatus === 401 ? 'UNAUTHORIZED' : undefined } : null;
    }

    function ErrorNotice({ error, t, onRetry }) {
      if (!error) return null;
      const permission = permissionMessage(error, t);
      return h('div', { className: 'yxx-notice yxx-error', role: 'alert' }, h(Icon, { kind: 'warning' }),
        h('span', { className: 'yxx-spacer' }, permission ?? error.message),
        onRetry && !permission ? h(Action, { icon: 'refresh', label: t('retry'), onClick: onRetry }) : null);
    }

    function useLoad(loader, deps) {
      const [state, setState] = useState({ loading: true, value: null, error: null });
      const [tick, setTick] = useState(0);
      useEffect(() => {
        const controller = new AbortController();
        setState(previous => ({ ...previous, loading: true, error: null }));
        loader(controller.signal).then(
          value => { if (!controller.signal.aborted) setState({ loading: false, value, error: null }); },
          error => { if (!controller.signal.aborted && error.name !== 'AbortError') setState({ loading: false, value: null, error }); },
        );
        return () => { controller.abort(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [...deps, tick]);
      return [state, () => setTick(n => n + 1)];
    }

    function useSelection() {
      const [selected, setSelected] = useState(null);
      const opener = useRef(null);
      useEffect(() => {
        if (!selected && opener.current) {
          opener.current.focus();
          opener.current = null;
        }
      }, [selected]);
      function select(row, event) {
        opener.current = event?.currentTarget ?? null;
        setSelected(row);
      }
      return [selected, select, () => setSelected(null)];
    }

    const WORK_CATEGORIES = [['Req', 'requirement'], ['Bug', 'bug'], ['Task', 'task']];

    function WorkTab({ t, status }) {
      const [category, setCategory] = useState('Req');
      const [mine, setMine] = useState(true);
      const [statusFilter, setStatusFilter] = useState('');
      const [projectId, setProjectId] = useState(readPreferredProject);
      const [page, setPage] = useState(1);
      const [selected, select, closeDetail] = useSelection();
      const [createFrom, setCreateFrom] = useState(null);
      const [created, setCreated] = useState(false);
      const userId = status?.user?.id;
      const size = 20;
      const [projects, reloadProjects] = useLoad(signal => api({ action: 'projects', perPage: 100 }, signal), []);
      const projectList = projects.value?.items ?? [];
      const project = projectList.find(row => String(row.id) === projectId) ?? projectList[0];
      const activeProject = project ? String(project.id) : '';
      const [workflow, reloadWorkflow] = useLoad(async signal => {
        if (!activeProject) return [];
        const types = await api({ action: 'workItemTypes', projectId: activeProject, category }, signal);
        const rows = (types?.items ?? []).filter(type => type.enable !== false && type.id);
        const flows = await Promise.all(rows.map(type => api({ action: 'workItemStatuses', projectId: activeProject, workitemTypeId: type.id }, signal)));
        return [...new Map(flows.flatMap(flow => (flow.items ?? []).map(option => [String(option.id), option]))).values()];
      }, [activeProject, category]);
      const [items, reloadItems] = useLoad(signal => activeProject
        ? api({ action: 'workItems', spaceId: activeProject, category, assignedTo: mine && userId ? userId : undefined,
          status: statusFilter || undefined, page, perPage: size }, signal)
        : Promise.resolve({ items: [] }), [activeProject, category, mine, statusFilter, page, userId]);
      const rows = items.value?.items ?? [];
      const refresh = () => { reloadProjects(); reloadWorkflow(); reloadItems(); };
      const resetList = () => { setPage(1); closeDetail(); };
      const bar = h('div', { className: 'yxx-bar' },
        h(Control, { label: t('project'), icon: 'folder' }, h('select', {
          value: activeProject, disabled: !projectList.length,
          onChange: event => { setProjectId(event.target.value); rememberProject(event.target.value); setStatusFilter(''); resetList(); },
        }, projectList.length ? projectList.map(row => h('option', { key: row.id, value: String(row.id) }, row.name))
          : h('option', { value: '' }, projects.loading ? t('loading') : t('project')))),
        h(Control, { label: t('category'), icon: 'work' }, h('select', {
          value: category, onChange: event => { setCategory(event.target.value); setStatusFilter(''); resetList(); },
        }, WORK_CATEGORIES.map(([id, key]) => h('option', { key: id, value: id }, t(key))))),
        h(Control, { label: t('status'), icon: 'filter' }, h('select', {
          value: statusFilter, disabled: workflow.loading || !(workflow.value?.length),
          onChange: event => { setStatusFilter(event.target.value); resetList(); },
        }, h('option', { value: '' }, t('allStatus')),
        (workflow.value ?? []).map(option => h('option', { key: option.id, value: String(option.id) }, option.displayName || option.name)))),
        userId ? h(Action, { icon: 'user', label: t('mine'), 'aria-pressed': mine, onClick: () => { setMine(!mine); resetList(); } }) : null,
        h('span', { className: 'yxx-spacer' }),
        h(Action, { icon: 'refresh', label: t('refresh'), onClick: refresh }),
        h(Action, { icon: 'plus', label: t('newWork'), primary: true, disabled: !activeProject,
          onClick: event => { setCreated(false); setCreateFrom({ project, button: event.currentTarget }); } }, t('newWork')));
      const list = h('div', { className: 'yxx-master' }, bar,
        h(ErrorNotice, { error: projects.error ?? items.error ?? workflow.error, t, onRetry: refresh }),
        items.loading || projects.loading ? h(Empty, { loading: true }, t('loading'))
          : rows.length ? h('div', { className: 'yxx-list' }, rows.map(row => h('button', {
            key: row.id, type: 'button', className: 'yxx-item', 'aria-pressed': row.id === selected?.id, onClick: event => select(row, event),
          }, h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, row.subject),
            h('span', { className: 'yxx-item-meta' }, h('span', { className: 'yxx-serial' }, row.serialNumber), row.assignedTo?.name,
              priorityOf(row) ? h('span', { title: t('priority') }, priorityOf(row)) : null)),
          row.status?.name ? h('span', { className: 'yxx-state' }, row.status.displayName || row.status.name) : null,
          h(Icon, { kind: 'next', className: 'yxx-end-icon', size: 14 }))))
            : (items.error || projects.error) ? null : h(Empty, null, t(activeProject ? mine && userId ? 'noMine' : 'empty' : 'requiredProject'),
              activeProject && mine && userId ? h(Action, { icon: 'work', label: t('showAll'), onClick: () => { setMine(false); resetList(); } }, t('showAll')) : null),
        activeProject && !items.error ? h(Pager, { t, page, size, count: rows.length, pagination: items.value?.pagination, setPage, loading: items.loading }) : null);
      return h(React.Fragment, null,
        created ? h('p', { className: 'yxx-notice', role: 'status' }, t('createdWork')) : null,
        h('div', { className: `yxx-split${selected ? ' yxx-split-open' : ''}` }, list,
          selected ? h(WorkNavigation, { key: selected.id, t, selected, edition: status?.settings?.edition, onBack: closeDetail, onChanged: reloadItems }) : null),
        createFrom ? h(CreateWorkDialog, { t, project: createFrom.project, initialCategory: category, onCancel: () => setCreateFrom(null),
          onCreated: (item, kind, subject) => {
            setCreateFrom(null);
            setCreated(true);
            setCategory(kind);
            setStatusFilter('');
            setMine(false);
            setPage(1);
            reloadItems();
            const id = item?.id ?? item?.workItemId ?? item?.identifier;
            if (id) select({ ...item, id, subject: item?.subject ?? subject }, { currentTarget: createFrom.button });
          } }) : null);
    }

    function AssigneePicker({ t, value, selected, disabled, onChange, emptyHint = "defaultAssignee" }) {
      const [open, setOpen] = useState(false);
      const [active, setActive] = useState(-1);
      const input = useRef(null);
      const listId = React.useId();
      const mention = !selected && /^[＠@]/.test(value.trimStart());
      const query = mention ? value.trimStart().slice(1).trim() : null;
      const show = open && mention && !disabled;
      const [results, retry] = useLoad(async signal => {
        if (!show) return null;
        if (query) await new Promise(resolve => setTimeout(resolve, 200));
        signal.throwIfAborted();
        const result = await api({ action: 'searchAssignees', query }, signal);
        return { query, items: result.items ?? [] };
      }, [show, query]);
      const rows = show && !results.loading && results.value?.query === query ? results.value.items : [];
      const current = active >= 0 && active < rows.length ? active : -1;

      function choose(row) {
        onChange(row.name, row.id);
        input.current?.focus();
        setOpen(false);
        setActive(-1);
      }

      function handleKey(event) {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Escape' && show) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          setActive(-1);
        } else if (mention && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
          event.preventDefault();
          setOpen(true);
          if (rows.length) setActive(current < 0 ? (event.key === 'ArrowDown' ? 0 : rows.length - 1)
            : (current + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length);
        } else if (event.key === 'Enter' && (mention || event.repeat)) {
          event.preventDefault();
          if (!event.repeat && current >= 0) choose(rows[current]);
        }
      }

      useEffect(() => {
        if (show && current >= 0) document.getElementById(`${listId}-${current}`)?.scrollIntoView({ block: 'nearest' });
      }, [show, current, listId]);

      return h('div', { className: 'yxx-assignee', onBlur: event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActive(-1);
        }
      } },
        h(Field, { label: t('assigneeId'), hint: t(mention ? 'chooseAssignee' : emptyHint) }, h('input', {
          ref: input, role: 'combobox', 'aria-autocomplete': 'list', 'aria-expanded': show,
          'aria-controls': show ? listId : undefined, 'aria-activedescendant': current >= 0 ? `${listId}-${current}` : undefined,
          autoComplete: 'off', maxLength: 100, value, disabled, placeholder: t('assigneePlaceholder'),
          onFocus: () => setOpen(true), onClick: () => setOpen(true), onKeyDown: handleKey,
          onChange: event => { onChange(event.target.value); setOpen(true); setActive(-1); },
        })),
        show ? h('div', { className: 'yxx-assignee-results' },
          h(ErrorNotice, { error: results.error, t, onRetry: retry }),
          h('div', { id: listId, role: 'listbox', 'aria-label': t('assigneeResults') }, rows.map((row, index) => h('div', {
            key: row.id, id: `${listId}-${index}`, role: 'option', 'aria-selected': current === index, className: 'yxx-item',
            title: row.id, onMouseDown: event => event.preventDefault(), onClick: () => choose(row),
          }, row.name))),
          !results.error && !rows.length ? h('p', { className: 'yxx-muted', role: 'status' },
            t(results.loading || results.value?.query !== query ? 'loading' : 'noAssignees')) : null) : null);
    }

    function CreateWorkDialog({ t, project, initialCategory, onCancel, onCreated }) {
      const dialog = useRef(null);
      const [category, setCategory] = useState(initialCategory);
      const [typeId, setTypeId] = useState('');
      const [subject, setSubject] = useState('');
      const [description, setDescription] = useState('');
      const [assignee, setAssignee] = useState('');
      const [assigneeText, setAssigneeText] = useState('');
      const unresolvedAssignee = /^[＠@]/.test(assigneeText.trim()) && !assignee;
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState(null);
      const spaceId = String(project.id);
      const [types, reloadTypes] = useLoad(async signal => {
        const result = await api({ action: 'workItemTypes', projectId: spaceId, category }, signal);
        return { category, items: (result.items ?? []).filter(item => item.id && item.enable !== false) };
      }, [spaceId, category]);
      const rows = types.value?.category === category && !types.loading ? types.value.items : [];
      const chosen = rows.find(item => String(item.id) === typeId) ?? rows.find(item => item.defaultType) ?? rows[0];

      useEffect(() => {
        const element = dialog.current;
        element.showModal();
        return () => element.close();
      }, []);

      async function submit(event) {
        event.preventDefault();
        if (busy || !subject.trim() || !chosen || unresolvedAssignee) return;
        setBusy(true);
        setError(null);
        try {
          const item = await api({ action: 'createWorkItem', spaceId, workitemTypeId: String(chosen.id),
            subject: subject.trim(), description: description.trim() || undefined, assignedTo: assignee || assigneeText.trim() || undefined });
          onCreated(item, category, subject.trim());
        } catch (failure) {
          setError(failure);
          setBusy(false);
        }
      }

      return h('dialog', { ref: dialog, className: 'yxx-create-dialog', 'aria-label': t('newWork'),
        onCancel: event => { event.preventDefault(); if (!busy) onCancel(); } },
        h('form', { className: 'yxx-form', onSubmit: submit },
          h('header', null, h('h2', null, t('newWork')), h('p', { className: 'yxx-muted' }, project.name)),
          h(Field, { label: t('itemTitle') }, h('input', { autoFocus: true, required: true, maxLength: 200, value: subject,
            disabled: busy, onChange: event => setSubject(event.target.value) })),
          h('div', { className: 'yxx-form-row' },
            h(Field, { label: t('category') }, h('select', { value: category, disabled: busy,
              onChange: event => { setCategory(event.target.value); setTypeId(''); } },
              WORK_CATEGORIES.map(([id, key]) => h('option', { key: id, value: id }, t(key))))),
            h(Field, { label: t('itemTemplate') }, h('select', { value: chosen ? String(chosen.id) : '', disabled: busy || !rows.length,
              onChange: event => setTypeId(event.target.value) },
              rows.length ? rows.map(item => h('option', { key: item.id, value: String(item.id) }, item.name || item.nameEn || String(item.id)))
                : h('option', { value: '' }, types.loading ? t('loading') : '—')))),
          h(ErrorNotice, { error: types.error, t, onRetry: reloadTypes }),
          !types.loading && !types.error && !rows.length ? h('p', { className: 'yxx-muted', role: 'status' }, t('noTemplates')) : null,
          h(AssigneePicker, { t, value: assigneeText, selected: assignee, disabled: busy,
            onChange: (value, id = '') => { setAssigneeText(value); setAssignee(id); } }),
          h(Field, { label: t('description') }, h('textarea', { rows: 5, value: description, maxLength: 40000,
            disabled: busy, onChange: event => setDescription(event.target.value) })),
          h(ErrorNotice, { error, t }),
          h('div', { className: 'yxx-actions' }, h('span', { className: 'yxx-spacer' }),
            h('button', { type: 'button', className: 'yxx-btn', disabled: busy, onClick: onCancel }, t('cancelCreate')),
            h(Action, { icon: 'plus', label: t(busy ? 'creating' : 'create'), primary: true, type: 'submit',
              disabled: busy || !chosen || !subject.trim() || unresolvedAssignee }, t(busy ? 'creating' : 'create')))));
    }

    function priorityOf(item) {
      return (item?.customFieldValues ?? []).find(field => field.fieldId === 'priority')?.values?.[0]?.displayValue;
    }

    function WorkNavigation({ t, selected, edition, onBack, onChanged }) {
      const [trail, setTrail] = useState([]);
      const current = trail.at(-1) ?? selected;
      const [drafts, setDrafts] = useState({});
      return h(WorkDetail, {
        comment: drafts[current.id] ?? '',
        setComment: value => setDrafts(previous => ({ ...previous, [current.id]: value })),
        key: current.id, t, selected: current, edition, onChanged,
        onOpenRelated: related => setTrail(path => [...path, related]),
        backLabel: trail.length ? t('previousItem') : undefined,
        onBack: trail.length ? () => setTrail(path => path.slice(0, -1)) : onBack,
      });
    }

    function dateValue(value) {
      if (value == null || value === '') return null;
      const date = new Date(typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value);
      return Number.isFinite(date.getTime()) ? date : null;
    }

    function DateText({ value }) {
      const date = dateValue(value);
      return date ? h('time', { dateTime: date.toISOString() }, new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(date)) : null;
    }

    function workItemLink(item, edition) {
      const supplied = safeLink(item.webUrl) || safeLink(item.detailUrl);
      if (supplied) return supplied;
      const category = String(item.categoryId ?? item.workitemType?.categoryId ?? '').toLowerCase();
      if (edition !== 'central' || !['req', 'bug', 'task'].includes(category) || !item.id) return undefined;
      return `https://devops.aliyun.com/projex/${category}/${encodeURIComponent(item.id)}`;
    }

    const RELATION_TYPES = ['ASSOCIATED', 'PARENT', 'SUB', 'DEPEND_ON', 'DEPENDED_BY'];
    const WORK_ITEM_TYPES = ['req', 'bug', 'task', 'workitem'];

    function RelatedWork({ t, workItemId, onOpen }) {
      const [type, setType] = useState('ASSOCIATED');
      const [page, setPage] = useState(1);
      const size = 8;
      const [records, reload] = useLoad(signal => api({ action: 'workItemRelations', workItemId, relationType: type }, signal), [workItemId, type]);
      const rows = records.value?.items ?? [];
      const visible = rows.slice((page - 1) * size, page * size);
      const ids = visible.filter(row => row.resourceId && String(row.resourceId) !== String(workItemId)
        && WORK_ITEM_TYPES.includes(String(row.resourceType).toLowerCase())).map(row => String(row.resourceId));
      const lookupKey = records.loading ? '' : JSON.stringify(ids);
      const [details] = useLoad(async signal => {
        const ids = lookupKey ? [...new Set(JSON.parse(lookupKey))] : [];
        const settled = await Promise.allSettled(ids.map(id => api({ action: 'workItem', workItemId: id }, signal)));
        return { key: lookupKey, items: Object.fromEntries(settled.map((result, index) => [ids[index], result])) };
      }, [lookupKey]);
      return h('section', { className: 'yxx-detail-body yxx-work-section' },
        h('div', { className: 'yxx-body-head' }, h(Icon, { kind: 'branch' }), h('h3', null, t('relations')), h('span', { className: 'yxx-spacer' }),
          h('select', { className: 'yxx-input', value: type, 'aria-label': t('relationFilter'), onChange: event => { setType(event.target.value); setPage(1); } },
            RELATION_TYPES.map(key => h('option', { key, value: key }, t(key))))),
        h(ErrorNotice, { error: records.error, t, onRetry: reload }),
        records.loading ? h('p', { className: 'yxx-muted', role: 'status' }, t('loading')) : records.error ? null
          : !rows.length ? h('p', { className: 'yxx-muted' }, t('noRelations'))
          : h(React.Fragment, null, h('div', { className: 'yxx-list' }, visible.map((row, index) => {
              const id = String(row.resourceId ?? '');
              const lookup = details.value?.key === lookupKey ? details.value.items[id] : null;
              const linked = lookup?.value;
              const permission = permissionMessage(lookup?.reason, t);
              const canOpen = ids.includes(id) && !permission;
              return h(canOpen ? 'button' : 'div', { key: row.id ?? `${id}-${index}`, type: canOpen ? 'button' : undefined, className: 'yxx-item',
                onClick: canOpen ? () => onOpen(linked ?? { id, categoryId: row.resourceType, subject: id }) : undefined },
                h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, linked?.subject || id || row.resourceType),
                  h('span', { className: 'yxx-item-meta' }, permission ?? linked?.serialNumber ?? row.resourceType)),
                canOpen ? h(Icon, { kind: 'next', className: 'yxx-end-icon', size: 14 }) : null);
            })),
            rows.length > size ? h(Pager, { t, page, size, count: visible.length, pagination: { total: rows.length, totalPages: Math.ceil(rows.length / size) }, setPage }) : null));
    }

    function Disclosure({ label, children, className = '', keepMounted = false }) {
      const [open, setOpen] = useState(false);
      return h('details', { className: `yxx-disclosure ${className}`, onToggle: event => setOpen(event.currentTarget.open) },
        h('summary', null, label), open || keepMounted ? children : null);
    }

    const ACTIVITY_EVENTS = new Set([
      'workitem.created', 'workitem.updated', 'workitem.transitioned', 'workitem.association.changed', 'workitem.attachment.changed',
    ]);

    function WorkActivity({ t, workItemId, revision }) {
      const [result, reload] = useLoad(signal => officialRead('list_workitem_activities', { workItemId }, signal), [workItemId, revision]);
      const [page, setPage] = useState(1);
      const size = 10;
      const rows = Array.isArray(result.value) ? result.value : [];
      const visible = rows.slice((page - 1) * size, page * size);
      const displayValues = values => values?.map(value => value.displayValue || value.identifier).filter(Boolean).join(', ');
      return h('div', { className: 'yxx-detail-body' },
        h(ErrorNotice, { error: result.error, t, onRetry: reload }),
        result.loading ? h('p', { className: 'yxx-muted', role: 'status' }, t('loading')) : result.error ? null
          : rows.length ? h('ul', { className: 'yxx-comments' }, visible.map((row, index) => {
              const label = ACTIVITY_EVENTS.has(row.eventType) ? t(row.eventType) : row.eventType || row.actionType || t('activity');
              const field = row.property?.propertyName || row.property?.propertyId;
              const oldValue = displayValues(row.oldValue);
              const newValue = displayValues(row.newValue);
              return h('li', { key: `${row.eventId ?? ''}-${index}` },
                h('div', { className: 'yxx-comment-text' }, label, field ? ` · ${field}` : null),
                h('div', { className: 'yxx-item-meta' }, row.operator?.name, h(DateText, { value: row.eventTime })),
                oldValue || newValue ? h('p', { className: 'yxx-comment-text' }, `${oldValue || '—'} → ${newValue || '—'}`) : null,
                row.relatedResource?.resourceId ? h('p', { className: 'yxx-item-meta' }, row.relatedResource.resourceType, row.relatedResource.resourceId) : null);
            })) : h('p', { className: 'yxx-muted' }, t('noActivity')),
        rows.length > size ? h(Pager, { t, page, size, count: visible.length, pagination: { total: rows.length }, setPage, loading: result.loading }) : null);
    }

    function WorkAttachments({ t, workItemId }) {
      const [result, reload] = useLoad(signal => officialRead('list_workitem_attachments', { workItemId }, signal), [workItemId]);
      const rows = Array.isArray(result.value) ? result.value : result.value?.items ?? [];
      return h('div', { className: 'yxx-detail-body' },
        h(ErrorNotice, { t, error: result.error, onRetry: reload }),
        result.loading ? h(Empty, { loading: true }, t('loading')) : result.error ? null :
          rows.length ? h('div', { className: 'yxx-list' }, rows.map((row, index) =>
            h(AttachmentRow, { key: row.id ?? row.fileId ?? index, t, workItemId, row }))) : h('p', { className: 'yxx-muted' }, t('empty')));
    }

    function AttachmentRow({ t, workItemId, row }) {
      const attachmentId = row.id ?? row.fileId;
      const [busy, setBusy] = useState(false);
      const [link, setLink] = useState(null);
      const [error, setError] = useState(null);
      async function requestLink() {
        setBusy(true); setError(null); setLink(null);
        try {
          const result = await officialRead('get_workitem_file', { workitemId: workItemId, id: String(attachmentId) });
          const url = safeLink(result?.url);
          if (!url) throw new Error(t('noDownload'));
          setLink(url);
        } catch (failure) { setError(failure); }
        finally { setBusy(false); }
      }
      return h('div', { className: 'yxx-item' },
        h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, row.fileName || row.name || String(attachmentId ?? "—")),
          h(ErrorNotice, { t, error })),
        link ? h(Action, { icon: 'external', label: t('downloadAttachment'), href: link }) : null,
        attachmentId != null ? h(Action, { icon: link ? 'refresh' : 'external', label: t('getAttachment'), onClick: requestLink, disabled: busy }) : null);
    }

    function EditWork({ t, item, onSaved }) {
      const [subject, setSubject] = useState(item.subject ?? '');
      const [description, setDescription] = useState(item.description ?? '');
      const [person, setPerson] = useState({ text: '', id: '' });
      const [baseline, setBaseline] = useState(() => ({ subject: item.subject ?? '', description: item.description ?? '', assignedTo: item.assignedTo?.id }));
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState(null);
      const fields = {};
      if (subject !== baseline.subject) fields.subject = subject.trim();
      if (description !== baseline.description) {
        fields.description = description;
        fields.formatType = item.formatType || 'MARKDOWN';
      }
      if (person.id && person.id !== baseline.assignedTo) fields.assignedTo = person.id;
      const blocked = busy || !subject.trim() || (person.text.trim() && !person.id) || !Object.keys(fields).length;
      async function submit(event) {
        event.preventDefault();
        if (blocked) return;
        setBusy(true);
        setError(null);
        try {
          await api({ action: 'updateWorkItem', workItemId: item.id, ...fields });
          if (fields.subject !== undefined) setSubject(fields.subject);
          setBaseline(previous => ({ ...previous, ...fields }));
          onSaved();
        } catch (failure) { setError(failure); }
        finally { setBusy(false); }
      }
      return h('form', { className: 'yxx-form', onSubmit: submit },
        h(Field, { label: t('itemTitle') }, h('input', { value: subject, required: true, maxLength: 200, disabled: busy, onChange: event => setSubject(event.target.value) })),
        h(Field, { label: t('description') }, h('textarea', { value: description, rows: 5, maxLength: 20000, disabled: busy, onChange: event => setDescription(event.target.value) })),
        h(AssigneePicker, { t, value: person.text, selected: person.id, emptyHint: 'assigneeEdit', disabled: busy,
          onChange: (text, id = '') => setPerson({ text, id }) }),
        h(ErrorNotice, { t, error }),
        h('div', { className: 'yxx-actions' }, h(Action, { icon: 'save', label: t('save'), type: 'submit', primary: true, disabled: Boolean(blocked) }, t('save'))));
    }

    function WorkDetail({ t, selected, edition, onBack, backLabel, onChanged, onOpenRelated, comment, setComment }) {
      const [detail, reload] = useLoad(signal => api({ action: 'workItem', workItemId: selected.id }, signal), [selected.id]);
      const item = detail.value ?? selected;
      const projectId = item.space?.id;
      const workitemTypeId = item.workitemType?.id;
      const [workflow, reloadWorkflow] = useLoad(signal => projectId && workitemTypeId
        ? api({ action: 'workItemStatuses', projectId, workitemTypeId }, signal)
        : Promise.resolve({ items: [] }), [projectId, workitemTypeId]);
      const [commentPage, setCommentPage] = useState(1);
      const commentPageSize = 10;
      const [comments, reloadComments] = useLoad(signal => api({ action: 'workItemComments', workItemId: selected.id,
        page: commentPage, perPage: commentPageSize }, signal), [selected.id, commentPage]);
      const commentRows = comments.value?.items ?? [];
      const href = workItemLink(item, edition);
      const timeFields = [['createdTime', item.gmtCreate], ['updatedTime', item.gmtModified], ['statusTime', item.updateStatusAt]]
        .filter(([, value]) => dateValue(value));
      const [pendingAction, setPendingAction] = useState(null);
      const busy = pendingAction != null;
      const [error, setError] = useState(null);
      const [notice, setNotice] = useState('');
      const [confirmedStatus, setConfirmedStatus] = useState(null);
      const [activityRevision, setActivityRevision] = useState(0);
      const editableItem = useRef(null);
      if (detail.value) editableItem.current = detail.value;
      const statusId = confirmedStatus?.id ?? String(item.status?.id ?? '');
      const options = (workflow.value?.items ?? []).map(option => ({ id: String(option.id), name: option.displayName || option.name }));
      if (!options.some(option => option.id === statusId)) options.unshift({ id: statusId, name: confirmedStatus?.name || item.status?.displayName || item.status?.name || '—' });

      useEffect(() => {
        if (confirmedStatus && detail.value && String(detail.value.status?.id) === confirmedStatus.id) setConfirmedStatus(null);
      }, [confirmedStatus, detail.value]);

      async function mutate(input) {
        if (busy) return;
        setPendingAction(input.action); setError(null); setNotice('');
        try {
          await api({ ...input, workItemId: selected.id });
          setActivityRevision(value => value + 1);
          if (input.action === 'comment') {
            setComment('');
            setNotice(t('sent'));
            setCommentPage(1);
            reloadComments();
          } else {
            setConfirmedStatus(options.find(option => option.id === input.status));
            setNotice(t('saved'));
            onChanged();
            reload();
          }
        } catch (failure) { setError(failure); }
        finally { setPendingAction(null); }
      }

      return h('article', { className: 'yxx-detail' },
        h(DetailHeader, { t, title: item.subject, onBack, backLabel, meta: h('div', { className: 'yxx-item-meta' },
          h('span', { className: 'yxx-serial' }, item.serialNumber), item.space?.name, item.assignedTo?.name,
          priorityOf(item) ? h('span', { title: t('priority') }, priorityOf(item)) : null) },
          href ? h(Action, { icon: 'external', label: t('openWorkItem'), href }) : null),
        detail.value && !href ? h('p', { className: 'yxx-muted' }, t('missingWorkLink')) : null,
        timeFields.length ? h('dl', { className: 'yxx-times' }, timeFields.map(([label, value]) => h('div', { key: label },
          h('dt', null, t(label)), h('dd', null, h(DateText, { value }))))) : null,
        h(ErrorNotice, { error: detail.error ?? workflow.error, t, onRetry: () => { reload(); reloadWorkflow(); } }),
        h('div', { className: 'yxx-actions' }, h(Control, { label: t('changeStatus'), icon: 'filter' }, h('select', {
          value: statusId, disabled: busy || detail.loading || !detail.value || workflow.loading || options.length < 2,
          onChange: event => { if (event.target.value && event.target.value !== statusId) mutate({ action: 'updateWorkItem', status: event.target.value }); },
        }, options.map(option => h('option', { key: option.id, value: option.id }, option.name))))),
        h('div', { className: 'yxx-detail-body' }, h('h3', null, t('description')),
          detail.loading ? h(Empty, { loading: true }, t('loading')) : h('div', { className: 'yxx-prose', tabIndex: 0 }, item.description || t('noDescription'))),
        editableItem.current ? h(Disclosure, { label: t('editWork'), className: 'yxx-work-section', keepMounted: true },
          h(EditWork, { t, item: { ...editableItem.current, id: selected.id }, onSaved: () => {
            setNotice(t('saved')); setActivityRevision(value => value + 1); reload(); onChanged();
          } })) : null,
        h(RelatedWork, { t, workItemId: selected.id, onOpen: onOpenRelated }),
        h(Disclosure, { label: t('attachments'), className: 'yxx-work-section' }, h(WorkAttachments, { t, workItemId: selected.id })),
        h(Disclosure, { label: t('activity'), className: 'yxx-work-section' },
          h(WorkActivity, { t, workItemId: String(selected.id), revision: activityRevision })),
        h('section', { className: 'yxx-detail-body yxx-work-section' },
          h('div', { className: 'yxx-body-head' }, h(Icon, { kind: 'comment' }), h('h3', null, t('comments'))),
          h(ErrorNotice, { error: comments.error, t, onRetry: reloadComments }),
          comments.loading ? h('p', { className: 'yxx-muted', role: 'status' }, t('loading')) : comments.error ? null
            : commentRows.length ? h('ul', { className: 'yxx-comments' }, commentRows.map((row, index) => h('li', { key: row.id ?? index },
                h('div', { className: 'yxx-item-meta' }, h('strong', null, row.user?.name ?? t('unknownAuthor')), h(DateText, { value: row.gmtCreate })),
                h('div', { className: 'yxx-comment-text' }, typeof row.content === 'string' ? row.content : ''))))
              : h('p', { className: 'yxx-muted' }, t('noComments')),
          !comments.error && (commentRows.length || commentPage > 1) ? h(Pager, { t, page: commentPage, size: commentPageSize, count: commentRows.length,
            pagination: comments.value?.pagination, setPage: setCommentPage, loading: comments.loading }) : null,
          h('form', { className: 'yxx-comment', onSubmit: event => { event.preventDefault(); if (comment.trim()) mutate({ action: 'comment', content: comment.trim() }); } },
            h('textarea', { className: 'yxx-input', 'aria-label': t('comment'), value: comment, disabled: busy, placeholder: t('commentPlaceholder'), onChange: event => setComment(event.target.value) }),
            h(Action, { icon: 'send', label: t('send'), primary: true, disabled: busy || !comment.trim(), type: 'submit' })),
          pendingAction === 'comment' ? h('p', { className: 'yxx-muted', role: 'status' }, t('sendingComment')) : null),
        h(ErrorNotice, { error, t }), notice ? h('span', { className: 'yxx-muted', role: 'status' }, notice) : null);
    }

    function BrowserList({ t, kind, action, searchField, renderRow, Detail }) {
      const [draft, setDraft] = useState('');
      const [query, setQuery] = useState('');
      const [page, setPage] = useState(1);
      const [selected, select, closeDetail] = useSelection();
      const size = 30;
      const [result, reload] = useLoad(signal => api({ action, [searchField]: query || undefined, page, perPage: size }, signal), [query, page]);
      const rows = result.value?.items ?? [];
      return h('div', { className: `yxx-split${selected ? ' yxx-split-open' : ''}` },
        h('div', { className: 'yxx-master' },
          h('form', { className: 'yxx-bar', onSubmit: event => { event.preventDefault(); setPage(1); closeDetail(); setQuery(draft.trim()); } },
            h(Control, { icon: kind, label: t('search'), className: 'yxx-search' }, h('input', {
              type: 'search', value: draft, placeholder: t(kind === 'code' ? 'searchRepos' : 'searchPipelines'),
              onChange: event => { setDraft(event.target.value); if (!event.target.value) { setQuery(''); setPage(1); closeDetail(); } },
            })),
            h(Action, { icon: 'search', label: t('search'), type: 'submit' }),
            h('span', { className: 'yxx-spacer' }), h(Action, { icon: 'refresh', label: t('refresh'), onClick: reload })),
          h(ErrorNotice, { error: result.error, t, onRetry: reload }),
          result.loading ? h(Empty, { loading: true }, t('loading'))
            : rows.length ? h('div', { className: 'yxx-list' }, rows.map(row => renderRow(row, selected, select)))
              : !result.error ? h(Empty, null, t('empty')) : null,
          !result.error ? h(Pager, { t, count: rows.length, page, size, pagination: result.value?.pagination, setPage, loading: result.loading }) : null),
        selected ? h(Detail, { key: selected.id ?? selected.pipelineId, t, selected, onBack: closeDetail }) : null);
    }

    function browserRow(row, id, kind, title, meta, selected, onClick, label) {
      return h('button', { key: id, type: 'button', className: 'yxx-item', onClick,
        'aria-pressed': (selected?.id ?? selected?.pipelineId) === id, title: label }, h(Icon, { kind }),
        h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, title),
          h('span', { className: 'yxx-item-meta' }, meta)),
        h(Icon, { kind: kind === 'pipeline' ? 'history' : 'next', className: 'yxx-end-icon' }));
    }

    function CodeTab({ t }) {
      return h(BrowserList, { t, kind: 'code', action: 'repositories', searchField: 'search', Detail: RepoDetail,
        renderRow: (row, selected, select) => browserRow(row, row.id, 'code', row.name,
          [row.nameWithNamespace || row.pathWithNamespace, row.visibility].filter(Boolean).join(' · '), selected, event => select(row, event)),
      });
    }

    const codeupEn = {
      codeupCreateBranch: 'New branch', codeupCreateMR: 'New merge request',
      codeupBranchName: 'Branch name', codeupBaseRef: 'Base branch or commit',
      codeupSourceBranch: 'Source branch', codeupTargetBranch: 'Target branch',
      codeupSameBranch: 'Choose different source and target branches.',
      codeupBranchCreated: 'Branch {branch} created.', codeupMRCreated: 'Merge request created.',
      codeupCommits: 'Commit history', codeupRef: 'Branch, tag, or commit',
      codeupDefaultRef: 'Default branch', codeupFilePath: 'File path (optional)',
      codeupNoCommits: 'No commits match this ref and path.',
    };
    const codeupZh = {
      codeupCreateBranch: '新建分支', codeupCreateMR: '新建合并请求',
      codeupBranchName: '分支名称', codeupBaseRef: '基于分支或提交',
      codeupSourceBranch: '源分支', codeupTargetBranch: '目标分支',
      codeupSameBranch: '请选择不同的源分支和目标分支。',
      codeupBranchCreated: '已创建分支 {branch}。', codeupMRCreated: '已创建合并请求。',
      codeupCommits: '提交历史', codeupRef: '分支、标签或提交',
      codeupDefaultRef: '默认分支', codeupFilePath: '文件路径（选填）',
      codeupNoCommits: '未找到与此引用和路径匹配的提交。',
    };

    function RepoCodeActions({ t, repositoryId, selected, branches, reloadBranches, reloadRequests }) {
      const [mode, setMode] = useState(null);
      const [notice, setNotice] = useState(null);
      const [createdBranch, setCreatedBranch] = useState('');
      const branchRows = branches.value?.items ?? [];
      const refs = [...new Set([createdBranch, ...branchRows.map(row => row.name)].filter(Boolean))];
      const defaultRef = (typeof selected.defaultBranch === 'string' && selected.defaultBranch)
        || branchRows.find(row => row.defaultBranch === true)?.name || '';

      function created(payload, result) {
        setMode(null);
        if (payload.action === 'createBranch') {
          setCreatedBranch(payload.branch);
          setNotice({ key: 'codeupBranchCreated', params: { branch: payload.branch } });
          reloadBranches();
        } else {
          const href = safeLink(result?.detailUrl || result?.webUrl);
          setNotice({ key: 'codeupMRCreated', href });
          reloadRequests();
        }
      }

      return h('section', { className: 'yxx-detail-body' },
        h('div', { className: 'yxx-actions' },
          h(Action, { icon: 'branch', label: t('codeupCreateBranch'), onClick: () => setMode('branch') }, t('codeupCreateBranch')),
          h(Action, { icon: 'plus', label: t('codeupCreateMR'), onClick: () => setMode('mr') }, t('codeupCreateMR'))),
        notice ? h('div', { className: 'yxx-notice' },
          h('span', { className: 'yxx-spacer', role: 'status' }, t(notice.key, notice.params)),
          notice.href ? h(Action, { href: notice.href, icon: 'external', label: t('openInCodeup') }) : null) : null,
        mode ? h(RepoCodeCreateDialog, {
          key: mode, t, mode, repositoryId, repoName: selected.name, refs, defaultRef, createdBranch,
          onCancel: () => setMode(null), onCreated: created,
        }) : null,
        h(Disclosure, { label: t('codeupCommits'), className: 'yxx-work-section' },
          h(RepoCommitHistory, { t, repositoryId, refs, defaultRef })));
    }

    function RepoCodeCreateDialog({ t, mode, repositoryId, repoName, refs, defaultRef, createdBranch, onCancel, onCreated }) {
      const branchMode = mode === 'branch';
      const heading = t(branchMode ? 'codeupCreateBranch' : 'codeupCreateMR');
      const dialog = useRef(null);
      const submitting = useRef(false);
      const refsId = React.useId();
      const [name, setName] = useState('');
      const [base, setBase] = useState(null);
      const [source, setSource] = useState(createdBranch);
      const [target, setTarget] = useState(null);
      const [description, setDescription] = useState('');
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState(null);
      const baseRef = base ?? defaultRef;
      const targetBranch = target ?? defaultRef;
      const sameBranch = !branchMode && Boolean(source.trim()) && source.trim() === targetBranch.trim();
      const valid = name.trim() && (branchMode ? baseRef.trim() : source.trim() && targetBranch.trim() && !sameBranch);

      useEffect(() => {
        const element = dialog.current;
        element.showModal();
        return () => element.close();
      }, []);

      async function submit(event) {
        event.preventDefault();
        if (!valid || submitting.current) return;
        submitting.current = true;
        setBusy(true);
        setError(null);
        const payload = branchMode
          ? { action: 'createBranch', repositoryId, branch: name.trim(), ref: baseRef.trim() }
          : { action: 'createChangeRequest', repositoryId, title: name.trim(), sourceBranch: source.trim(),
            targetBranch: targetBranch.trim(), description: description.trim() || undefined };
        let result;
        try {
          result = await api(payload);
        } catch (failure) {
          setError(failure);
          submitting.current = false;
          setBusy(false);
          return;
        }
        onCreated(payload, result);
      }

      return h('dialog', { ref: dialog, className: 'yxx-create-dialog', 'aria-label': heading,
        onCancel: event => { event.preventDefault(); if (!submitting.current) onCancel(); } },
        h('form', { className: 'yxx-form', onSubmit: submit },
          h('header', null, h('h2', null, heading), h('p', { className: 'yxx-muted' }, repoName)),
          h(Field, { label: t(branchMode ? 'codeupBranchName' : 'itemTitle') },
            h('input', { autoFocus: true, value: name, required: true, maxLength: branchMode ? 255 : 200,
              disabled: busy, onChange: event => setName(event.target.value) })),
          h('datalist', { id: refsId }, refs.map(ref => h('option', { key: ref, value: ref }))),
          branchMode ? h(Field, { label: t('codeupBaseRef') },
            h('input', { value: baseRef, required: true, list: refsId, disabled: busy,
              onChange: event => setBase(event.target.value) })) : h(React.Fragment, null,
            h(Field, { label: t('codeupSourceBranch') }, h('input', { value: source, required: true, list: refsId,
              disabled: busy, onChange: event => setSource(event.target.value) })),
            h(Field, { label: t('codeupTargetBranch') }, h('input', { value: targetBranch, required: true, list: refsId,
              disabled: busy, onChange: event => setTarget(event.target.value) })),
            sameBranch ? h('p', { className: 'yxx-help yxx-error', role: 'status' }, t('codeupSameBranch')) : null,
            h(Field, { label: t('description') }, h('textarea', { rows: 4, maxLength: 10000, value: description,
              disabled: busy, onChange: event => setDescription(event.target.value) }))),
          h(ErrorNotice, { t, error }),
          h('div', { className: 'yxx-actions' }, h('span', { className: 'yxx-spacer' }),
            h('button', { type: 'button', className: 'yxx-btn', disabled: busy, onClick: onCancel }, t('cancelCreate')),
            h(Action, { icon: 'plus', label: t(busy ? 'creating' : 'create'), type: 'submit', primary: true,
              disabled: busy || !valid }, t(busy ? 'creating' : 'create')))));
    }

    function RepoCommitHistory({ t, repositoryId, refs, defaultRef }) {
      const refsId = React.useId();
      const [draftRef, setDraftRef] = useState('');
      const [draftPath, setDraftPath] = useState('');
      const [[refName, path], setFilters] = useState(['', '']);
      const [page, setPage] = useState(1);
      const size = 15;
      const ref = refName || defaultRef;
      const [result, reload] = useLoad(signal => api({ action: 'commits', repositoryId, refName: ref || undefined,
        path: path || undefined, page, perPage: size }, signal), [repositoryId, ref, path, page]);
      const rows = result.value?.items ?? [];

      function search(event) {
        event.preventDefault();
        const nextRef = draftRef.trim();
        const nextPath = draftPath.trim();
        if (page === 1 && nextRef === refName && nextPath === path) {
          reload();
          return;
        }
        setPage(1);
        setFilters([nextRef, nextPath]);
      }

      return h('div', { className: 'yxx-detail-body' },
        h('form', { className: 'yxx-bar', onSubmit: search, style: { alignItems: 'end' } },
          h(Field, { label: t('codeupRef') }, h('input', { value: draftRef, placeholder: defaultRef || t('codeupDefaultRef'),
            list: refsId, onChange: event => setDraftRef(event.target.value) })),
          h('datalist', { id: refsId }, refs.map(ref => h('option', { key: ref, value: ref }))),
          h(Field, { label: t('codeupFilePath') }, h('input', { value: draftPath, onChange: event => setDraftPath(event.target.value) })),
          h(Action, { icon: 'search', label: t('search'), type: 'submit' }, t('search'))),
        h(ErrorNotice, { t, error: result.error, onRetry: reload }),
        result.loading ? h(Empty, { loading: true }, t('loading')) : result.error ? null
          : rows.length ? h('div', { className: 'yxx-list' }, rows.map((row, index) => {
            const href = safeLink(row.webUrl);
            const shortId = row.shortId || row.id?.slice(0, 12) || '—';
            const title = row.title || row.message?.split('\n', 1)[0] || shortId;
            return h('div', { key: row.id ?? index, className: 'yxx-row-actions' },
              h('div', { className: 'yxx-item' },
                h('span', { className: 'yxx-serial', title: row.id }, shortId),
                h('div', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, title),
                  h('span', { className: 'yxx-item-meta' }, row.authorName || row.committerName,
                    h(DateText, { value: row.committedDate || row.authoredDate })))),
              href ? h(Action, { href, icon: 'external', label: t('openInCodeup') }) : null);
          })) : h('p', { className: 'yxx-muted', role: 'status' }, t('codeupNoCommits')),
        !result.error && (rows.length || page > 1) ? h(Pager, { t, page, size, count: rows.length,
          pagination: result.value?.pagination, setPage, loading: result.loading }) : null);
    }

    function RepoDetail({ t, selected, onBack }) {
      const repositoryId = String(selected.id);
      const [branches, reloadBranches] = useLoad(signal => api({ action: 'branches', repositoryId, perPage: 12, sort: 'updated_desc' }, signal), [repositoryId]);
      const [requests, reloadRequests] = useLoad(signal => api({ action: 'changeRequests', repositoryId, state: 'opened', perPage: 20 }, signal), [repositoryId]);
      const repoUrl = safeLink(selected.webUrl);
      const rows = requests.value?.items ?? [];
      const [requestId, setRequestId] = useState(null);
      return h('article', { className: 'yxx-detail' },
        h(DetailHeader, { t, title: selected.name, onBack, meta: h('p', { className: 'yxx-muted' }, selected.description || selected.pathWithNamespace) },
          h(Action, { icon: 'refresh', label: t('refresh'), onClick: () => { reloadBranches(); reloadRequests(); } }),
          repoUrl ? h(Action, { href: repoUrl, icon: 'external', label: t('openInCodeup') }) : null),
        h(RepoCodeActions, { t, repositoryId, selected, branches, reloadBranches, reloadRequests }),
        h('section', { className: 'yxx-detail-body' },
          h('div', { className: 'yxx-body-head' }, h(Icon, { kind: 'branch' }), h('h3', null, t('branches'))),
          h(ErrorNotice, { error: branches.error, t, onRetry: reloadBranches }),
          branches.loading ? h('p', { className: 'yxx-muted' }, t('loading'))
            : branches.value?.items?.length ? h('div', { className: 'yxx-item-meta' }, branches.value.items.map(branch =>
              h('span', { key: branch.name, className: 'yxx-chip', title: branch.name }, branch.name)))
              : !branches.error ? h('p', { className: 'yxx-muted' }, t('empty')) : null),
        h('section', { className: 'yxx-detail-body' },
          h('div', { className: 'yxx-body-head' }, h(Icon, { kind: 'code' }), h('h3', null, t('openMRs'))),
          h(ErrorNotice, { error: requests.error, t, onRetry: reloadRequests }),
          requests.loading ? h('p', { className: 'yxx-muted' }, t('loading'))
            : rows.length ? h('div', { className: 'yxx-list' }, rows.map(row => {
              const href = safeLink(row.detailUrl || row.webUrl);
              const open = row.localId != null && requestId === row.localId;
              return h(React.Fragment, { key: row.localId },
                h('div', { className: 'yxx-row-actions' },
                  h(row.localId == null ? 'div' : 'button', { className: 'yxx-item', type: row.localId == null ? undefined : 'button',
                    title: t('reviewComments'), 'aria-expanded': row.localId == null ? undefined : open,
                    onClick: row.localId == null ? undefined : () => setRequestId(open ? null : row.localId) },
                    h('span', { className: 'yxx-serial' }, `!${row.localId ?? '—'}`),
                    h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, row.title),
                      h('span', { className: 'yxx-item-meta' }, `${row.sourceBranch} → ${row.targetBranch}`, row.author?.name, row.state)),
                    row.localId != null ? h(Icon, { kind: 'comment', className: 'yxx-end-icon', size: 14 }) : null),
                  href ? h(Action, { href, icon: 'external', label: t('openInCodeup') }) : null),
                open ? h(MergeRequestComments, { t, repositoryId, localId: row.localId }) : null);
            })) : !requests.error ? h('p', { className: 'yxx-muted' }, t('noMRs')) : null));
    }

    function ReviewComment({ t, row }) {
      const path = row.filePath ?? row.location?.located_file_path;
      const line = row.line_number ?? row.location?.located_line_number;
      return h(React.Fragment, null,
        h('div', { className: 'yxx-item-meta' }, h('strong', null, row.author?.name || row.author?.username || t('unknownAuthor')),
          h(DateText, { value: row.comment_time }), path ? h('span', null, line != null ? `${path}:${line}` : path) : null),
        h('div', { className: 'yxx-comment-text' }, typeof row.content === 'string' ? row.content : ''));
    }

    function MergeRequestComments({ t, repositoryId, localId }) {
      const [commentType, setCommentType] = useState('GLOBAL_COMMENT');
      const [resolved, setResolved] = useState(false);
      const [result, reload] = useLoad(signal => officialRead('list_change_request_comments', {
        repositoryId, localId, commentType, state: 'OPENED', resolved,
      }, signal), [repositoryId, localId, commentType, resolved]);
      const rows = Array.isArray(result.value) ? result.value.filter(row => !row.is_deleted) : [];
      return h('section', { className: 'yxx-detail-body yxx-inline-detail' },
        h('h3', null, t('reviewComments')),
        h('div', { className: 'yxx-actions' },
          h(Control, { label: t('commentType'), icon: 'comment' }, h('select', { value: commentType, onChange: event => setCommentType(event.target.value) },
            h('option', { value: 'GLOBAL_COMMENT' }, t('globalComments')), h('option', { value: 'INLINE_COMMENT' }, t('inlineComments')))),
          h(Control, { label: t('resolution'), icon: 'filter' }, h('select', { value: String(resolved), onChange: event => setResolved(event.target.value === 'true') },
            h('option', { value: 'false' }, t('unresolved')), h('option', { value: 'true' }, t('resolved'))))),
        h(ErrorNotice, { error: result.error, t, onRetry: reload }),
        result.loading ? h('p', { className: 'yxx-muted', role: 'status' }, t('loading')) : result.error ? null
          : rows.length ? h('ul', { className: 'yxx-comments' }, rows.map((row, index) => h('li', { key: row.comment_biz_id ?? index },
              h(ReviewComment, { t, row }),
              row.child_comments_list?.length ? h('ul', { className: 'yxx-comments yxx-comment-replies' }, row.child_comments_list.filter(reply => reply && !reply.is_deleted)
                .map((reply, index) => h('li', { key: reply.comment_biz_id ?? index }, h(ReviewComment, { t, row: reply })))) : null)))
            : h('p', { className: 'yxx-muted' }, t('noComments')));
    }

    function PipelineTab({ t }) {
      return h(BrowserList, { t, kind: 'pipeline', action: 'pipelines', searchField: 'pipelineName', Detail: PipelineDetail,
        renderRow: (row, selected, select) => browserRow(row, row.pipelineId, 'pipeline', row.pipelineName,
          `#${row.pipelineId}`, selected, event => select(row, event), t('pipelineRun')),
      });
    }

    function PipelineDetail({ t, selected, onBack }) {
      const [result, reload] = useLoad(signal => api({ action: 'pipelineRun', pipelineId: selected.pipelineId }, signal), [selected.pipelineId]);
      const run = result.value;
      const [launching, setLaunching] = useState(false);
      const [launchError, setLaunchError] = useState(null);
      const [queued, setQueued] = useState(null);
      const [historyRevision, setHistoryRevision] = useState(0);
      async function launch() {
        const name = selected.pipelineName || `#${selected.pipelineId}`;
        if (launching || !window.confirm(t('confirmRun', { name }))) return;
        setLaunching(true);
        setLaunchError(null);
        setQueued(null);
        try {
          const value = await api({ action: 'runPipeline', pipelineId: selected.pipelineId });
          setQueued(value.pipelineRunId ?? true);
          setHistoryRevision(value => value + 1);
          reload();
        } catch (failure) { setLaunchError(failure); }
        finally { setLaunching(false); }
      }
      return h('article', { className: 'yxx-detail' },
        h(DetailHeader, { t, title: selected.pipelineName || `#${selected.pipelineId}`, onBack,
          meta: h('span', { className: 'yxx-muted' }, t('pipelineRun')) },
          h(Action, { icon: 'play', label: t('runNow'), primary: true, disabled: launching, onClick: launch }),
          h(Action, { icon: 'refresh', label: t('refresh'), onClick: reload })),
        h(ErrorNotice, { t, error: launchError }),
        launching || queued != null ? h('p', { className: 'yxx-muted', role: 'status' }, launching ? t('loading') :
          `${t('runQueued')}${typeof queued === 'number' ? ` #${queued}` : ''}`) : null,
        h(ErrorNotice, { error: result.error, t }),
        result.loading ? h(Empty, { loading: true }, t('loading')) : result.error ? null : !run ? h(Empty, null, t('noRun'))
          : h('div', { className: 'yxx-detail-body' },
            h('div', { className: 'yxx-actions' }, h('span', { className: 'yxx-state', title: t('runStatus') }, run.status || '—'),
              run.operator?.name || run.creator?.name ? h('span', { className: 'yxx-control', title: t('trigger') }, h(Icon, { kind: 'user' }), run.operator?.name || run.creator?.name) : null),
            run.startTime ? h('p', { className: 'yxx-muted' }, t('started'), ' · ', new Date(run.startTime).toLocaleString()) : null,
            run.endTime ? h('p', { className: 'yxx-muted' }, t('finished'), ' · ', new Date(run.endTime).toLocaleString()) : null),
        h(Disclosure, { label: t('runHistory'), className: 'yxx-work-section' },
          h(PipelineHistory, { key: historyRevision, t, pipelineId: selected.pipelineId })));
    }

    function PipelineHistory({ t, pipelineId }) {
      const [page, setPage] = useState(1);
      const [runId, setRunId] = useState(null);
      const size = 10;
      const [result, reload] = useLoad(signal => officialRead('list_pipeline_runs', { pipelineId, page, perPage: size }, signal), [pipelineId, page]);
      const rows = result.value?.items ?? [];
      // The official handler initializes totals to zero even when it returns runs.
      const pagination = result.value?.pagination?.total > 0 ? result.value.pagination : undefined;
      const movePage = next => { setRunId(null); setPage(next); };
      return h('div', { className: 'yxx-detail-body' },
        h(ErrorNotice, { error: result.error, t, onRetry: reload }),
        result.loading ? h('p', { className: 'yxx-muted', role: 'status' }, t('loading')) : result.error ? null
          : rows.length ? h('div', { className: 'yxx-list' }, rows.map((run, index) => {
              const id = run.pipelineRunId;
              const open = id != null && runId === id;
              return h('div', { key: id ?? index, className: 'yxx-history-row' },
                h(id == null ? 'div' : 'button', { className: 'yxx-item', type: id == null ? undefined : 'button',
                  'aria-expanded': id == null ? undefined : open, onClick: id == null ? undefined : () => setRunId(open ? null : id) },
                  h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, id == null ? t('detail') : t('runNumber', { id })),
                    h('span', { className: 'yxx-item-meta' }, h(DateText, { value: run.startTime }), run.creator)),
                  run.status ? h('span', { className: 'yxx-state' }, run.status) : null,
                  id != null ? h(Icon, { kind: 'next', className: 'yxx-end-icon', size: 14 }) : null),
                open ? h(PipelineRunJobs, { t, pipelineId, pipelineRunId: id }) : null);
            })) : h('p', { className: 'yxx-muted' }, t('noRun')),
        (page > 1 || (!result.error && rows.length > 0)) ? h(Pager, { t, page, size, count: rows.length, pagination, setPage: movePage, loading: result.loading }) : null);
    }

    function PipelineRunJobs({ t, pipelineId, pipelineRunId }) {
      const [result, reload] = useLoad(signal => officialRead('get_pipeline_run', { pipelineId, pipelineRunId }, signal), [pipelineId, pipelineRunId]);
      const stages = (result.value?.stages ?? []).filter(stage => stage.stageInfo?.jobs?.length);
      return h('section', { className: 'yxx-detail-body yxx-inline-detail' },
        h('h3', null, t('runJobs', { id: pipelineRunId })),
        h(ErrorNotice, { error: result.error, t, onRetry: reload }),
        result.loading ? h('p', { className: 'yxx-muted', role: 'status' }, t('loading')) : result.error ? null
          : stages.length ? stages.map((stage, index) => h('div', { key: stage.stageInfo.id ?? stage.index ?? index, className: 'yxx-detail-body' },
              stage.name || stage.stageInfo.name ? h('p', { className: 'yxx-muted' }, stage.name || stage.stageInfo.name) : null,
              stage.stageInfo.jobs.map((job, jobIndex) => {
                const name = job.name || (job.id != null ? `#${job.id}` : t('jobLog'));
                const label = job.status ? `${name} · ${job.status}` : name;
                return job.id == null ? h('p', { key: job.jobSign ?? jobIndex, className: 'yxx-muted' }, label)
                  : h(Disclosure, { key: job.id, label }, h(PipelineJobLog, { t, pipelineId, pipelineRunId, jobId: job.id }));
              }))) : h('p', { className: 'yxx-muted' }, t('noJobs')));
    }

    function PipelineJobLog({ t, pipelineId, pipelineRunId, jobId }) {
      const [result, reload] = useLoad(signal => officialRead('get_pipeline_job_run_log', { pipelineId, pipelineRunId, jobId }, signal), [pipelineId, pipelineRunId, jobId]);
      const content = result.value?.content;
      return h('div', { className: 'yxx-detail-body' },
        h('div', { className: 'yxx-body-head' }, h('h3', null, t('jobLog')), h('span', { className: 'yxx-spacer' }),
          h(Action, { icon: 'refresh', label: t('refresh'), disabled: result.loading || Boolean(permissionMessage(result.error, t)), onClick: reload })),
        h(ErrorNotice, { error: result.error, t }),
        result.loading ? h('p', { className: 'yxx-muted', role: 'status' }, t('loading')) : result.error ? null
          : h(React.Fragment, null,
              content ? h('pre', { className: 'yxx-prose yxx-job-log', tabIndex: 0 }, content) : h('p', { className: 'yxx-muted' }, t('noJobLog')),
              result.value?.more ? h('p', { className: 'yxx-muted' }, t('moreJobLog')) : null));
    }

    function SettingsTab({ t, status, onSaved, onTested }) {
      const [token, setToken] = useState('');
      const [baseUrl, setBaseUrl] = useState(status?.settings?.baseUrl ?? '');
      const [edition, setEdition] = useState(status?.settings?.edition ?? 'auto');
      const [organizationId, setOrganizationId] = useState(status?.settings?.organizationId ?? '');
      const [busy, setBusy] = useState(false);
      const [notice, setNotice] = useState('');
      const [error, setError] = useState(null);
      useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 4000); return () => clearTimeout(timer); }, [notice]);
      useEffect(() => {
        if (!status) return;
        setBaseUrl(status.settings?.baseUrl ?? '');
        setEdition(status.settings?.edition ?? 'auto');
        setOrganizationId(status.settings?.organizationId ?? '');
      }, [status?.settings?.baseUrl, status?.settings?.edition, status?.settings?.organizationId]);

      async function run(operation, message, syncDraft = true) {
        setBusy(true); setError(null); setNotice('');
        try {
          const value = await operation();
          if (value) {
            if (syncDraft) onSaved(value);
            else onTested(value);
          }
          if (value?.error) setError(statusError(value));
          else setNotice(t(message));
        } catch (failure) { setError(failure); }
        finally { setBusy(false); }
      }

      function save(event) {
        event.preventDefault();
        if (busy) return;
        run(async () => {
          const value = await api({ action: 'saveSettings', ...(token.trim() ? { token: token.trim() } : {}), baseUrl, edition, organizationId });
          setToken('');
          return value;
        }, 'settingsSaved');
      }

      return h('form', { className: 'yxx-form', onSubmit: save },
        h('div', { className: 'yxx-bar' }, h('span', { className: 'yxx-spacer' }),
          h(Action, { icon: 'test', label: t('test'), disabled: busy || !status?.configured,
            onClick: () => run(() => api({ action: 'status', probe: true }), 'connectionOk', false) }),
          h(Action, { icon: 'save', label: t('save'), primary: true, disabled: busy, type: 'submit' })),
        h(ErrorNotice, { error: error ?? (!notice ? statusError(status) : null), t }),
        h('div', { className: 'yxx-settings-group' },
          h('div', { className: 'yxx-actions' }, h(Icon, { kind: 'key' }),
            h('span', { className: status?.configured ? 'yxx-chip yxx-chip-ok' : 'yxx-chip' }, t(status?.configured ? 'configured' : 'notConfiguredShort')),
            status?.user ? h('span', { className: 'yxx-muted' }, status.user.name) : null,
            h('span', { className: 'yxx-spacer' }),
            h(Action, { icon: 'remove', label: t('clearToken'), danger: true, disabled: busy || !status?.configured,
              onClick: () => { if (window.confirm(t('removeConfirm'))) run(() => api({ action: 'clearToken' }), 'tokenCleared'); } })),
          h(Field, { label: t('token'), hint: t('tokenHint') }, h('input', {
            type: 'password', autoComplete: 'off', value: token, disabled: busy,
            onChange: event => setToken(event.target.value), placeholder: status?.configured ? '••••••••' : 'pt-…',
          }))),
        h('div', { className: 'yxx-settings-group' },
          h('div', { className: 'yxx-form-row' },
            h(Field, { label: t('baseUrl'), hint: t('baseUrlHint') }, h('input', {
              type: 'text', value: baseUrl, disabled: busy, onChange: event => setBaseUrl(event.target.value), placeholder: 'https://openapi-rdc.aliyuncs.com',
            })),
            h(Field, { label: t('edition') }, h('select', { value: edition, disabled: busy, onChange: event => setEdition(event.target.value) },
              ['auto', 'central', 'region'].map(value => h('option', { key: value, value }, t(value)))))),
          h(Field, { label: t('organization'), hint: t('organizationHint') }, h('input', {
            type: 'text', value: organizationId, disabled: busy, onChange: event => setOrganizationId(event.target.value),
          }))),
        h('span', { className: 'yxx-muted', role: 'status' }, busy ? t('loading') : notice));
    }

    const BROWSE_LOCALES = {
      en: {
        browse: 'Browse', browseTesthub: 'Testhub', browsePackages: 'Packages', browseAppstack: 'AppStack',
        browseOrg: 'Organization', browseOrgs: 'My organizations', browseDepts: 'Departments',
        browseSubdepts: 'Subdepartments', browseMembers: 'Members', browseRoles: 'Roles',
        browseRepos: 'Test case libraries', browsePlans: 'Test plans', browseCases: 'Test cases',
        browseDirectories: 'Directories', browseResults: 'Test results', browseProgress: 'Execution progress',
        browsePackageRepos: 'Package repositories', browseArtifacts: 'Artifacts', browseVersions: 'Versions',
        browseApps: 'Applications', browseSources: 'Code sources', browseType: 'Type', browseId: 'ID',
        browseScope: 'Visibility', browseTemplate: 'Application template', browseDefaultBranch: 'Default branch',
        browsePass: 'Passed', browseFail: 'Failed', browsePostpone: 'Postponed', browseTodo: 'Pending',
        browsePrecondition: 'Preconditions', browseSteps: 'Test steps', browseExpected: 'Expected result',
        browsePermissions: 'Permissions', browseGroup: 'Group', browseNoMoreCases: 'Narrow by directory to browse beyond 10,000 results.',
      },
      zh: {
        browse: '浏览', browseTesthub: '测试管理', browsePackages: '制品仓库', browseAppstack: '应用交付',
        browseOrg: '组织', browseOrgs: '我的组织', browseDepts: '部门',
        browseSubdepts: '子部门', browseMembers: '成员', browseRoles: '角色',
        browseRepos: '用例库', browsePlans: '测试计划', browseCases: '测试用例',
        browseDirectories: '目录', browseResults: '测试结果', browseProgress: '执行进度',
        browsePackageRepos: '制品仓库', browseArtifacts: '制品', browseVersions: '版本',
        browseApps: '应用', browseSources: '代码源', browseType: '类型', browseId: 'ID',
        browseScope: '可见范围', browseTemplate: '应用模板', browseDefaultBranch: '默认分支',
        browsePass: '通过', browseFail: '失败', browsePostpone: '延后', browseTodo: '待执行',
        browsePrecondition: '前置条件', browseSteps: '测试步骤', browseExpected: '预期结果',
        browsePermissions: '权限', browseGroup: '分组', browseNoMoreCases: '如需浏览超过 10,000 条的结果，请按目录缩小范围。',
      },
    };

    const BROWSE_AREAS = [
      ['browseTesthub', ['testRepos', 'testPlans']],
      ['browsePackages', ['packageRepos']],
      ['browseAppstack', ['apps']],
      ['browseOrg', ['organizations', 'departments', 'members', 'roles']],
    ];

    function browseRoute(kind, args = {}, title, links = []) {
      return { kind, args, title, links, page: 1, tokens: [null] };
    }

    function browseRow(id, title, meta, destination) {
      return { id, title: title || id, meta: [].concat(meta ?? []).filter(value => value != null && value !== ''), destination };
    }

    function browseResultDirectories(value) {
      const entries = [];
      for (const [library, directories] of Object.entries(value ?? {})) {
        if (!Array.isArray(directories)) continue;
        const pending = directories.slice().reverse().map(row => ({ row, path: [library] }));
        while (pending.length) {
          const { row, path } = pending.pop();
          const title = [...path, row.displayName || row.name || row.identifier].filter(Boolean);
          entries.push({ id: row.identifier, title: title.join(' / '), count: row.workitemCount });
          for (let i = (row.children?.length ?? 0) - 1; i >= 0; i--) pending.push({ row: row.children[i], path: title });
        }
      }
      return entries;
    }

    const BROWSE_VIEWS = {
      testRepos: { label: 'browseRepos', read: 'list_test_repos', mode: 'page', search: 'name', row: row => browseRow(
        row.testRepoIdentifier, row.name, row.description,
        row.testRepoIdentifier && browseRoute('testCases', { testRepoId: row.testRepoIdentifier }, row.name, [
          browseRoute('testDirectories', { testRepoId: row.testRepoIdentifier }),
        ])) },
      testDirectories: { label: 'browseDirectories', read: 'list_testcase_directories', row: (row, args) => browseRow(
        row.id, row.name, row.parentId,
        row.id && browseRoute('testCases', { ...args, directoryId: row.id }, row.name)) },
      testCases: { label: 'browseCases', read: 'search_testcases', mode: 'page', pageLimit: 500, row: (row, args) => browseRow(
        row.id, row.subject, [row.customCode, row.directory?.name, row.assignedTo?.name],
        row.id && browseRoute('testCase', { testRepoId: args.testRepoId, testcaseId: row.id }, row.subject)) },
      testCase: { label: 'detail', read: 'get_testcase', fields: row => [
        ['browseId', row.id], ['assignee', row.assignedTo?.name], ['browseDirectories', row.directory?.name],
        ['browsePrecondition', row.preCondition], ['browseSteps', row.testSteps?.stepContent], ['browseExpected', row.testSteps?.expectedResult],
      ], steps: true },
      testPlans: { label: 'browsePlans', read: 'list_test_plans', mode: 'page', search: 'name', row: row => browseRow(
        row.testPlanIdentifier, row.name, row.status,
        row.testPlanIdentifier && browseRoute('planProgress', { testPlanIdentifier: row.testPlanIdentifier }, row.name, [
          browseRoute('planDirectories', { testPlanIdentifier: row.testPlanIdentifier }),
        ])) },
      planProgress: { label: 'browseProgress', read: 'get_test_plan_progress', fields: row => [
        ['browsePass', row.passCount ?? row.paasCount], ['browseFail', row.failureCount],
        ['browsePostpone', row.postponeCount], ['browseTodo', row.todoCount],
      ] },
      planDirectories: { label: 'browseDirectories', read: 'list_test_plan_result_directories', rows: browseResultDirectories,
        row: (row, args) => browseRow(row.id, row.title, row.count,
          row.id && browseRoute('planResults', { ...args, directoryIdentifier: row.id }, row.title)) },
      planResults: { label: 'browseResults', read: 'get_test_result_list', row: row => browseRow(
        row.identifier, row.subject, [row.testResultStatus, row.assignedTo?.name],
        row.identifier && row.spaceIdentifier && browseRoute('testCase', { testRepoId: row.spaceIdentifier, testcaseId: row.identifier }, row.subject)) },
      packageRepos: { label: 'browsePackageRepos', read: 'list_package_repositories', mode: 'page',
        row: row => browseRow(row.repoId, row.repoName, [row.repoType, row.repoCategory, row.repoDesc],
          row.repoId && row.repoType && browseRoute('artifacts', { repoId: row.repoId, repoType: row.repoType }, row.repoName)) },
      artifacts: { label: 'browseArtifacts', read: 'list_artifacts', mode: 'page', search: 'search',
        row: (row, args) => browseRow(row.id, row.module, row.organization,
          Number.isSafeInteger(row.id) && browseRoute('artifact', { ...args, id: row.id }, row.module)) },
      artifact: { label: 'detail', read: 'get_artifact', fields: row => [
        ['browseId', row.id], ['browseGroup', row.organization],
        ['browseVersions', row.versions?.map(version => version.version).filter(Boolean).join('\n')],
      ] },
      apps: { label: 'browseApps', read: 'list_applications', mode: 'cursor', rows: value => value?.data,
        row: row => browseRow(row.name, row.name, [row.appTemplateDisplayName, row.description],
          row.name && browseRoute('app', { appName: row.name }, row.name, [browseRoute('appSources', { appName: row.name })])) },
      app: { label: 'detail', read: 'get_application', fields: row => [
        ['description', row.description], ['browseTemplate', row.appTemplateDisplayName || row.appTemplateName],
      ] },
      appSources: { label: 'browseSources', read: 'list_application_sources', mode: 'cursor', rows: value => value?.data,
        row: row => browseRow(row.identifier || row.sn, row.name, [row.type, row.repoContext?.defaultBranch]) },
      organizations: { label: 'browseOrgs', read: 'get_user_organizations', row: row => browseRow(row.id, row.name, [row.id, row.description]) },
      departments: { label: 'browseDepts', read: 'list_organization_departments', row: row => browseRow(
        row.id, row.name, null, row.id && browseRoute('department', { id: row.id }, row.name,
          row.hasSub === false ? [] : [browseRoute('departments', { parentId: row.id }, undefined)])) },
      department: { label: 'detail', read: 'get_organization_department_info', fields: row => [['browseId', row.id]] },
      members: { label: 'browseMembers', read: 'list_organization_members', mode: 'page', row: row => browseRow(
        row.id, row.name, row.status, row.id && browseRoute('member', { memberId: row.id }, row.name)) },
      member: { label: 'detail', read: 'get_organization_member_info', fields: row => [
        ['browseId', row.id], ['status', row.status], ['browseDepts', row.deptIds?.join(', ')], ['browseRoles', row.roleIds?.join(', ')],
      ] },
      roles: { label: 'browseRoles', read: 'list_organization_roles', row: row => browseRow(
        row.id, row.name, null, row.id && browseRoute('role', { roleId: row.id }, row.name)) },
      role: { label: 'detail', read: 'get_organization_role', fields: row => [
        ['browseId', row.id], ['browsePermissions', row.permissions?.join('\n')],
      ] },
    };

    function BrowseTab({ t }) {
      const [area, setArea] = useState(0);
      const [stack, setStack] = useState(() => [browseRoute(BROWSE_AREAS[0][1][0])]);
      const route = stack[stack.length - 1];
      const root = stack[0];
      const currentArea = BROWSE_AREAS[area];
      const pick = kind => setStack([browseRoute(kind)]);
      const open = entry => setStack(previous => [...previous, entry]);
      const back = () => setStack(previous => previous.slice(0, -1));
      const update = patch => setStack(previous => [...previous.slice(0, -1), { ...previous[previous.length - 1], ...patch }]);
      return h('section', { 'aria-label': t('browse') },
        h('nav', { className: 'yxx-bar', 'aria-label': t('browse') }, BROWSE_AREAS.map(([label, views], index) =>
          h('button', { type: 'button', className: 'yxx-btn', key: label, 'aria-pressed': index === area,
            onClick: () => { if (index !== area) { setArea(index); pick(views[0]); } } }, t(label)))),
        currentArea[1].length > 1 ? h('div', { className: 'yxx-bar', role: 'group', 'aria-label': t(currentArea[0]) },
          currentArea[1].map(kind => h('button', { type: 'button', className: 'yxx-btn', key: kind, 'aria-pressed': kind === root.kind,
            onClick: () => { if (kind !== root.kind || stack.length > 1) pick(kind); } }, t(BROWSE_VIEWS[kind].label)))) : null,
        h(BrowseView, { key: JSON.stringify([stack.length, route.kind, route.args]), t, route, open, update,
          onBack: stack.length > 1 ? back : null }));
    }

    function BrowseView({ t, route, open, update, onBack }) {
      const spec = BROWSE_VIEWS[route.kind];
      const { args, page, tokens, filter = '' } = route;
      const token = tokens[page - 1];
      const [query, setQuery] = useState(filter);
      const size = 20;
      const loadKey = JSON.stringify([page, token, filter]);
      const [result, reload] = useLoad(async signal => {
        const params = { ...args };
        if (spec.mode === 'page') Object.assign(params, { page, perPage: size });
        if (spec.mode === 'cursor') Object.assign(params, { pagination: 'keyset', perPage: size, ...(token ? { nextToken: token } : {}) });
        if (spec.search && filter) params[spec.search] = filter;
        const value = await officialRead(spec.read, params, signal);
        if (value?.error) throw Object.assign(new Error(String(value.error)), { status: value.errorStatus });
        return { loadKey, value };
      }, [loadKey]);
      const loading = result.loading || (!result.error && result.value?.loadKey !== loadKey);
      const value = result.value?.loadKey === loadKey ? result.value.value : null;
      const label = t(spec.label);
      const heading = route.title || label;
      const rows = spec.rows ? spec.rows(value) ?? [] : Array.isArray(value) ? value : [];
      const nextToken = typeof value?.nextToken === 'string' && value.nextToken !== token ? value.nextToken : '';
      function movePage(next) {
        if (spec.mode === 'cursor' && next > page) update({ page: next, tokens: [...tokens.slice(0, page), nextToken] });
        else update({ page: next });
      }
      return h('section', { className: 'yxx-detail' },
        onBack ? h(DetailHeader, { t, title: heading, onBack, backLabel: t('previous'), meta: route.title ? h('p', { className: 'yxx-muted' }, label) : null },
          h('span', { className: 'yxx-spacer' }), h(Action, { icon: 'refresh', label: t('refresh'), disabled: loading, onClick: reload }))
          : h('div', { className: 'yxx-body-head' }, h('h2', null, heading), h('span', { className: 'yxx-spacer' }),
            h(Action, { icon: 'refresh', label: t('refresh'), disabled: loading, onClick: reload })),
        route.links.length ? h('div', { className: 'yxx-actions' }, route.links.map(link => {
          const text = t(link.kind === 'departments' ? 'browseSubdepts' : BROWSE_VIEWS[link.kind].label);
          return h(Action, { key: link.kind, icon: 'folder', label: text, onClick: () => open(link) }, text);
        })) : null,
        spec.search ? h('form', { className: 'yxx-bar', onSubmit: event => {
          event.preventDefault();
          const next = query.trim();
          if (filter !== next || page !== 1) update({ filter: next, page: 1 });
          else reload();
        } }, h(Control, { icon: 'search', label: t('search'), className: 'yxx-search' }, h('input', {
          type: 'search', value: query, onChange: event => setQuery(event.target.value), placeholder: t('search'),
        })), h(Action, { type: 'submit', icon: 'search', label: t('search') }, t('search'))) : null,
        h(ErrorNotice, { error: result.error, t, onRetry: reload }),
        loading ? h(Empty, { loading: true }, t('loading')) : result.error ? null : spec.fields
          ? h(BrowseFields, { t, value, spec })
          : rows.length ? h('div', { className: 'yxx-list' }, rows.map((item, index) => {
            const row = spec.row(item, args);
            return h(row.destination ? 'button' : 'div', {
              type: row.destination ? 'button' : undefined, key: `${row.id ?? ''}-${index}`, className: 'yxx-item',
              onClick: row.destination ? () => open(row.destination) : undefined,
            }, h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, row.title || t('detail')),
              row.meta.length ? h('span', { className: 'yxx-item-meta' }, row.meta.join(' · ')) : null),
            row.destination ? h(Icon, { kind: 'next', size: 14, className: 'yxx-end-icon' }) : null);
          })) : h(Empty, null, t('empty')),
        !loading && !result.error && spec.mode === 'page' ? h(Pager, { t, page, size, count: rows.length,
          pagination: spec.pageLimit && page >= spec.pageLimit ? { totalPages: spec.pageLimit } : undefined, setPage: movePage }) : null,
        !loading && !result.error && spec.mode === 'cursor' ? h('div', { className: 'yxx-pager' },
          h('span', { className: 'yxx-muted' }, t('loadedCount', { count: rows.length })),
          h(Action, { icon: 'prev', label: t('previous'), disabled: page === 1, onClick: () => movePage(page - 1) }),
          h('span', { className: 'yxx-muted' }, t('page', { page })),
          h(Action, { icon: 'next', label: t('next'), disabled: !nextToken, onClick: () => movePage(page + 1) })) : null,
        spec.pageLimit && page >= spec.pageLimit ? h('p', { className: 'yxx-muted' }, t('browseNoMoreCases')) : null);
    }

    function BrowseFields({ t, value, spec }) {
      if (!value) return h(Empty, null, t('empty'));
      const fields = spec.fields(value).filter(([, text]) => text != null && text !== '');
      const steps = spec.steps && Array.isArray(value.testSteps?.content) ? value.testSteps.content : [];
      if (!fields.length && !steps.length) return h(Empty, null, t('empty'));
      return h('div', { className: 'yxx-detail-body' }, fields.map(([key, text]) => h('div', { key, className: 'yxx-detail-body' },
        h('h3', null, t(key)), h('p', { className: 'yxx-prose' }, String(text)))),
      steps.length ? h('section', { className: 'yxx-detail-body' }, h('h3', null, t('browseSteps')),
        h('ol', null, steps.map((step, index) => h('li', { key: index }, h('p', { className: 'yxx-prose' }, step.step),
          step.expected ? h('p', { className: 'yxx-prose' }, `${t('browseExpected')} · ${step.expected}`) : null)))) : null);
    }

    const SECTIONS = [['work', 'work'], ['code', 'code'], ['pipelines', 'pipeline'], ['browse', 'folder'], ['settings', 'settings']];
    const VIEWS = { work: WorkTab, code: CodeTab, pipelines: PipelineTab, browse: BrowseTab, settings: SettingsTab };

    function Panel({ t }) {
      const [tab, setTab] = useState('work');
      const [probe, refresh] = useLoad(signal => api({ action: 'status', probe: true }, signal), []);
      const [override, setOverride] = useState(null);
      const status = override ?? probe.value;
      const View = VIEWS[tab];
      const openSettings = () => setTab('settings');
      const refreshStatus = () => { setOverride(null); refresh(); };
      return h('section', { className: 'yxx', 'aria-label': t('title') }, h('style', null, CSS),
        h('div', { className: 'yxx-shell' },
          h('header', { className: 'yxx-head' }, h('h1', null, t(tab)),
            h('nav', { className: 'yxx-tabs', 'aria-label': t('title') }, SECTIONS.map(([key, icon]) => h(Action, {
              key, icon, label: t(key), 'aria-current': tab === key ? 'page' : undefined, onClick: () => setTab(key),
            }))),
            h('div', { className: 'yxx-actions yxx-head-end' },
              status?.user?.name ? h('span', { className: 'yxx-chip yxx-chip-ok', title: status.user.name }, status.user.name) : null)),
          h(ErrorNotice, { error: (override ? null : probe.error) ?? (tab !== 'settings' ? statusError(status) : null), t, onRetry: refreshStatus }),
          tab === 'settings' || status?.configured ? h(View, { t, status, onSaved: setOverride,
            onTested: value => setOverride({ ...value, settings: status?.settings ?? value.settings }) })
            : probe.loading ? h(Empty, { loading: true }, t('loading'))
              : h(Empty, null, probe.error ? null : t('notConfigured'), h(Action, { icon: 'settings', label: t('openSettings'), onClick: openSettings }, t('openSettings')))));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en: { ...en, ...codeupEn, ...BROWSE_LOCALES.en }, zh: { ...zh, ...codeupZh, ...BROWSE_LOCALES.zh } }));
        const t = ctx.locale.bind(NS);
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id: 'dsh-yunxiao', order: 15, label: () => t('panel'), locale: NS,
        }, ({ size }) => h(Icon, { kind: 'branch', size })));
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'dsh-yunxiao', id: 'dsh-yunxiao', locale: NS }, Panel));
      },
    };
  },
});