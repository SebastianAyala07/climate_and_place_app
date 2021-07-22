'use strict';
const fs = require('fs');

const { default: axios } = require("axios");

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        // TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( palabra => palabra[0].toLocaleUpperCase() + palabra.substring(1) );
            return palabras.join(' ');
        })
    }

    get paramsMapBox() {
        return {
            'access_token': process.env['MAPBOX_KEY'],
            'language': 'es',
            'limit': 5
        }
    }

    get paramsWeather() {
        return {
            'appid': process.env['OPENWEATHER_KEY'],
            'units': 'metric',
            'lang': 'es'
        }
    }

    async ciudad( lugar = '' ) {

        try {

            // peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox
            });
            const resp = await instance.get();
            // console.log( 'ciudad', lugar );
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Ibagu%C3%A9.json?access_token=pk.eyJ1Ijoic2ViYXNheWFsYTA3IiwiYSI6ImNrcjJ0Mm5yejI3MTEydXJ6eTI1b2x5bmoifQ.xtp0fMNFjYtgO7zkXn2RDw&language=es&limit=5');
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch ( error ) {
            console.log("Error", error.params);
            return [];
        }

    }

    async climaLugar( lat, lon ) {
        try {
            const params = this.paramsWeather;
            params.lat = lat;
            params.lon = lon;

            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params
            });

            const { data } = await instance.get();

            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp,
            }
        } catch ( error ) {
            console.error( error );
        }
    }

    agregarHistorial( lugar = '' ) {

        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }
        this.historial = this.historial.splice( 0, 5 );
        this.historial.unshift( lugar.toLocaleLowerCase() );

        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    }

    leerDB() {

        if ( fs.existsSync(this.dbPath) ) {
            let resultado = fs.readFileSync(this.dbPath,{ encoding: 'utf-8' });
            let data = JSON.parse(resultado);
            this.historial = data.historial;
        }

    }

}

module.exports = Busquedas;
