--Добавить авторов
INSERT INTO
    authors(
        email,
        firstname,
        lastname,
        password_hash,
        avatar
    )
VALUES
    (
        'ivanov@example.com',
        'Иван',
        'Иванов',
        '5f4dcc3b5aa765d61d8327deb882cf99',
        'avatar1.jpg'
    ),
    (
        'petrov@example.com',
        'Пётр',
        'Петров',
        '5f4dcc3b5aa765d61d8327deb882cf99',
        'avatar2.jpg'
    );

--Добавить категории статей
INSERT INTO
    categories(title)
VALUES
    ('Музыка'),
    ('IT'),
    ('Железо');

--Добавить статьи
ALTER TABLE
    articles DISABLE TRIGGER ALL;
INSERT INTO
    articles(title, announce, full_text, picture, author_id)
VALUES
    (
        'Разработка плагина брендирования',
        'Бороться с прокрастинацией несложно. Просто действуйте.',
        'Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Google сейчас активно форсит AMP, подробней здесь.Разработчики Wordpress реализовали поддерку через плагин, но с ним пока все печально. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Готов заплатить за такое, как вероятно и другие вебмастера ориентировнные на получение трафика с гугла. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Предложение — почему бы в момент подписки на конкретный блог не сделать возможность выбора: получать уведомления о новых топиках в данном блоге на e-mail/просто следить за блогом в Ленте без писем на мыло. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина.',
        'image1.jpg',
        1
    ),
    (
        'Как начать программировать',
        'Это один из лучших рок-музыкантов.',
        'Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Уже не помню в чем были причины, но это уже и не важно. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно, как об этом говорят. Готов заплатить за такое, как вероятно и другие вебмастера ориентировнные на получение трафика с гугла. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?',
        'image1.jpg',
        2
    ),
    (
        'Самый лучший музыкальный альбом этого года',
        'Бороться с прокрастинацией несложно. Просто действуйте. Программировать не настолько сложно, как об этом говорят. ',
        'Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Уже не помню в чем были причины, но это уже и не важно. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно, как об этом говорят. Готов заплатить за такое, как вероятно и другие вебмастера ориентировнные на получение трафика с гугла. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?',
        'image3.jpg',
        3
    );
ALTER TABLE
    articles ENABLE TRIGGER ALL;

--Добавить статьям категории
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

--Добавить комментарии
INSERT INTO
    comments(text)
VALUES
    ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.'),
    ('Мне кажется или я уже читал это где-то?'),
    ('Плюсую, но слишком много буквы! Хочу такую же футболку :-) Совсем немного...'),
    ('Совсем немного...'),
    ('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)'),
    ('Планируете записать видосик на эту тему? Совсем немного...'),
    ('Продам крокодила, которого можно держать в гараже'),
    ('Это где ж такие красоты?');

--Добавить статьям комментарии
ALTER TABLE comments_articles DISABLE TRIGGER ALL;
INSERT INTO comments_articles(comment_id, article_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 3),
(6, 3);
ALTER TABLE comments_articles ENABLE TRIGGER ALL;

--Добавить авторам комментарии
ALTER TABLE comments_authors DISABLE TRIGGER ALL;
INSERT INTO comments_authors(comment_id, author_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 2);
ALTER TABLE comments_authors ENABLE TRIGGER ALL;

--Добавить роли
ALTER TABLE roles DISABLE TRIGGER ALL;
INSERT INTO roles(role_name, author_id) VALUES
('Гость', 1),
('Читатель', 1),
('Автор', 2);
ALTER TABLE roles ENABLE TRIGGER ALL;
