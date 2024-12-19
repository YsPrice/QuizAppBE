const bcrypt = require('bcrypt');
const prisma = require('../../utils/prisma');
const {generateToken} = require('../../utils/jwtHelper');
const { validateId } = require('../../utils/helperFunctions');

userResolver = {
    Mutation: {
    signUp: async (_,{email, password, userName}) => {
        const userExists = await prisma.user.findUnique({where:{email}});
        if(userExists) throw new Error('email is already taken');

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.user.create({data:{
            email,
            password:hashedPassword,
            userName
        }});

        const token = generateToken({userId:user.id});
        return{ user, token}
    },

    logIn: async (_,{email,password})=>{

        const user = await prisma.user.findUnique({where:{email}});
        if (!user) throw new Error('invalid email or password');
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword) throw new Error('invalid email or password');
        const token = generateToken({ userId: user.id });
        return {user, token};
    },

logOut: async (_,__,context) =>{
    if(!context.userId) throw new Error('user not signed in')
        return { message: 'Successfully logged out!' }
},
    deleteUser: async (_,{id},context) =>{
        if(!context.userId) throw new Error('Authentication is required');
const userId = validateId(id,'user')
        if(context.userId !== userId) throw new Error('not authorized to delete this account');
        return await prisma.user.delete({
            where: {id: userId}
        })
    }}
    ,
    Query: {
        users: async () => {
          return await prisma.user.findMany();
        },
        user: async (_, { id }) => {
          const userId = validateId(id, 'user');
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (!user) throw new Error('User not found.');
          return user;
        },
      },

}
module.exports = userResolver;