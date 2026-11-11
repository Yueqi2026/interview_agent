# Supabase 数据库迁移

本目录保存数据库的“版本化蓝图”。文件一旦部署过，不应修改旧文件；后续变化应新建一个时间戳更大的迁移文件。

## 第一阶段

`202611110001_initial_identity_and_isolation.sql` 创建：

- `profiles`：登录用户的展示资料；
- `agents`：归属于某个用户的数字分身；
- `knowledge_items`：已经进入用户正式空间的经验条目，默认私有且不允许 Agent 使用；
- `conversations` 与 `messages`：按“消费者 + Agent”隔离的对话。

它同时开启 Row Level Security（RLS）。这表示应用不能仅靠前端隐藏按钮保护隐私：数据库会拒绝跨用户、跨 Agent 的访问。

`202611110002_consolidate_agent_select_policy.sql` 将 Agent 的读取规则合并为一条：Agent 的主人始终可读，其他人只能读状态为 `published` 的 Agent 基本资料。知识条目和对话仍完全私有。

## 尚未创建的内容

本阶段不创建以下表：

- 临时原始录入和 AI 草稿；
- 逐项授权事件；
- Agent 的检索副本、向量与 RAG；
- 文件和音频存储。

这些会在第二阶段随“用户审核后才保留授权条目”的完整流程一起加入，避免未授权数据提前进入正式数据库。
