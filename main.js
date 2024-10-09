let baseUrl = null;
let user = null;
let password = null;
let tokenAcesso = null;
let urlAtivo = null;
let ativoId = null;

function clearBody() {
    document.body.innerHTML = '';
}

function newBody() {
    document.body.innerHTML = `
    <div id="login-box">
        <p id="form-title">Leitura Ativo</p>
        <div class="form-group">
            <label for="url-ativo">URL Ativo</label>
            <input id="url-ativo" class="input-login" type="text" placeholder="Cole a url do ativo">
        </div>
        <button id="search-button">Buscar</button>
    </div>
    <footer>${user}</footer>
    `;
    document.getElementById('search-button').addEventListener('click', getUrl);
}

function getData() {
    baseUrl = document.getElementById("url").value;
    user = document.getElementById("user").value;
    password = document.getElementById("password").value;

    if (!baseUrl) {
        baseUrl = "https://sigmaecm.com";
    }

    if (!user || !password) {
        alert("Por favor, preencha os campos de Usuário e Senha.");
        return;
    }

    auth(baseUrl, user, password);
}

function getUrl() {
    urlAtivo = document.getElementById("url-ativo").value;

    if (!urlAtivo) {
        alert("Por favor, preencha o campo URL Ativo");
        return;
    }
    getAtivoId(urlAtivo);
    ativoRead(baseUrl, ativoId, tokenAcesso);
}

function getAtivoId(urlAtivo) {
    const supervisaoIndex = urlAtivo.indexOf("supervisao/");
    const sensorIndex = urlAtivo.indexOf("/sensor/");

    if (supervisaoIndex !== -1 && sensorIndex !== -1) {
        ativoId = urlAtivo.substring(supervisaoIndex + 11, sensorIndex); // Extrai o ID do ativo
        alert(`Ativo ID: ${ativoId}`);
        return ativoId;
    } else {
        alert("Ocorreu um erro inesperado");
        location.reload();
        return null;
    }
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
        console.log(tokenAcesso);
        clearBody();
        newBody(); // Chama newBody para exibir o próximo formulário
    })
    .catch(error => {
        console.error("Erro ao autenticar:", error);
    });
}

function ativoRead(baseUrl, ativoId, tokenAcesso) {
    const url = `http://localhost:3000/ativoId?baseUrl=${encodeURIComponent(baseUrl)}&idAtivo=${encodeURIComponent(ativoId)}&token=${encodeURIComponent(tokenAcesso)}`;
    fetch(url, { 
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (!response.ok) {
            alert("Erro na requisição: " + response.status);
            throw new Error("Erro na requisição: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        alert("Leitura do Ativo realizada com sucesso!");
        const modulosAtivo = data;
        console.log(modulosAtivo); // Exibe os dados do ativo
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
    });
}
document.getElementById('auth-button').addEventListener('click', getData);