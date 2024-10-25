# Software Engineering Challenge, by Bloqit

Node.js + TypeScript + Express

Code Coverage Report:

```
Statements   : 91.31% ( 263/288 )
Branches     : 78.78% ( 26/33 )
Functions    : 75.4% ( 46/61 )
Lines        : 92.5% ( 259/280 )
```

## Setup

Just clone the project in your own machine and install the dependencies:

```
$ npm i
```

Create and configure a .env file with all the environment variables needed to run the project (see .env.example for more information)
After don't forget to create an instance of the MongoDB docker image:

```
$ docker-compose up
```

To run the server:

```
$ npm run dev
```

Run tests:

```
$ npm run test (or test:coverage to get coverage report)
```

Alternatively, there is a Dockerfile that you can build by simply uncommenting the relevant lines in the docker-compose.yml file. This file will run the app inside a container.

## Challenge

#### Architecture

The implementation using a layered architecture promotes scalability and a clear separation of concerns. This architecture organizes the code into specific layers, each responsible for a distinct part of the application, ensuring modularity and maintainability as the project grows.

It was decided to use MongoDB as database instead of the provided JSON data files to ensure we use a real database.

#### Development considerations

The project validates every request using class-validator, ensuring that any validation failures return consistent error messages through the validator middleware. Additionally, it logs every request and captures all unhandled errors using Winston and a global error handler, providing comprehensive error tracking and debugging.

Controllers remain lightweight by delegating all business logic to the services folder, improving the code structure and testability.

#### Endpoints explanation

The Bloq service includes endpoints to create a new bloq, retrieve a specific bloq, and fetch all bloqs. These endpoints were implemented primarily to initialize the project and add sample bloqs. If needed, a delete endpoint can be added, but it wasn't required for the current version of the API.

The Locker service includes the same endpoints as the Bloq service, with additional functionality. It implements an endpoint to update the status (open/close and set locker occupation) and another endpoint to check which locker is available for use.

The Rent service includes the same endpoints as the Bloq service, along with additional endpoints to reserve a specific locker and to update the status of a rent.
For increased flexibility the status endpoint allows a Rent to go from "waiting dropoff" to "delivered".

#### Example

- The client creates a new Rent with the package's weight and size, and the status is automatically set to "created."
- A request is sent to the Locker service to retrieve a free locker ID.
- If a free locker is available and an ID is returned, the client can allocate the locker and update the rent status to "waiting dropoff."
- Once the package is dropped off, the status changes to "waiting pickup" using the update status endpoint.
- When the user picks up the rent, the locker is marked as empty again, and the rent status is updated to "delivered."

## Test coverage

Tests were conducted using Jest and Supertest on key endpoints. A Postman collection is also provided to facilitate testing during development. Unit tests on the services could further enhance the testing process.

## Improvements

Future improvements could include:

- Integrating Swagger for better API documentation
- Using microservices or domain-driven design if the project becomes too extensive
- Implementing transactions to ensure lockers are always set to non occupied when a rent is delivered
- Use different database instance to run tests

For simplicity, the Docker Compose MongoDB container has credentials defined in the file. In a production environment, we should use environment variables instead.

Luís Passos - Bloqit Challenge
