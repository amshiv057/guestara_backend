
# Guestara Backend

Welcome to the Guestara Backend application. This project is designed to handle the backend logic for the Guestara application, including API endpoints, database management, and more.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

These instructions will guide you through setting up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following software installed on your system:

- [Node.js](https://nodejs.org/) (v14.x or later recommended)
- [Yarn](https://yarnpkg.com/) (v1.22.x or later recommended)
- [MongoDB](https://www.mongodb.com/) (if using a local database)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/amshiv057/guestara_backend/tree/UAT
   cd guestara_backend
2. setup .env file and provide this variables
CONFIG_DATA='{
  "development": {
    "config_id": "development",
    "port": 5009,
    "hostAddress": "localhost",
    "databaseHost": "0.0.0.0",
    "databasePort": "27017",
    "databaseName": "guestara",
    "dbCredential": {
      "host": "",
      "user": "",
      "password": "",
      "dbName": ""
    },
    "swaggerDefinition": {
      "info": {
        "title": "Guestara_Backend",
        "version": "1.0",
        "description": "Guestara"
      },
      "basePath": "/api/v1",
      "securityDefinitions": {
        "tokenauth": {
          "type": "apiKey",
          "name": "Authorization",
          "in": "header"
        }
      }
    },
    "cloudinary": {
      "cloud_name": "",
      "api_key": "",
      "api_secret": ""
    }
  },

  "staging": {
    "config_id": "staging",
    "port": 5009,
    "hostAddress": "localhost",
    "databaseHost": "0.0.0.0",
    "databasePort": "27017",
    "databaseName": "guestara",
    "dbCredential": {
      "host": "",
      "user": "",
      "password": "",
      "dbName": ""
    },
    "swaggerDefinition": {
      "info": {
        "title": "Guestara_Backend",
        "version": "1.0",
        "description": "Guestara"
      },
      "basePath": "/api/v1",
      "securityDefinitions": {
        "tokenauth": {
          "type": "apiKey",
          "name": "Authorization",
          "in": "header"
        }
      }
    },
    "cloudinary": {
      "cloud_name": "",
      "api_key": "",
      "api_secret": ""
    }
  }
}'

3. run command
yarn install

congrulations your code will run