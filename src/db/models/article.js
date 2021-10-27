const { Model } = require('objection');

class Article extends Model {
    static get tableName(){
        return 'article';
    }

    static get relationMappings(){
        const Author = require('./author');
        const Category = require('./category');
        return {
            category: {
                relation: Model.HasManyRelation,
                modelClass: Category,
                join: {
                    from: 'category.id',
                    to: 'article.categoryId'
                }
            },
            author: {
                relation: Model.HasManyRelation,
                modelClass: Author,
                join: {
                    from: 'author.id',
                    to: 'article.authorId'
                }
            }
        };
    }
}

module.exports = Article;