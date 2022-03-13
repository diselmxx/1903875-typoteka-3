"use strict";

const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const {HttpCode} = require(`../../constants`);
const {ArticleService, CommentService} = require(`../data-service`);

const mockCategories = [`Кино`, `Железо`, `Музыка`, `IT`];

const mockData = [
  {
    title: `Разработка плагина брендирования`,
    createdDate: `2021-08-15 00:40:28`,
    announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Уже не помню в чем были причины, но это уже и не важно. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Google сейчас активно форсит AMP, подробней здесь.Разработчики Wordpress реализовали поддерку через плагин, но с ним пока все печально. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Готов заплатить за такое, как вероятно и другие вебмастера ориентировнные на получение трафика с гугла. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Предложение — почему бы в момент подписки на конкретный блог не сделать возможность выбора: получать уведомления о новых топиках в данном блоге на e-mail/просто следить за блогом в Ленте без писем на мыло. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    category: [`Кино`],
    comments: [
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы!`,
      },
    ],
  },
  {
    title: `Самый лучший музыкальный альбом этого года`,
    createdDate: `2021-09-20 14:17:43`,
    announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Это один из лучших рок-музыкантов.`,
    fullText: `Ёлки — это не просто красивое дерево. Это прочная древесина. Google сейчас активно форсит AMP, подробней здесь.Разработчики Wordpress реализовали поддерку через плагин, но с ним пока все печально. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Готов заплатить за такое, как вероятно и другие вебмастера ориентировнные на получение трафика с гугла. Возможно остались единицы сайтостроителей, которые надеются на чудо:)) Но чуда не будет. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха.`,
    category: [`Музыка`],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)`,
      },
      {
        text: `Планируете записать видосик на эту тему? Совсем немного...`,
      },
      {
        text: `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?`,
      },
    ],
  },
  {
    title: `Как начать программировать`,
    createdDate: `2021-09-14 04:10:33`,
    announce: `Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина. Предложение — почему бы в момент подписки на конкретный блог не сделать возможность выбора: получать уведомления о новых топиках в данном блоге на e-mail/просто следить за блогом в Ленте без писем на мыло.`,
    fullText: `Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Уже не помню в чем были причины, но это уже и не важно. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно, как об этом говорят. Готов заплатить за такое, как вероятно и другие вебмастера ориентировнные на получение трафика с гугла. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    category: [`Железо`],
    comments: [
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {text: `Совсем немного...`},
    ],
  },
  {
    title: `Как начать программировать`,
    createdDate: `2021-08-18 02:41:37`,
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    fullText: `Уже не помню в чем были причины, но это уже и не важно. Google сейчас активно форсит AMP, подробней здесь.Разработчики Wordpress реализовали поддерку через плагин, но с ним пока все печально. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Готов заплатить за такое, как вероятно и другие вебмастера ориентировнные на получение трафика с гугла. Первая большая ёлка была установлена только в 1938 году. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят.`,
    category: [`Музыка`],
    comments: [
      {text: `"Мне кажется или я уже читал это где-то?`},
      {text: `Это где ж такие красоты?`},
      {
        text: `Плюсую, но слишком много буквы! Хочу такую же футболку :-) Совсем немного...`,
      },
    ],
  },
  {
    title: `Вниманию всех, у кого возникли проблемы с авторизацией`,
    createdDate: `2021-09-17 10:48:15`,
    announce: `Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Уже не помню в чем были причины, но это уже и не важно. Внешне сайт работает нормально, но в админке сыплет такими нотисами... очень неприятно. Простые ежедневные упражнения помогут достичь успеха. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Хочется чтобы вместо этого меню была тупо ссылка на профиль и выход.. Такое можно реализовать? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Предложение — почему бы в момент подписки на конкретный блог не сделать возможность выбора: получать уведомления о новых топиках в данном блоге на e-mail/просто следить за блогом в Ленте без писем на мыло. Возможно остались единицы сайтостроителей, которые надеются на чудо:)) Но чуда не будет. Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Google сейчас активно форсит AMP, подробней здесь.Разработчики Wordpress реализовали поддерку через плагин, но с ним пока все печально.`,
    category: [`IT`],
    comments: [
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Это где ж такие красоты?`,
      },
      {
        text: `Хочу такую же футболку :-) "Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!`,
      },
      {text: `Планируете записать видосик на эту тему?`},
    ],
  },
];

const mockAuthors = [
  {
    email: `ivanov@example.com`,
    firstname: `Иван`,
    lastname: `Иванов`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avater: `'avatar1.jpg`,
  },
  {
    email: `petrov@example.com`,
    firstname: `Пётр`,
    lastname: `Петров`,
    password: `5f4dcc3b5aa765d61d8327deb882cf99`,
    avater: `'avatar2.jpg`,
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    authors: mockAuthors,
    articles: mockData,
  });
  const app = express();
  app.use(express.json());
  article(app, new ArticleService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () =>
    expect(response.body.length).toBe(5));
});

describe(`API returns an article with given id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Разработка плагина брендирования"`, () =>
    expect(response.body.title).toBe(`Разработка плагина брендирования`));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Дам погладить котика`,
    announce: `Дам погладить котика. Дорого. Не гербалайф.`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф. Остальной текст...`,
    categories: [`Котики`],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  // test(`Returns article created`, () =>
  //   expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6)));
});

// describe(`API refuses to create an article if data is invalid`, () => {
//   const newArticle = {
//     categories: [`Котики`],
//     title: `Дам погладить котика`,
//     announce: `Дам погладить котика. Дорого. Не гербалайф.`,
//     fullText: `Дам погладить котика. Дорого. Не гербалайф. Остальной текст...`,
//   };

//   const app = createAPI();

//   test(`Without any required property response code is 400`, async () => {

//     for (const key of Object.keys(newArticle)) {
//       const badArticle = {...newArticle};
//       delete badArticle[key];
//       await request(app)
//         .post(`/articles`)
//         .send(badArticle)
//         .expect(HttpCode.BAD_REQUEST);
//     }
//   });
// });

// describe(`API changes existent article`, () => {
//   const newArticle = {
//     category: `Котики`,
//     title: `Дам погладить котика`,
//     announce: `Дам погладить котика. Дорого. Не гербалайф.`,
//     fullText: `Дам погладить котика. Дорого. Не гербалайф. Остальной текст...`,
//   };

//   const app = createAPI();

//   let response;

//   beforeAll(async () => {
//     response = await request(app).put(`/articles/PDs53Q`).send(newArticle);
//   });

//   test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

//   test(`Returns changed article`, () =>
//     expect(response.body).toEqual(expect.objectContaining(newArticle)));

//   test(`Article is really changed`, () =>
//     request(app)
//       .get(`/articles/PDs53Q`)
//       .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));
// });

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();

  const validArticle = {
    categories: [`Котики`],
    title: `Дам погладить котика`,
    announce: `Дам погладить котика. Дорого. Не гербалайф.`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф. Остальной текст...`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createAPI();

  const invalidArticle = {
    title: `Дам погладить котика`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(1));

  test(`Articles count is 4 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();
  const newComment = {
    text: `Новый комментарий`,
  };
  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send(newComment)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/PDs53Q/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});
