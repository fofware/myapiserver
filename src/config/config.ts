export default {
  jwtSecret: process.env.JWT_SECRET || 'mysupersecrettoken',
  mongoDB:{
    URI: process.env.MONGODB_URI || 'mongodb://myapimongo36/gestion',
//    URI: process.env.MONGODB_URI || 'mongodb+srv://fabian:tamara01@cluster0.wk2fd.mongodb.net/gestion?retryWrites=true&w=majority',
    USER: process.env.MONGODB_USER,
    PASSWORD: process.env.MONGODB_PASSWORD
  }
  ,mariaDB:{
    host: process.env.MARIADB_URI || 'localhost',
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || 'pirulo',
    database: process.env.MARIADB_DATABASE || 'gestion',
    port: 3306
  }
}
