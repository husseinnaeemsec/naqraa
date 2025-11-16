import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Features from "../../components/landing/Features";
import HeroSection from "../../components/landing/HeroSection";
import TopNavigation from "../../components/landing/TopNavigation";
import Footer from "./Footer";

export default function LandingPage(){
    return (
        <>
            <TopNavigation />
            <Outlet />
            <Footer />
        </>
    )
}


export function Home(){
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            <HeroSection />
            <Features />
        </div>
    )
}