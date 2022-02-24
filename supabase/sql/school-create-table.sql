CREATE TABLE school (
  id uuid default uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text not null,
  short_name varchar(20) not null unique,
  email varchar(100) not null unique,
  phone varchar(15) not null unique,
  description text,
  owner_id uuid references auth.users(id),
  primary key(id)
);