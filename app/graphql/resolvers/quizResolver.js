const prisma = require('../../utils/prisma');
const quizResolvers = {
    Query:{
        quizzes: async () =>{
            return await prisma.quiz.findMany()
        },
        quiz: async (_ ,{ id })=>{
            return await prisma.quiz.findUnique({where: {id: parseInt(id)}})
        },
    },
Mutation: {
    createQuiz: async (_, {title, difficulty}, context) => {
        if(!context.userId) throw new error('Authentication Required!');

        return await prisma.quiz.create({
            data:{
                title,
                difficulty,
                createdById:context.userId
            },

        });
    },
},

};

module.exports = quizResolvers