import axios from "axios";


const urlBase = "https://jsonplaceholder.typicode.com"




export const obtenerTareasApi = async (signal) => {

    const response = await axios.get(
        `${urlBase}/todos`, {
        signal: signal
    });
    const tareas = response.data
    console.log(tareas);
    return tareas;
}



export const crearTareaApi = async (tarea) => {
    const response = await axios.post(
        `${urlBase}/todos`, tarea
    );
    return response.data;
}

