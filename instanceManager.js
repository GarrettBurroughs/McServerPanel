const fs = require('fs');
const path = require('path');


function getInstances() {
    return  fs.readdirSync(path.join(__dirname, 'minecraft'))
}

function createNewInstance(instanceData) {
    
}

function getManifest() {
    
}

module.exports = { 
    getInstances, 
    createNewInstance, 
    getManifest
}