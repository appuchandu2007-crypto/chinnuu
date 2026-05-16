-- Supabase Setup Script
-- Please paste and run this completely in your Supabase SQL Editor setup.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users table linked to Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  email text,
  phone_number text,
  gender text,
  dob text,
  age integer,
  language text,
  emotion text
);

-- ENTRIES (Emotions & support selections, wellness tracking)
create table if not exists entries (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  mood text,
  reason_tag text,
  reason_text text,
  better_since_last_visit text,
  same_situation text,
  previous_helpful text,
  rating integer,
  helpful text,
  follow_up text,
  suggestions text,
  current_feeling text,
  extra_message text
);

-- REVIEWS
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  role text,
  text text not null,
  rating integer not null,
  likes integer default 0
);

-- THOUGHTS
create table if not exists thoughts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author text not null,
  text text not null,
  likes integer default 0
);

-- Turn on Row Level Security (RLS)
alter table profiles enable row level security;
alter table entries enable row level security;
alter table reviews enable row level security;
alter table thoughts enable row level security;

-- Add any missing columns just in case the tables were already created
alter table profiles add column if not exists email text;
alter table profiles add column if not exists emotion text;
alter table profiles add column if not exists phone_number text;
alter table profiles add column if not exists gender text;
alter table profiles add column if not exists dob text;
alter table profiles add column if not exists age integer;
alter table profiles add column if not exists language text;

alter table entries add column if not exists current_feeling text;
alter table entries add column if not exists extra_message text;

-- Setup RLS Policies

-- Profiles: Users can view and update their own profile
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using ( auth.uid() = id );
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );
drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles for insert with check ( auth.uid() = id );

-- Entries: Users can insert and read their own entries
drop policy if exists "Users can read own entries" on entries;
create policy "Users can read own entries" on entries for select using ( auth.uid() = user_id );
drop policy if exists "Users can insert own entries" on entries;
create policy "Users can insert own entries" on entries for insert with check ( auth.uid() = user_id );

-- Reviews: Anyone can read, authenticated users can insert and update likes
drop policy if exists "Anyone can read reviews" on reviews;
create policy "Anyone can read reviews" on reviews for select using ( true );
drop policy if exists "Anyone can insert reviews" on reviews;
create policy "Anyone can insert reviews" on reviews for insert with check ( true ); 
-- Allowing unauthenticated reviews since it's a public form usually, but if you want auth only, change to:
-- create policy "Auth users can insert reviews" on reviews for insert with check ( auth.role() = 'authenticated' );
drop policy if exists "Anyone can update reviews (likes)" on reviews;
create policy "Anyone can update reviews (likes)" on reviews for update using ( true );

-- Thoughts: Anyone can read, authenticated users can insert and update likes
drop policy if exists "Anyone can read thoughts" on thoughts;
create policy "Anyone can read thoughts" on thoughts for select using ( true );
drop policy if exists "Anyone can insert thoughts" on thoughts;
create policy "Anyone can insert thoughts" on thoughts for insert with check ( true );
drop policy if exists "Anyone can update thoughts (likes)" on thoughts;
create policy "Anyone can update thoughts (likes)" on thoughts for update using ( true );

-- Initial dummy reviews data
insert into reviews (name, role, text, rating, likes) values
('Harish', 'Student', 'Amazing platform with great guidance. Has helped me track my emotions clearly.', 5, 0),
('chinnu', 'Student', 'very great platform', 5, 0),
('Sahana', 'User', 'I feel much better after talking here.', 5, 9),
('Satish', 'User', 'This platform changed my life. I finally feel heard.', 5, 13),
('nagrathna', 'Teacher', 'It has been so easy to navigate through my stressful days with this app.', 4, 2),
('chandan', 'Student', 'A completely unique approach to wellness. Highly recommend.', 5, 0),
('vamshi', 'User', 'The suggested support features are very practical and helpful.', 4, 5),
('pallavi', 'Student', 'Thank you for creating this safe space.', 5, 12),
('Pushpa', 'Parent', 'I feel a lot calmer after using the daily check-ins.', 5, 7),
('ganganna', 'User', 'Good platform for expressing yourself without judgment.', 4, 3),
('suvarnamma', 'User', 'Very peaceful and reassuring experience.', 5, 8);

-- Initial dummy thoughts
insert into thoughts (author, text, likes) values
('Chethan', 'Pause for a moment and look at how incredibly far you have already journeyed.\nYou survived all of your hardest, darkest days that you thought would break you.\nAllow yourself to feel immensely proud of the quiet battles you have bravely won.\nYou are so much stronger, softer, and wiser than you ever give yourself credit for.', 25),
('Vandana', 'Every sunrise is a gentle reminder that we can start again.\nIt does not matter how heavy yesterday felt, today is a blank canvas.\nTake a deep breath and give yourself permission to be simply be.\nYou are doing the best you can, and that is more than enough.', 18),
('Swamy', 'Healing is not a destination, but a quiet, daily practice.\nSome days you will take two steps forward, and others one step back.\nLearn to embrace the messy, beautiful process of becoming.\nYour scars are proof that you survived everything trying to break you.', 32),
('Mamtha', 'Stop rushing to have it all figured out right this second.\nYour journey unfolds exactly as it is meant to, in its own time.\nWater your own roots, be patient with your personal winter.\nSpring always arrives inside of those who endure the cold.', 41);

-- VOICE ANALYSIS
create table if not exists public.voice_analysis (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  transcript text,
  age_group text,
  primary_emotion text,
  confidence numeric,
  text_sentiment text,
  tone_sentiment text,
  insight text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for voice_analysis
alter table public.voice_analysis enable row level security;

-- Create policy for user's own data
drop policy if exists "Users can insert their own voice analysis" on public.voice_analysis;
create policy "Users can insert their own voice analysis" on public.voice_analysis
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can view their own voice analysis" on public.voice_analysis;
create policy "Users can view their own voice analysis" on public.voice_analysis
  for select using (auth.uid() = user_id);
