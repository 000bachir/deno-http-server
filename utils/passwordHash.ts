import * as bcrypt from "jsr:@felix/bcrypt";

export async function hashingPassword(userPassword : string){
    try{
        const hashed = await bcrypt.hash(userPassword)
        return hashed
    }catch(error){
        console.error("Error hashing password:", error);
        throw error;
    }
}

export async function verifyPassword(userPassword: string , hashedPassword:string){
    try{
        return await bcrypt.verify(userPassword , hashedPassword)
    }catch(error){
        console.error("Error verifying password:", error);
        return false;
    }
}


