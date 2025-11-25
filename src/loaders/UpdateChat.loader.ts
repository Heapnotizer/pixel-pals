import { getChat } from "@/lib/api";
import { requireAuth } from "@/lib/requireAuth";
import { socket } from "@/lib/socket";
import { setKey } from "@/rtk/slices/keySlice";
import { store } from "@/rtk/store";
import { ChatDetailsResponse } from "@/utils/types";
import { defer } from "react-router-dom";

export async function loader({ params, request }: { params: any, request: Request }) {
    await requireAuth(request)
    const token: (string | null) = store.getState().auth.accessToken
    const userID: (string | null) = store.getState().auth.userId
  
    if (!token || !userID) return { data: [] }
  
    const url: URL = new URL(request.url);
  
    const type: string | null = url.searchParams.get('type');
  
    if (type === null || (type !== 'individual' && type !== 'group'))
      throw {
        message: "Invalid chat type. Please go back and try again",
        statusText: "Bad Request",
        status: 400
      }
    
    // Get the AES key of the sender and store in the store
    socket.on('encryptionKey', (encryptionKey: string) => {
  
      if (encryptionKey === '') {
        // If the encryption key is empty, throw an error
        throw new Error('Failed to retrieve encryption key');
      }
  
      store.dispatch(setKey(encryptionKey));
    })
  
    const data: (Promise<ChatDetailsResponse>) = getChat(params.id, token)
    return defer({ data })
  }