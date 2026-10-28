import axios from "axios";



const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

//interceptor de la peticion, moverlo a servicios de tareas
api.interceptors.request.use((config) => {
    //busca en el localStorage el token
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//interceptor de la respuesta
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    }
);

//verificar que se manda en este formato 


export const loginApi = async (dataLogin) => {
    console.log('dataLogin en login api', dataLogin)
    const resultado = await api.post("/auth/login", dataLogin);
    console.log('resultadoAPI', resultado)
    return resultado.data;
}





export default api;