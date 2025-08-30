import folder from '../assets/folder.svg';
import exam from '../assets/test.svg';
import support from '../assets/customer-support.svg';
import board from '../assets/math.svg';
import chat from '../assets/live-chat.svg';
import community from '../assets/group-chat.svg';
import gear from '../assets/cog.svg';
import notifications from '../assets/notification.svg';
import videoStack from '../assets/playlist.svg';
import building from '../assets/office.svg';
import expand from '../assets/four-arrows.svg';
import dashboard from '../assets/data-management.svg';
import menu from '../assets/menu.svg';
import elearn from '../assets/e-learning.svg';


export enum IconImg {
    File = "file",
    Board = "board",
    Building = "building",
    Chat = "chat",
    Videos = "video-stack",
    Exam = "exam",
    Community = "community",
    Gear = "gear",
    Support = "support",
    Notifications = "notifications",
    Expand = 'expand',
    Dashboard = 'dashboard',
    Menu  = 'menu',
    Elearn = 'elearn'
}

interface IconProps {
    icon: IconImg;
    className?: string;
}

function getIcon(icon: IconImg) {
    switch (icon) {
        case IconImg.File:
            return folder;
        case IconImg.Board:
            return board;
        case IconImg.Building:
            return building;
        case IconImg.Chat:
            return chat;
        case IconImg.Videos:
            return videoStack;
        case IconImg.Exam:
            return exam;
        case IconImg.Community:
            return community;
        case IconImg.Gear:
            return gear;
        case IconImg.Support:
            return support;
        case IconImg.Notifications:
            return notifications;
        case IconImg.Expand:
            return expand;
        case IconImg.Dashboard:
            return dashboard;
        case IconImg.Menu:
            return menu;
        case IconImg.Elearn:
            return elearn;
        default:
            return folder; // fallback icon
    }
}

export default function Icon({ icon, className }: IconProps) {
    return (
        <img
            src={getIcon(icon)}
            className={`${className || 'size-5'}`}
            alt={icon}
        />
    );
}
