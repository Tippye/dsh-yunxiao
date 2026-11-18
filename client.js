window.__ModuleLoader__.load({
  id: '@local/dsh-yunxiao',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useRef } = React;
    const NS = 'dsh-yunxiao';

    const en = {
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
        throw error;
      }
      return payload.value;
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
      const more = Number.isFinite(pagination?.totalPages) ? page < pagination.totalPages : count === size;
      return h('div', { className: 'yxx-pager' },
        h('span', { className: 'yxx-muted' }, pagination?.total != null ? t('total', { count: pagination.total }) : t('loadedCount', { count })),
        page > 1 || more ? h(React.Fragment, null,
          h(Action, { icon: 'prev', label: t('previous'), disabled: loading || page <= 1, onClick: () => setPage(page - 1) }),
          h('span', { className: 'yxx-muted' }, t('page', { page })),
          h(Action, { icon: 'next', label: t('next'), disabled: loading || !more, onClick: () => setPage(page + 1) })) : null);
    }

    function DetailHeader({ t, title, meta, onBack, children }) {
      const heading = useRef(null);
      useEffect(() => { heading.current?.focus(); }, []);
      return h('header', { className: 'yxx-detail-head' },
        h(Action, { icon: 'back', label: t('back'), onClick: onBack }),
        h('div', { className: 'yxx-item-main' }, h('h2', { ref: heading, tabIndex: -1 }, title), meta), children);
    }

    function safeLink(value) {
      try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined; }
      catch { return undefined; }
    }

    function Field({ label, hint, children }) {
      return h('label', { className: 'yxx-field' }, h('span', null, label), children, hint ? h('span', { className: 'yxx-help' }, hint) : null);
    }

    function ErrorNotice({ error, t, onRetry }) {
      if (!error) return null;
      return h('div', { className: 'yxx-notice yxx-error', role: 'alert' }, h(Icon, { kind: 'warning' }), h('span', { className: 'yxx-spacer' }, error.message),
        onRetry ? h(Action, { icon: 'refresh', label: t('retry'), onClick: onRetry }) : null);
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
        opener.current = event.currentTarget;
        setSelected(row);
      }
      return [selected, select, () => setSelected(null)];
    }

    function WorkTab({ t, status }) {
      const [category, setCategory] = useState('Req');
      const [mine, setMine] = useState(true);
      const [statusFilter, setStatusFilter] = useState('');
      const [projectId, setProjectId] = useState(readPreferredProject);
      const [page, setPage] = useState(1);
      const [selected, select, closeDetail] = useSelection();
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
        }, [['Req', 'requirement'], ['Bug', 'bug'], ['Task', 'task']].map(([id, key]) => h('option', { key: id, value: id }, t(key))))),
        h(Control, { label: t('status'), icon: 'filter' }, h('select', {
          value: statusFilter, disabled: workflow.loading || !(workflow.value?.length),
          onChange: event => { setStatusFilter(event.target.value); resetList(); },
        }, h('option', { value: '' }, t('allStatus')),
        (workflow.value ?? []).map(option => h('option', { key: option.id, value: String(option.id) }, option.displayName || option.name)))),
        userId ? h(Action, { icon: 'user', label: t('mine'), 'aria-pressed': mine, onClick: () => { setMine(!mine); resetList(); } }) : null,
        h('span', { className: 'yxx-spacer' }), h(Action, { icon: 'refresh', label: t('refresh'), onClick: refresh }));
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
      return h('div', { className: `yxx-split${selected ? ' yxx-split-open' : ''}` }, list,
        selected ? h(WorkDetail, { key: selected.id, t, selected, onBack: closeDetail, onChanged: reloadItems }) : null);
    }

    function priorityOf(item) {
      return (item?.customFieldValues ?? []).find(field => field.fieldId === 'priority')?.values?.[0]?.displayValue;
    }

    function WorkDetail({ t, selected, onBack, onChanged }) {
      const [detail, reload] = useLoad(signal => api({ action: 'workItem', workItemId: selected.id }, signal), [selected.id]);
      const item = detail.value ?? selected;
      const projectId = item.space?.id;
      const workitemTypeId = item.workitemType?.id;
      const [workflow, reloadWorkflow] = useLoad(signal => projectId && workitemTypeId
        ? api({ action: 'workItemStatuses', projectId, workitemTypeId }, signal)
        : Promise.resolve({ items: [] }), [projectId, workitemTypeId]);
      const [comment, setComment] = useState('');
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState(null);
      const [notice, setNotice] = useState('');
      const [confirmedStatus, setConfirmedStatus] = useState(null);
      const statusId = confirmedStatus?.id ?? String(item.status?.id ?? '');
      const options = (workflow.value?.items ?? []).map(option => ({ id: String(option.id), name: option.displayName || option.name }));
      if (!options.some(option => option.id === statusId)) options.unshift({ id: statusId, name: confirmedStatus?.name || item.status?.displayName || item.status?.name || '—' });

      useEffect(() => {
        if (confirmedStatus && detail.value && String(detail.value.status?.id) === confirmedStatus.id) setConfirmedStatus(null);
      }, [confirmedStatus, detail.value]);

      async function mutate(input) {
        if (busy) return;
        setBusy(true); setError(null); setNotice('');
        try {
          await api({ ...input, workItemId: selected.id });
          if (input.action === 'comment') { setComment(''); setNotice(t('sent')); }
          else {
            setConfirmedStatus(options.find(option => option.id === input.status));
            setNotice(t('saved'));
            onChanged();
            reload();
          }
        } catch (failure) { setError(failure); }
        finally { setBusy(false); }
      }

      return h('article', { className: 'yxx-detail' },
        h(DetailHeader, { t, title: item.subject, onBack, meta: h('div', { className: 'yxx-item-meta' },
          h('span', { className: 'yxx-serial' }, item.serialNumber), item.space?.name, item.assignedTo?.name,
          priorityOf(item) ? h('span', { title: t('priority') }, priorityOf(item)) : null) }),
        h(ErrorNotice, { error: detail.error ?? workflow.error, t, onRetry: () => { reload(); reloadWorkflow(); } }),
        h('div', { className: 'yxx-actions' }, h(Control, { label: t('changeStatus'), icon: 'filter' }, h('select', {
          value: statusId, disabled: busy || detail.loading || !detail.value || workflow.loading || options.length < 2,
          onChange: event => { if (event.target.value && event.target.value !== statusId) mutate({ action: 'updateWorkItem', status: event.target.value }); },
        }, options.map(option => h('option', { key: option.id, value: option.id }, option.name))))),
        h('div', { className: 'yxx-detail-body' }, h('h3', null, t('description')),
          detail.loading ? h(Empty, { loading: true }, t('loading')) : h('div', { className: 'yxx-prose', tabIndex: 0 }, item.description || t('noDescription'))),
        h('form', { className: 'yxx-comment', onSubmit: event => { event.preventDefault(); if (comment.trim()) mutate({ action: 'comment', content: comment.trim() }); } },
          h('textarea', { className: 'yxx-input', 'aria-label': t('comment'), value: comment, disabled: busy, placeholder: t('commentPlaceholder'), onChange: event => setComment(event.target.value) }),
          h(Action, { icon: 'send', label: t('send'), primary: true, disabled: busy || !comment.trim(), type: 'submit' })),
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

    function RepoDetail({ t, selected, onBack }) {
      const repositoryId = String(selected.id);
      const [branches, reloadBranches] = useLoad(signal => api({ action: 'branches', repositoryId, perPage: 12, sort: 'updated_desc' }, signal), [repositoryId]);
      const [requests, reloadRequests] = useLoad(signal => api({ action: 'changeRequests', repositoryId, state: 'opened', perPage: 20 }, signal), [repositoryId]);
      const repoUrl = safeLink(selected.webUrl);
      const rows = requests.value?.items ?? [];
      return h('article', { className: 'yxx-detail' },
        h(DetailHeader, { t, title: selected.name, onBack, meta: h('p', { className: 'yxx-muted' }, selected.description || selected.pathWithNamespace) },
          h(Action, { icon: 'refresh', label: t('refresh'), onClick: () => { reloadBranches(); reloadRequests(); } }),
          repoUrl ? h(Action, { href: repoUrl, icon: 'external', label: t('openInCodeup') }) : null),
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
              return h(href ? 'a' : 'div', { key: row.localId, className: 'yxx-item', href, target: href ? '_blank' : undefined, rel: href ? 'noopener noreferrer' : undefined },
                h('span', { className: 'yxx-serial' }, `!${row.localId}`),
                h('span', { className: 'yxx-item-main' }, h('span', { className: 'yxx-item-title' }, row.title),
                  h('span', { className: 'yxx-item-meta' }, `${row.sourceBranch} → ${row.targetBranch}`, row.author?.name, row.state)),
                href ? h(Icon, { kind: 'external', className: 'yxx-end-icon', size: 14 }) : null);
            })) : !requests.error ? h('p', { className: 'yxx-muted' }, t('noMRs')) : null));
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
      return h('article', { className: 'yxx-detail' },
        h(DetailHeader, { t, title: selected.pipelineName || `#${selected.pipelineId}`, onBack,
          meta: h('span', { className: 'yxx-muted' }, t('pipelineRun')) }, h(Action, { icon: 'refresh', label: t('refresh'), onClick: reload })),
        h(ErrorNotice, { error: result.error, t, onRetry: reload }),
        result.loading ? h(Empty, { loading: true }, t('loading')) : result.error ? null : !run ? h(Empty, null, t('noRun'))
          : h('div', { className: 'yxx-detail-body' },
            h('div', { className: 'yxx-actions' }, h('span', { className: 'yxx-state', title: t('runStatus') }, run.status || '—'),
              run.operator?.name || run.creator?.name ? h('span', { className: 'yxx-control', title: t('trigger') }, h(Icon, { kind: 'user' }), run.operator?.name || run.creator?.name) : null),
            run.startTime ? h('p', { className: 'yxx-muted' }, t('started'), ' · ', new Date(run.startTime).toLocaleString()) : null,
            run.endTime ? h('p', { className: 'yxx-muted' }, t('finished'), ' · ', new Date(run.endTime).toLocaleString()) : null));
    }

    function SettingsTab({ t, status, onSaved }) {
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
      }, [status]);

      async function run(operation, message, syncDraft = true) {
        setBusy(true); setError(null); setNotice('');
        try {
          const value = await operation();
          if (value && syncDraft) onSaved(value);
          if (value?.error) setError(new Error(value.error));
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
        h(ErrorNotice, { error: error ?? (!notice && status?.error ? new Error(status.error) : null), t }),
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

    const SECTIONS = [['work', 'work'], ['code', 'code'], ['pipelines', 'pipeline'], ['settings', 'settings']];
    const VIEWS = { work: WorkTab, code: CodeTab, pipelines: PipelineTab, settings: SettingsTab };

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
          h(ErrorNotice, { error: probe.error ?? (tab !== 'settings' && status?.error ? new Error(status.error) : null), t, onRetry: refreshStatus }),
          tab === 'settings' || status?.configured ? h(View, { t, status, onSaved: setOverride })
            : probe.loading ? h(Empty, { loading: true }, t('loading'))
              : h(Empty, null, probe.error ? null : t('notConfigured'), h(Action, { icon: 'settings', label: t('openSettings'), onClick: openSettings }, t('openSettings')))));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, zh }));
        const t = ctx.locale.bind(NS);
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id: 'dsh-yunxiao', order: 15, label: () => t('panel'), locale: NS,
        }, ({ size }) => h(Icon, { kind: 'branch', size })));
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: 'dsh-yunxiao', id: 'dsh-yunxiao', locale: NS }, Panel));
      },
    };
  },
});