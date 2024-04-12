const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const folderPath = path.join(__dirname, "../controllers/folder");

// Route pour créer un nouveau dossier
router.post("/api/drive/", async (req, res) => {
    try {
        const name = req.query.name; // Récupérer le nom du dossier depuis la requête query

        if (!name) {
            return res.status(400).json({ error: "Le nom du dossier est manquant dans la requête." });
        }

        const newFolderPath = path.join(folderPath, name);

        // Vérifier si le dossier existe déjà
        const folderExists = await fs.stat(newFolderPath).catch(() => false);
        if (folderExists) {
            return res.status(400).json({ error: "Un dossier avec ce nom existe déjà." });
        }

        // Créer le nouveau dossier
        await fs.mkdir(newFolderPath);

        res.status(201).json({ message: `Le dossier "${name}" a été créé avec succès.` });
    } catch (error) {
        console.error("Erreur lors de la création du dossier :", error);
        res.status(500).json({ error: "Erreur serveur lors de la création du dossier." });
    }
});

// Route pour lister les fichiers et dossiers
router.get("/api/drive/", async (req, res) => {
    try {
        console.log(`Je m'exécute`);

        const files = await fs.readdir(folderPath, { withFileTypes: true });
        console.log(files);

        const filesIsExpectedFormat = files.map(file => {
            return {
                name: file.name,
                isFolder: file.isDirectory(),
                size: file.size,
            };
        });

        res.json(filesIsExpectedFormat);

    } catch (error) {
        console.error("Erreur lors de la lecture du répertoire :", error);
        res.status(500).json({ error: "Erreur serveur lors de la lecture du répertoire" });
    }
});

// Route pour ouvrir un fichier ou un dossier
router.get("/api/drive/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const itemPath = path.join(folderPath, name);
        const stats = await fs.stat(itemPath);

        if (stats.isDirectory()) {
            res.json({ message: `Ouvrir le dossier ${name}` });
        } else {
            const fileContent = await fs.readFile(itemPath, { encoding: "utf-8" });
            res.json({ content: fileContent });
        }

    } catch (error) {
        console.error("Erreur lors de la lecture du répertoire :", error);
        res.status(500).json({ error: "Erreur serveur lors de la lecture du répertoire" });
    }
});

// Route pour supprimer un dossier
router.delete("/api/drive/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const itemPath = path.join(folderPath, name);

        // Vérifier si le dossier existe
        const folderExists = await fs.stat(itemPath).catch(() => false);
        if (!folderExists || !folderExists.isDirectory()) {
            return res.status(404).json({ error: "Le dossier spécifié n'existe pas." });
        }

        // Supprimer le dossier
        await fs.rmdir(itemPath, { recursive: true });

        res.json({ message: `Le dossier "${name}" a été supprimé avec succès.` });
    } catch (error) {
        console.error("Erreur lors de la suppression du dossier :", error);
        res.status(500).json({ error: "Erreur serveur lors de la suppression du dossier." });
    }
});

module.exports = router;
