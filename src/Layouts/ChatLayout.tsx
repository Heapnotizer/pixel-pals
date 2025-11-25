import { useEffect } from "react";
import { Outlet, useLoaderData, useActionData } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { SocketMessage } from "@/utils/types";
import { useAppDispatch, useAppSelector } from "@/rtk/hooks";
import { setSocketMsg } from "@/rtk/slices/socketMsgSlice";
import { socket } from "@/lib/socket";
import ChatSheet from "@/components/ChatSheet";
import { GiHamburgerMenu } from "react-icons/gi";
import '../styles/chatlayout.css'
import { setCloseSheets } from "@/rtk/slices/closeSheets";


export default function ChatLayout() {
    const data: any = useLoaderData()
    const error: any = useActionData()
    const dispatch = useAppDispatch()
    const closeSheets: boolean = useAppSelector((state) => state.closeSheets)
    const userId: string | null = useAppSelector((state) => state.auth.userId) // null never comes since loader already makes sure user is authenticated

    useEffect(() => {
        // Only register once when component mounts
        socket.emit('register-user', userId);
    }, [userId]);

    useEffect(() => {

        const handleMessage = (data: SocketMessage) => {
            dispatch(setSocketMsg(data));
        };

        const elem: (Element | null) = document.querySelector('.data');
        if (elem) {
            elem.scrollTop = elem.scrollHeight;
        }

        socket.on('receive-message', handleMessage);

        return () => {
            socket.off('receive-message', handleMessage);
        };
    }, [dispatch]);

    return (
        <div className="flex h-screen border-b-2">
            <Sheet open={closeSheets} onOpenChange={(open) => dispatch(setCloseSheets(open))}>
                <SheetTrigger className='flex lg:hidden absolute left-3 top-6'>
                    <GiHamburgerMenu color='#1a1a1a' size={30} />
                </SheetTrigger>
                <SheetContent side='left' className="bg-secondary w-screen">
                    <ChatSheet error={error} data={data} />
                </SheetContent>
            </Sheet>

            <ChatSheet error={error} data={data} className='hidden' />

            <Outlet />
        </div>
    )
}
