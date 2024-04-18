const express = require("express");
const constants = require("fs").constants;
const fs = require("fs").promises;
const path = require("path");
const res = require("express/lib/response");
const folderPath = path.join(__dirname, "../data/folder");
const req = require("express/lib/request");


function direntToAlpsFolder(dirent) {
    return {
        name: dirent.name,
        isFolder: true,
    };
}

async function direntToAlpsFile(dirent) {
    const stats = await fs.stat(path.join(folderPath, dirent.name));
    return {
        name: dirent.name,
        isFolder: false,
        size: stats.size,
    };
}

async function direntToAlpsItem(dirent) {
    if (dirent.isDirectory()) {
        return direntToAlpsFolder(dirent);
    } else {
        return direntToAlpsFile(dirent);
    }
}

async function testIsFolderExiste(folder) {
    try {
        const fullPath = path.join(folderPath, folder)
        await fs.access(fullPath, constants.R_OK | constants.W_OK)
        return true;
    } catch (e) {
        return false;
    }

}

async function testAlphaNumerique(folder) {
    const comparaison = /^[a-zA-Z0-9]{0,8}$/g;
    return comparaison.test(folder);
}

async function creatFolders(folder) {
    await fs.mkdir(folder);
}

async function deleteFolder(folder) {
    await fs.rm(folder, {recursive: true});
}

async function creatOrNotFolder(folder) {
    if (await testIsFolderExiste(folder) === false) {
        if (await testAlphaNumerique(folder) === true) {
            await creatFolders(path.join(folderPath, folder));
        } else {
            throw {message: folder + " contient des caractères non-alphanumérique", code: 400}
        }
    } else {
        throw {message: folder + " exists", code: 400}
    }
}

async function deleteOrNotFolder(folder) {
    if (await testIsFolderExiste(folder) === true) {
        if (await testAlphaNumerique(folder) === true) {
            await deleteFolder(path.join(folderPath, folder));
        } else {
            throw {message: folder + " contient des caractères non-alphanumérique", code: 400}
        }
    } else {
        throw {message: folder + " not exists ", code: 404}
    }
}

async function savefile(file) {
        await fs.copyFile(file, folderPath);
    }

async function uploadOrNotFile(file) {
    try {
        const filePath = await savefile(file);
        return {message: filePath + " upload", code: 201};
    } catch {
        return {message: file + " not upload", code: 400};
    }
}

module.exports = {
    direntToAlpsItem,
    creatOrNotFolder,
    deleteOrNotFolder,
    uploadOrNotFile,
}