# E-commerce REST API

## Project Description

REST API for an e-commerce system built using Node.js, Express, PostgreSQL (Neon), and Postman.

## Technologies

* Node.js
* Express.js
* PostgreSQL
* Neon
* Postman
* dotenv
* cors
* pg

## Project Structure

text
ecommerce-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── productsController.js
│   │   ├── categoriesController.js
│   │   └── usersController.js
│   ├── routes/
│   │   ├── productsRoutes.js
│   │   ├── categoriesRoutes.js
│   │   └── usersRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md

## Setup

Install dependencies:

bash
npm install


## Environment Variables

Create a `.env` file:

env
PORT=3000
DATABASE_URL=your_neon_database_url


## Run the Project

Development mode:

bash
npm run dev


Production mode:

bash
npm start


## API Endpoints

### Products

* GET `/api/products`
* GET `/api/products/:id`
* POST `/api/products`
* PUT `/api/products/:id`
* PATCH `/api/products/:id/deactivate`

### Categories

* GET `/api/categories`
* GET `/api/categories/:id`
* POST `/api/categories`
* PUT `/api/categories/:id`

### Users

* GET `/api/users`
* GET `/api/users/:id`
* POST `/api/users`
* PATCH `/api/users/:id/status`

## Database

The API connects to a PostgreSQL database hosted on Neon.

Parameterized SQL queries are used to protect against SQL injection.

## Security

Sensitive environment variables are stored in `.env` and are not included in the repository.

The `.env` file must not be uploaded to GitHub.

