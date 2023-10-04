# This is a web app for operation calculations

The main purpose of the code is to allow the user to perform basic  computations on the server and render the result in the frontend. As the user executes and operation their credit is going to be deducted from the initial balance. The history of all operations are also available as a list table.

## How to run

1) To run please make sure to have `docker`, `maven` and `Java` installed, since the **target** has to be generated. 

1) In the root of the `backend` directory run `mvn install` or use and IDE such as IntelliJ to build the backend. Also modify the `application.yaml `file with the database configuration and server port

1) Modify the .env.example with the appropriate server port 

1) modify `docker-compose.yaml` with the server port

1) Execute the `docker-compose up` command


Visit the browser at [http://localhost:3000](http://localhost:3000) to use the app.


## How to test


1) To run please make sure you have  `maven` and `Java` installed, since the **target** has to be generated. 

1) In the root of the `backend` directory run `mvn test` or use and IDE such as IntelliJ to build the backend.

1) modify the .env.example inside the `frontend` directory with the appropriate environment variables and run `npm run test`

