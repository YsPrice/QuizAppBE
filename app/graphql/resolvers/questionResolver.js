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
            },
            
        })
        console.log("Created Question:", question);
        return question
    },

    deleteQuestion: async (_,{id},context) =>{
        if(!context.userId) throw new Error("Not authorized!");
        const questionId = validateId(id,'question');
        const question = await prisma.question.findUnique({where:{id:questionId}})

        if(!question) throw new Error("Question not found!");

      await validateQuestionOwnership(context,question.quizId);
 await prisma.question.delete({where:{id: questionId}})

    return { message: "Question deleted successfully" };
    },
    editQuestion: async (_,{id, content},context) =>{
        if(!context.userId) throw new Error("Not authorized!");
        const questionId = validateId(id,'question');
        const question = await prisma.question.findUnique({where:{id:questionId}})

        if(!question) throw new Error("Question not found!");

      await validateQuestionOwnership(context,question.quizId);
      const updatedData = {};
      if (content !== undefined && content.trim() !== "") {
        updatedData.content = content;
      }
      
      if (Object.keys(updatedData).length === 0) {
        throw new Error("No fields provided to update");
      }
      return await prisma.question.update({where:{id: questionId},
        data:updatedData
    });
    }
}

};

module.exports = questionResolver