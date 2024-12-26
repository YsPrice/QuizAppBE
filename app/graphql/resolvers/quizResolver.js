const prisma = require('../../utils/prisma');
const { validateId, validateOwnership } = require('../../utils/helperFunctions');

const quizResolvers = {
    Query:{
        quizzes: async (_, __, context) => {
            if (!context.userId) throw new Error("Not Authorized!");
        
            return await prisma.quiz.findMany({
                where: {
                    status: "PUBLISHED",
                    createdById: context.userId,
                },
            });
        },
        quiz: async (_ ,{ id })=>{
            const quizId= validateId(id, 'quiz'); 
            return await prisma.quiz.findUnique({where: {id: quizId}})
        },
        quizzesByStatus: async (_, { status }, context) => {
            if (!context.userId) throw new Error("Authentication Required!");
          
            return await prisma.quiz.findMany({
              where: { status },
            });
          },
    },
Mutation: {
    createQuiz: async (_, { title, difficulty, status = "DRAFT" }, context) => {
        if (!context.userId) throw new Error('Authentication Required!');
        if (status === "DRAFT" && !title) {
          title = "Untitled Draft";
        }
        if (status === "PUBLISHED" && (!title || !difficulty)) {
          throw new Error("Title and difficulty are required to publish a quiz!");
        }
      
        return await prisma.quiz.create({
          data: {
            title,
            difficulty: status === "DRAFT" ? null : difficulty,
            status,
            createdById: context.userId,
          },
        });
      },
      
    editQuiz: async (_, { id, title, difficulty,status }, context) => {
        if (!context.userId) throw new Error("Not Authorized!");
    
        const quiz = await prisma.quiz.findUnique({ where: { id } });
        if (!quiz) throw new Error("Quiz not found!");
        if (quiz.createdById !== context.userId) throw new Error("Not Authenticated!");
    
        if (quiz.status === "PUBLISHED" && (!title || !difficulty)) {
            throw new Error("Published quizzes must have a title and difficulty!");
        }
    
        const updatedData = {};
        if (title !== undefined) updatedData.title = title;
        if (difficulty !== undefined) updatedData.difficulty = difficulty;
       
    
        return await prisma.quiz.update({
            where: { id },
            data: updatedData,
            status:quiz.status
            
        });
    },
    
    deleteQuiz: async (_,{id},context)=>{
        if(!context.userId) throw new Error('Not Authorized to edit this quiz');
        const quizId= validateId(id, 'quiz'); 
        await validateOwnership(context, quizId);
        
    await prisma.quiz.delete({where:{id:quizId}});
    return { message: "Quiz deleted successfully" };

    },
  
    
},
Quiz: {
    createdBy: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.createdById },
      });
    }},
};

module.exports = quizResolvers