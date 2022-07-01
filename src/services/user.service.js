import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3600/";

const getPublicContent = () => {
    return axios.get(API_URL + "all");
};

const getDocuments = () => {
    return axios.get(API_URL + "document", { headers: authHeader() })
}

const addDocument = (payload) => {
    return axios.post(API_URL + "document", payload, { headers: authHeader() })
}

const uploadDocument = (payload) => {
    return axios.post(API_URL + "document/upload", payload, { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } })
}

const getDocument = (id) => {
    return axios.get(API_URL + "document/" + id, { headers: authHeader() })
}

const editDocument = (id, data) => {
    return axios.patch(API_URL + "document/" + id, data, { headers: authHeader() })
}
const deleteDocument = (id) => {
    return axios.delete(API_URL + "document/" + id, { headers: authHeader() })
}

const syncDocument = (data) => {
    return axios.post(API_URL + "document/dialogflow/add", data, { headers: authHeader() })
}

const getAllUsers = () => {
    return axios.get(API_URL + "user/all", { headers: authHeader() });
};

const getUserBoard = () => {
    return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
    return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
    return axios.get(API_URL + "admin", { headers: authHeader() });
};

const userService = {
    getAllUsers,
    getPublicContent,
    getUserBoard,
    getModeratorBoard,
    getAdminBoard,
    addDocument,
    getDocuments,
    getDocument,
    editDocument,
    deleteDocument,
    syncDocument,
    uploadDocument
};

export default userService