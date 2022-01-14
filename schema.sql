DROP TABLE IF EXISTS comments_authors;
DROP TABLE IF EXISTS comments_articles;
DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS authors cascade;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;

CREATE TABLE authors
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
  author_id INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (id)
    ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE categories
(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE comments
(
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	text TEXT NOT NULL
);

CREATE TABLE articles
(
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	title VARCHAR(100) NOT NULL,
	created_date timestamp DEFAULT current_timestamp,
  announce VARCHAR(255) NOT NULL,
  full_text TEXT NOT NULL,
	author_id INTEGER NOT NULL,
	FOREIGN KEY (author_id) REFERENCES authors (id)
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

CREATE TABLE comments_articles
(
	comment_id INTEGER NOT NULL,
	article_id INTEGER NOT NULL,
	CONSTRAINT comments_articles_pk PRIMARY KEY (comment_id, article_id),
    FOREIGN KEY (comment_id) REFERENCES comments (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE comments_authors
(
	comment_id INTEGER NOT NULL,
	author_id INTEGER NOT NULL,
	CONSTRAINT comments_authors_pk PRIMARY KEY (comment_id, author_id),
    FOREIGN KEY (comment_id) REFERENCES comments (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);


