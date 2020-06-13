const fs = require('fs');
const https = require('https');
const path = require('path');
const fetch = require('node-fetch');

function getInstances() {
    const mcPath = path.join(__dirname, 'minecraft');
    if (fs.existsSync(mcPath)) {
        return fs.readdirSync(path.join(__dirname, 'minecraft'));
    } else {
        return "No Server Instances Found";
    }

}

function createNewInstance(name, downloadUrl, cb) {
    console.log(`Downloading ${downloadUrl}`)

    fs.mkdirSync(`./minecraft/${name}`);
    const serverJAR = fs.createWriteStream(`./minecraft/${name}/server.jar`);
    https.get(downloadUrl,  (response) => {
        response.pipe(serverJAR);
        serverJAR.on('finish', () => {
            console.log('finished downloading!')
            serverJAR.close();
            cb({
                type: "message",
                message: "Server Jar downloaded!"
            });
        });
    }).on('error', (error) => {
        fs.unlink(`./minecraft/${name}/server.jar`);
        cb({
            type: "error",
            message: error.message
        })
    });
}

async function getAllVerions(snapshots, alpha, beta) {
    let version_manifest = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then(res => res.json());
    let versions = version_manifest.versions;

    versions = versions.filter(v => {
        if (v.type === "release") return true;
        if (snapshots && v.type === "snapshot") return true;
        if (alpha && v.type === "old_alpha") return true;
        if (beta && v.type === "old_beta") return true;
        return false;
    })

    return versions;
}

getAllVerions();
module.exports = {
    getInstances,
    createNewInstance,
    getAllVerions
}