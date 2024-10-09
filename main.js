let tokenAcesso = null;

function getData() {
    let baseUrl = document.getElementById("url").value;
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    if (!baseUrl) {
        baseUrl = "https://sigmaecm.com";
    }

    if (!user || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    auth(baseUrl, user, password);
}

function auth(baseUrl, user, password) {
    fetch('http://localhost:3000/auth', { 
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            baseUrl: baseUrl,
            usuario: user,
            chaveAcesso: password
        })
    })
    .then(response => {
        if (!response.ok) {
            alert("Erro na requisição: " + response.status);
            throw new Error("Erro na requisição: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        alert("Autenticação bem-sucedida");
        tokenAcesso = data.dadosAutenticacao.tokenAcesso;
    })
    .catch(error => {
        console.error("Erro ao autenticar:", error);
    });
}
document.getElementById('auth-button').addEventListener('click', getData);