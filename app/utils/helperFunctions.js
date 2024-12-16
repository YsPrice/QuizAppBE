const prisma = require('./prisma');

const validateId = (id,name) =>{
const intId = parseInt(id);
if(isNaN(intId)){
    throw new Error(`Invalid ${name} ID provided`);
}
return intId;
}


const validateOwnership = async (context,questionIdInt) =>{
    const question = await prisma.question.findUnique({ where: { id: questionIdInt } });
    if (!question) throw new Error('Question not found!');
  
    const quiz = await prisma.quiz.findUnique({ where: { id: question.quizId } });
    if (!quiz || quiz.createdById !== context.userId) {
      throw new Error('Not authorized to edit this quiz!');
    }
  
    return { question, quiz };
}

module.exports = {
    validateId,
    validateOwnership,
  };