// Minimales Beispiel-Backend für "Perfekte Uhrzeit"
// Speichert die Einträge einfach in einer JSON-Datei auf der Festplatte
// UND liefert gleichzeitig die Website (perfekte-uhrzeit.html) aus,
// damit alles über eine einzige Adresse läuft.
//
// Ordnerstruktur (wichtig!):
//   projekt/
//     server-beispiel.js
//     entries.json          (wird automatisch angelegt)
//     public/
//       perfekte-uhrzeit.html   <- hier reinlegen, am besten in "index.html" umbenennen
//
// Installation:
//   npm init -y
//   npm install express cors
//   node server-beispiel.js
//
// Danach ist die Seite unter http://localhost:3000 erreichbar (lokal)
// bzw. unter deiner Domain, sobald der Server öffentlich läuft.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'entries.json');

app.use(cors());
app.use(express.json());

// Liefert alles aus dem "public"-Ordner aus (dort liegt die HTML-Datei)
app.use(express.static(path.join(__dirname, 'public')));

function readEntries(){
  if(!fs.existsSync(DATA_FILE)) return [];
  try{
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }catch(e){
    return [];
  }
}

function writeEntries(entries){
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

// Alle Einträge abrufen
app.get('/api/entries', (req, res) => {
  res.json(readEntries());
});

// Einen neuen Eintrag speichern
app.post('/api/entries', (req, res) => {
  const { name, timeLabel, bonus, points, ts } = req.body || {};
  if(!name || !timeLabel || typeof points !== 'number'){
    return res.status(400).json({ error: 'Ungültiger Eintrag' });
  }
  const entries = readEntries();
  entries.push({ name, timeLabel, bonus, points, ts });
  writeEntries(entries);
  res.status(201).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log(`(Auf einem echten Server: über deine Domain / IP erreichbar)`);
});
