# DataBuddy Backend

Backend with Node.js, TypeScript and Express.js

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

We use yarn as a packet manager for this project. Install it together with NodeJS:

```
$ sudo apt-get install nodejs
$ sudo apt install yarn
```

### Installing

Open a bash and navigate into the parent folder of this README.

```
$ cd /mnt/c/Users/path/to/web-backend/
```

type this command to install all dependencies. This will take a while:

```
$ yarn install
```

Now let's check if it works by starting our server. This will translate the TypeScript source files (.ts) into plain JavaScript, check them for TypeErrors and put them into the target directory. After it's done, it will do `node target/server.js` to start the server with our application:

```
$ yarn start-dev
```

## Running the tests

TODO

## Deployment

We currently deploy this system on heroku.

Build your project with

```
$ yarn build-ts
```

Move the updated target directory into the heroku repository and push your changes by running

```
$ git add .
$ git commit -am "Commit message"
$ git push heroku master
```

To see the logs, run:

```
$ heroko logs --tail
```

## Built With

- [Express]() - Easy-to-use framework for building (not only) APIs with Node.js
- [yarn]() - package manager
- [TypeScript](https://rometools.github.io/rome/) - For a better JavaScript experience

## API Documentation
We use [ApiDoc](https://apidocjs.com/) for the api documentation.
```
apidoc -i src
```
to generate your documentation.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
