"use strict";

const hmac = "3a3b4a4e602cdb551a0d16dabea193b6516ddadc05f827a21932402517f47966";

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

  const before = new Date();
  console.log("Loading content...");
  $(document.body).append($container);
  const after = new Date();
  const timeTaken = after - before;
  console.log("Content loaded in " + (after - before) + " ms.");

  $(window).on("load", function () { console.log("LOAD FIRED."); });
  $(function () { console.log("READY FIRED."); });

  initialiseMainPage(); // Call inititiase for now unencrypted page.
  $container.addClass("sp-fadein");
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

  const uiDeleteDelay = 2000;
  setTimeout(function() { $authUiContainer.remove(); }, uiDeleteDelay);
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
