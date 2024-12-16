# Gig Rewards Web Application

This project is a web application built using Node.js, Express.js, and MongoDB as the database. It serves to fetch and manage Axie data from the Axie Infinity marketplace.

## Table of Contents

- [Installation](#installation)
- [Setting Up the Database](#setting-up-the-database)
- [Running the Application](#running-the-application)
- [Handling Encoding Issues](#handling-encoding-issues)
- [Endpoints](#endpoints)

## Installation

### Required Software

1. **Node.js**: Ensure Node.js is installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
2. **MongoDB**: Install MongoDB by following this link: [MongoDB Installation](https://www.mongodb.com/try/download/community).
3. **Git**: If you don't have Git installed, download it from [git-scm.com](https://git-scm.com/downloads).
4. **Postman**: Optionally, download Postman from [postman.com](https://www.postman.com/downloads/) for API testing.

### Clone the Repository

```bash
git clone https://github.com/jerome2525/gig_rewards.git
cd gig_rewards
```

### Install Dependencies

```bash
npm install
```

## Setting Up the Database

### Run MongoDB Locally

To run the MongoDB server, execute the following command in your terminal or command prompt:

```bash
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
```

## Running the Application

### Start the Server

Run the application locally:

```bash
node server.js
```

## Handling Encoding Issues

If you encounter encoding issues when running the application, ensure your terminal supports UTF-8. For Windows environments, run the following command:

```bash
chcp 65001
```

## Endpoints

### User Registration

- **Endpoint**: `http://localhost:5000/api/auth/register`
- **Method**: POST
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

### User Login

- **Endpoint**: `http://localhost:5000/api/auth/login`
- **Method**: POST
- **Description**: Log in an existing user to retrieve an authentication token.
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

### Fetch Axie Data

- **Endpoint**: `http://localhost:5000/api/axie/fetch`
- **Method**: POST
- **Description**: Fetches Axie data from the Axie Infinity marketplace.
- **Request Body**: No specific fields required.

### Get Stored Axie Data

- **Endpoint**: `http://localhost:5000/api/axie/all`
- **Method**: GET
- **Description**: Retrieves stored Axies from the database, categorized by class.
- **Request Body**: None.

### Get Smart Contract Data

- **Endpoint**: `http://localhost:5000/api/axie/smart-contract/?action=totalSupply`
- **Method**: GET
- **Description**: Retrieves data from the Ethereum smart contract associated with the Axie Infinity marketplace.
- **Query Parameters**:
  - `action` (required): Specifies the action to perform. Supported values are:
    - `totalSupply`: Retrieves the total supply of the token.
    - `balanceOf`: Retrieves the balance of a specified address. Requires an additional parameter `address`.
    - `name`: Retrieves the name of the token.
    - `symbol`: Retrieves the symbol of the token.
  - `address` (optional): Required only if `action=balanceOf`. Specifies the Ethereum address to query.
- **Examples**:
  1. Fetch total supply:
     ```bash
     http://localhost:5000/api/axie/smart-contract/?action=totalSupply
     ```
  2. Fetch balance for an address:
     ```bash
     http://localhost:5000/api/axie/smart-contract/?action=balanceOf&address=0xYourEthereumAddress
     ```
  3. Fetch token name:
     ```bash
     http://localhost:5000/api/axie/smart-contract/?action=name
     ```
  4. Fetch token symbol:
     ```bash
     http://localhost:5000/api/axie/smart-contract/?action=symbol
     ```

