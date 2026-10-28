import axios from "axios";

const urlBase = "https://jsonplaceholder.typicode.com"











export const obtenerUsuariosApi = async (signal) => {

    const response = await axios.get(
        `${urlBase}/users`, {
        signal: signal
    });
    const usuarios = response.data
    console.log("Usuarios:", usuarios);
    return usuarios;
}



export const crearUsuarioApi = async (usuario) => {
    const response = await axios.post(
        `${urlBase}/todos`, tarea
    );
    return response.data;
}

