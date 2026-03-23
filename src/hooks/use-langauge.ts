import { useEffect, useState } from "react"
import { useAppSelector } from "../store";

export const useLangaugeHook = ()=>{
    const [langauge,setLangauge] = useState<'en'|'ar'|'ku'>('en');
    const [loading,setLoading] = useState(false)
    const {user,isAuthenticated} = useAppSelector(state=>state.auth);
    useEffect(()=>{
        setLoading(true)
        if(isAuthenticated && user?.profile?.lang){
            setLangauge(user.profile.lang)
        }else{
            setLangauge( ( localStorage.getItem('lang') as 'ar'|'en'|'ku' )  || 'ar' )
        }
        setLoading(false)
    },[isAuthenticated,user?.profile?.lang])


    return { loading,langauge }
}