import { Outlet } from "react-router-dom";
import Chat from "../../components/Chat";
import ChatSidebar from "./ChatSidebar";

// Chat Page Component
const ChatPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950">
            <div className="grid h-full lg:grid-cols-[320px_1fr] border border-emerald-200 dark:border-emerald-800 rounded-lg overflow-hidden bg-white dark:bg-emerald-950 shadow-lg">
                <ChatSidebar />
                <div className="border-l border-emerald-200 dark:border-emerald-800">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;