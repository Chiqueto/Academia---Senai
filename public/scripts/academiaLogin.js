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
      // Redireciona para a página do menu do aluno
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

// Adiciona o evento de submit ao formulário de login
document.getElementById("loginFormAcad").addEventListener("submit", autenticar);
