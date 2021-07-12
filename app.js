const { leerInput, inquirerMenu, pausa } = require('./helpers/inquirer.js');
const Busquedas = require('./models/busquedas.js');


const main = async() => {
    const busquedas = new Busquedas();
    let opt;

    do {
        console.clear();
        opt = await inquirerMenu();

        switch( opt ) {
            case 1:
                // Mostrar mensaje
                    const lugar = await leerInput( 'Ciudad: ' );
                    console.log( lugar );
                // Buscar los lugares
                // Seleccionar el lugar

                // Clima

                // Mostrar resultado
                console.log( '\nInformacion de la ciudad\n'.green );
                console.log('Ciudad:', );
                console.log('Lat:', );
                console.log('Lng:', );
                console.log('Temperatura:', );
                console.log('Mínima:', );
                console.log('Máxima:', );
        }

        if ( opt !== 0 ) await pausa();
    } while( opt !== 0 );
};

main();


