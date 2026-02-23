'use server'

import { headers } from "next/headers";
import { auth } from "../better-auth/auth"
import { inngest } from "../inngest/client";

export const signUp = async ({email,password,fullName,country,investmentGoals,riskTolerance,preferredIndustry}: SignUpFormData) => {
    try {
        const authInstance = await auth;
        const response = await authInstance.api.signUpEmail({
            body:{email,password,name:fullName}
        })
        if(response){
            await inngest.send({
                name:'app/user.created',
                data:{
                    email,
                    fullName,
                    country,
                    investmentGoal: investmentGoals,
                    riskTolerance,
                    preferredIndustries: preferredIndustry,
                }
            })
            return { success: true, message: "Account created successfully" }
        }
    } catch (e) {
        console.log("Error in signUp action:", e)
        return { success: false, message: "An error occurred during sign-up. Please try again." }
    }}
export const signIn = async ({email,password}: SignInFormData) => {
    try {
        const authInstance = await auth;
        const response = await authInstance.api.signInEmail({
            body:{email,password}
        })
       
            return { success: true, message: response }
    } catch (e) {
        console.log("Error in signIn action:", e)
        return { success: false, message: "An error occurred during sign-in. Please try again." }
    }
}

export const signOut = async () => {
    try {
        const authInstance = await auth;
        await authInstance.api.signOut({headers: await headers()})
        return { success: true, message: "Signed out successfully" }
    } catch (e) {
        console.log("Error in signOut action:", e)
        return { success: false, message: "An error occurred during sign-out. Please try again." }
    }
}