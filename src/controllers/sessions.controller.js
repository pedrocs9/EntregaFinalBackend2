import { sessionService } from '../repositories/index.js';
import UserDTO from '../dtos/user.dto.js';



export default class SessionsController {
     async register(req, res) {
        try {
            const { first_name, last_name, email, age, password, role} = req.body;
            const token = await sessionService.register({ first_name, last_name, email, age, password, role });
            res.cookie('jwt', token, { httpOnly: true, secure: false });
            res.status(200).json({ message: 'Registro exitoso' });
          } catch (error) {
            res.status(400).json({ errorMessage: error.message });
          }
        }
      
        async login(req, res) {
          try {
            const { email, password } = req.body;
            const token = await sessionService.login({ email, password });
            
            res.cookie('jwt', token, { httpOnly: true, secure: false });
            res.status(200).json({ message: 'Inicio de sesión exitosa' });
          } catch (error) {
            res.status(401).json({ errorMessage: error.message });
          }
        }
      
        async logout(req, res) {
          try {
            res.clearCookie('jwt', { httpOnly: true, secure: false });
            res.status(200).json({ message: 'Cerrar sesión exitosamente' });
          } catch (error) {
            res.status(500).json({ errorMessage: 'Server error while logging out' });
          }
        }
      
        async getCurrentUser(req, res) {
          try {
              const user = req.user; 
              if (!user) {
                  return res.status(401).json({ message: 'Ninguna usuario encontrada' });
              }
              const userDTO = new UserDTO(user); 
              res.status(200).json({ user: userDTO, cartId: userDTO.cartId }); 
          } catch (error) {
              res.status(500).json({ message: 'Error retrieving user', error: error.message });
          }
      }
      }
      

