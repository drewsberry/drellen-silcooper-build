"use strict";

var hmac = "6128d64a35ffb893ff7b28c2f36bc2c5afe65fccabaa02e55c2b3604a3c9cdc4";

function setupEmailLink() {
  var $emailLink = $("#sp-info-email");

  // Half-serious, half-fun attempt at spam-busting.
  var components = [
    "mailto", ":", "drew", "@", "drewandellenswedding", ".", "co", ".", "uk",
    "?subject=", "Drew%20and%20Ellen%27s%20Wedding%20Site%20-%20Login",
  ];

  $emailLink.attr("href", components.join(""));
}

function checkPassword(encryptedContent, password) {
  var hmacAttempt = lib.hmacString(encryptedContent, password);

  if (hmacAttempt === hmac) {
    var decryptedContent = lib.decryptString(encryptedContent, password);

    return {
      valid: true,
      decryptedContent: decryptedContent,
    };
  }

  return { valid: false };
}

function showLoadingSpinner() {
  var $loadingSpinner = $('#sp-loading-container');
  $loadingSpinner.removeClass('sp-hide');
}

function hideLoadingSpinner() {
  var $loadingSpinner = $('#sp-loading-container');
  $loadingSpinner.addClass('sp-hide');
}

function markAuthenticationComplete() {
  var $body = $(document.body);
  $body.addClass("sp-auth-complete");
}

function appendContent(content) {
  var $container = $("<div>");
  $container.attr("id", "sp-content");
  $container.append(content);

  var before = new Date();
  console.log("Loading content...");
  $(document.body).append($container);

  initialiseMainPage(); // Call inititiase for now unencrypted page.

  var estimatedLoadTime = 1000;
  setTimeout(function showContent() {
    hideLoadingSpinner();
    markAuthenticationComplete();
    $container.addClass('sp-fadein');
  }, estimatedLoadTime);
}

function showInvalidPassword() {
  var $errorMessage = $("#sp-login-error");
  $errorMessage.addClass("sp-fadein");
}

/**
  Hide the UI elements used for the authentication.
  */
function hideAuthenticationUi() {
  var $authUiContainer = $("#sp-ui-container");
  $authUiContainer.addClass("sp-fadeout");

  var uiDeleteDelay = 2000;
  setTimeout(function() { $authUiContainer.remove(); }, uiDeleteDelay);
}

function initialiseVerifyForm() {
  var $loginButton = $("#sp-login-button");
  var $passwordInput = $("#sp-login-password");

  $.ajax({
    method: "GET",
    url: "encrypted.html",
  }).done(function (data) {
    var protectedContent = data;

    $loginButton.on("click", function () {
      var inputPassword = $passwordInput.val();
      var passwordCheck = checkPassword(protectedContent, inputPassword);

      var passwordValid = passwordCheck.valid;
      var decryptedContent = passwordCheck.decryptedContent;

      console.log(passwordValid ? "Valid" : "Invalid");

      if (passwordValid) {
        hideAuthenticationUi();
        showLoadingSpinner();
        appendContent(decryptedContent);
      } else {
        showInvalidPassword();
      }
    });

    var enterKeyCode = 13;
    $passwordInput.on("keypress", function (keyEvent) {
      if (keyEvent.keyCode === enterKeyCode) {
        $loginButton.trigger("click");
      }
    });
  });
}

function focusInput() {
  var $passwordInput = $("#sp-login-password");

  $passwordInput.focus();
}

$(function () {
  setupEmailLink();
  initialiseVerifyForm();
  focusInput();
});
