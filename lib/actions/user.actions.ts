"use server"

import { connectToDatabase } from "@/database/mongoose";

export const getAllUsersForNewsEmail = async () => {
    try {
        const mongoose = await connectToDatabase();
        const db= mongoose.connection.db;
        if(!db) throw new Error('Database connection not established')
        
        // Get all users first to debug
        const allUsers = await db.collection('user').find({}).limit(10).toArray();
        console.log('All users from "user" collection:', allUsers.length, JSON.stringify(allUsers, null, 2));
        
        const users = await db.collection('user').find({email: {$exists: true,$ne:null}},
        {projection:{email:1,name:1,_id:1,id:1,country:1}}).toArray();
        
        console.log('Filtered users:', users.length);
        
        const result = users.filter((user) => user.email&&user.name).map((user) => ({
            id:user.id|| user._id.toString(),
            email: user.email,
            name: user.name,
        }));
        
        console.log('Final result:', result.length, JSON.stringify(result, null, 2));
        return result;
    } catch (error) {
        console.error('Error fetching users for news email:', error);
        return [];
    }
}