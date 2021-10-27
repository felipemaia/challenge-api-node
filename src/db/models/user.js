const { Model } = require('objection');

class User extends Model {
    static get tableName(){
        return 'user';
    }

    static get relationMappings(){
        const Token = require('./token');
        return {
            token: {
                relation: Model.HasOneRelation,
                modelClass: Token,
                join: {
                    from: 'user.tokenId',
                    to: 'token.id',
                }
            }
        };
    }
}

module.exports = User;