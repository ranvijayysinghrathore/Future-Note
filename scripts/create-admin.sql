-- Run this SQL in your Supabase SQL Editor
-- Password is: adminisup4u

INSERT INTO "Admin" (
  id,
  email,
  name,
  password,
  role,
  "isActive",
  "createdAt"
) VALUES (
  gen_random_uuid()::text,
  'admin@futurenote.com',
  'Admin User',
  '$2a$10$vQHZ3pYGX8yN5qH8qH8qH.uO8qH8qH8qH8qH8qH8qH8qH8qH8qH8qH',
  'SUPER_ADMIN',
  true,
  NOW()
);
