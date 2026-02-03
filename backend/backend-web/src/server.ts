import express from 'express';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const staticPath = path.join(__dirname, '..', '..', '..', 'frontend', 'src');
app.use(express.static(staticPath))

app.get('/', (req, res) => {
    res.redirect('/home/home.html');
});

app.get('/graphhopper/api', async (req, res) => {
    try {
        const queryString = req.url.split('?')[1] || '';

        const graphHopperUrl = `http://localhost:8989/route?${queryString}`;
        
        console.log("Node pedindo para Java:", graphHopperUrl); // Para debug

        const response = await fetch(graphHopperUrl);
        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error("Erro na ponte:", error);
        res.status(500).json({ error: 'Erro ao calcular rota' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});