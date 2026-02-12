import axios from "axios";
import BASE_URL from "./config"; 


const API = axios.create({
  baseURL: BASE_URL,
});

/* CREATE */
export const createComplaint = (formData) =>
  API.post("/complaints", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* GET BY USER */
export const getUserComplaints = (userId) =>
  API.get(`/complaints/user/${userId}`);

/* UPDATE */
export const updateComplaint = (id, formData) =>
  API.put(`/complaints/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* DELETE */
export const deleteComplaint = (id) =>
  API.delete(`/complaints/${id}`);
