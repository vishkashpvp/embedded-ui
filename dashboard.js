let resolution = "";

window.onload = function () {
  const username = localStorage.getItem("username");
  const isRpcConnected = window.isRpcConnected();

  console.log("username :>> ", username);
  console.log("isRpcConnected :>> ", isRpcConnected);

  if (!username) {
    logout();
  } else if (!isRpcConnected) {
    window.location.href = "error.html";
  } else {
    showWelcomeMessage(username);
  }
};

function showWelcomeMessage(username) {
  document.getElementById("welcomeMessage").textContent = `Hello, ${username}!`;
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

function setResolution(value) {
  resolution = value;
  document.getElementById("submitButton").disabled = !resolution;
}

function rpcResolution(event) {
  event.preventDefault();
  const [width, height] = resolution.split("x");
  callRpcMethod("resolution", [height, width]);
}
