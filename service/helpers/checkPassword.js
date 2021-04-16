const checkPassword = (password) => {
  let capitalLetter = false;
  let numberOrSymbol = false;
  let minimumLength = false;
  let length = 0;

  for (let i = 0; i < password.length; i++) {
    if (
      password[i].toUpperCase() !== password[i].toLowerCase() &&
      password[i] === password[i].toUpperCase() &&
      Number(password[i]) !== password[i]
    ) {
      capitalLetter = true;
    }

    if (password[i].toUpperCase() === password[i].toLowerCase()) {
      numberOrSymbol = true;
    }

    length++;
  }

  if (length >= 6) {
    minimumLength = true;
  }

  if (capitalLetter && numberOrSymbol && minimumLength) {
    return true;
  } else {
    return false;
  }
};

module.exports = checkPassword;
