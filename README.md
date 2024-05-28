# couchcritics
 IHC project

To run this Next.js application on a new machine, you need to follow these steps:

Install Node.js and npm: https://nodejs.org/

Navigate to the project directory:

```
cd couchcritics
```
Install the dependencies:

```
npm install
```

Create a ".env" file with this in it (for running porpuses):
  SESSION_SECRET = "J5TdLWGMZt2oQbRQx5A2pSz7Jb2rRdKh"
  NODE_ENV = "production"
  
Start the application:
```
npm run dev
```

Start the local database in a new terminal (pocketbase):

```
.\pocketbase.exe serve
```
