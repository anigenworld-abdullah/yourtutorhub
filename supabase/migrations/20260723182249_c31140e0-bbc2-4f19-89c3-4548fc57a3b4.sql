
UPDATE public.site_settings SET
  logo_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL2xvZ28ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDgzMDkxOSwiZXhwIjoyMTAwMTkwOTE5fQ.iF9gw8sex80svXXLx9sMHOmclM0_UujRmM0o_iHdBoA',
  hero_bg_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/hero-bg.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL2hlcm8tYmcuanBnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDgzMDkxOSwiZXhwIjoyMTAwMTkwOTE5fQ.hw2mEZF-gCQls82gENhFofEX79VBfeaWb9jK3vy_rTM'
WHERE id = 1;

UPDATE public.services SET
  media_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/service-math.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL3NlcnZpY2UtbWF0aC5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg0ODMwOTIwLCJleHAiOjIxMDAxOTA5MjB9.vEb10uw8aqUsKLbBWxhF8mYDHulklUgWuMijV4xkZKM',
  media_type = 'image',
  long_description = COALESCE(long_description, 'From counting to calculus — our expert math tutors break down every concept with step-by-step explanations, colorful visuals, and lots of practice. Perfect for building confidence in algebra, geometry, trigonometry, and beyond.')
WHERE title = 'Math Tuition';

UPDATE public.services SET
  media_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/service-science.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL3NlcnZpY2Utc2NpZW5jZS5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg0ODMwOTIwLCJleHAiOjIxMDAxOTA5MjB9.fKr-dS9699afO01yo8nvmKz2h2WtB2frer058MiucAk',
  media_type = 'image',
  long_description = 'Explore Physics, Chemistry, and Biology through real-world examples, hands-on demos, and clear diagrams. Our science mentors turn tricky theories into memorable "aha!" moments and prepare students for exams with structured revision.'
WHERE title = 'Science Tuition';

UPDATE public.services SET
  media_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/service-english.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL3NlcnZpY2UtZW5nbGlzaC5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg0ODMwOTIwLCJleHAiOjIxMDAxOTA5MjB9.8oMQJQKUBw3CTB3vga0PRdJuMJdeC4B8g9b_fJT5WRU',
  media_type = 'image',
  long_description = 'Grammar, literature, essay writing, and confident spoken English — all in one program. We polish reading comprehension, creative writing, and pronunciation with fun exercises and personalised feedback.'
WHERE title = 'English & Languages';

UPDATE public.services SET
  media_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/service-cs.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL3NlcnZpY2UtY3MuanBnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDgzMDkyMSwiZXhwIjoyMTAwMTkwOTIxfQ.GAzl81M1YSmq7eceuCMGbsurFCgcRmILH5d1aaO1OOE',
  media_type = 'image',
  long_description = 'Coding for kids and teens — from Scratch to Python, JavaScript, and web development. Students build real projects, understand algorithms, and gain the digital skills that power tomorrow''s careers.'
WHERE title = 'Computer Science';

UPDATE public.teachers SET
  photo_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/teacher-ayesha.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL3RlYWNoZXItYXllc2hhLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ4MzA5MjEsImV4cCI6MjEwMDE5MDkyMX0.YC2GSYMzfnGYbpLq-A6hgZX4EK3lZmYTy3nOhKeD7B8'
WHERE name = 'Ayesha Khan';

UPDATE public.teachers SET
  photo_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/teacher-ali.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL3RlYWNoZXItYWxpLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODQ4MzA5MjEsImV4cCI6MjEwMDE5MDkyMX0.uLfPmqVzVET0cDE1c3UMgLok03z9e6XE8xWPmdsbQ-U'
WHERE name = 'Ali Raza';

UPDATE public.teachers SET
  photo_url = 'https://ntdlaswlscpwlgtanwlw.supabase.co/storage/v1/object/sign/site-media/teacher-sara.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMThlZjRmYi00ZjJiLTRhMDUtODg3Yi05NTljZDNkODQzYmIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzaXRlLW1lZGlhL3RlYWNoZXItc2FyYS5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg0ODMwOTIxLCJleHAiOjIxMDAxOTA5MjF9.RBMVsWq0LvD75d6-VLPbF2PdK8244V2mx8HqjOdzUew'
WHERE name = 'Sara Ahmed';
