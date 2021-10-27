# Node Challenge #001 presented by Jungle Devs

## Description on how to run the project

**Development Enviroment**: For the purpose to be analysed, the following instructions are set to help run correctly the app:

-- Must have node.js installed (+v10)
1. Download all the files (assuming this doc is been read, it was already done)
2. Install all the dependencies, using the command 'npm install' (in linux enviroments, suppose it's 'yarn install')
3. Some bugs might occur, based on depreciated functions. Use the command 'npm audit fix'
4. Run the command 'docker-compose up' so the container is installed correctly
5. Open docker and make sure it is running the container. If not, start the container
    (the container will probably be with the folder name all the files were saved in)
6. With the help of some visual DB administrator, such as PGAdmin or DBeaver, check if the DB is running and can be reached
    Use:  localhost for HOST; postgres for USERNAME; postgres for PASSWORD; 5432 for PORT
7. Run the command 'npm run migrate' so all the tables are instanciated
8. This step is optional: run the command 'npm run seed', witch will populate the DB
9. Run the command 'npm run dev' so the server is up and read to be tested
10. Use the 'API Collection' so it can be fully tested REST architecture;

**Build Enviroment**: The following instructions are to build and deploy the app.

1. Change DB configurations in './sec/db/knexfils.js'
2. (I guess) Instanciate the DB tables with the command 'npm run migrate' (on the desired location, not localhost anymore)
3. Run the command 'npm run build' witch will generate a server file, in the directory './build'
4. Upload the files generated and run it on the server!

There is a .doc file, defining every and each of the endpoints, witch parameters to use, method and so on!