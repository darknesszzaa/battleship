### Battle Ship

### Installation

### Install and run the server with Docker

There is a `docker-compose.yml` file for starting Docker.

`docker-compose up -d`

After running the server, you can stop the Docker container with

`docker-compose down`

### Install with local

`npm install`

#### Running

This project requires docker or a local mongodb installation.  If using a local mongodb, see `.env` for connection options, and make sure there are matching options for the mongodb installation and the source code.

#### Run the server

`npm start`

#### Run test

Test Suite

`npm run test`

Test coverage

`npm run test:cov`

### How to use

After running the server, you can see API document on this URL

http://localhost:3000/api-docs/

Enjoy the game...
