
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
        const mockQuestion = { id: 2, quizId: mockQuiz.id, content: 'What is 2+2?' };
        prismaMock.quiz.findUnique.mockResolvedValue(mockQuiz); 
       
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
        })});

        describe('Edit a Question', ()=> {
            test('Authenticated User can Edit a Question', async ()=>{
            const mockQuiz = { id: 1, title: 'Math Quiz', difficulty: 'EASY', createdById: 1 };
            const mockQuestion = { id: 1, quizId: mockQuiz.id, content: 'What is 2+2?' };
            const updatedQuestion ={ id: 1, quizId: mockQuiz.id, content: 'What is 5 + 5?' };
            
            // prismaMock.quiz.findUnique.mockResolvedValue(mockQuiz); 
           
            prismaMock.question.findUnique.mockResolvedValue(mockQuestion);
            prismaMock.question.update.mockResolvedValue(updatedQuestion);
            const res = await questionResolver.Mutation.editQuestion(
                {},
                { id: mockQuestion.id, content: 'What is 5 + 5?'},
                mockAuthenticatedContext(1)
            );
            expect(res).toEqual(updatedQuestion)
            expect(prismaMock.question.findUnique).toHaveBeenCalledWith({
                where: { id: mockQuestion.id },
            });
            expect(prismaMock.question.update).toHaveBeenCalledWith({
                where: { id: mockQuestion.id },
                data: {
                    content: 'What is 5 + 5?',
                },
            });
        }) 
        });

        describe('Delete Question', ()=>{
            test('Deleting Question as an Authorized User', async ()=>{
                const mockQuiz = { id: 1, title: 'Math Quiz', difficulty: 'EASY', createdById: 1 };

                const mockQuestion = { id: 1, quizId: mockQuiz.id, content: 'What is 2+2?' };
                
                prismaMock.question.findUnique.mockResolvedValue(mockQuestion);
                prismaMock.question.delete.mockResolvedValue(null);

                const res = await questionResolver.Mutation.deleteQuestion(
                    {},
                    {id:mockQuestion.id},
                    mockAuthenticatedContext(1)
                );
                expect(prismaMock.question.findUnique).toHaveBeenLastCalledWith({where:{id:mockQuestion.id}})
                expect(prismaMock.question.delete).toHaveBeenLastCalledWith({where:{id:mockQuestion.id}})
                expect(res).toEqual({message:"Question deleted successfully"})
            })
        })

   
    })
})
