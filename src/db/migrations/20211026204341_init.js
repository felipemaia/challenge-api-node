
exports.up = function(knex) {
    return knex.schema.createTable('token', (table) => {
        table.increments();
        table.string('token').notNullable().unique();
    }).createTable('user', (table)=> {
        table.increments();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.integer('tokenId').references('id').inTable('token');
        table.timestamps(true, true);
    }).createTable('author', (table) => {
        table.increments();
        table.string('name').notNullable().unique();
        table.string('picture').notNullable().unique();
    }).createTable('category', (table) => {
        table.increments();
        table.string('name').notNullable().unique();
    }).createTable('article', (table) => {
        table.increments();
        table.string('title').notNullable();
        table.string('summary').notNullable();
        table.string('firstParagraph').notNullable();
        table.string('body').notNullable();
        table.integer('authorId').references('id').inTable('author');
        table.integer('categoryId').references('id').inTable('category');
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('token')
    .dropTableIfExists('user')
    .dropTableIfExists('author')
    .dropTableIfExists('category')
    .dropTableIfExists('article');
};
