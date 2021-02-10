// Display origin in UI
document.getElementById("url-origin").innerHTML = window.location.origin + "/";

// Burger Bar Functionality
const mobileMenu = document.getElementById("mobile-menu");
const mobileBurger = document.getElementById("mobile-menu-button");
let menuStateOpen = false;
//mobileMenu.classList.add("opacity-0");
mobileBurger.addEventListener("click", function (event) {
  if (!menuStateOpen) {
    mobileMenu.classList.remove("opacity-0");
    mobileMenu.classList.add("opacity-100");
    menuStateOpen = true;
  } else {
    mobileMenu.classList.remove("opacity-100");
    mobileMenu.classList.add("opacity-0");
    menuStateOpen = false;
  }
});

// Validation and Fetch
const submitButton = document.getElementById("submit");
const shortlinkDismiss = document.getElementById("shortlink-dismiss");
const shortlinkCreatedMessage = document.getElementById("created-message");
const shortlinkErrorMessage = document.getElementById("shortlink-exists-error");
const shortlinkErrorDismiss = document.getElementById(
  "shortlink-error-dismiss"
);
const VALIDATOR = new RegExp("^[A-Za-z0-9_-]{0,32}$");

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  dummy.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

async function createShortURL() {
  const keyInput = document.getElementById("custom-url");
  const valueInput = document.getElementById("long-url");
  const key = keyInput.value;
  const value = valueInput.value;

  const keyError = document.getElementById("key-error");
  const valueError = document.getElementById("value-error");

  const spinner = document.getElementById("loading-spinner");
  const check = document.getElementById("loading-check");
  const fail = document.getElementById("loading-fail");

  const shortlinkCopy = document.getElementById("shortlink-copy");

  // Validation
  const isKeyValid = VALIDATOR.test(key);
  const isValueValid = isValidHttpUrl(value);

  keyInput.classList.remove("border-red-300");
  keyError.classList.add("hidden");
  if (!isKeyValid) {
    keyInput.classList.add("border-red-300");
    keyError.classList.remove("hidden");
  }

  valueInput.classList.remove("border-red-300");
  valueError.classList.add("hidden");
  if (!isValueValid) {
    valueInput.classList.add("border-red-300");
    valueError.classList.remove("hidden");
  }
  if (!isValueValid || !isKeyValid) return;

  // Loading Spinner
  submitButton.disabled = true;
  submitButton.classList.add("cursor-wait");
  spinner.classList.remove("hidden");
  shortlinkCreatedMessage.classList.add("hidden");
  shortlinkErrorMessage.classList.add("hidden");

  // API Call
  const url = window.location.origin + "/new";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      key: key,
      value: value,
    }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((responseBody) => {
      const elementToShow = responseBody.status == 201 ? check : fail;
      const responseKey = responseBody.data.key;

      spinner.classList.add("hidden");
      submitButton.classList.remove("cursor-wait");
      elementToShow.classList.remove("hidden");
      if (responseBody.status == 201) {
        shortlinkCopy.addEventListener(
          "click",
          copyToClipboard(window.location.origin + "/" + responseKey)
        );
        shortlinkCreatedMessage.classList.remove("hidden");
      } else if (responseBody.status == 409) {
        shortlinkErrorMessage.classList.remove("hidden");
      }

      setTimeout(function () {
        elementToShow.classList.add("hidden");
        submitButton.disabled = false;
      }, 2000);
    });
}

submitButton.addEventListener("click", createShortURL);
shortlinkDismiss.addEventListener("click", function () {
  shortlinkCreatedMessage.classList.add("hidden");
});
shortlinkErrorDismiss.addEventListener("click", function () {
  shortlinkErrorMessage.classList.add("hidden");
});
