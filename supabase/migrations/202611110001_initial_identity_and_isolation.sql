-- 第一阶段：身份、Agent 归属与对话隔离。
--
-- 本迁移刻意不创建向量、RAG 检索表或原始访谈文本表。它们会在用户逐条
-- 审核与授权的流程完成后再加入，避免任何未经同意的资料被 Agent 使用。

create extension if not exists pgcrypto;

-- 存放内部触发器函数，不暴露给 Data API。
create schema if not exists private;
revoke all on schema private from public;

-- 由 auth.users 创建 profile。auth.users 是 Supabase Auth 管理的用户表，
-- 业务代码不应直接写入它。
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '我的经验主页' check (char_length(display_name) between 1 and 80),
  avatar_url text,
  bio text not null default '' check (char_length(bio) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 一个用户可以拥有多个 Agent；每一个 Agent 只属于一个用户。
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,80}$'),
  description text not null default '' check (char_length(description) <= 2_000),
  status text not null default 'draft' check (status in ('draft', 'published', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 这里只保存“已进入正式空间”的条目，绝不保存未确认的 AI 草稿。
-- 第一阶段中所有条目默认 private，并且禁止 Agent 使用。
create table public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 300),
  content text not null check (char_length(content) between 1 and 20_000),
  visibility text not null default 'private' check (visibility in ('private', 'published')),
  agent_usage_allowed boolean not null default false,
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  hidden_at timestamptz
);

-- 一次对话既属于一个消费者，也只属于一个 Agent。
-- unique (id, agent_id) 让 messages 能用组合外键拒绝跨 Agent 写入。
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  consumer_user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, agent_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  agent_id uuid not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null check (char_length(content) between 1 and 20_000),
  source_type text check (source_type in ('experience', 'public', 'analysis')),
  created_at timestamptz not null default now(),
  foreign key (conversation_id, agent_id)
    references public.conversations (id, agent_id)
    on delete cascade
);

create index agents_owner_user_id_idx on public.agents(owner_user_id);
create index knowledge_items_agent_id_idx on public.knowledge_items(agent_id);
create index conversations_consumer_agent_idx on public.conversations(consumer_user_id, agent_id, updated_at desc);
create index conversations_agent_id_idx on public.conversations(agent_id);
create index messages_conversation_agent_created_idx on public.messages(conversation_id, agent_id, created_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger agents_set_updated_at before update on public.agents
for each row execute function public.set_updated_at();
create trigger knowledge_items_set_updated_at before update on public.knowledge_items
for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations
for each row execute function public.set_updated_at();

create or replace function private.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), '我的经验主页')
  );
  return new;
end;
$$;

revoke all on function private.create_profile_for_new_user() from public;

create trigger auth_user_created_profile
after insert on auth.users
for each row execute function private.create_profile_for_new_user();

-- RLS 是数据库层的门锁：即便前端传错了用户 ID，也不能跨用户读取私有资料。
alter table public.profiles enable row level security;
alter table public.agents enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Data API 权限与 RLS 是两层不同的保护：前者决定角色能否访问表，
-- 后者决定访问到表后能看见哪些行。这里按最小权限显式授予。
revoke all on public.profiles, public.agents, public.knowledge_items,
  public.conversations, public.messages from anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.agents to authenticated;
grant select, insert, update, delete on public.knowledge_items to authenticated;
grant select, insert, update, delete on public.conversations to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select on public.agents to anon;

create policy "Users can read their profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update their profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Owners can manage their agents"
on public.agents for all to authenticated
using ((select auth.uid()) = owner_user_id)
with check ((select auth.uid()) = owner_user_id);

-- 只有已发布的 Agent 基本资料可被浏览；不包含任何知识条目或对话。
create policy "Published agents are discoverable"
on public.agents for select to anon, authenticated
using (status = 'published');

create policy "Owners can manage knowledge for their agents"
on public.knowledge_items for all to authenticated
using (
  exists (
    select 1 from public.agents
    where agents.id = knowledge_items.agent_id
      and agents.owner_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.agents
    where agents.id = knowledge_items.agent_id
      and agents.owner_user_id = (select auth.uid())
  )
);
create policy "Consumers can manage only their own conversations"
on public.conversations for all to authenticated
using ((select auth.uid()) = consumer_user_id)
with check ((select auth.uid()) = consumer_user_id);

create policy "Consumers can manage messages in their conversations"
on public.messages for all to authenticated
using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.agent_id = messages.agent_id
      and conversations.consumer_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and conversations.agent_id = messages.agent_id
      and conversations.consumer_user_id = (select auth.uid())
  )
);
