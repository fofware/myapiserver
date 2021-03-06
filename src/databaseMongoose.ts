import mongoose, { ConnectionOptions } from "mongoose";
import config from "./config/config";
import { initTables } from "./libs/initialTables";

const mongoDBoptions: ConnectionOptions ={
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
mongoose.connect( config.mongoDB.URI, mongoDBoptions );
const mdbConnection = mongoose.connection;

mdbConnection.on('open', () => {
  console.log('MongoDB Conectado Ok');
  initTables();
})
mdbConnection.on('error', (err) =>{
  console.log('Error en la coneccion de MongoDB', err);
  process.exit(0);
} )