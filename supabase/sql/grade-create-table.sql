CREATE TABLE grade (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	standard int4 NOT NULL,
	created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	owner_id uuid NULL,
	CONSTRAINT "PK_grade_id" PRIMARY KEY (id),
	CONSTRAINT "UQ_grade_standard_owner" UNIQUE (standard, owner_id)
);

ALTER TABLE public.grade ADD CONSTRAINT "FK_grade_owner" FOREIGN KEY (owner_id) REFERENCES school(id);