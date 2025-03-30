CREATE TABLE users (
   id bigserial PRIMARY KEY,
   surname text not null,
   name text not null,
   phone_number text not null,
   email text,
   email_id text,
   password text not null,
   country text,
   region text,
   count_starts int,
   balance bigint DEFAULT 0,
   referral_code text,
   chat_id bigint,
   bot_step text,
   bot_lang text,
   app_token text [],
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

CREATE TABLE referrals (
   id bigserial PRIMARY KEY,
   user_id bigint,
   referral_code text,
   parent_id bigint,
   position text,
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