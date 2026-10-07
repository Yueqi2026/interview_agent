# Data Schema v0.3

建议第一阶段使用 PostgreSQL；向量字段先使用 pgvector，不单独引入新的向量数据库。

## Identity Domain

### users
- id
- email / phone / oauth_subject
- created_at
- status

### contributor_profiles
- id
- user_id
- public_display_name
- avatar_url
- bio
- verification_status

该域不直接提供给 LLM Retrieval。

## Experience Domain

### interview_experiences
- id
- contributor_id
- company_id
- role_id
- year
- month
- interview_type
- location
- result
- status

### interview_rounds
- id
- experience_id
- round_number
- round_type
- summary

### interview_questions
- id
- round_id
- question_text
- answer_text
- follow_up_text
- reflection
- advice

### knowledge_chunks
- id
- contributor_id
- experience_id
- chunk_type
- content
- metadata_json
- embedding
- visibility
- source_version

## Consent Domain

### consents
- id
- contributor_id
- resource_type
- resource_id
- purpose
- granted
- granted_at
- revoked_at
- policy_version

Consent 不只存一个布尔值，要保留目的、版本和撤销记录。

## Conversation Domain

### conversations
- id
- consumer_user_id
- agent_id
- created_at

### messages
- id
- conversation_id
- role
- content
- source_type
- created_at

Consumer Conversation 与 Contributor Knowledge 分离；禁止自动跨域写入。
