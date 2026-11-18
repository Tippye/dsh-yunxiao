# dsh-yunxiao

在 DeepSeek Harness 里读写阿里云云效（Alibaba Cloud DevOps / Yunxiao）：
**一个给人用的侧边栏页面 + 一组给 agent 用的工具**，共享同一套实现。

- 侧边栏「云效」入口在工作区上方，与「插件」「自动化任务」同组。
- 顶栏的图标可切换工作项、代码库、流水线和设置。鼠标悬停可查看操作名称。宽屏并排显示列表和详情，窄屏在列表和详情之间切换。
- agent 侧是 `yunxiao_*` 工具，和页面的按钮调用同一批 Host 方法，不会出现「页面能改、agent 改不了」的分叉。
- 配置全部在页面的「设置」页完成：令牌保存进 DSH 凭据库，API 地址/站点类型/组织 ID 保存在插件自己的存储记录里，**不读任何配置文件、不需要改 profile 补丁、保存后立即生效（不重启）**。

## 界面导览

![工作项、代码分支、合并请求与流水线的功能示意图](docs/preview.svg)

## 页面能做什么

| 页签 | 内容 | 可操作 |
| --- | --- | --- |
| 工作项 | 按项目、类型（需求/缺陷/任务）、状态筛选；「指派给我」开关；分页 | 打开详情看描述/负责人/优先级；改状态；加评论 |
| 代码库 | 搜索仓库，点开看最近分支与开启中的合并请求 | 跳到云效查看合并请求 |
| 流水线 | 流水线列表 | 查看最近一次运行的状态/触发人/时间 |
| 设置 | 令牌、API 地址、站点类型、组织 ID、连接状态 | 保存、测试连接、移除令牌 |

## agent 侧工具

| 领域 | 工具 |
| --- | --- |
| 账号/组织 | `yunxiao_whoami`、`yunxiao_auth` |
| Projex 工作项 | `yunxiao_list_projects`、`yunxiao_list_sprints`、`yunxiao_list_work_items`、`yunxiao_get_work_item`、`yunxiao_create_work_item`、`yunxiao_update_work_item`、`yunxiao_add_work_item_comment` |
| Codeup 代码 | `yunxiao_list_repositories`、`yunxiao_list_branches`、`yunxiao_create_branch`、`yunxiao_get_file`、`yunxiao_write_file`、`yunxiao_list_commits`、`yunxiao_list_change_requests`、`yunxiao_get_change_request`、`yunxiao_create_change_request` |
| Flow 流水线 | `yunxiao_list_pipelines`、`yunxiao_get_pipeline`、`yunxiao_get_pipeline_run`、`yunxiao_run_pipeline` |
| 其他 OpenAPI | `yunxiao_api_request`（测试管理、制品仓库、应用交付等长尾接口，必须 `/oapi/v1/` 开头） |

页面的「改状态」「加评论」与 `yunxiao_update_work_item`、`yunxiao_add_work_item_comment` 走同一个服务方法；命令行的 `yunxiao_auth save` 与页面「保存」写同一份凭据。

## 安装

