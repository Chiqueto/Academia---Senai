document.querySelector("form").addEventListener("submit", function (event) {
  const nome = document.querySelector("input[name='nome']").value.trim();
  const email = document.querySelector("input[name='email']").value.trim();
  const senha = document.querySelector("input[name='senha']").value.trim();
  const telefone = document.querySelector("input[name='telefone']").value.trim();
  const cep = document.querySelector("input[name='cep']").value.trim();
  const cref = document.querySelector("input[name='cref']").value.trim();

  // Regex de validação
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/; // Apenas domínios permitidos
  const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/; // Formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
  const cepRegex = /^\d{5}-\d{3}$/; // Formato XXXXX-XXX
  const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/; // Apenas letras e espaços
  const crefRegex = /^\d{4}-[A-Za-z]\/[A-Za-z]{2}$/; // Formato 0000-G/SC

  const errors = [];

  // Validações específicas
  if (!nomeRegex.test(nome) || nome.length < 3 || nome.length > 50) {
      errors.push("O nome deve conter apenas letras e espaços, e ter entre 3 e 50 caracteres.");
  }

  if (!emailRegex.test(email)) {
      errors.push("Email inválido. Use um dos domínios: gmail.com, hotmail.com ou outlook.com.");
  }

  if (senha.length < 6) {
      errors.push("A senha deve ter pelo menos 6 caracteres.");
  }

  if (!telefoneRegex.test(telefone)) {
      errors.push("Telefone inválido. ");
  }

  if (!cepRegex.test(cep)) {
      errors.push("CEP inválido. Deve estar no formato XXXXX-XXX.");
  }

  if (!crefRegex.test(cref)) {
      errors.push("CREF inválido. Deve estar no formato 0000-G/SC.");
  }

  if (errors.length > 0) {
      event.preventDefault();
      alert(errors.join("\n"));
  }
});

document.querySelectorAll("input[name='nome'], input[name='cidade'], input[name='bairro'], input[name='logradouro']")
.forEach(function (input) {
  input.addEventListener("input", function (event) {
    const regex = /^[A-Za-zÀ-ÿ\s]*$/; // Permite apenas letras e espaços
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""); // Remove caracteres inválidos
    }
  });
});
// Funções de formatação
function formatarTelefone(telefone) {
  return telefone
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d)/, "$1-$2");
}

function formatarCEP(cep) {
  return cep.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2");
}

function formatarCref(cref) {
  return cref
  
      .replace(/^(\d{4})([A-Za-z])/, "$1-$2")
      .replace(/([A-Za-z])([A-Za-z]{2})$/, "$1/$2");
}

// Aplicando as formatações dinamicamente
document.querySelector("input[name='telefone']").addEventListener("input", function (event) {
  event.target.value = formatarTelefone(event.target.value);
});

document.querySelector("input[name='cep']").addEventListener("input", function (event) {
  event.target.value = formatarCEP(event.target.value);
});

document.querySelector("input[name='cref']").addEventListener("input", function (event) {
  event.target.value = formatarCref(event.target.value);
});

 // Mensagem de sucesso após o cadastro
 const params = new URLSearchParams(window.location.search);
 if (params.get("success") === "1") {
   alert("Cadastro realizado com sucesso!");
 }
console.log("Script carregado com sucesso!");
