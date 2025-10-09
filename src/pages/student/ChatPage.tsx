import { Outlet } from "react-router-dom";
import Chat from "../../components/Chat";
import ChatSidebar from "./ChatSidebar";

// Chat Page Component
const ChatPage = () => {
    return (
        <div className="grid h-full  lg:grid-cols-[320px_1fr]">
            <ChatSidebar />
            <Outlet />
        </div>
    );
};

export default ChatPage;