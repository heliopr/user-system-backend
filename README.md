## Old Repo
https://github.com/TownbyHelio/user-system-backend

## This file is W.I.P.

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

## Response (IMPORTANT)
The response is always a json object containing a `success` boolean property (very self-describing). In case the code does not succeed, it will return an `errorCode` (number) and `errorMessage` (string), both describing the error. The possible error codes for each endpoint can be found below within their respective sections.

## GENERAL
W.I.P.

### `GET /api/getUser`
<details>
  <summary>Click me</summary>

  #### Request: **GET**
  Params (exclusive, in can set only one of them in your request):
  - `name`: string
  - `id`: number

  #### Response
  ```json
  {
    //guaranteed:
    "success": boolean,

    //if (!success) {
      "errorCode": number,
      "errorMessage": string,
    //}

    //if (success) {
      "found": boolean,
      //if (found) {
        "id": number,
        "username": string,
        "description": string,
        "emailConfirmed": boolean
      //}
    //}

  }
  ```

  #### Errors
  1000 - One, and only one of the arguments must be defined
  1001 - Wrong param type
  1010 - Error trying to get user

  #### Examples
  Request: `.../api/getUser/?name=helio`

  Success Response:
  ```json
  {
    "success": true,
    "found": true,
    "id": 1,
    "username": "helio",
    "description": "my password is not 'verystrongpassword123'",
    "emailConfirmed": false
  }
  ```

  Error Response:
  ```json
  {
    "success": false,
    "errorCode": 1010,
    "errorMessage": "An error occurred when trying to get user from the database"
  }
  ```
</details>


### `POST /api/registerUser`
<details>
  <summary>Click me</summary>

  #### Request: **POST**
  Body:
  ```json
  {
    "username": string,
    "password": string,
    "email": string
  }
  ```

  #### Response
  ```json
  {
    //guaranteed:
    "success": boolean,

    //if (!success) {
      "errorCode": number,
      "errorMessage": string,
    //}

    //if (success) {
      "id": number,
      "cookie": string,
    //}
  }
  ```

  #### Errors
  1000 - Invalid argument type 'username'
  1001 - Invalid argument type 'password'
  1002 - Invalid argument type 'email'

  1010 - Invalid username length
  1011 - Invalid username characters

  1012 - Invalid password length
  1013 - Invalid password characters

  1014 - Invalid email

  1015 - Error creating user
  1016 - Error trying to find user
  1017 - Error creating confirmation

  1018 - Error checking for unique username
  1019 - Username is taken

  1020 - Error checking for unique email
  1021 - Email is taken

  #### Examples
  Request:
  ```json
  {
    "username": "helio",
    "email": "helio@gmail.com",
    "password": "verystrongpassword123"
  }
  ```

  Success Response:
  ```json
  {
    "success": true,
    "id": 1,
    "cookie": "53YpouBTWwjkiry9DM0ckgncfAniTGsSpvML7zcOL5TJL6pa5LPJan6fPtX6uay37fL9HoqHe3NfRUxgOpWaGe9fxK6FGl8hzGO7qN59CrFwdqQI9dFXxns5n0l8tuS3"
  }
  ```

  Error Response:
  ```json
  {
    "success": false,
    "errorCode": 1014,
    "errorMessage": "Invalid email"
  }
  ```
</details>


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
