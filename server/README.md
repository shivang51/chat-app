# This is server or backend for chat-app client

# To use this you will need:

#### Dependencies
To install them use `npm install`

#### And google firebase account.
    
## If you have google firebase account:
1. You need make a new project and setup cloud firestore.

2. Now got project settings then `Service Accounts` section. Then under `Firebase Admin SDK` section, \
    click on `Generate New Private Key` button. 
    This will generate a json file. Save or Download that file and save it in `server` folder and rename it to `serviceAccountKey.json`.

3. After this make a new base document `users` in firestore database.

## If you dont't have google firebase account:

Sign-up to google firebase and follow above steps. \
Check it [here](http://firebase.google.com).

### After doing above tasks you can start server with `node server.js` or `nodemon server.js`.

It will start at port `8080` locally.
