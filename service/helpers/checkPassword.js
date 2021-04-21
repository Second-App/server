const checkPassword = (password) => {
  let capitalLetter = false;
  let numberOrSymbol = false;
  let minimumLength = false;
  let length = 0;

  for (let i = 0; i < password.length; i++) {
    /* istanbul ignore next */
    if (
      password[i].toUpperCase() !== password[i].toLowerCase() &&
      password[i] === password[i].toUpperCase() &&
      Number(password[i]) !== password[i]
    ) {
      capitalLetter = true;
    }

    /* istanbul ignore next */
    if (password[i].toUpperCase() === password[i].toLowerCase()) {
      numberOrSymbol = true;
    }

    length++;
  }

  /* istanbul ignore next */
  if (length >= 6) {
    minimumLength = true;
  }

  /* istanbul ignore next */
  if (capitalLetter && numberOrSymbol && minimumLength) {
    return true;
  } else {
    /* istanbul ignore next */
    return false;
  }
};

module.exports = checkPassword;
