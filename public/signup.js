document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.form-box.signup form');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.classList.remove('show-popup');
        });
    }
});

async function handleSignup(event) {
    event.preventDefault(); 

    const form = event.target;
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok) {
            alert(result.message + ' Redirecting to login page.');
            window.location.href = 'login.html'; 
        } else {
            alert(result.message); 
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}
