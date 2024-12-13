const prisma = require('../../utils/prisma');

const questionResolvers = {
Mutation:{
    createQuestion: async (_,{quizId, content}, context) =>{
        if(!context.userId) throw new Error("Authentication Required!");
        const quiz = await prisma.quiz.findUnique({where:{id: parseInt(quizId)} });
  
        if(!quiz) throw new Error('Quiz not found!')
            if (quiz.createdById !== context.userId) throw new Error("Not authorized to add questions to this quiz!");

        return await prisma.question.create({
            data:{
              content,
              quizId: parseInt(quizId)
            }
        })

    }
}

};

module.exports = questionResolvers