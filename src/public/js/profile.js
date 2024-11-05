const button = document.getElementById('logout-btn');
button.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Failed to logout');
        }
    } catch (error) {
        console.error('Error in the request:', error);
    }
})
