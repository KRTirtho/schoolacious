CREATE TABLE invitation (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc' :: text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc' :: text, now()) NOT NULL,
  role_id uuid NULL,
  owner_id uuid NULL,
  receiver_id uuid NULL,
  status VARCHAR(20) DEFAULT 'pending'::text,
  CONSTRAINT "cpk_invitation" PRIMARY KEY (id),
  CONSTRAINT "cuq_invitation" UNIQUE (owner_id, receiver_id)
);

ALTER TABLE
  invitation
ADD
  CONSTRAINT "fk_invitation_owner" FOREIGN KEY (owner_id) REFERENCES auth.users(id);

ALTER TABLE
  invitation
ADD
  CONSTRAINT "fk_invitation_receiver" FOREIGN KEY (receiver_id) REFERENCES school(id);

ALTER TABLE
  invitation
ADD
  CONSTRAINT "fk_invitation_role" FOREIGN KEY (role_id) REFERENCES roles(id);