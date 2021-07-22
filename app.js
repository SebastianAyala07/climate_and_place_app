require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas.js');
const axios = require('axios');


const main = async() => {
    const busquedas = new Busquedas();
    let opt;

    do {
        console.clear();
        opt = await inquirerMenu();

        switch( opt ) {
            case 1:
                // Mostrar mensaje
                    const termino = await leerInput( 'Ciudad: ' );
                    const lugares = await busquedas.ciudad( termino );
                    const idSeleccionado = await listarLugares( lugares );
                    if ( idSeleccionado === '0' ) continue;

                    const { id, nombre, lng, lat } = lugares.find( l => l.id === idSeleccionado);

                    busquedas.agregarHistorial( nombre );

                // Buscar los lugares
                // Seleccionar el lugar

                // Clima
                const clima = await busquedas.climaLugar( lat, lng );

                // Mostrar resultado
                console.clear();
                console.log( '\nInformacion de la ciudad\n'.green );
                console.log('Ciudad:', nombre.cyan);
                console.log('Lat:', lat);
                console.log('Lng:', lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc.cyan);
                break;
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i +1 }.`.green;
                    console.log(`${ idx } ${lugar}`);
                })
                break;
        }

        if ( opt !== 0 ) await pausa();
    } while( opt !== 0 );
};

main();


