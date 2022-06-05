DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS articles cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments cascade;

CREATE TABLE users
(
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) UNIQUE NOT NULL,
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(255)
);

CREATE TABLE roles
(
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	role_name VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE categories
(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE articles
(
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	title VARCHAR(100) NOT NULL,
	created_date timestamp DEFAULT current_timestamp,
  announce VARCHAR(255) NOT NULL,
  full_text TEXT NOT NULL,
  picture varchar(255) NOT NULL,
	user_id INTEGER NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE comments
(
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	text TEXT NOT NULL,
  created_date timestamp DEFAULT current_timestamp,
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
		ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE INDEX ON articles(title);

CREATE TABLE articles_categories
(
	article_id INTEGER NOT NULL,
	category_id INTEGER NOT NULL,
	CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);



