import colors from 'colors';
import { confirmar, inquirerMenu, leerInput, listadoTareasBorrar, mostrarListadoChecklist, pausa } from './helpers/inquirer.js';
import { Tareas } from './models/tareas.js';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';


console.clear();

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB) {

        tareas.cargarTareasFromArray(tareasDB);

    }

    do {
        
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                // Crear opcion
                const desc = await leerInput('Descripcion: ');
                tareas.crearTarea( desc );
                break;
        
            case '2':
                // console.log( tareas.listadoArr );
                tareas.listadoCompleto( tareas.listadoArr );
                break;

            case '3':
                tareas.listarPendientesCompletadas(true);
                break;
            
            case '4':
                tareas.listarPendientesCompletadas(false);
                break;

            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                break;

            case '6':
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0' ) {
                    const ok = await confirmar('¿Estas seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada correctamente');
                    }
                }
                break;
        }

        guardarDB( tareas.listadoArr );

        await pausa();

    } while ( opt !== '0' )
}

main();