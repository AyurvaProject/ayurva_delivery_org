import axios from "axios";
import { API_URL } from "../../constants/keys";
import { GetCurrentUser } from "../Auth/Auth";

export const SignUpDeliveryPerson = async (data) => {
    const response = await axios.post(`${API_URL}/auth/register/deliveryPerson`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })

    return response.data;
} 

export const GetDeliveryPersonsByDeliveryOrgId = async () => {
    const response = await axios.get(`${API_URL}/delivery-persons/get/by-organization/${GetCurrentUser()?.id}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    return response.data.data;
}

export const DeleteDeliveryPerson = async (deliveryPersonId) => {
    await axios.delete(`${API_URL}/delivery-persons/${deliveryPersonId}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
}

export const EditDeliveryPerson = async (deliveryPersonId, data) => {
    await axios.patch(`${API_URL}/delivery-persons/${deliveryPersonId}`, data, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
        }
    })
}

export const GetDeliveryPersonById = async (deliveryPersonId) => {
    const response = await axios.get(`${API_URL}/delivery-persons/${deliveryPersonId}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    return response.data.data;
}