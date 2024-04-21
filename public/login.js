document.addEventListener('DOMContentLoaded', function() {

const hamburgerBtn = document.querySelector(".hamburger-btn");
const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");
function showPopup() {
    document.body.classList.add("show-popup");
}

function hidePopup() {
    document.body.classList.remove("show-popup");
}


showPopupBtn.addEventListener('click', showPopup);


hidePopupBtn.addEventListener('click', hidePopup);


signupLoginLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        if (link.id === 'signup-link') {
            formPopup.classList.add('show-signup');
        } else if (link.id === 'login-link') {
            formPopup.classList.remove('show-signup');
        }
    });
});
});