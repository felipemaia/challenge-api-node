/** Manage all the endpoints requests and responses, keeping the routes file clean */
const APIModel = require('../db/api-consumption');

//For all purposes, on a real project, all variables received by the user must be sanitized

//Deleting an article, only delete the article
//Deleting an author, delete all the articles of that given author

module.exports = {
    login: async (req, res) => {
        let email = req.body.email;
        let pass = req.body.password;

        let emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
        if(!emailRegex.test(email)) return res.json({error: "Email invalid!"});
        if(pass.length < 3 && pass.length > 16)
            return res.json({error: "Password must contain between 3 and 16 charaters"});
        
        let response = await APIModel.login(email,pass);

        if(response[0] === undefined) res.json("Email and/or password incorrect!");
        else res.json(response[0]);
        //TODO: the real implemantation here would be 'check if email is in DB, return the hashed password,
        //compare (probably using BCRYPT) if the inserted password is equal as the hashed stored. If so, return TOKEN,
        //if not, return "email and/or password are wrong!"
    },
    signup: async (req, res) => {
        let user = {};
        user.email = req.body.email;
        user.pass = req.body.password;
        console.log("MEIAL", user.email)
        //TODO: Isolate token Generation. Pretty simple token generator
        user.token = (parseInt(Math.random()*1000000000)).toString();
        console.log("TOKEN", user.token)

        let emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
        if(!emailRegex.test(user.email)) return res.status(400).json({error: "Email invalid!"});
        
        if(user.pass.length < 3 && user.pass.length > 16)
            return res.status(400).json({error: "Password must contain between 3 and 16 charaters"});
        
        let response = await APIModel.signup(user);

        if(response[0] === undefined) res.status(400).json("Email already registered!");
        else res.status(201).json("User successfully registered");
    },
    getArticlesByCategory: async (req, res) => {
        let category = req.query.category;
        let response = await APIModel.getArticlesByCategory(category);
        if(response !== undefined){
            let finalResponse = [];
            response.map((obj) => {
                let newObj = {};
                let author = {}
                author.name = obj.name;
                author.picture = obj.picture;
                newObj.author = author;
                newObj.title = obj.title;
                newObj.summary = obj.summary;
                finalResponse.push(newObj);
            })
            res.status(201).json(finalResponse);
        }
        else res.json({message: 'There are no Articles'});
    },
    //used in both public and private API
    getArticleById: async (req, res) => {
        let token = req.header('token') || '';
        let id = req.params.id;
        let tokenValidation = await APIModel.validateToken(token);
        let response = await APIModel.getArticleById(id, tokenValidation);
        
        if(response !== undefined) res.json(response);
        else res.json({message: 'There is no article with the given ID'});
    },

    //Down here are the PRIVATE (only) routes
    getAuthors: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let response = await APIModel.getAuthors();
            if(response[0] !== undefined) res.json(response);
            else res.json({message: 'No authors were found'})
        }
        else res.status(503).json({error:"Permission denied"});
    },
    getAuthorById: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let id = req.params.id;
            let response = await APIModel.getAuthorById(id);
            if(response[0] !== undefined) res.json(response);
            else res.json({message: 'There is no author with the given ID'});
        }
        else res.status(503).json({error:"Permission denied"});
    },
    insertAuthor: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let author = {};
            author.name = req.body.name;
            author.picture = req.body.picture;
            if(author.name != undefined && author.picture != undefined){
                let response = await APIModel.insertAuthor(author, token);
                
                if(response !== undefined) res.status(201).json({message:'Author successfully registered'});
                else res.status(200).json({message: 'Name and/or picture URL already exists'});
            }
            else{
                res.json({error: 'Missing parameters!'});
            }
        }
        else res.status(503).json({error:"Permission denied"})
    },

    updateAuthor: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let author = {};
            author.id = req.params.id;
            let name = req.body.name;
            let picture = req.body.picture;
            if(name !== undefined)
                author.name = name;
            if(picture !== undefined)
               author.picture = picture;
            let response = await APIModel.updateAuthor(author);
            if(response == 1) res.status(201).json({message:'Successful Update'});
            else res.status(400).json({message: 'There is a conflict with another author'});
        }
        else res.status(503).json({error:"Permission denied"});
    },
    deleteAuthorById: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let id = req.params.id;
            let response = await APIModel.deleteAuthorById(id);
            if(response == 1) res.json({message: 'Successful Deletion'});
            else res.status(200).json({message: 'There is no author with given ID to delete'})
        }
        else res.status(503).json({error:"Permission denied"});
    },
    getArticles: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let articlesList = await APIModel.getArticles();
            //Not smart enought: still have to improve the use of objection so it returns as one, not a mapping style
            if(articlesList !== undefined){
                let finalResponse = []
                articlesList[0].map((obj) => {
                    let newObj = {};
                    let author = {}
                    let category;
                    for(let i = 0; i < articlesList[1].length; i++){
                        if(articlesList[1][i].id == obj.categoryId){
                            category = articlesList[1][i].name;
                            i=articlesList[1].length+1;
                        }
                    }
                    author.name = obj.name;
                    author.picture = obj.picture;
                    newObj.author = author;
                    newObj.category = category;
                    newObj.title = obj.title;
                    newObj.summary = obj.summary;
                    newObj.firstParagraph = obj.firstParagraph;
                    newObj.body = obj.body;
                    finalResponse.push(newObj);
                })
                res.json(finalResponse);
            }
            else res.json({message: 'No articles were found'})
        }
        else res.status(503).json({error:"Permission denied"});
    },
    insertArticle: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let article = {}
            article.category = req.body.category;
            article.title = req.body.title;
            article.summary = req.body.summary;
            article.firstParagraph = req.body.firstParagraph;
            article.body = req.body.body;
            article.authorId = req.body.authorId;
            let response = await APIModel.insertArticle(article);
            if(response !== undefined) res.status(201).json({message: 'Successfully registered'});
            else res.status(500).json({message: 'Missing Parameters'})
        }
        else res.status(503).json({error:"Permission denied"});
    },
    updateArticle: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            let article = {};
            article.id = req.params.id;
            article.author = req.body.authorId;
            article.category = req.body.category;
            article.summary = req.body.summary;
            article.firstParagraph = req.body.firstParagraph
            article.title = req.body.title;
            article.body = req.body.body;
            let response = await APIModel.updateArticle(article);
            if(response == 1) res.status(201).json({message: 'Successfully Updated'})
            else res.json({message: 'There is no article to UPDATE'})
        }
        else res.status(503).json({error:"Permission denied"});
    },
    deleteArticleById: async (req, res) => {
        let token = req.header('token') || '';
        let tokenValidation = await APIModel.validateToken(token);
        if(tokenValidation){
            
            let id = req.params.id;
            let response = await APIModel.deleteArticleById(id);
        
            if(response) return res.status(201).json({message: 'Successfully Deleted'})
            else res.status(200).json({message: 'There is no article to delete'});

        }
        else res.status(503).json({error:"Permission denied"})
        
    }
};