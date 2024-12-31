const prisma = require('../../utils/prisma');
const {validateId, validateQuestionOwnership} = require('../../utils/helperFunctions');

const questionResolver = {
Mutation:{
    createQuestion: async (_,{quizId, content}, context) =>{
        if(!context.userId) throw new Error("Authentication Required!");
        const validQuizId = validateId(quizId, "quiz");
        const quiz = await prisma.quiz.findUnique({where:{id: validQuizId} });
      
        if(!quiz) throw new Error('Quiz not found!')
            if (quiz.createdById !== context.userId) throw new Error("Not authorized to add questions to this quiz!");

         const question = await prisma.question.create({
            data:{
              content,
              quizId: validQuizId
            },
            include: {
              quiz: true, 
              options: true,
            },
            
        })
        console.log("Created Question:", question);
        return question
    },

    deleteQuestion: async (_, { id }, context) => {
      if (!context.userId) throw new Error("Not authorized!");
      const parsedId = parseInt(id, 10); 
      console.log("Parsed ID:", parsedId); 
      if (isNaN(parsedId)) throw new Error("Invalid question ID!");
    
      const question = await prisma.question.findUnique({
        where: { id: parsedId },
      });
    
      if (!question) throw new Error("Question not found!");
    
      await validateQuestionOwnership(context, question.quizId);
    
      const quesDel = await prisma.question.delete({
        where: { id: parsedId },
      });
      console.log("deletedquestion:", quesDel)
      return { message: "Question deleted successfully" };
    },
    
    editQuestion: async (_, { id, content }) => {
      try {
        const parsedId = parseInt(id, 10); 
        console.log("ID Received:", id);
        const question = await prisma.question.findUnique({ where: { id:parsedId } });
        if (!question) {
          throw new Error(`Question with ID ${id} not found!`);
        }
    
        return await prisma.question.update({
          where: { id:parsedId },
          data: { content },
        });
      } catch (error) {
        console.error("Error in editQuestion Resolver:", error);
        throw new Error(error.message || "Failed to edit question.");
      }
    },
    
}

};

module.exports = questionResolver