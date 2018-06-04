# An ecommerce demo project using Prisma (GraphQL) and React-Native

> The react-native code can be found in the /client directory.

> The prisma code (in typescript) can be found in /server directory.

### To run the server code, Docker is required, as I have deployed DB to local cluster.

For setting up server, use this in the terminal:
* cd to `/server/database`
* `docker-compose up -d`
* `prisma deploy`
This will start the docker container for our db.

To access db, use this in the terminal:
* `docker container ls` and get the name of the container using mysql
* `docker exec -it *container-name* bash`
* The above command will put us in a bash shell.
* Here use: `mysql -pprisma` to access the db.
* We can now use regular mySql commands such as `show databases;` etc to explore.

**Once the db is set up and deployed, cd to root of server directory and run `yarn dev`.**

### To run the client side code, simply cd to client directory and `yarn start`.