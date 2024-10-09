const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/auth', async (req, res) => {
    const { baseUrl, usuario, chaveAcesso } = req.body;

    try {
        const response = await fetch(`${baseUrl}/api/v1/Autenticacao`, {
            method: 'POST',
            headers: {
                'Accept-Language': 'pt-BR',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, chaveAcesso })
        });

        if (!response.ok) {
            throw new Error(`Erro ao autenticar: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao fazer a autenticação', error: error.message });
    }
});

app.get('/ativoId', async (req, res) => {
    const { baseUrl, token, idAtivo } = req.query;

    const apiUrl = `${baseUrl}/api/v1/Ativo/${idAtivo}/modulos/lookups?tipoModulo=Supervisao`;
    const headers = {
        'Accept': 'application/json',
        'Accept-Language': 'pt-BR',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    // Imprime os headers para ver se o Authorization está lá
    console.log("Cabeçalhos:", headers);

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
        });

        console.log("Status da resposta:", response.status);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Erro ao fazer a requisição para a API final:", error);
        res.status(500).json({ message: 'Erro na requisição', error: error.message });
    }
});

app.use(express.static('../'));

app.listen(port, () => {
    console.log(`Servidor proxy rodando em http://localhost:${port}`);
});
