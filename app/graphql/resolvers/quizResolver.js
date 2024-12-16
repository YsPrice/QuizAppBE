const prisma = require('../../utils/prisma');
const { validateId, validateOwnership } = require('../../utils/helperFunctions');

const quizResolvers = {
    Query:{
        quizzes: async () =>{
            return await prisma.quiz.findMany()
        },
        quiz: async (_ ,{ id })=>{
            const quizId= validateId(id, 'quiz'); 
            return await prisma.quiz.findUnique({where: {id: quizId}})
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
    editQuiz: async(_,{id,title,difficulty}, context) =>{
        if(!context.userId) throw new Error('Not Authorized to edit this quiz');
        const quizId= validateId(id, 'quiz'); 
        await validateOwnership(context, quizId);
       
        const updatedData = {};
        if (title !== undefined) updatedData.title = title;
        if (difficulty !== undefined) updatedData.difficulty = difficulty;
  
        if (Object.keys(updatedData).length === 0) {
          throw new Error('No fields provided to update');
        }
        return await prisma.quiz.update({
            where:{id:quizId},
            data:updatedData
        })

    },
    deleteQuiz: async (_,{id},context)=>{
        if(!context.userId) throw new Error('Not Authorized to edit this quiz');
        const quizId= validateId(id, 'quiz'); 
        await validateOwnership(context, quizId);
        
        return await prisma.quiz.delete({where:{id:quizId}});

    }
    
},

};

module.exports = quizResolvers