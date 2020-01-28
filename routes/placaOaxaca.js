var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var $ = require('cheerio');
const FormData = require('form-data');

/* GET placas listing. */
router.get('/', async function (req, res, next) {
    var pagina = await consultaPlacas(req.query.placa);
    //var arreglo = pagina.split('objetoContrato: \'');
    //var contrato = arreglo[1].split('\'');
    //console.log(contrato[0])
    res.send(generarJson(pagina));
});

async function consultaPlacas(placa) {
    var params = new FormData();
    params.append('placa', placa);
    params.append('serie', '');
    var informacion = await fetch('https://siox.finanzasoaxaca.gob.mx/pagoTenencia/busquedaVehiculo.htm', peticionPost(params));
    var pagina = informacion.text();
    return pagina;
}

function peticionPost(params) {
    return {
        method: 'POST',
        body: params,
        headers: params.getHeaders()
    }
}
function generarJson(pagina){
    return {
        'Numero de serie': $('#labelNumeroSerie', pagina).text(),
        'Estatus': $('#labelEstatus', pagina).text(),
        'Placas': $('#labelPlacas', pagina).text(),
        'Modelo': $('#labelModelo', pagina).text(),
        'Clasificacion': $('#labelClasificacion', pagina).text(),
        'Marca': $('#labelLinea', pagina).text(),
        'General': $('#labelVersion', pagina).text(),
    }
}

module.exports = router;
