import {productService} from '../repositories/index.js'
import mongoose from 'mongoose';

export default class ProductsController {
    async getProducts(req, res) {
      try {
        const result = await productService.getProducts(req.query);
        res.send({ result: "success", payload: result });
      } catch (error) {
        console.error("Error al recuperar la lista de productos: ", error);
        res.status(500).json({ error: "Error al recuperar productos" });
      }
    }
  
    async createProduct(req, res) {
      try {
        const result = await productService.createProduct(req.body);
        res.send({ result: "success", payload: result });
      } catch (error) {
        console.error('Error while creating a new product:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
      }
    }
  
    async updateProduct(req, res) {
      try {
        const productId = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ error: "Invalid product ID" });
        }
        const result = await productService.updateProduct(productId, req.body);
        res.send({ result: "success", payload: result });
      } catch (error) {
        console.error("Error while updating the product:", error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
      }
    }
  
    async deleteProduct(req, res) {
      try {
        const productId = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ error: 'ID de producto no válido' });
        }
        await productService.deleteProduct(productId);
        res.send({ result: "success", payload: { message: "Producto eliminado exitosamente" } });
      } catch (error) {
        console.error('Error while deleting the product', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
      }
    }
  
    async getProductById(req, res) {
      try {
        const productId = req.params.pid;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ error: "ID de producto no válido" });
        }
        const result = await productService.getProductById(productId);
        if (!result) {
          return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.send({ result: "success", payload: result });
      } catch (error) {
        console.error('Error while fetching the product', error);
        res.status(500).json({ error: 'Error al buscar el producto' });
      }
    }
  }
  
