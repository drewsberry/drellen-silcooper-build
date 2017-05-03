"use strict";

const hmac = "ee66945669888a922988f29063972f2d69f542d5366c3be705e255f52bf11a02";

function checkPassword(encryptedContent, password) {
  const hmacAttempt = lib.hmacString(encryptedContent, password);

  if (hmacAttempt === hmac) {
    const decryptedContent = lib.decryptString(encryptedContent, password);

    return { valid: true, decryptedContent };
  }

  return { valid: false };
}

function appendContent(content) {
  const $container = $("<div>");
  $container.attr("id", "sp-content");
  $container.append(content);

  $(document.body).append($container);
}

function showInvalidPassword() {
  const $errorMessage = $("#sp-login-error");
  $errorMessage.addClass("sp-fadein");
}

/**
  Hide the UI elements used for the authentication.
  */
function hideAuthenticationUi() {
  const $authUiContainer = $("#sp-ui-container");
  $authUiContainer.addClass("sp-fadeout");
}

function markAuthenticationComplete() {
  const $body = $(document.body);
  $body.addClass("sp-auth-complete");
}

function initialiseVerifyForm() {
  const $loginButton = $("#sp-login-button");
  const $passwordInput = $("#sp-login-password");

  $.ajax({
    method: "GET",
    url: "encrypted.html",
  }).done(function (data) {
    const protectedContent = data;

    $loginButton.on("click", function () {
      const inputPassword = $passwordInput.val();
      const passwordCheck = checkPassword(protectedContent, inputPassword);

      const passwordValid = passwordCheck.valid;
      const decryptedContent = passwordCheck.decryptedContent;

      console.log(passwordValid ? "Valid" : "Invalid");

      if (passwordValid) {
        appendContent(decryptedContent);
        hideAuthenticationUi();
        markAuthenticationComplete();
      } else {
        showInvalidPassword();
      }
    });

    const enterKeyCode = 13;
    $passwordInput.on("keypress", function (keyEvent) {
      if (keyEvent.keyCode === enterKeyCode) {
        $loginButton.trigger("click");
      }
    });
  });
}

function focusInput() {
  const $passwordInput = $("#sp-login-password");

  $passwordInput.focus();
}

$(function () {
  initialiseVerifyForm();
  focusInput();
});
