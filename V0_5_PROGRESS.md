# v0.5 开发进度

更新时间：2026-10-08

本轮先处理线上白屏稳定性，再开始 v0.5 的第一批基础工作。当前版本没有把模拟数据伪装成数据库，也没有声称已经完成生产持久化闭环。

## 已完成

- 统一版本配置入口：`app/src/config/app.ts`，当前版本为 `0.5.0`。
- Footer 从统一配置读取版本号。
- AI Interview 会把当前 session、轮次、进度和完成状态保存到浏览器 `localStorage`。
- 刷新 `/interview` 后可以恢复最近一次本地访谈草稿。
- Worker 的 interview turn 同时返回 `message`、`question`、`stage`、`progress` 和 `sessionStatus`，兼容 v0.5 API 方向并保留现有前端协议。
- Chat 请求增加响应结构校验和页面级错误兜底，渲染错误会显示具体错误消息，不再只显示白屏。

## 当前真实链路

```text
浏览器 Chat / Interview
        ↓ /api/*
Cloudflare Worker
        ↓
QuickRouter /v1/chat/completions
        ↓
gpt-5.6-sol
```

## 当前仍未完成

以下 v0.5 能力需要数据库或项目组 API 支持，当前没有伪造为已完成：

- 正式 Authentication、刷新后服务端 session 和 Protected Route
- ContributorProfile、InterviewExperience、InterviewSession 的 PostgreSQL 持久化
- InterviewMessage 自动保存到服务端并跨设备恢复
- Structured Extraction 的 JSON Schema 输出
- Knowledge Review 的编辑、删除、隐藏和确认接口
- Consent 记录与 KnowledgeChunk 持久化
- 真实 Agent 状态和 Dashboard 数据

## 下一步实现顺序

1. 确定 PostgreSQL（Supabase、Neon 或项目组现有数据库）和认证提供方。
2. 建立 users、contributor_profiles、interview_experiences、interview_sessions、interview_messages、experience_extractions、agents、knowledge_chunks、consents migration。
3. 将 `/api/interview-sessions` 和 `/api/interview-sessions/:id/turn` 接到真实服务，自动保存每轮消息。
4. 增加 Knowledge Review 和 Consent 页面，确认后才生成 KnowledgeChunk。
5. Dashboard 改为读取真实数据；pgvector 和完整 RAG 留到 v0.6。

## 关键文件

- 浏览器 API Client：`app/src/services/api.ts`
- Worker Gateway：`app/src/worker.ts`
- AI Interview UI：`app/src/pages/Interview.tsx`
- 创建入口：`app/src/pages/Contribute.tsx`
- 版本配置：`app/src/config/app.ts`
- 线上部署结构：`DEPLOYMENT_AND_ARCHITECTURE.md`
- 数据模型：`SCHEMA.md`
- v0.5 原始要求：用户提供的 `v0.5.txt`
