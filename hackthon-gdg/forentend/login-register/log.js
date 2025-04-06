document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("Login successful!");
            window.location.href = "/dashboard.html"; 
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
    }
});