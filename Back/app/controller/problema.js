const modelProblema = require('./../model/problema');

class Problema {
    constructor(router) {
        router.get('/problemas', this.obtenerProblemas);
    }

    async obtenerProblemas(req, res) {
        res.send(await modelProblema.findAll());
    }

}

module.exports = Problema;