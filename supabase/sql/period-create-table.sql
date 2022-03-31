create table period (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc' :: text, now()) NOT NULL,
  updated_at timestamp WITH TIME ZONE DEFAULT timezone('utc' :: text, now()) NOT NULL,
  day int NOT NULL CHECK (day >= 0 AND day <= 6),
  starts_at TIME NOT NULL,
  duration INT  NOT NULL CHECK (duration >= 600 AND duration <= 3600),
  status VARCHAR(10) NOT NULL DEFAULT 'scheduled' CHECK(status IN ('ongoing', 'scheduled')),
  session_id VARCHAR(20)
);