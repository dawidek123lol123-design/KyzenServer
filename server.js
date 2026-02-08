const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Prosta baza danych w pamięci (zniknie po restarcie serwera)
// Render.com restartuje serwery, więc dane będą znikać.
// Aby tego uniknąć w przyszłości, będziesz potrzebować bazy danych (np. MongoDB Atlas).
const database = {}; 

// Endpoint: Sprawdź czy działa
app.get('/', (req, res) => {
    res.send('Kyzen API is running!');
});

// Endpoint: Pobierz kosmetyki gracza
app.get('/api/cosmetics/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    const data = database[uuid] || { 
        cape: "default", 
        wings: "default_wings", 
        handItem: "default_item",
        capeEnabled: true, 
        wingsEnabled: false, 
        handItemEnabled: false 
    };
    console.log(`[GET] Fetching for ${uuid}`);
    res.json(data);
});

// Endpoint: Zapisz kosmetyki gracza
app.post('/api/cosmetics/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    // Walidacja prostych danych
    if (!req.body) return res.sendStatus(400);
    
    database[uuid] = {
        cape: req.body.cape || "default",
        wings: req.body.wings || "default_wings",
        handItem: req.body.handItem || "default_item",
        capeEnabled: !!req.body.capeEnabled,
        wingsEnabled: !!req.body.wingsEnabled,
        handItemEnabled: !!req.body.handItemEnabled
    };
    
    console.log(`[POST] Updated for ${uuid}:`, database[uuid]);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});