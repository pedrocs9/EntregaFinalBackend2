import CartDAO from "../daos/cart.dao.js";
import ProductDAO from "../daos/product.dao.js";
import { ticketService } from "../repositories/index.js";
import { v4 as uuidv4 } from "uuid";
import { sendPurchaseEmail } from "../utils/mail.js";

export default class CartsRepository {
  constructor() {
    this.cartDAO = new CartDAO();
    this.productDAO = new ProductDAO();
  }

  async isValidCartId(cid) {
    if (!this.cartDAO.isValidCartId(cid)) {
      throw new Error("ID Carrito Invalido");
    }
  }

  async isValidProductId(pid) {
    if (!this.productDAO.isValidProductId(pid)) {
      throw new Error("ID Producto Invalido");
    }
  }

  async createCart() {
    return await this.cartDAO.createCart();
  }

  async getCartById(cid) {
    await this.isValidCartId(cid);
    const cart = await this.cartDAO.getCartById(cid);
    if (!cart) throw new Error("Cart not found");
    return cart;
  }

  async addProductToCart(cid, pid, quantity) {
    await Promise.all([this.isValidCartId(cid), this.isValidProductId(pid)]);

    const cart = await this.getCartById(cid);

    const productIndex = cart.products.findIndex((p) => {
      const productIdInCart = p.productId._id || p.productId;
      return productIdInCart.toString() === pid.toString();
    });

    if (productIndex > -1) {
      console.log(`Producto encontrado. Incrementar la cantidad en ${quantity}`);
      cart.products[productIndex].quantity += quantity;
    } else {
      console.log(
        `Producto no encontrado. Agregar producto con cantidad: ${quantity}`
      );
      cart.products.push({ productId: pid, quantity });
    }
    const updatedCart = await this.cartDAO.saveCart(cart);
    console.log("Carrito después de la actualización:", updatedCart);
    return updatedCart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    await Promise.all([this.isValidCartId(cid), this.isValidProductId(pid)]);
    const cart = await this.getCartById(cid);
    const productInCart = cart.products.find(
      (p) => p.productId._id.toString() === pid
    );

    if (!productInCart) throw new Error("Producto no encontrado en el carrito");

    productInCart.quantity = quantity;
    await this.cartDAO.saveCart(cart);
    return cart;
  }

  async updateCart(cid, products) {
    await this.isValidCartId(cid);
    const productIds = products.map((p) => p.productId);
    const existingProducts = await this.productDAO.findProductsByIds(
      productIds
    );

    if (existingProducts.length !== productIds.length) {
      throw new Error("Uno o más productos no encontrados");
    }

    const cart = await this.getCartById(cid);
    cart.products = products;
    await this.cartDAO.saveCart(cart);

    const updatedCart = await this.cartDAO.getCartById(cid);
    return updatedCart;
  }

  async deleteProductFromCart(cid, pid) {
    await Promise.all([this.isValidCartId(cid), this.isValidProductId(pid)]);
    const updatedCart = await this.cartDAO.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      throw new Error("Carrito no encontrado");
    }
    return updatedCart;
  }

  async emptyCart(cid) {
    await this.isValidCartId(cid);
    const cart = await this.getCartById(cid);
    cart.products = [];
    await this.cartDAO.saveCart(cart);
    return cart;
  }

  async completePurchase(cid, purchaserEmail) {
    const cart = await this.getCartById(cid);
    if (!cart) throw new Error("Cart not found");

    if (!cart.products || cart.products.length === 0) {
      return {
        success: false,
        message: "El carrito está vacío. La compra no se puede completar.",
        productsNotPurchased: [],
      };
    }

    const productsNotPurchased = [];
    const purchasedProducts = [];

    for (const item of cart.products) {
      const product = await this.productDAO.getProductById(item.productId);
  
      if (product.stock < item.quantity) {
        productsNotPurchased.push(item);
      } else {
        product.stock -= item.quantity;
        await this.productDAO.updateProduct(product._id, { stock: product.stock });
  
        purchasedProducts.push({
          productId: product._id,
          title: product.title,
          quantity: item.quantity,
          price: product.price,
        });
      }
    }

    const totalAmount = purchasedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    if (purchasedProducts.length === 0) {
      return {
        success: false,
        message: "No se pudieron comprar productos por falta de stock.",
        productsNotPurchased,
      };
    }

    const ticketData = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: purchaserEmail,
    };

    await ticketService.createTicket(ticketData);
    await sendPurchaseEmail(ticketData, purchasedProducts, purchaserEmail);

    cart.products = productsNotPurchased;
    await this.cartDAO.saveCart(cart); 

    console.log('Carrito después de guardar:', cart);

    return {
      success: true,
      message: "Compra Completada",
      productsNotPurchased,
    };
  }
}
