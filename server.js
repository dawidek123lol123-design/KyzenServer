const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Prosta baza danych w pamięci
// Uwaga: Dane znikają po restarcie serwera na darmowym hostingu (Render.com)
const database = {}; 

// Endpoint: Sprawdź czy działa
app.get('/', (req, res) => {
    res.send('Kyzen API is running!');
});

// Endpoint: Pobierz kosmetyki gracza
app.get('/api/cosmetics/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    
    // Jeśli gracza nie ma w bazie, zwróć domyślne ustawienia (WSZYSTKO WYŁĄCZONE)
    const data = database[uuid] || { 
        cape: "default", 
        wings: "default_wings", 
        handItem: "default_item",
        capeEnabled: false, // <--- ZMIANA: Domyślnie wyłączone
        wingsEnabled: false, 
        handItemEnabled: false 
    };
    
    console.log(`[GET] Fetching for ${uuid}`);
    res.json(data);
});

// Endpoint: Zapisz kosmetyki gracza
app.post('/api/cosmetics/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    
    // Walidacja: sprawdź czy przesłano dane
    if (!req.body) return res.sendStatus(400);
    
    // Zapisz dane do bazy
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