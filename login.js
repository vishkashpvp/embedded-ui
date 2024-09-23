const correctUsername = "admin";
const correctPassword = "admin";

window.onload = function () {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "dashboard.html";
  }
};

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === correctUsername && password === correctPassword) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect username or password. Please try again.");
  }
}
