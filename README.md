# Coeus
Social networking site specialising in inspiring and educational short form content for all ages

## Setup

You will need Node to run this project locally. To run, clone this repo and in the main folder run
`npm i`.

Then, in the main folder create a file named `.env` to securely store your environment variables. In this folder you will need to set three variables as follows:

MONGO_URI=""

JWT_SECRET=""

JWT_LIFETIME=""

Mongo_uri is the link to the mongo_db database, of the format mongodb+srv://<db_username>:<db_password>@nodeexpressproject.ee21c.mongodb.net/?retryWrites=true&w=majority&appName=NodeExpressProject 

where <db_username> and <db_password> are replaced by your respective values.

Jwt_secret must be set to a random complex string of your choice (will be used for authentication tokens)

jwt_lifetime is a string set to declare the lifetime of created jwt tokens, e.g. "18d" for tokens to remain valid for 18 days

### Commands

`npm start` starts the program locally on local host port 3000

`npm test` runs the tests (currently register and login functionality)