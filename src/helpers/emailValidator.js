const emailRegEx =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export default function validateEmail(email) {
  if (!email) {
    return false;
  }

  const emailParts = email.split("@");

  if (emailParts.length !== 2) {
    return false;
  }

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64) {
    return false;
  } else if (address.length > 255) {
    return false;
  }

  const domainParts = address.split(".");
  if (domainParts.some((part) => part.length > 63)) {
    return false;
  }

  if (!emailRegEx.test(email)) {
    return false;
  }

  return true;
}
