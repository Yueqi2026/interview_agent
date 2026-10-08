# v0.4.1 部署与结构说明

更新时间：2026-10-08

## 当前线上部署

| 项目 | 当前值 |
| --- | --- |
| Production URL | `https://interview-agent.nonlinear-workstation-12828.workers.dev` |
| 健康检查 | `GET /api/health` |
| GitHub 仓库 | `https://github.com/Yueqi2026/interview_agent` |
| 部署目标 | Cloudflare Worker + Workers Static Assets |
| Root directory | `app` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| 静态产物 | `app/dist` |

健康接口已经确认 QuickRouter 配置成功，返回 `upstream: configured` 和 `model: gpt-5.6-sol`。接口不会返回 API Key。

## 运行结构

```text
React + Vite 浏览器应用
        |
        | 同源 /api/*
        v
Cloudflare Worker: app/src/worker.ts
        |
        | 服务端附加 QUICKROUTER_API_KEY
        v
QuickRouter OpenAI 兼容接口
https://api.quickrouter.ai/v1/chat/completions
        |
        v
gpt-5.6-sol
```

`app/wrangler.toml` 中的 `run_worker_first = ["/api/*"]` 保证 API 请求优先进入 Worker，不会被 SPA fallback 返回首页。

## Cloudflare 配置

Worker Variables：

```text
AI_BASE_URL=https://api.quickrouter.ai/v1
AI_MODEL=gpt-5.6-sol
ENVIRONMENT=production
```

Worker Secret：

```text
QUICKROUTER_API_KEY
```

Worker Builds Variables：

```text
VITE_API_MODE=remote
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT_MS=30000
```

`QUICKROUTER_API_KEY` 只能作为 Cloudflare Secret，不能写入 Git、浏览器代码或 `VITE_*` 变量。

## 当前功能链路

“探索过来人”的 Agent 列表、搜索和详情使用 `app/src/data/mock.ts` 中的模拟面试资料，保证数据库尚未接入时仍然可以浏览和演示。

| 浏览器请求 | Worker 行为 |
| --- | --- |
| `POST /api/agents/:id/chat` | 将 Agent 对话历史和新问题发送给 QuickRouter，返回网站的 `ChatMessage`。 |
| `POST /api/interview-sessions/:id/turn` | 将访谈历史和候选人回答发送给 QuickRouter，返回下一条追问。 |
| `POST /api/interview-sessions/:id/extract` | 当前返回知识条目已准备好的过渡状态，持久化抽取将在后续版本接入。 |
| `GET /api/health` | 返回 Worker 与 AI 配置状态，不泄露 Secret。 |

聊天页面现在会校验 AI 返回结构；请求失败时在聊天区域显示错误，不会卸载整个页面。`ErrorBoundary` 为未来的 React 渲染异常提供返回探索页的兜底界面。

## 关键文件

| 模块 | 路径 |
| --- | --- |
| 浏览器 API Client | `app/src/services/api.ts` |
| Cloudflare Worker / QuickRouter Gateway | `app/src/worker.ts` |
| Worker 配置 | `app/wrangler.toml` |
| 模拟 Agent 与面试资料 | `app/src/data/mock.ts` |
| 探索页面 | `app/src/pages/Discover.tsx` |
| Agent Profile | `app/src/pages/AgentDetail.tsx` |
| Agent Chat | `app/src/pages/Chat.tsx` |
| 创建 Agent | `app/src/pages/Contribute.tsx` |
| AI Interview | `app/src/pages/Interview.tsx` |
| 知识与授权 Dashboard | `app/src/pages/Dashboard.tsx` |
| API 契约 | `API_CONTRACT.md` |
| 数据模型建议 | `SCHEMA.md` |
| 后续路线图 | `ROADMAP.md` |

## 当前边界

当前线上版本是 AI-enabled prototype，尚未持久化贡献者资料、访谈原文、Consent 记录、KnowledgeChunk 和 Conversation，也尚未接入 RAG。QuickRouter 当前接收对话历史和面试场景提示词；Agent 资料与面试经历地图仍是模拟数据。

后续接入 PostgreSQL 和 pgvector 时，应只检索贡献者明确授权的 `knowledge_chunks`，再将检索结果和用户问题一起发送到 QuickRouter。具体表结构和版本顺序见 `SCHEMA.md` 与 `ROADMAP.md`。
