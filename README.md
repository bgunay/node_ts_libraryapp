# 📚 Library Management API

Welcome to the Library Management API project! This Node.js-based REST API is designed to manage library operations,
such as listing users, accessing user information, creating new users, listing books, accessing book information,
creating new books, borrowing books, returning books, and rating books.

## 🚀 Getting Started

Follow the instructions below to set up and run the project locally:

1. **Install Dependencies:**
   ```shell
   npm install (or yarn install)
   ```

2. **Set Up the Database:**
    - MySQL used in docker-compose.yaml, you can use it or configure your own
    -
3. **Configure Environment Variables:**
    - `.env` file created for environment variables for database connection.

4. **Run the tests (Unit and Integration Tests)**
    - Make sure mysql is running!
   ```shell
   npm run test
   ```

5. **Start the Server:**
   ```shell
   npm run prod
   ```
    **OR**: Use docker. Dockerfile and docker-compose.yaml created for running container<br>
    ```shell
    docker compose up
    ```
   
**In package.json** 
* Usage: npm run "action"
- Use lint for code errors
- Use format-check for format errors, and format for pretty formatting.
- Use precommit for staged files errors.
- Use typeorm for migrations.

## 🔧 Technologies Used

- **Express.js:** The API is developed using Express.js, a popular Node.js web framework.
- **TypeScript:** We used TypeScript for type safety and a better development experience.
- **Database:**  Mysql, Tables created automatically.
- **ORM/Query Builder:** TypeORM
- **Data Validation:** We implemented data validation using a validator library ( express-validator).
- **Error Handling:** The API handles errors gracefully and returns appropriate error responses.
- **Docker:** For containerization
- **Jest, Supertest, Faker:** For unit and e2e tests
## 📝 API Documentation

You can find detailed API documentation, including request/response examples, in the [Postman Collection](postman_collection.json).

## 🛠️ Services

#### List Users

- **Endpoint:** `/users`
- **Method:** `GET`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Successfully retrieved users",
    "data": [
        {
            "id": "4584e030-f863-454b-b1c1-83bbcf6cdf84",
            "name": "Burhan Gunay",
            "createdAt": "2024-04-12T18:16:14.762Z",
            "updatedAt": "2024-04-12T18:16:14.762Z"
        },
        {
            "id": "47220502-e416-4727-881c-7f4462e1640a",
            "name": "Sumeyra Gunay",
            "createdAt": "2024-04-12T18:24:33.590Z",
            "updatedAt": "2024-04-12T18:24:33.590Z"
        }
    ],
    "paginationInfo": null
  }
  ```

#### Get User by ID

- **Endpoint:** `/users/{userId}`
- **Method:** `GET`
    - **Sample Response:**
      ```json
       {
      "success": true,
      "message": "Successfully retrieved user",
      "data": {
          "id": "4584e030-f863-454b-b1c1-83bbcf6cdf84",
          "name": "Burhan Gunay",
          "currentBorrows": [
              {
                  "book": {
                      "name": "Crime and Punishment",
                      "id": "371f0a16-e380-4313-8f05-5d947bff87ef"
                  },
                  "borrowDate": "2024-04-12T18:31:00.388Z"
              }
          ],
          "pastBorrows": [
              {
                  "book": {
                      "name": "Brothers Karamazov",
                      "id": "27c79b61-51ba-4c1a-a2dc-41d2496fed3e"
                  },
                  "borrowDate": "2024-04-12T18:26:41.588Z",
                  "returnDate": "2024-04-12T21:30:42.000Z"
              }
          ]
      },
      "paginationInfo": null
      }
      ```

#### Create User

- **Endpoint:** `/users`
- **Method:** `POST`
- **Sample Request Body:**
  ```json
  {
      "name": "Sumeyra Gunay"
  }
  ```

### Book Services

#### List Books

- **Endpoint:** `/books`
- **Method:** `GET`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Successfully retrieved books",
    "data": [
        {
            "id": "27c79b61-51ba-4c1a-a2dc-41d2496fed3e",
            "name": "Brothers Karamazov",
            "createdAt": "2024-04-12T18:25:48.845Z",
            "updatedAt": "2024-04-12T18:25:48.845Z"
        },
        {
            "id": "371f0a16-e380-4313-8f05-5d947bff87ef",
            "name": "Crime and Punishment",
            "createdAt": "2024-04-12T18:25:27.512Z",
            "updatedAt": "2024-04-12T18:25:27.512Z"
        },
        {
            "id": "a663ba26-86ed-466c-b70f-1ff52c5340b7",
            "name": "Nutuk",
            "createdAt": "2024-04-12T18:25:34.225Z",
            "updatedAt": "2024-04-12T18:25:34.225Z"
        }
    ],
    "paginationInfo": null
  }
  ```

#### Get Book by ID

- **Endpoint:** `/books/{bookId}`
- **Method:** `GET`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Fetch book successfully",
    "data": {
        "book": {
            "id": "371f0a16-e380-4313-8f05-5d947bff87ef",
            "name": "Crime and Punishment"
        },
        "averageScore": 0,
        "available": false
    },
    "paginationInfo": null
  }
  ```

### Borrow Services

#### Borrow Book

- **Endpoint:** `/users/{userId}/borrow/{bookId}`
- **Method:** `POST`
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Successfully reserved",
    "data": {
        "borrowedBy": {
            "id": "4584e030-f863-454b-b1c1-83bbcf6cdf84",
            "name": "Burhan Gunay",
            "createdAt": "2024-04-12T18:16:14.762Z",
            "updatedAt": "2024-04-12T18:16:14.762Z"
        },
        "book": {
            "id": "371f0a16-e380-4313-8f05-5d947bff87ef",
            "name": "Crime and Punishment",
            "createdAt": "2024-04-12T18:25:27.512Z",
            "updatedAt": "2024-04-12T18:25:27.512Z"
        },
        "score": 0,
        "returnDate": null,
        "id": "44b9ca23-9423-4a92-b70b-f2fad9029592",
        "createdAt": "2024-04-12T18:31:00.388Z",
        "updatedAt": "2024-04-12T18:31:00.388Z"
    },
    "paginationInfo": null
   }
  ```

#### Return Book

- **Endpoint:** `/users/{userId}/return/{bookId}`
- **Method:** `POST`
- **Request:**

 ```json
 {
  "score": 9
}
   ```

- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Successfully return",
    "data": null,
    "paginationInfo": null
  }
  ```
