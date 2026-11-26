import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import {supabase} from '../../supabase';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [session,setSession]=useState(null),[authEvent,setAuthEvent]=useState('INITIAL_SESSION'),[loading,setLoading]=useState(true);
 useEffect(()=>{let active=true;supabase.auth.getSession().then(({data,error})=>{if(!active)return;if(error)console.error(error);setSession(data?.session??null);setLoading(false);});const {data:{subscription}}=supabase.auth.onAuthStateChange((event,next)=>{setAuthEvent(event);setSession(next??null);setLoading(false);});return()=>{active=false;subscription.unsubscribe();};},[]);
 const value=useMemo(()=>({session,user:session?.user??null,authEvent,loading,signIn:({email,password})=>supabase.auth.signInWithPassword({email,password}),signUp:({email,password,displayName})=>supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin,data:{display_name:displayName}}}),signOut:()=>supabase.auth.signOut()}),[session,authEvent,loading]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw Error('useAuth must be inside AuthProvider');return value;}
