import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename))

// Hashear la contraseña
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Validar la contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export default __dirname;