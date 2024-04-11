const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const folderPath = path.join(__dirname, "../controllers/folder");


router.get("/api/drive/", async (req, res) => {
    try {
        console.log(`Je m'exécute`);

        const files = await fs.readdir(folderPath, {withFileTypes: true});
        console.log(files);

        const filesIsExpectedFormat = files.map(file => {
            return {
                name: file.name,
                isFolder: file.isDirectory(),
            };
        });


        res.json(filesIsExpectedFormat);

    } catch (error) {
        console.error("Erreur lors de la lecture du répertoire :", error);
        res.status(500).json({error: "Erreur serveur lors de la lecture du répertoire"});
    }
});

router.get("/api/drive/:name", async (req, res) => {
    try {

        const name = req.params.name;
        const itemPath = path.join(folderPath, name);
        const stats = await fs.stat(itemPath);

        if (stats.isDirectory()) {
            res.json({message: `Ouvrir le dossier ${name}`});
        } else {
            const fileContent = await fs.readFile(itemPath, {encoding:"utf-8"}, (err, data) => {
                if (err) {
                    console.log("Error : ", err);
                } else {
                    console.log(data);
                }
            });
            res({content: fileContent});
        }

    } catch (error) {
        console.error("Erreur lors de la lecture du répertoire :", error);
        res.status(500).json({error: "Erreur serveur lors de la lecture du répertoire"});
    }
});


module.exports = router;