document.addEventListener("DOMContentLoaded", () => {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      try {
        const productId = event.target.dataset.pid;
        console.log(productId)

        const currentUserResponse = await fetch('/api/sessions/current', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include'  
        });

        if (!currentUserResponse.ok) {
          throw new Error('No se pudo obtener la información del usuario actual');
      }

     
         const { cartId, user } = await currentUserResponse.json();
         console.log('Usuario actual:', user);
         console.log('Cart ID:', cartId);


        if (!cartId) {
          throw new Error('No se pudo obtener el cartId');
        }

        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });


        const result = await response.json();

        if (result.result === "success") {
          Swal.fire({
            title: "Product added!",
            text: `The product has been added to the cart`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          throw new Error(result.message || 'We couldn´t add the product');
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    });
  });

  //filtros

  const form = document.getElementById('filter-form');

  form.addEventListener('submit', (event) => {
      event.preventDefault(); 

      const category = document.getElementById('category-select').value;
      const status = document.getElementById('status-select').value;
      const sort = document.getElementById('sort-select').value;
      const limit = document.getElementById('limit-select').value;

  
      let queryString = '?';
      if (category) queryString += `category=${category}&`;
      if (status) queryString += `status=${status}&`;
      if (sort) queryString += `sort=${sort}&`;
      if (limit) queryString += `limit=${limit}&`;


      queryString = queryString.slice(0, -1);


      window.location.href = `/products${queryString}`;
  });
});
