# setup instuctions
- clone this repository and enter the directory
  ```bash
  git clone https://github.com/yeaminsarder/careerconnect
  cd careerconnect
  ```
- get the .env file from discord `resources` channel and place it at `server/.env`
- make sure you have `nodejs 26.4.0` and `npm 11.17.0` installed
```bash
node -v
npm -v
```
- change to  server directory install dependencies and start the server
```bash
cd server
npm install
```
- if scripts are disabled, follow the instructions given in the last command's output to enable them
- finally run the server
```bash
npm run start
```
- wait for it print 'connected to db and listening'
- take another terminal and change to client directory install dependencies and start the client server. allow scripts if necessary
```bash
cd client
npm install
npm run start
````
- open the browser at `localhost:3000`