const becrypt = require("bcrypt");

async function teste(texto) {
  return (senhaEncrypt = await becrypt.hash(texto, 10));
}

console.log(teste("12C3C12"));
