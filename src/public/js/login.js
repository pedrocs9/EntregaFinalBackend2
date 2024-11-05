//LOGIN

const form = document.getElementById('login-form');
const errorMessageDiv = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = '/profile';  
        } else {
            errorMessageDiv.innerText = result.errorMessage || 'Wron data entered';
        }
    } catch (error) {
        console.error('Error in the request:', error);
        errorMessageDiv.innerText = 'An error has ocurred when proccessing the request ';
    }
});


