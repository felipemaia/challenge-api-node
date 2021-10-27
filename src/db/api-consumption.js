const Article = require('./models/article');
const Author = require('./models/author');
const Category = require('./models/category');
const Token = require('./models/token');
const User = require('./models/user');


module.exports = {
    login: async (email, pass) => {
        try{
            let user = await Token.query()
                .select('token')
                .whereExists(
                    User.query()
                    .select(1)
                    .where('email', email)
                    .where('password', pass)
                    .whereColumn('token.id', 'user.tokenId')
                );
            return user;
        }catch(err){
            return err;
        }
    },
    signup: async (user) => {
        let checkToken = await Token.query().select(1).where('token', user.token);
        let checkEmail = await User.query().select(1).where('email', user.email);

        if( checkToken == 0 && checkEmail == 0){
            try{
                let tokenResponse = await Token.query().insert({token: user.token});
                let userResponse = await User.query().insert({
                    email: user.email,
                    password: user.pass,
                    tokenId: tokenResponse.id})
                return userResponse;
            }catch(e) {
                console.log(e);
            }
        }
        else return false;
    },
    getArticlesByCategory: async (category) => {
        let catId = await Category.query().select('id').where('name',category);
        if(catId[0] !== undefined){
            let response = await Category.query()
            .select('article.title', 'article.summary', 'author.name', 'author.picture')
            .innerJoin('article', 'category.id', 'article.categoryId' )
            .innerJoin('author', 'article.authorId', 'author.id')
            .where('category.name', category);
            return response;
        }
        else{
            return;
        }
    },
    getArticleById: async (id, withToken) => {
        //se estiver com token, mesma query, com select extra de BODY
        try{
            let array = ['authorId', 'categoryId', 'summary','title','firstParagraph'];
            if(withToken) array.push('body');
            let article = await Article.query().select(array).findById(id);
            let author = await Author.query().select('name','picture').findById(article.authorId);
            let category = await Category.query().select('name').findById(article.categoryId);
            let response = {}
            response.author = author;
            response.category = category.name;
            response.title = article.title;
            response.summary = article.summary;
            response.firstParagraph = article.firstParagraph;
            response.body = article.body;
            return response;
        }catch(e){
            return undefined;
        }
    },
    getAuthors: async () => {
        try{
            let authorList = await Author.query();
            return authorList;
        }catch(e){
            console.log(e);
        }
    },
    getAuthorById: async (id) => {
        try{
            let author = await Author.query()
            .select('name', 'picture')
            .where('id', id);
            return author;
        }catch(e){
            console.log(e)
        }
    },
    insertAuthor: async (author) => {
        try{
            let response = await Author.query().insert({ name: author.name, picture: author.picture });
            return response;
        }catch(e){
            console.log(e);
        }
    },
    updateAuthor: async (author) => {
        try{
            let response = await Author.query()
            .patch({ name: author.name, picture: author.picture }).findById(author.id);
            return response;
        }catch(e){
            console.log(e)
        }
    },
    deleteAuthorById: async (id) => {
        try{
            let response = await Article.query().delete().where('authorId',id);
            response = await Author.query().delete().where('id',id); 
            return response;
        }catch(e){
            console.log(e)
        }
    },
    getArticles: async () => {
        try{
            let response = await Category.query()
            .select('article.title', 'article.summary', 'article.categoryId', 'article.firstParagraph', 'article.body', 'author.name', 'author.picture')
            .innerJoin('article', 'category.id', 'article.categoryId' )
            .innerJoin('author', 'article.authorId', 'author.id');
            if(response[0] !== undefined){
                let listCategory = await Category.query();
                let array = [response, listCategory];
                return array;
            }
            else return;
        }catch(e){
            console.log(e)
        }
    },
    insertArticle: async (article) => {
        try{
            let response = await Category.query().select('id').where('name', article.category);
            console.log("RESPONSE", response)
            if(response[0] === undefined){
                response = await Category.query().insertAndFetch({category: article.category});
            }
            response = await Article.query().insert({
                title: article.title,
                summary: article.summary,
                firstParagraph: article.firstParagraph,
                body: article.body,
                authorId: article.author,
                categoryId: response[0].id
            });
            return response;
        }catch(e){
            console.log(e)
            return;
        }
    },
    updateArticle: async (article) => {
        try{
            let response = await Article.query().patch({
                ...article
            }).findById(article.id);
            return response;
        }catch(e){
            console.log(e)
        }
    },
    deleteArticleById: async (id) => {
        try{
            let delResponse = await Article.query().delete().where('id', id);
            return delResponse == 1 ? true : false;
        }catch(e){
            console.log(e)
        }
    },
    validateToken: async (token) => {
        let isValid = await Token.query().select(1).where('token',token)
        return isValid[0] !== undefined ? true : false;
    }
}