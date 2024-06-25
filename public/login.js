document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const data = { username, password };

        try {
            // Adjust the URL to the endpoint where your server handles the login verification
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const userData = await response.json();

            if (response.ok) {
                // Set user data in session storage
                window.sessionStorage.setItem("userid", JSON.stringify(userData));
                // Navigate to the budget.html page if the login is successful
                window.location.href = './main2.html';
            } else {
                // Display an error message from the server if login is unsuccessful
                alert(userData.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});

