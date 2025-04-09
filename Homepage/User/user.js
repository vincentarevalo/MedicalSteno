document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation
    if (username === 'Pasoa' && password === 'MedicalSteno') {
        window.location.href = "../gameHomepage/gameHomepage.html"
    } else {
        document.getElementById('error-message').textContent = 'Invalid username or password.';
    }
});