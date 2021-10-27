const { Model } = require('objection');

class Author extends Model {
    static get tableName(){
        return 'author';
    }
}

module.exports = Author;