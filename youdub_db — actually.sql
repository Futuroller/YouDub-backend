-- DROP SCHEMA "YouDub";

CREATE SCHEMA "YouDub" AUTHORIZATION vasily;

-- DROP SEQUENCE "YouDub".access_statuses_id_seq;

CREATE SEQUENCE "YouDub".access_statuses_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".comments_id_seq;

CREATE SEQUENCE "YouDub".comments_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".history_id_seq;

CREATE SEQUENCE "YouDub".history_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".playlist_videos_id_seq;

CREATE SEQUENCE "YouDub".playlist_videos_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".playlists_id_seq;

CREATE SEQUENCE "YouDub".playlists_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".roles_id_seq;

CREATE SEQUENCE "YouDub".roles_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".subscriptions_id_seq;

CREATE SEQUENCE "YouDub".subscriptions_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".tags_id_seq;

CREATE SEQUENCE "YouDub".tags_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".users_id_seq;

CREATE SEQUENCE "YouDub".users_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".video_tags_id_seq;

CREATE SEQUENCE "YouDub".video_tags_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE "YouDub".videos_id_seq;

CREATE SEQUENCE "YouDub".videos_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- "YouDub".access_statuses определение

-- Drop table

-- DROP TABLE "YouDub".access_statuses;

CREATE TABLE "YouDub".access_statuses (
	id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT access_pk PRIMARY KEY (id)
);


-- "YouDub".roles определение

-- Drop table

-- DROP TABLE "YouDub".roles;

CREATE TABLE "YouDub".roles (
	id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT roles_pk PRIMARY KEY (id),
	CONSTRAINT roles_unique UNIQUE (name)
);


-- "YouDub".tags определение

-- Drop table

-- DROP TABLE "YouDub".tags;

CREATE TABLE "YouDub".tags (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT tags_pk PRIMARY KEY (id),
	CONSTRAINT tags_unique UNIQUE (name)
);


-- "YouDub".users определение

-- Drop table

-- DROP TABLE "YouDub".users;

CREATE TABLE "YouDub".users (
	id serial4 NOT NULL,
	username varchar(50) NOT NULL,
	registration_date timestamp NOT NULL,
	email varchar(50) NOT NULL,
	password_hash varchar(255) NOT NULL,
	avatar_url varchar NULL,
	"is_activated" bool DEFAULT false NOT NULL,
	activation_link varchar NULL,
	id_role int4 NOT NULL,
	description varchar NULL,
	subscribers_count int4 NULL,
	is_banned bool DEFAULT false NOT NULL,
	ban_reason varchar NULL,
	channel_header_url varchar NULL,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_unique UNIQUE (email),
	CONSTRAINT users_roles_fk FOREIGN KEY (id_role) REFERENCES "YouDub".roles(id)
);
CREATE INDEX users_id_idx ON "YouDub".users USING btree (id, username, email, password_hash, registration_date, avatar_url, channel_header_url, description, subscribers_count, "is_activated", activation_link, is_banned, ban_reason, id_role);


-- "YouDub".videos определение

-- Drop table

-- DROP TABLE "YouDub".videos;

CREATE TABLE "YouDub".videos (
	id serial4 NOT NULL,
	"name" varchar(150) NOT NULL,
	description varchar NULL,
	url varchar NOT NULL,
	load_date timestamp NOT NULL,
	"views" int4 NULL,
	likes int4 NULL,
	dislikes int4 NULL,
	id_owner int4 NOT NULL,
	id_access int4 NOT NULL,
	CONSTRAINT videos_pk PRIMARY KEY (id),
	CONSTRAINT videos_unique UNIQUE (url),
	CONSTRAINT videos_access_statuses_fk FOREIGN KEY (id_access) REFERENCES "YouDub".access_statuses(id),
	CONSTRAINT videos_users_fk FOREIGN KEY (id_owner) REFERENCES "YouDub".users(id) ON DELETE CASCADE
);


-- "YouDub"."comments" определение

-- Drop table

-- DROP TABLE "YouDub"."comments";

