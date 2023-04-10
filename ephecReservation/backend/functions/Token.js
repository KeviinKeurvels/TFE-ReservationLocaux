import bcrypt from 'bcrypt'

export function generateToken(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let token = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charset.length);
    token += charset.charAt(randomIndex);
  }
  return token;
}

export function hashToken(token, saltRounds) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(token, salt);
  return hash;
}

