const prisma = require('../../utils/prisma');
const { validateId, validateOptionOwnership } = require('../../utils/helperFunctions');

const optionResolver = {
  Query: {
    options: async (_, { questionId }) => {
      const questionIdInt = validateId(questionId, 'question'); 
      return await prisma.option.findMany({ where: { questionId: questionIdInt } });
    },
  },
  Option:{
question: async (parent,_) =>{
  return await prisma.question.findUnique({
    where: {id: parent.questionId},
  })
}
  },
  Mutation: {
    createOption: async (_, { questionId, isCorrect, content }, context) => {
      if (!context.userId) throw new Error('Not Authenticated');

      const questionIdInt = validateId(questionId, 'question'); 
      const question = await prisma.question.findUnique({ where: { id: questionIdInt } });
      if (!question) throw new Error('Question not found!');
      const quiz = await prisma.quiz.findUnique({ where: { id: question.quizId } });
      if (!quiz) throw new Error('Quiz not found!');
      if (quiz.createdById !== context.userId) throw new Error('Not Authenticated');
      return await prisma.option.create({
        data: {
          content,
          isCorrect,
          questionId: questionIdInt,
        },
        include: {
          question: true, 
        },

      });
    },
    deleteOption: async (_, { questionId, optionId }, context) => {
      if (!context.userId) throw new Error('Authentication Required');
    
      const questionIdInt = validateId(questionId, 'question');
      const optionIdInt = validateId(optionId, 'option');
    
      await validateOptionOwnership(context, optionIdInt);
    
      await prisma.option.delete({ where: { id: optionIdInt } });
    
      return { message: "Option deleted successfully" };
    },
    
    editOption: async (_, { questionId, optionId, isCorrect, content }, context) => {
      if (!context.userId) throw new Error('Authentication Required');

      const questionIdInt = validateId(questionId, 'question'); 
      const optionIdInt = validateId(optionId, 'option'); 

     
      await validateOptionOwnership(context, optionIdInt);

      const option = await prisma.option.findUnique({ where: { id: optionIdInt } });
      if (!option) throw new Error("Option doesn't exist!");


      const updatedData = {};
      if (content !== undefined) updatedData.content = content;
      if (isCorrect !== undefined) updatedData.isCorrect = isCorrect;

      if (Object.keys(updatedData).length === 0) {
        throw new Error('No fields provided to update');
      }

      return await prisma.option.update({
        where: { id: optionIdInt },
        data: updatedData,
      });
    },
  },
};

module.exports = optionResolver;
