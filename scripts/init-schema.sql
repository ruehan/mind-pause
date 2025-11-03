-- Create Enums
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'EXPERT');
CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE', 'KAKAO', 'NAVER');
CREATE TYPE message_role AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');
CREATE TYPE challenge_status AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED');
CREATE TYPE notification_type AS ENUM ('CHALLENGE', 'COMMENT', 'LIKE', 'SYSTEM', 'AI_FEEDBACK');
CREATE TYPE entity_type AS ENUM ('POST', 'COMMENT', 'USER_PROFILE');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  nickname VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255),
  profile_image_url VARCHAR(500),
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  role user_role NOT NULL DEFAULT 'USER',
  auth_provider auth_provider,
  auth_provider_id VARCHAR(255),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- EmotionLog table
CREATE TABLE emotion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  emotion_score INT NOT NULL,
  emotion_text TEXT,
  prompt_used TEXT,
  ai_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ChatConversation table
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255),
  context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ChatMessage table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CommunityPost table
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  num_likes INT NOT NULL DEFAULT 0,
  num_comments INT NOT NULL DEFAULT 0
);

-- Comment table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Challenge table
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status challenge_status NOT NULL DEFAULT 'PENDING',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  feedback TEXT
);

-- Notification table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  link_url VARCHAR(500),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FileAttachment table
CREATE TABLE file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type entity_type NOT NULL,
  entity_id UUID NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(1000) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Indexes
CREATE UNIQUE INDEX idx_user_email ON users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX idx_user_nickname ON users(nickname);
CREATE UNIQUE INDEX idx_user_provider ON users(auth_provider, auth_provider_id) WHERE auth_provider IS NOT NULL;
CREATE INDEX idx_user_created ON users(created_at DESC);
CREATE INDEX idx_user_deleted ON users(is_deleted) WHERE is_deleted = false;

CREATE INDEX idx_emotion_user_date ON emotion_logs(user_id, recorded_at DESC);
CREATE INDEX idx_emotion_date ON emotion_logs(recorded_at DESC);
CREATE INDEX idx_emotion_score ON emotion_logs(emotion_score);

CREATE INDEX idx_chat_conv_user ON chat_conversations(user_id, updated_at DESC);
CREATE UNIQUE INDEX idx_chat_conv_session ON chat_conversations(session_id);
CREATE INDEX idx_chat_conv_updated ON chat_conversations(updated_at DESC);

CREATE INDEX idx_chat_msg_conv ON chat_messages(conversation_id, created_at);
CREATE INDEX idx_chat_msg_created ON chat_messages(created_at DESC);

CREATE INDEX idx_post_created ON community_posts(created_at DESC);
CREATE INDEX idx_post_user ON community_posts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_post_likes ON community_posts(num_likes DESC);

CREATE INDEX idx_comment_post ON comments(post_id, created_at);
CREATE INDEX idx_comment_user ON comments(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_comment_created ON comments(created_at DESC);

CREATE INDEX idx_challenge_user_status ON challenges(user_id, status);
CREATE INDEX idx_challenge_started ON challenges(started_at DESC);
CREATE INDEX idx_challenge_completed ON challenges(completed_at DESC) WHERE completed_at IS NOT NULL;

CREATE INDEX idx_notif_user_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notif_created ON notifications(created_at DESC);
CREATE INDEX idx_notif_type ON notifications(type, created_at DESC);

CREATE INDEX idx_file_entity ON file_attachments(entity_type, entity_id);
CREATE INDEX idx_file_uploader ON file_attachments(uploaded_by);
CREATE INDEX idx_file_created ON file_attachments(created_at DESC);
