-- --Получить список всех категорий (идентификатор, наименование категории);
SELECT * FROM categories;

-- --Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT id, title FROM categories
  JOIN articles_categories
  ON id = category_id
  GROUP BY id;

-- --Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT id, title, count(article_id) FROM categories
  LEFT JOIN articles_categories
  ON id = category_id
  GROUP BY id;

--Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
SELECT articles.id, articles.title, articles.announce, articles.created_date,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.title, ', ') AS categories_list,
  users.firstname,
  users.lastname,
  users.email
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  JOIN users ON users.id = articles.user_id
  LEFT JOIN comments ON comments.article_id = articles.id AND comments.user_id = users.id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_date DESC;

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT articles.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.title, ', ') AS categories_list,
  users.firstname,
  users.lastname,
  users.email
FROM articles
  JOIN articles_categories ON articles.id = articles_categories.article_id
  JOIN categories ON articles_categories.category_id = categories.id
  JOIN users ON users.id = articles.user_id
  LEFT JOIN comments ON comments.article_id = articles.id AND comments.user_id = users.id
  WHERE articles.id = 1
  GROUP BY articles.id, users.id;

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT
  comments.id,
  comments.article_id,
  users.firstname,
  users.lastname,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.created_date DESC
  LIMIT 5;

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT comments.id as comment_id,
  comments.article_id as article_id,
  users.firstname,
  users.lastname,
comments.text as comment
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
ORDER BY comments.created_date DESC;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1

