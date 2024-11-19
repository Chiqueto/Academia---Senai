async function autenticar(event) {
  event.preventDefault(); // Evita o envio padrão do formulário

  const email = document.getElementById("emailAcademia").value;
  const senha = document.getElementById("senhaAcademia").value;

  try {
    const response = await fetch("/academia/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    console.log(email, senha);

    if (response.ok) {
      const data = await response.json();
      localStorage.clear();
      // Armazena o token no localStorage
      localStorage.setItem("authorization", data.token);
      console.log(data.token);
      // Redireciona para a página do menu 
      window.location.href = data.redirectTo;
    } else {
      const errorData = await response.json();
      alert(errorData.error || "Erro ao autenticar. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro de rede:", error);
    alert("Erro ao tentar conectar com o servidor. Tente novamente.");
  }
}

      // Mensagem de sucesso após o cadastro
      const params = new URLSearchParams(window.location.search);
      if (params.get("success") === "1") {
        alert("Cadastro realizado com sucesso!");
      }

      // Validação do formulário de login
      document.querySelector("#loginFormAcad").addEventListener("submit", function (event) {
        const email = document.querySelector("input[name='email']").value.trim();
        const senha = document.querySelector("input[name='senha']").value.trim();

        // Regex para validação do email e senha
        const emailRegex = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/; // Valida domínio específico
        const errors = [];

        // Validação de email
        if (!emailRegex.test(email)) {
          errors.push("Email inválido. O domínio deve ser gmail.com, hotmail.com ou outlook.com.");
        }

        // Validação de senha
        if (senha.length < 4) {
          errors.push("A senha deve ter pelo menos 4 caracteres.");
        }

        // Mostrar erros se houver
        if (errors.length > 0) {
          event.preventDefault(); // Evita o envio do formulário
          alert(errors.join("\n"));
        }
      });

// Adiciona o evento de submit ao formulário de login
document.getElementById("loginFormAcad").addEventListener("submit", autenticar);
