require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // const newUser = await prisma.user.create({
    //     data:{
    //         email: 'john.doe@example.com',
    //         userName: 'John Doe',
    //     }
    // })
    // console.log('New User:', newUser);
    const users = await prisma.user.findMany();
    console.log('All Users:', users);
    
}


main().catch((e)=>{
    console.error(e);
    return
}).finally(async ()=>{
    await prisma.$disconnect();
});