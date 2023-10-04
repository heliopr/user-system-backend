## Old Repo
https://github.com/TownbyHelio/user-system-backend

# About

## Built with
* SQLite 3
* NodeJS
* Express

## About the project
API, panel web server and database in one application. I tried to keep it as simple as possible and do everything my own way.

It includes:
* User registration
* Email confirmation (**OBS**: it does not actually send you an email, so you will have to manually check the `email_confirmations` table on the database in order to know the confirmation code)
* Password and email changes (**OBS**: codes are stored in `password_changes` table)
* Friendships among users
    * Friend requests
* Simple authentication (cookie)


# Instructions
1. Clone the repository
2. Run `npm install`
3. Run `npm start`
    3.1. The port is 1001

`localhost:1001/panel` - Panel where you can send requests
`localhost:1001/api/...` - API endpoints (for example: `localhost:1001/api/getUser`)

4. The database is automatically created inside `db/` as `main.db` when you run the program, along with the schemas in `schemas.json`

5. `CTRL + C` closes the server

# Endpoints

## GENERAL
W.I.P.

### `GET /api/getUser`
### `POST /api/registerUser`
### `POST /api/changeEmail`
### `POST /api/confirmEmail`
### `POST /api/requestPasswordChange`
### `POST /api/confirmPasswordChange`
### `POST /api/changeDescription`
### `GET  /api/getCookie`

## FRIENDS

### `GET /api/getFriends`
### `POST /api/removeFriend`
### `POST /api/sendFriendRequest`
### `GET /api/getSentFriendRequests`
### `GET /api/getPendingFriendRequests`
### `POST /api/cancelFriendRequest`
### `POST /api/acceptFriendRequest`
### `POST /api/declineFriendRequest`
