
jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn(() => require('../utils/jest/prismaMock')),
    };
  });
const questionResolver = require('../graphql/resolvers/questionResolver');
const prismaMock = require('../utils/jest/prismaMock');
const { mockAuthenticatedContext, mockUnauthenticatedContext } = require('./mockContext');

describe('Question Resolvers', ()=> {
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    describe('Create Question', () =>{
        test( 'Authenticated User can create a question', async()=> {
        const mockQuiz = { id: 1, title: 'Math Quiz', difficulty: 'EASY', createdById: 1 };
       
        prismaMock.quiz.findUnique.mockResolvedValue(mockQuiz); 
        const mockQuestion = {quizId:mockQuiz.id,content:'What is 2+2?'};
        prismaMock.question.create.mockResolvedValue(mockQuestion);

        const res = await questionResolver.Mutation.createQuestion(
            {},
            {quizId:mockQuiz.id, content:'What is 2+2?'},
            mockAuthenticatedContext(1)
        );
        expect(res).toEqual(mockQuestion)
        expect(prismaMock.quiz.findUnique).toHaveBeenCalledWith({ where: { id: mockQuiz.id } });
        expect(prismaMock.question.create).toHaveBeenCalledWith({
            data:{
                content:'What is 2+2?',
                quizId:mockQuiz.id
            },
            include: {
                quiz: true, 
            },
        })})
    })
})
