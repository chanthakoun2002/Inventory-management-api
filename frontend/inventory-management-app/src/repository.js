const API_BASE_URL = "http://localhost:3001/inventory-api";

function handleResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  }


function loginUser(credentials) {
    return fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials)
    })
    .then(handleResponse)
    .then(data => {
        if (data.token) {
            sessionStorage.setItem('authToken', data.token); //this store's the token after login to use
            return data;
        }
        throw new Error('Token was not provided');
    })
    .catch((error) => {
        console.error("Error logging in:", error);
        throw error;
    });
}

function registerUser(userData) {
    return fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
    })
    .then(handleResponse)
    .catch((error) => {
        console.error("Error registering user:", error);
        throw error;
    });
}

function logoutUser() {
    const token = sessionStorage.getItem('authToken');
    console.log("Token retrieved from sessionStorage:", token);//for debugging to check if token has been given correctly

    if (!token) {
        console.log("No token found, already logged out or never logged in.");
        alert("No session to log out from.");
        return;
    }

    return fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
    .then(response => {
        console.log('Logged out successfully', response);
        sessionStorage.removeItem('authToken');
    })
    .catch((error) => {
        console.error("Error logging out:", error);
    });
}
export {loginUser, registerUser,logoutUser};

