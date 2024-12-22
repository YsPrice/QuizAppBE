
jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn(() => require('../utils/jest/prismaMock')),
    };
  });
const quizResolver = require('../graphql/resolvers/quizResolver');
const prismaMock = require('../utils/jest/prismaMock');
const { mockAuthenticatedContext, mockUnauthenticatedContext } = require('./mockContext');


describe('Quiz Resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });
// __________
  describe('createQuiz', () => {
    test('Authenticated user can create a quiz', async () => {
      const mockQuiz = { id: 1, title: 'Math Quiz', difficulty: 'EASY', createdById: 1 };
      prismaMock.quiz.create.mockResolvedValue(mockQuiz); 

      const result = await quizResolver.Mutation.createQuiz(
        {},
        { title: 'Math Quiz', difficulty: 'EASY' },
        mockAuthenticatedContext(1)
      );

      expect(result).toEqual(mockQuiz); 
      expect(prismaMock.quiz.create).toHaveBeenCalledWith({
        data: {
          title: 'Math Quiz',
          difficulty: 'EASY',
          createdById: 1,
        },
      });
    });

    test('Unauthenticated user cannot create a quiz', async () => {
        await expect(
          quizResolver.Mutation.createQuiz({}, { title: 'History Quiz', difficulty: 'HARD'}, {})
        ).rejects.toThrow('Authentication Required!');
        expect(prismaMock.quiz.create).not.toHaveBeenCalled();
      });

      // __________
  });

  describe('Edit Quiz', () => {
    test('Authenticated User can edit a quiz', async () => {
      const mockQuiz = { id: 1, title: 'Math Quiz', difficulty: 'EASY', createdById: 1 };
  

      prismaMock.quiz.findUnique.mockResolvedValue(mockQuiz); 
      prismaMock.quiz.update.mockResolvedValue({
        id: 1,
        title: 'Science Quiz',
        difficulty: 'HARD',
        createdById: 1,
      }); 
  
   
      const res = await quizResolver.Mutation.editQuiz(
        {},
        { id: 1, title: 'Science Quiz', difficulty: 'HARD' },
        { userId: 1 } 
      );
  
      
      expect(prismaMock.quiz.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prismaMock.quiz.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Science Quiz', difficulty: 'HARD' },
      });
      expect(res).toEqual(
        expect.objectContaining({
        id: 1,
        title: 'Science Quiz',
        difficulty: 'HARD',
        createdById: 1,
      })
    ); 
    });
  
    test('Unauthenticated User cannot edit a quiz', async () => {
      await expect(
        quizResolver.Mutation.editQuiz(
          {},
          { id: 1, title: 'Science Quiz', difficulty: 'HARD' },
          { userId: null } 
        )
      ).rejects.toThrow('Not Authorized to edit this quiz');
    });
  
    test('Error when editing a quiz that does not exist', async () => {
      prismaMock.quiz.findUnique.mockResolvedValue(null); 
      await expect(
        quizResolver.Mutation.editQuiz(
          {},
          { id: 1, title: 'Science Quiz', difficulty: 'HARD' },
          { userId: 1 }
        )
      ).rejects.toThrow('Quiz not found!');
    });
  });
  
  describe('Delete Quiz',()=>{
    test('Deleting a Quiz as an Authorized User', async()=>{
        const mockQuiz = { id: 1, title: 'Math Quiz', difficulty: 'EASY', createdById: 1 };
        prismaMock.quiz.findUnique.mockResolvedValue(mockQuiz);
        prismaMock.quiz.delete.mockResolvedValue(null); 
    
        const res = await quizResolver.Mutation.deleteQuiz(
            {},
            {id: mockQuiz.id},
            mockAuthenticatedContext(1)
        );

        expect(prismaMock.quiz.findUnique).toHaveBeenCalledWith({where:{id:mockQuiz.id}});
        expect(prismaMock.quiz.delete).toHaveBeenCalledWith({where:{id:mockQuiz.id}});
        expect(res).toEqual({ message: "Quiz deleted successfully" });
    });

   
    test('Unauthorized User cannot delete a Quiz', async () => {
        await expect(
            quizResolver.Mutation.deleteQuiz({}, { id: 1 }, mockUnauthenticatedContext())
        ).rejects.toThrow('Not authorized to edit this quiz!');
    });

  })


});
