import ProductsRepository from '../repositories/products.repository.js'
import CartsRepository from '../repositories/carts.repository.js';
import UsersRepository from '../repositories/users.repository.js'
import SessionsRepository from '../repositories/sessions.repository.js';
import TicketsRepository from '../repositories/tickets.repository.js';

const productService = new ProductsRepository();
const cartService = new CartsRepository();
const userService = new UsersRepository();
const sessionService = new SessionsRepository();
const ticketService = new TicketsRepository();


export { productService, cartService, userService, sessionService, ticketService };
