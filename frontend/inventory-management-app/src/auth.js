import { logoutUser } from './repository.js';

document.addEventListener('DOMContentLoaded', function() {
    hidePageContent();
    //check to see if user is logged in to acces other pages, if not return user to login page
    if (!isLoginPage()) {
        checkAuthentication().then(isAuthenticated => {
            if (isAuthenticated) {
                showPageContent();
            } else {
                alert('You are not logged in. Please log in to access this page.');
                window.location.href = './index.html';
            }
        });
    } else {
        showPageContent();
    }
    

    updateNavbar();

    const logoutButton = document.getElementById('logoutButton');
    if(logoutButton) {
        logoutButton.addEventListener('click', function() {
            logoutUser().then(() => {
                window.location.reload();
                window.location.href = './index.html';
            }).catch((error) => {
                console.error("Logout failed:", error);
                alert("Failed to logout. Please try again later.");
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

// function checkAuthentication() {
//     const token = sessionStorage.getItem('authToken');
//     if (!token) {
//         alert('You are not logged in. Please log in to access this page.');
//         window.location.href = './index.html'; // Redirect to login page
//     }
// }
function checkAuthentication() {
    return new Promise((resolve) => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

function isLoginPage() {
    const currentPath = window.location.pathname;
    return currentPath.endsWith('index.html') || currentPath === '/';
}

function hidePageContent() {
    document.body.style.display = 'none'; //page contents hidden by default if not logged in
}
function showPageContent() {
    document.body.style.display = 'block';
}


export {updateNavbar};
