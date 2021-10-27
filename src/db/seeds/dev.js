
exports.seed = async function(knex) {
  //truncate all existing tables
  await knex.raw('TRUNCATE TABLE "token" CASCADE');
  await knex.raw('TRUNCATE TABLE "user" CASCADE');
  await knex.raw('TRUNCATE TABLE "author" CASCADE');
  await knex.raw('TRUNCATE TABLE "category" CASCADE');
  await knex.raw('TRUNCATE TABLE "article" CASCADE');
  
  await knex('token').insert([
    { id: 100, token: 1234567890 },
    { id: 101, token: 0987654321 },
    { id: 102, token: 1029384756 }
  ]);

  await knex('user').insert([
    { id: 100, email: "user1@test.com", password: "12345", tokenId: 101 },
    { id: 101, email: "user2@test.com", password: "12345", tokenId: 100 },
    { id: 102, email: "user3@test.com", password: "12345", tokenId: 102 }
  ]);

  await knex('author').insert([
    { id: 100, name: "author 1", picture: "https://picture.com/author1" },
    { id: 101, name: "author 2", picture: "https://picture.com/author2" },
    { id: 102, name: "author 3", picture: "https://picture.com/author3" },
    { id: 103, name: "author 4", picture: "https://picture.com/author4" },
    { id: 104, name: "author 5", picture: "https://picture.com/author5" },
    { id: 105, name: "author 6", picture: "https://picture.com/author6" },
    { id: 106, name: "author 7", picture: "https://picture.com/author7" },
    { id: 107, name: "author 8", picture: "https://picture.com/author8" },
    { id: 108, name: "author 9", picture: "https://picture.com/author9" },
  ]);

  await knex('category').insert([
    { id: 100, name: "Medicine" },
    { id: 101, name: "Law" },
    { id: 102, name: "Marketing" },
    { id: 103, name: "Programming" },
    { id: 104, name: "Engineering" }
  ]);

  //As the last one, can be return
  return knex('article').insert([
    { id: 100, title: "About MEDICINE", summary: "Describe something pretty cool in the MEDICINE area.",
    firstParagraph: "In here, something awesome about MEDICINE to grab atention in the first words about what will be discussed in the next paragraphs",
    body: "The rest of the article, with begin, middle and end of the topic about MEDICINE",
    authorId: 101, categoryId: 100},
    { id: 101, title: "Other about MEDICINE", summary: "Describe something pretty cool in the MEDICINE as well.",
    firstParagraph: "In here, something awesome about MEDICINE to grab atention in the first words about what will be discussed in the next paragraphs",
    body: "The rest of the article, with begin, middle and end of the topic about MEDICINE",
    authorId: 104, categoryId: 100},
    { id: 102, title: "About PROGRAMMING", summary: "Describe something pretty cool in the PROGRAMMING area.",
    firstParagraph: "At least this author can talk about migrations",
    body: "The rest of the article describing how to proceed, witch commands to use.",
    authorId: 106, categoryId: 103},
    { id: 103, title: "Something about LAW", summary: "Describe something pretty cool in the LAW area.",
    firstParagraph: "Perhaps an introduction about the LGPD LAW",
    body: "The rest of the article, where the LGPD LAW is discussed, user cases given, and the conclusion of the article",
    authorId: 108, categoryId: 101},
  ]);

};
