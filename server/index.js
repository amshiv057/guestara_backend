require("../config/config");
import Server from "./common/server";
import Routes from "./routes"
// console.log(global.gConfig.swaggerDefinition);

let dbUrl;
// console.log(global.gConfig.config_id)
dbUrl = global.gConfig.config_id === 'development' ? `mongodb://${global.gConfig.hostAddress}:${global.gConfig.databasePort}/${global.gConfig.databaseName}` :
    global.gConfig.config_id === 'staging' ? `mongodb+srv://${global.gConfig.dbCredential.user}:${global.gConfig.dbCredential.password}@${global.gConfig.dbCredential.host}/${global.gConfig.dbCredential.dbName}` :
        'mongodb://localhost:27017/guestara';
console.log(dbUrl)

const port = global.gConfig.port;

const server = new Server()
    .router(Routes)
    .configureSwagger(global.gConfig.swaggerDefinition)
    .handleError()
    .configureDb(dbUrl)
    .then((_server) => _server.listen(port));



export default server;

//mongodb://localhost:27017