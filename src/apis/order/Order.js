import axios from "axios";
import { API_URL } from "../../constants/keys";
import { GetCurrentUser } from "../auth/Auth";

export const GetOrdersByDeliveryOrg = async () => {
    const response = await axios.get(`${API_URL}/orders/get/by-delivery-org/${GetCurrentUser().id}`,{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })

    return response.data.data;
}

export const GetPrescriptionOrdersByDeliveryOrg = async () => {
    const response = await axios.get(`${API_URL}/prescription-orders/get/by-org-id/${GetCurrentUser().id}`,{
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })

    return response.data.data;
}

export const GetOrderById = async (id) => {
    const response = await axios.get(`${API_URL}/orders/${id}`)

    return response.data.data;
}

export const GetPrOrderById = async (id) => {
    const response = await axios.get(`${API_URL}/prescription-orders/${id}`)

    return response.data.data;
}