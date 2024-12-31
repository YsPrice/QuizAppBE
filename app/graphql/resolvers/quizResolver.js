const prisma = require('../../utils/prisma');
const { validateId, validateOwnership } = require('../../utils/helperFunctions');

const quizResolvers = {
  Query: {
    quizzes: async (_, __, context) => {
      return await prisma.quiz.findMany({
        where: {
          status: {
            not: "DRAFT", 
          },
        },
        include: {
          createdBy: true, 
        },
      });
    },
    
    quiz: async (_, { id }, context) => {
      const quizId = validateId(id, 'quiz');
      
      // Fetch the quiz from the database
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });
    
  
      if (!quiz) {
        throw new Error("Quiz not found.");
      }
    
      
      if (quiz.status === "DRAFT" && (!context.userId || quiz.createdById !== context.userId)) {
        throw new Error("This quiz is a draft and cannot be viewed.");
      }
    
      return quiz;
    },
  
    quizzesByStatus: async (_, { status }, context) => {
        if (!context.userId) throw new Error("Authentication Required!");
        const validStatuses = ["DRAFT", "PUBLISHED"];
        if (!validStatuses.includes(status)) throw new Error("Invalid Status Provided.");
        return await prisma.quiz.findMany({
            where: { status },
        });
    },
},

Mutation: {
    createQuiz: async (_, { title, difficulty, status = "DRAFT" }, context) => {
      console.log("Context User ID:", context.userId); 
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
        const quizId = parseInt(id, 10)
        if (isNaN(quizId)) {
          throw new Error("Invalid Quiz ID. It must be a number.");
        };
        const quiz = await prisma.quiz.findUnique({ where: { id:quizId } });
        if (!quiz) throw new Error("Quiz not found!");
        if (quiz.createdById !== context.userId) throw new Error("Not Authenticated!");
    
        if (quiz.status === "PUBLISHED" && (!title || !difficulty)) {
            throw new Error("Published quizzes must have a title and difficulty!");
        }
    
        const updatedData = {};
        if (title !== undefined) updatedData.title = title;
        if (difficulty !== undefined) updatedData.difficulty = difficulty;
        if (status !== undefined) updatedData.status = status;
    
        return await prisma.quiz.update({
            where: { id:quizId },
            data: updatedData,
       
            
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