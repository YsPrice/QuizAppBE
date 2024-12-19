const prisma = require('./prisma');

const validateId = (id,name) =>{
const intId = parseInt(id);
if(isNaN(intId)){
    throw new Error(`Invalid ${name} ID provided`);
}
return intId;
}


const validateOwnership = async (context,quizIdInt) =>{
    const quiz = await prisma.quiz.findUnique({ where: { id: quizIdInt } });

    if (!quiz) {
      throw new Error('Quiz not found!');
    }
    if (!quiz || quiz.createdById !== context.userId) {
      throw new Error('Not authorized to edit this quiz!');
    }
  
    return { quiz };
}

const validateQuestionOwnership = async (context, questionId) => {
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw new Error('Question not found!');

  const quiz = await prisma.quiz.findUnique({ where: { id: question.quizId } });
  if (!quiz || quiz.createdById !== context.userId) {
    throw new Error('Not authorized to edit this quiz!');
  }

  return { question, quiz };
};
const validateOptionOwnership = async (context, optionId) => {
  console.log("Validating ownership for Option ID:", optionId);


  const option = await prisma.option.findUnique({ where: { id: optionId } });
  console.log("Option found:", option);

  if (!option) {
    console.error("Option not found!");
    throw new Error('Option not found!');
  }


  const question = await prisma.question.findUnique({
    where: { id: option.questionId },
  });
  console.log("Question found for Option:", question);

  if (!question) {
    console.error("Question not found!");
    throw new Error('Question not found!');
  }


  const quiz = await prisma.quiz.findUnique({
    where: { id: question.quizId },
  });
  console.log("Quiz found for Question:", quiz);

  if (!quiz) {
    console.error("Quiz not found!");
    throw new Error('Quiz not found!');
  }


  if (quiz.createdById !== context.userId) {
    console.error("User not authorized:", context.userId);
    throw new Error('Not authorized to edit this option!');
  }

  console.log("Validation successful for Option ID:", optionId);
  return { option, question, quiz };
};



module.exports = {
    validateId,
    validateOwnership,
    validateQuestionOwnership,
    validateOptionOwnership
  };