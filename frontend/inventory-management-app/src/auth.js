import { logoutUser } from './repository.js';

document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();

    const logoutButton = document.getElementById('logoutButton');
    if(logoutButton) {
        logoutButton.addEventListener('click', function() {
            logoutUser().then(() => {
                window.location.reload();
            }).catch((error) => {
                console.error("Logout failed:", error);
                alert("Failed to logout. Please try again.");
            });
        });
    }
});

function updateNavbar() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        //if the token exists, parse it to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userID = document.getElementById('userID');
        if (userID) {
            userID.textContent = `User ID: ${payload.id}`;
        }
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.style.display = 'block';
        }
        
    }
}

export {updateNavbar};
