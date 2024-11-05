import { cartService } from "../repositories/index.js";

export default class CartsController {
  async createCart(req, res) {
    try {
      const cart = await cartService.createCart();
      res.status(201).json({
        result: "success",
        message: "Carrito creado correctamente",
        payload: cart,
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Error al crear carrito",
        error: error.message,
      });
    }
  }

  async getCartById(req, res) {
    try {
      const cid = req.params.cid || req.user.cart; 
      if (!cid) {
        return res.status(400).json({
          result: "error",
          message: "Se requiere ID del carrito, ya sea como parámetro o por parte del usuario.",
        });
      }
      const cart = await cartService.getCartById(cid);
      res.status(200).json({
        result: "success",
        message: "Carrito recuperado exitosamente",
        payload: cart,
      });
    } catch (error) {
      res.status(404).json({
        result: "error",
        message: "El carrito no existe",
        error: error.message,
      });
    }
  }

  async addProductToCart(req, res) {
    try {
      const { cid, pid } = req.params;
      let { quantity } = req.body;

      if (!cid || !pid) {
        return res.status(400).json({
          result: "error",
          message: "Se requieren ID del carrito y del producto.",
        });
      }

      quantity = quantity !== undefined && !isNaN(parseInt(quantity)) && parseInt(quantity) > 0
          ? parseInt(quantity)
          : 1;


      const cart = await cartService.addProductToCart(cid, pid, quantity);

      res.status(200).json({
        result: "success",
        message: "El producto fue agregado exitosamente al carrito.",
        payload: cart,
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "El producto no se pudo agregar al carrito.",
        error: error.message,
      });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      const cart = await cartService.updateProductQuantity(cid, pid, quantity);
      res.status(200).json({
        result: "success",
        message: "La cantidad del producto se actualizó correctamente.",
        payload: cart,
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "La cantidad del producto no se pudo actualizar.",
        error: error.message,
      });
    }
  }

  async updateCart(req, res) {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      const cart = await cartService.updateCart(cid, products);

      res.status(200).json({
        result: "success",
        message: "El carrito se ha actualizado correctamente.",
        payload: cart,
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "El carrito no se pudo actualizar.",
        error: error.message,
      });
    }
  }

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.deleteProductFromCart(cid, pid);

      res.status(200).json({
        result: "success",
        message: "El producto ha sido eliminado exitosamente.",
        payload: cart,
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "El producto no se pudo eliminar.",
        error: error.message,
      });
    }
  }

  async emptyCart(req, res) {
    try {
      const { cid } = req.params;

      const cart = await cartService.emptyCart(cid);

      res.status(200).json({
        result: "success",
        message: "El carro ha sido vaciado.",
        payload: cart,
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "El carrito no se pudo vaciar.",
        error: error.message,
      });
    }
  }

  async completePurchase(req, res) {
    try {
      const { cid } = req.params;
      const { email } = req.user; 

      const result = await cartService.completePurchase(cid, email);

      if (!result.success) {
        return res.status(400).json({
          result: "error",
          message: result.message,
          productsNotPurchased: result.productsNotPurchased,
        });
      }

      res.status(200).json({
        result: "success",
        message: "Compra completada",
        productsNotPurchased: result.productsNotPurchased,
      });
    } catch (error) {
      res.status(500).json({
        result: "error",
        message: "Error al procesar la compra",
        error: error.message,
      });
    }
  }
}
