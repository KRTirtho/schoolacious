-- weld table for storing join requests

CREATE TABLE weld (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc' :: text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc' :: text, now()) NOT NULL,
  role_id uuid NULL,
  owner_id uuid NULL,
  receiver_id uuid NULL,
  status VARCHAR(20) DEFAULT 'pending'::text,
  CONSTRAINT "cpk_weld" PRIMARY KEY (id),
  CONSTRAINT "cuq_weld" UNIQUE (owner_id, receiver_id)
);

ALTER TABLE
  weld
ADD
  CONSTRAINT "fk_weld_owner" FOREIGN KEY (owner_id) REFERENCES school(id);

ALTER TABLE
  weld
ADD
  CONSTRAINT "fk_weld_receiver" FOREIGN KEY (receiver_id) REFERENCES auth.users(id);

ALTER TABLE
  weld
ADD
  CONSTRAINT "fk_weld_role" FOREIGN KEY (role_id) REFERENCES roles(id);