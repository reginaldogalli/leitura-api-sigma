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

app.use(express.static('../'));

app.listen(port, () => {
    console.log(`Servidor proxy rodando em http://localhost:${port}`);
});
