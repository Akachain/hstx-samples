# Akachain - High Secure Transaction Samples
Sample applications for implementing **[hstx-node-sdk](https://github.com/Akachain/hstx-node-sdk)**.

This project includes __hstx-front-end__, __hstx-dapp__ projects.

## Installation
Before installing, [download and install Node.js](https://nodejs.org/en/download/).

## Quick Start

### 1. hstx-front-end
<b><i>Vuejs Application</i></b>

Go to directory
```js
cd hstx-front-end
```

Install dependencies
```js
npm install
```

Run in develop mode, application will be running at port 8080
```js
npm run serve
```

Build production for deployment
```js
npm run build
```

### 2. hstx-dapp
<b><i>Nodejs Appplication</i></b>

__Go to directory__
```js
cd hstx-dapp
```

__Grant access permission for registry https://npm.pkg.github.com/__

Create file .npmrc

```js
// Linux/MacOS command
touch .npmrc
```
Config registry to install akaChain SDK
```js
// Linux/MacOS command
echo "registry=https://npm.pkg.github.com/Akachain" >> .npmrc
```
Get your personal access token on github:
Access to [gibhub](https://github.com), choose [settings](https://github.com/settings/profile) at right-top of page. Click on _Developer settings_, _Personal access tokens_ then generate your token. Copy it to replace your_token in the following command
```js
// Linux/MacOS command
echo "//npm.pkg.github.com/:_authToken=your_token"
```

__Install dependencies__
```js
npm install
```

__Create and config _env_ (enviroment variables)__

- Create file .env in the root of this project

- Copy content of .env.example to .env file

- Config env variables as you want

__Run in develop mode, application will be running at port 8080__
```js
npm start
```
