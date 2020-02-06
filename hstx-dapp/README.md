# Akachain - High Secure Transaction Samples ⌁ hstx-dapp

<h2>Quick Start</h2>

1. Go to directory
    ```js
    cd hstx-dapp
    ```

2. Grant access permission for registry https://npm.pkg.github.com/
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

3. Install dependencies
    ```js
    npm install
    ```

4. Create and config _env_ (enviroment variables)
- Create file .env in the root of this project
- Copy content of .env.example to .env file
- Config env variables as you want

5. Run in develop mode, application will be running at port 8080
    ```js
    npm start
    ```