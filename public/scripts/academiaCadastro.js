
        document.querySelector("form").addEventListener("submit", function (event) {
  const nome = document.querySelector("input[name='nome']").value.trim();
  const cnpj = document.querySelector("input[name='cnpj']").value.trim();
  const email = document.querySelector("input[name='email']").value.trim();
  const senha = document.querySelector("input[name='senha']").value.trim();
  const telefone = document.querySelector("input[name='telefone']").value.trim();
  const cep = document.querySelector("input[name='cep']").value.trim();
  const numero = document.querySelector("input[name='numero']").value.trim();

  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/; // Aceita (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
  const cepRegex = /^\d{5}-\d{3}$/; // Formato XXXXX-XXX
  const numeroRegex = /^\d{1,4}$/;
  const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/; // Apenas letras e espaços

  const errors = [];

  if (!nomeRegex.test(nome)) {
    errors.push("O nome deve conter apenas letras e espaços.");
  }

  if (nome.length < 3 || nome.length > 50) {
    errors.push("O nome deve ter entre 3 e 50 caracteres.");
  }

  if (!cnpjRegex.test(cnpj)) {
    errors.push("CNPJ inválido.");
  }

  if (!emailRegex.test(email)) {
    errors.push("Email inválido. Tem que estar com o domínio gmail.com, hotmail.com ou outlook.com");
  }

  if (senha.length < 4) {
    errors.push("A senha deve ter pelo menos 4 caracteres.");
  }

  if (!telefoneRegex.test(telefone)) {
    errors.push("Telefone inválido. Deve estar no formato (XX) XXXXX-XXXX.");
  }

  if (!cepRegex.test(cep)) {
    errors.push("CEP inválido. Deve estar no formato XXXXX-XXX.");
  }

  if (!numeroRegex.test(numero)) {
    errors.push("Número inválido. Deve ter no máximo 4 dígitos.");
  }

  if (errors.length > 0) {
    event.preventDefault();
    alert(errors.join("\n"));
  }
});

// Validação para campos que aceitam apenas letras e espaços
document.querySelectorAll("input[name='nome'], input[name='cidade'], input[name='bairro'], input[name='logradouro']")
  .forEach(function (input) {
    input.addEventListener("input", function (event) {
      const regex = /^[A-Za-zÀ-ÿ\s]*$/; // Permite apenas letras e espaços
      if (!regex.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""); // Remove caracteres inválidos
      }
    });
  });
// Formatação dos campos
function formatarCNPJ(cnpj) {
  return cnpj
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatarTelefone(telefone) {
  return telefone
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d)/, "$1-$2");
}

function formatarCEP(cep) {
  return cep.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2");
}

document.querySelector("input[name='cnpj']").addEventListener("input", function (event) {
  event.target.value = formatarCNPJ(event.target.value);
});

document.querySelector("input[name='telefone']").addEventListener("input", function (event) {
  event.target.value = formatarTelefone(event.target.value);
});

document.querySelector("input[name='cep']").addEventListener("input", function (event) {
  event.target.value = formatarCEP(event.target.value);
});
     

console.log("Script carregado com sucesso!");