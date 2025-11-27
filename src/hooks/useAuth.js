import {useState, useEffect} from 'react';
import {supabase} from '../services/supabaseClient';

export const useAuth=()=>{
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        //this will check active sessions and set the user
        const session=supabase.auth.getSession().then(({data:{session}})=>{
            setUser(session?.user??null);
            setLoading(false);
        });
        //this will listen for auth changes (login,logout,etc)
        const {data:authListener}=supabase.auth.onAuthStateChange((event,session)=>{
            setUser(session?.user??null);
            setLoading(false);
        });

        return()=>{
            authListener.subscription.unsubscribe();
        };
    },[])
    return {user,loading};
}
