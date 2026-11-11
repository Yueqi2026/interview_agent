-- 合并 agents 的读取策略：避免对 authenticated SELECT 同时评估两条
-- permissive policy，同时保持“主人始终可读、其他人仅能读已发布 Agent”。

drop policy if exists "Owners can manage their agents" on public.agents;
drop policy if exists "Published agents are discoverable" on public.agents;

create policy "Agents visible to owners or when published"
on public.agents for select to anon, authenticated
using (
  status = 'published'
  or owner_user_id = (select auth.uid())
);

create policy "Owners can create their agents"
on public.agents for insert to authenticated
with check (owner_user_id = (select auth.uid()));

create policy "Owners can update their agents"
on public.agents for update to authenticated
using (owner_user_id = (select auth.uid()))
with check (owner_user_id = (select auth.uid()));

create policy "Owners can delete their agents"
on public.agents for delete to authenticated
using (owner_user_id = (select auth.uid()));
