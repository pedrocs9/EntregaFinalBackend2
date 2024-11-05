export default class UserDTO {
    constructor(user) {
      if (user._id) this.id = user._id;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.email = user.email;
      this.age = user.age;
      this.cartId = user.cart;
      this.role = user.role
    }
  }