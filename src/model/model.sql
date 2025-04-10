CREATE TABLE users (
   id bigserial PRIMARY KEY,
   surname text,
   name text,
   phone_number text,
   email text,
   email_id text,
   password text,
   country text,
   region text,
   count_starts int,
   balance bigint DEFAULT 0,
   image_url text,
   image_name text,
   referral_code text,
   referral_status boolean DEFAULT false,
   chat_id bigint,
   bot_step text,
   bot_lang text,
   telegram boolean DEFAULT false,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE devices (
   id bigserial PRIMARY KEY,
   user_id int REFERENCES users(id) ON DELETE CASCADE,
   phone_brand text,
   phone_lang text,
   app_lang text,
   platform text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otp (
   id bigserial PRIMARY KEY,
   chat_id bigint,
   code text,
   status boolean DEFAULT true,
   created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE referrals (
   id bigserial PRIMARY KEY,
   user_id bigint,
   referral_code text,
   parent_id bigint,
   position text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promocodes (
   id bigserial PRIMARY KEY,
   referral_code text,
   parent_id bigint,
   position text,
   promocode text,
   status boolean DEFAULT true,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE histories_balance (
   id bigserial PRIMARY KEY,
   user_id bigint,
   category text,
   amount bigint,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE histories(
   id bigserial PRIMARY KEY,
   user_id bigint,
   amount bigint,
   user_count bigint,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);