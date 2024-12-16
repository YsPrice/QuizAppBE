const prisma = require('../../utils/prisma');
const { validateId, validateOwnership } = require('../../utils/helperFunctions');

const optionResolver = {
  Query: {
    options: async (_, { questionId }) => {
      const questionIdInt = validateId(questionId, 'question'); 
      return await prisma.option.findMany({ where: { questionId: questionIdInt } });
    },
  },
  Mutation: {
    createOption: async (_, { questionId, isCorrect, content }, context) => {
      if (!context.userId) throw new Error('Not Authenticated');

      const questionIdInt = validateId(questionId, 'question'); 

      await validateOwnership(context, questionIdInt);

      
      return await prisma.option.create({
        data: {
          content,
          isCorrect,
          questionId: questionIdInt,
        },
      });
    },
    deleteOption: async (_, { questionId, optionId }, context) => {
      if (!context.userId) throw new Error('Authentication Required');

      const questionIdInt = validateId(questionId, 'question'); 
      const optionIdInt = validateId(optionId, 'option');

     
      await validateOwnership(context, questionIdInt);


      const option = await prisma.option.findUnique({ where: { id: optionIdInt } });
      if (!option) throw new Error('Option doesn’t exist!');

  
      return await prisma.option.delete({ where: { id: optionIdInt } });
    },
    editOption: async (_, { questionId, optionId, isCorrect, content }, context) => {
      if (!context.userId) throw new Error('Authentication Required');

      const questionIdInt = validateId(questionId, 'question'); 
      const optionIdInt = validateId(optionId, 'option'); 

     
      await validateOwnership(context, questionIdInt);

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
