import { createConnection } from "typeorm";

function startDatabase() {
  createConnection()
    .then(async connection => {
      console.log("Connecting to database was succesfull!");
    })
    .catch(error => console.log(error));
}

export default startDatabase;
