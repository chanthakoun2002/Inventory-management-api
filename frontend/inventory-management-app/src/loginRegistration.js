import { loginUser, registerUser } from './repository.js';
import { updateNavbar } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');

    if(loginForm) { //allow user to login
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const loginData = {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };
            loginUser( loginData ).then(data => {
                console.log('Logged in successfully:', data);
                alert('Login Successful');
                window.location.reload();
                
            }).catch(error => {
                console.error('Failed to login:', error);
                alert('Login failed: ' + error.message);
            });
            updateNavbar();
        });
    }

    if(registrationForm) { //allow for users to register account
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            registerUser({ username, email, password }).then(data => {
                console.log('Registered successfully:', data);
                alert('Registration Successful');
                
            }).catch(error => {
                console.error('Failed to register:', error);
                alert('Registration failed: ' + error.message);
            });
        });
    }
});