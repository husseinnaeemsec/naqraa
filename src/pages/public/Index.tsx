import { Outlet } from "react-router-dom";
import Features from "../../components/landing/Features";
import HeroSection from "../../components/landing/HeroSection";
import TopNavigation from "../../components/landing/TopNavigation";

export default function LandingPage(){
    return (
        <div>
            <TopNavigation />
            <Outlet />
        </div>
    )
}


export function Home(){
    return (
        <>
            <HeroSection />
            <Features />
        </>
    )
}