const resolutionForm = document.getElementById("resolutionForm");
const resolutionSelect = document.getElementById("resolution");
const bitrateSelect = document.getElementById("bitrate");
const fpsSelect = document.getElementById("fps");
const audioFormatSelect = document.getElementById("audioFormat");
const videoFormatSelect = document.getElementById("videoFormat");
const submitButton = resolutionForm.querySelector("button");

// Add change event listener to all selects
[resolutionSelect, bitrateSelect, fpsSelect, audioFormatSelect, videoFormatSelect].forEach(
  (select) => select.addEventListener("change", checkFormValidity)
);

window.onload = function () {
  const username = localStorage.getItem("username");
  const isRpcConnected = localStorage.getItem("isRpcConnected") === "true";

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

function checkFormValidity() {
  const allSelected =
    resolutionSelect.value &&
    bitrateSelect.value &&
    fpsSelect.value &&
    audioFormatSelect.value &&
    videoFormatSelect.value;
  submitButton.disabled = !allSelected;
}

resolutionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = {
    resolution: resolutionSelect.value,
    bitrate: bitrateSelect.value,
    fps: fpsSelect.value,
    audioFormat: audioFormatSelect.value,
    videoFormat: videoFormatSelect.value,
  };
  const params = { mainStream: formData, subStream: formData };
  window.callRpcMethod("av_settings", params);
});
