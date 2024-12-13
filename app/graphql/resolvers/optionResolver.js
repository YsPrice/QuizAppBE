const prisma = require('../../utils/prisma');

optionResolver = {
    Query:{
        options: async (_,{questionId})=>{
            return await prisma.option.findMany({where:{questionId:parseInt(questionId)}});
        }
    },
    Mutation:{
        createOption: async (_,{questionId, isCorrect,content},context)=>{
            if(!context.userId) throw new Error('Authentication Required');
            const question = prisma.question.findUnique({where:{id:parseInt(questionId)}});

            if(!question) throw new Error('Question not found!');
            const quiz = prisma.quiz.findUnique({
                where:{id: question.quizId},
            });
            if(!quiz || quiz.createdById !== context.userId) throw new Error('Not authorized to edit this quiz!');

            return prisma.option.create({
                data:{
                    content,
                    isCorrect,
                    questionId: parseInt(questionId)
                },
            })
        }
    }
}