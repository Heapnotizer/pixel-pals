import { defer } from "react-router-dom"
import { store } from "@/rtk/store";
import {  getChats, getContacts } from "@/lib/api";
import { requireAuth } from "@/lib/requireAuth";

export async function loader({ request }: { request: Request }) {
    console.log("chatlayout loader..");

    await requireAuth(request)
    const userId: (string | null) = store.getState().auth.userId
    const token: (string | null) = store.getState().auth.accessToken

    if (userId === null || token === null) {
        throw {
            message: "Invalid Session. Please login again",
            statusText: "Unauthorized",
            status: 401
        }
    }

    const data = getChats(token)
    const contacts = getContacts(token)

    return defer({ data: data, contacts: contacts })

}