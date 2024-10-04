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
                const errorMessageElement = document.getElementById('loginError');
                
                if (error.status === 401) {
                    errorMessageElement.textContent = 'Incorrect login: Invalid password';
                } else if (error.status === 404) {
                    errorMessageElement.textContent = 'Incorrect login: Email not found';
                } else {
                    errorMessageElement.textContent = 'Login failed';
                }

                errorMessageElement.style.display = 'block';
            });
            updateNavbar();
        });
    }
    //NOTE: instead of showing error when issue registration or login should show prompt to fix entrys instead of show alert
    if(registrationForm) { //allow for users to register account
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault();


            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            const errorMessageElement = document.getElementById('registrationError');
            errorMessageElement.style.display = 'none';

            let hasError = false;

            //Feild validation
            if (!username) {
                document.getElementById('registerUsername').classList.add('is-invalid');
                hasError = true;
            } else {
                document.getElementById('registerUsername').classList.remove('is-invalid');
            }
    
            if (!email) {
                document.getElementById('registerEmail').classList.add('is-invalid');
                hasError = true;
            } else {
                document.getElementById('registerEmail').classList.remove('is-invalid');
            }
    
            if (!password) {
                document.getElementById('registerPassword').classList.add('is-invalid');
                hasError = true;
            } else {
                document.getElementById('registerPassword').classList.remove('is-invalid');
            }

            
            if (hasError) {
              errorMessageElement.style.color = 'red';
              errorMessageElement.textContent = 'Please fill out all fields before submitting !';
              errorMessageElement.style.display = 'block';
              return;
           }

           registerUser({ username, email, password })
           .then(data => {
               console.log('Registered successfully:', data);
               
               errorMessageElement.style.color = 'green';
               errorMessageElement.textContent = 'Registration Successful';
               errorMessageElement.style.display = 'block';

               
               registrationForm.reset();
           })
           .catch(error => {
               console.error('Failed to register:', error);

               // Error diplayed if incorect feild entered
               if (error.status === 409) {
                   if (error.message === "Email already exists") {
                       errorMessageElement.textContent = 'Registration failed: Email already in use.';
                   } else if (error.message === "Username already exists") {
                       errorMessageElement.textContent = 'Registration failed: Username already in use.';
                   } else {
                       errorMessageElement.textContent = 'Registration failed.';
                   }
               } else if (error.status === 400) {
                   errorMessageElement.textContent = 'Invalid registration: Please check the entered information.';
               } else {
                   errorMessageElement.textContent = 'Registration failed. Please try again.';
               }

               errorMessageElement.style.color = 'red';
               errorMessageElement.style.display = 'block';
           });
        });
    }
});