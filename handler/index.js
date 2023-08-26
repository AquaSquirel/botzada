const fs = require('fs')

module.exports = async (client) => {
    console.log('INDEX HANDLER')

    fs.readdir('./events', (erro, arquivos) => {
        arquivos.forEach(arquivo => {
            if (!arquivo.endsWith('.js')) return;
            require(`../events/${arquivo}`)
        })
    })
}