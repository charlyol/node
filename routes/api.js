const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const {tmpdir} = require("node:os");
const {query} = require("express");
const folderPath = path.join(__dirname, "../data/folder");
const { direntToAlpsItem, creatOrNotFolder, deleteOrNotFolder, uploadOrNotFile} = require("../function/utils");

/* region READ */
router.get("/api/drive", async (req, res) => {
    try {
        const dirents = await fs.readdir(folderPath, {
            withFileTypes: true
        })
        const tabFiles = []
        for (const dirent of dirents) {
            tabFiles.push(await direntToAlpsItem(dirent))
        }
        res.send(tabFiles);
    } catch (e) {
        console.error(e);
        return res.status(500).send(`Cannot read the folder: ${e}`);
    }
});
/* endregion READ */

/* region CREAT */
router.post("/api/drive", async (req, res) => {

    try {
        await creatOrNotFolder(req.query.name);
        res.sendStatus(201);
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
});
/* endregion CREAT */

// Update //
router.put("/api/drive", async (req, res) => {
    try {
        await uploadOrNotFile(req.files.file);
        console.log(req.files.file);
        res.sendStatus(201);
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
});

/* region DELETE */
router.delete("/api/drive/:name", async (req, res) => {
    try {
        await deleteOrNotFolder(req.params.name);
        res.sendStatus(201);
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
});
/* endregion DELETE */

module.exports = router;
