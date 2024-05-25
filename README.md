ConvoGenius
Define .env file for server that includes:-
PRIVATE_KEY = "ChatEngine private key"
PROJECT_ID = "ChatEngine project ID"
BOT_USER_NAME = "main user created in ChatEngine must be named :'AI_bot-Steve'"
BOT_USER_SECRET = "same secret used for creating above user"
PORT= "any port for Backend"
GENERATIVE_AI_API_KEY = "GeminiAI API key"

Define .env.local file for client that includes:-
VITE_BASE_URL=" local url for front end example:-http://localhost:1337 "
VITE_PROJECT_ID="ChatEngine project ID"

Server:-
Download dependencies:-
npm install
start server:-
npm run dev or nodemon(make sure nodemon is installed in your system)

Client:-
Download dependencies:-
npm install
Start frontEnd server:-
npm run dev

and then open the VITE_BASE_URL in browser, which you have defined in .env.local

Github Link:- https://github.com/Bhanu-Nayak/ConvoGenius
