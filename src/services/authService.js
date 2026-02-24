const {prisma} = require('../config/prisma.js')
const bcrypt = require('bcrypt')

class AuthService{
    registerUser = async (email,password)=>{
        const exisiting = await prisma.user.findUnique({
        where : {email}
        }) 

        if(exisiting){
                const error = new Error("Email already registered");
                error.statusCode = 409 //Conflict
                throw error
            }

            const passwordHash = await bcrypt.hash(password,12);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            isVerified: false,
        },
        select: {
            id: true,
            email: true,
            isVerified: true,
            createdAt: true,
        },
    })

    return user

}

}

module.exports={
    AuthService
}