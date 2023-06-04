document.querySelector("#signup-form").addEventListener("submit", function(event) {
  validateForm(event);
});

var userInputName;
var usernames;
getUsernames();

function validateForm(e) {
  let isValid = true;
  let userInputName = document.querySelector("#username").value;
  document.querySelector("#username-feedback").innerHTML = "";
  document.querySelector("#pwd-feedback").innerHTML = "";
  document.querySelector("#email-feedback").innerHTML = "";

  if(!checkPassword()) {
    e.preventDefault();
    document.querySelector("#pwd-feedback").innerHTML = "*Passwords don't match*";
  }

  if(!checkBlankPwd()) {
    e.preventDefault();
    document.querySelector("#pwd-feedback").innerHTML = "*Blank Password Field*";
  }

  
  for (user of usernames) {
    if (user.username == userInputName) {
      e.preventDefault();
      console.log("user input: " + userInputName);
      console.log(user.username);
      document.querySelector("#username-feedback").innerHTML = "*Username taken*";
      
    }
  }

  if (!checkEmail()) {
    e.preventDefault();
    document.querySelector("#email-feedback").innerHTML = "E-mail field blank";
  }
}

function checkPassword() {
  let userpass1 = document.querySelector("#password").value;
  let userpass2 = document.querySelector("#password2").value;
  console.log("userpass1: " + userpass1);
  console.log("userpass2: " + userpass2);

  if (userpass1 != userpass2) {
    return false;
  } else {
    return true;
  }
}

function checkBlankPwd() {
  let userpass1 = document.querySelector("#password").value;
  let userpass2 = document.querySelector("#password2").value;

  if (userpass1 == "" || userpass2 == "") {
    return false;
  } else {
    return true;
  }
}

function checkEmail() {
  let email = document.querySelector("#email").value;
  let isValid = true;

  if (email == "") {
    isValid = false;
  }

  console.log(isValid);

  return isValid;
    

}

async function getUsernames() {
  let url = '/api/usernames';
  let response = await fetch(url);
  let data = await response.json();
  usernames = data;
  console.log(data);
}