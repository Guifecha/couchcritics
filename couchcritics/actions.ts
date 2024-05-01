"use server"

import PocketBase from 'pocketbase';
import {sessionOptions, SessionData} from "@/lib"
import { getIronSession } from "iron-session";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";


export const getSession = async () => {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if(!session.isLoggedIn){
        session.isLoggedIn = false;
    }
    return session;
}

export const getSessionData = async () => {
    const session = await getSession();
    return {
        isLoggedIn: session.isLoggedIn,
        userId: session.userId,
        username: session.username,
    };
}


export const login = async (prevState:{error:undefined | string}, formData:FormData) => {
    const session = await getSession();
    
    const formUsername = formData.get("username") as string;
    const formPassword = formData.get("password") as string;

    const pb = new PocketBase('http://127.0.0.1:8090');
    const user = await pb.collection('users').getList(1, 1, {
        filter: pb.filter("username = {:username} && password = {:password}", { username: formUsername, password: formPassword }),
    });
    console.log(user);
    if(user.items.length === 0){
        console.log("Wrong username or password");
        return {error:"Wrong username or password"};
    }

    session.userId = user.items[0].id;
    session.username = user.items[0].username;
    session.isLoggedIn = true;
    
    await session.save();
    console.log(session);
    redirect("/");
}

export const logout = async () => {
    const session = await getSession();
    session.destroy();
    console.log(session);
    redirect("/");
}