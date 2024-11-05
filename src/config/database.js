//conexion a mongo
import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config()

mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexion:'));
db.once('open', () => {
    console.log('Conectado a MongoDB');
});

export default db;