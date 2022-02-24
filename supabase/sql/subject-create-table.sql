CREATE TABLE subject (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	name VARCHAR(100) NOT NULL,
	created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  owner_id uuid NOT NULL REFERENCES grade(id),
  description TEXT,
  marks INT4 DEFAULT 100,

  CONSTRAINT "cpk_subject" PRIMARY KEY (id),
  CONSTRAINT "CUQ_subject_owner" UNIQUE(id, name, owner_id)
);
