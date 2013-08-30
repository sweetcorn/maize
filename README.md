IBM Knowledge Edition App
==========

Single Page Application for IBM's Knowledge Edition training materials website.  The application is built using [Node.js](http://nodejs.org/) and the [Express.js](http://expressjs.com/).

## Development

### Cloning the repository

``` sh
$ git clone git@github.com:crushlovely/ibm-knowledge-editions-app
```

### Installing NVM (Node Version Manager)

`nvm` is a tool that helps you manage different version of Node for local development. To install, run the following:

``` sh
$ curl https://raw.github.com/creationix/nvm/master/install.sh | sh
```

### Installing Node.js

Node is a server-side javascript engine.  To install the correct version for this application, run:

``` sh
$ nvm use
```

This will tell `nvm` to use the version specified by the `.nvmrc` file in the root directory of the repository.  If `nvm` says you don't have the specified version of Node installed, install it by running:

``` sh
$ nvm install 0.10.15 // or whatever node version you need to install
```

### Installing grunt-cli

``` sh
$ npm install -g grunt-cli
```

### running the app

Navigate into the repository and run the following commands:

``` sh
$ npm install
$ grunt server
```

The application will now be live at [http://0.0.0.0:3000](http://0.0.0.0:3000)

## Deployment

For now, a temp deployment is up on Heroku.

### Set your Heroku remote up

``` bash
git remote add production git@heroku.com:ibm-knowledge-editions-app.git
```

### Deploy

``` bash
git push production master
```