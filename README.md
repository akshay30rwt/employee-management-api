# Employee Management API

A REST API to manage employees built with Node.js, Express.js and MongoDB.

## Features
- Add a new employee
- Get all employees
- Get an employee by ID
- Update an employee
- Delete an employee

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

## How to Run
npm install
npm run dev

## API Endpoints
- POST   /employees             - Add an employee
- GET    /employees             - Get all employees
- GET    /employees/:id         - Get an employee by ID
- PUT    /employees/:id         - Update an employee
- DELETE /employees/:id         - Delete an employee
- GET    /employees?department= - Filter by department