CREATE TABLE "YouDub"."comments" (
	id serial4 NOT NULL,
	comment_text varchar NOT NULL,
	comment_date timestamp NOT NULL,
	likes int4 NULL,
	dislikes int4 NULL,
	id_user int4 NOT NULL,
	id_video int4 NOT NULL,
	CONSTRAINT comments_pk PRIMARY KEY (id),
	CONSTRAINT comments_users_fk FOREIGN KEY (id_user) REFERENCES "YouDub".users(id) ON DELETE CASCADE,
	CONSTRAINT comments_videos_fk FOREIGN KEY (id_video) REFERENCES "YouDub".videos(id) ON DELETE CASCADE
);


-- "YouDub".history определение

-- Drop table

-- DROP TABLE "YouDub".history;

CREATE TABLE "YouDub".history (
	id serial4 NOT NULL,
	id_user int4 NOT NULL,
	id_video int4 NOT NULL,
	progress_percent int4 NULL,
	watched_at timestamp NOT NULL,
	CONSTRAINT history_pk PRIMARY KEY (id),
	CONSTRAINT history_users_fk FOREIGN KEY (id_user) REFERENCES "YouDub".users(id) ON DELETE CASCADE,
	CONSTRAINT history_videos_fk FOREIGN KEY (id_video) REFERENCES "YouDub".videos(id) ON DELETE CASCADE
);


-- "YouDub".playlists определение

-- Drop table

-- DROP TABLE "YouDub".playlists;

CREATE TABLE "YouDub".playlists (
	id serial4 NOT NULL,
	"name" varchar(150) NOT NULL,
	description varchar NULL,
	url varchar NOT NULL,
	"views" int8 NULL,
	likes int8 NULL,
	dislikes int8 NULL,
	id_user int4 NOT NULL,
	id_access int4 NOT NULL,
	CONSTRAINT playlists_pk PRIMARY KEY (id),
	CONSTRAINT playlists_unique UNIQUE (url),
	CONSTRAINT playlists_access_statuses_fk FOREIGN KEY (id_access) REFERENCES "YouDub".access_statuses(id),
	CONSTRAINT playlists_users_fk FOREIGN KEY (id_user) REFERENCES "YouDub".users(id) ON DELETE CASCADE
);


-- "YouDub".subscriptions определение

-- Drop table

-- DROP TABLE "YouDub".subscriptions;

CREATE TABLE "YouDub".subscriptions (
	id serial4 NOT NULL,
	id_subscriber int4 NOT NULL,
	id_subscribed_user int4 NOT NULL,
	subscribed_at timestamp NOT NULL,
	CONSTRAINT subscriptions_pk PRIMARY KEY (id),
	CONSTRAINT subscriptions_users_fk FOREIGN KEY (id_subscriber) REFERENCES "YouDub".users(id) ON DELETE CASCADE,
	CONSTRAINT subscriptions_users_fk_1 FOREIGN KEY (id_subscribed_user) REFERENCES "YouDub".users(id) ON DELETE CASCADE
);


-- "YouDub".video_tags определение

-- Drop table

-- DROP TABLE "YouDub".video_tags;

CREATE TABLE "YouDub".video_tags (
	id serial4 NOT NULL,
	id_video int4 NOT NULL,
	id_tag int4 NOT NULL,
	CONSTRAINT video_tags_pk PRIMARY KEY (id),
	CONSTRAINT video_tags_tags_fk FOREIGN KEY (id_tag) REFERENCES "YouDub".tags(id) ON DELETE CASCADE,
	CONSTRAINT video_tags_videos_fk FOREIGN KEY (id_video) REFERENCES "YouDub".videos(id) ON DELETE CASCADE
);


-- "YouDub".playlist_videos определение

-- Drop table

-- DROP TABLE "YouDub".playlist_videos;

CREATE TABLE "YouDub".playlist_videos (
	id serial4 NOT NULL,
	id_playlist int4 NOT NULL,
	id_video int4 NOT NULL,
	CONSTRAINT playlist_videos_pk PRIMARY KEY (id),
	CONSTRAINT playlist_videos_playlists_fk FOREIGN KEY (id_playlist) REFERENCES "YouDub".playlists(id) ON DELETE CASCADE,
	CONSTRAINT playlist_videos_videos_fk FOREIGN KEY (id_video) REFERENCES "YouDub".videos(id) ON DELETE CASCADE
);