已在 DeepSeek Harness `0.2.2-rc.2` 验证。下载并解压 [GitHub Releases](https://github.com/Tippye/dsh-yunxiao/releases) 的插件包，或克隆仓库。

```bash
git clone https://github.com/Tippye/dsh-yunxiao.git
```

```text
Plugins → Add plugin → 选择解压后的插件目录
```

或者由 agent 用 `plugin_manager` 的 `install_bundle` 安装该绝对路径。安装后：

- 侧边栏出现「云效」入口（与「插件」「自动化任务」同组，工作区上方）；
- 新会话里出现 `yunxiao_*` 工具。

## 首次配置

1. 打开侧边栏「云效」→ **设置**。
2. 填入云效个人访问令牌（[获取方式](https://help.aliyun.com/zh/yunxiao/developer-reference/obtain-personal-access-token)），令牌需要组织管理、项目协作、代码管理、流水线管理等读写权限。
3. 一般是中心站，`API 地址` 留空即可；Region 站填组织专属域名（如 `https://your-org.devops.aliyuncs.com`）并把站点类型设为「Region」。
4. 「保存」→「测试连接」，顶部会显示当前账号。

通过界面输入的令牌保存到 DSH 凭据库。请在插件设置页输入令牌，避免把令牌粘贴到对话或工具参数。

### 旧配置迁移

早期版本支持 `tokenFile`（从 `KEY=VALUE` 文件读令牌）。插件升级后会在加载时把该文件里的令牌一次性导入 DSH 凭据库，之后不再读取该文件；`tokenFile` 也已从插件配置里移除。导入成功后可以删掉 profile 补丁中那段配置。

## 配置项

| 位置 | 字段 | 说明 |
| --- | --- | --- |
| 页面「设置」 | 令牌 | 写入 DSH 凭据库 `YUNXIAO_ACCESS_TOKEN` |
| 页面「设置」 | API 地址 | 例如 `https://openapi-rdc.aliyuncs.com`（中心站默认） |
| 页面「设置」 | 站点类型 | 自动 / 中心站 / Region 站；自动按域名里是否含 `openapi-rdc.aliyuncs.com` 判断 |
| 页面「设置」 | 组织 ID | 可选；中心站默认取令牌的最近组织 |

页面配置存于插件自己的存储记录（`dsh_yunxiao` 域的 `settings`），不写在用户 profile 里，也不依赖任何外部文件。

## 使用示例

- 在工作项页选择项目，点击人员图标筛选指派给自己的工作项。打开详情后可修改状态或添加评论。
- 在对话中说「列出示例项目里指派给我的需求」或「查看示例仓库主分支最近五次提交」。
- 写操作请明确项目、工作项或分支，例如「给示例项目的 DEMO-123 添加评论：已完成联调」。

## 边界与风险

- 所有调用都以令牌所属账号的权限直接作用于线上云效：创建/修改工作项、提交文件、建合并请求、触发流水线都是真实写操作，没有草稿或回滚。
- 页面支持浏览数据、修改工作项状态和添加评论。创建工作项、提交文件、创建合并请求和触发流水线等操作由 Agent 工具提供。
- 改状态时页面提交的是工作流里的**状态 ID**（云效更新接口只认 ID，传中文名会报 “status not existed”）；agent 工具可以传状态名，会自动通过工作流解析成 ID，名字不存在时返回可选状态列表。
- 只支持个人访问令牌，不实现官方托管 MCP 的 OAuth 浏览器授权。
- 未实现附件上传、变更评审（review）、合并请求评论等长尾接口，需要时用 `yunxiao_api_request`。
- `yunxiao_get_file` 对 base64 内容额外提供 `text` 字段（限 256 KiB 的 UTF-8 文本）；二进制文件只给 `content` 与 `decodedBytes`。
- 流水线接口需要令牌对目标流水线有权限，缺少权限时返回 403 而不是空结果。
- 页面渲染依赖当前 DSH 主题变量；新增界面若在深色/浅色下出现对比问题，请反馈截图。

## 结构

```text
index.js          Host 入口：存储、服务、工具注册、/api/dsh-yunxiao 路由
client.js         浏览器入口：侧边栏图标 + 整页面板
lib/client.js     OpenAPI 请求层：站点差异、鉴权、错误、设置解析
lib/service.js    唯一的业务实现：工作项/仓库/合并请求/流水线/设置
lib/tools.js      agent 工具定义，共享 service
test/             单元测试（模拟 fetch，使用测试凭据）
```

## 开发

```bash
cd dsh-yunxiao
node --test test/*.test.js
```

测试覆盖：中心站/Region 路径、组织解析、令牌注入、文件创建/更新编码、合并请求数字项目 ID、
设置持久化即时生效、页面路由与工具共用实现、错误文案。

## 致谢

接口路径、请求体字段与 Region/中心站差异参考了阿里云官方开源项目
[alibabacloud-devops-mcp-server](https://github.com/aliyun/alibabacloud-devops-mcp-server)（Apache-2.0）。
本插件是社区集成。

## 许可证

[Apache License 2.0](LICENSE)。