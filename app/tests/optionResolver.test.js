jest.mock('@prisma/client', () => {
    return {
      PrismaClient: jest.fn(() => require('../utils/jest/prismaMock')),
    };
  });
  
  const optionResolver = require('../graphql/resolvers/optionResolver');
  const prismaMock = require('../utils/jest/prismaMock');
  const { mockAuthenticatedContext, mockUnauthenticatedContext } = require('./mockContext');
  
  describe('Option Resolvers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('Query: options', () => {
      test('Retrieve options for a question', async () => {
        const mockOptions = [
          { id: 1, content: 'Option A', isCorrect: true },
          { id: 2, content: 'Option B', isCorrect: false },
        ];
        prismaMock.option.findMany.mockResolvedValue(mockOptions);
  
        const res = await optionResolver.Query.options({}, { questionId: 1 });
  
        expect(prismaMock.option.findMany).toHaveBeenCalledWith({
          where: { questionId: 1 },
        });
        expect(res).toEqual(mockOptions);
      });
    });
  
    describe('Mutation: createOption', () => {
      test('Authenticated user can create an option', async () => {
        const mockQuestion = { id: 1, quizId: 2 };
        const mockQuiz = { id: 2, createdById: 1 };
        const mockOption = {
          id: 1,
          content: 'New Option',
          isCorrect: false,
          questionId: 1,
        };
  
        prismaMock.question.findUnique
          .mockResolvedValueOnce(mockQuestion) // Fetch question
          .mockResolvedValueOnce(mockQuiz); // Fetch quiz
        prismaMock.quiz.findUnique.mockResolvedValue(mockQuiz);
        prismaMock.option.create.mockResolvedValue(mockOption);
  
        const res = await optionResolver.Mutation.createOption(
          {},
          { questionId: 1, content: 'New Option', isCorrect: false },
          mockAuthenticatedContext(1)
        );
  
        expect(prismaMock.option.create).toHaveBeenCalledWith({
          data: {
            content: 'New Option',
            isCorrect: false,
            questionId: 1,
          },
          include: { question: true },
        });
        expect(res).toEqual(mockOption);
      });
  
      test('Unauthenticated user cannot create an option', async () => {
        await expect(
          optionResolver.Mutation.createOption(
            {},
            { questionId: 1, content: 'New Option', isCorrect: false },
            mockUnauthenticatedContext()
          )
        ).rejects.toThrow('Not Authenticated');
      });
    });
  
    describe('Mutation: editOption', () => {
      test('Authenticated user can edit an option', async () => {
        const mockOption = { id: 1, content: 'Option A', isCorrect: false };
        const updatedOption = { id: 1, content: 'Updated Option', isCorrect: true };
  
        prismaMock.option.findUnique.mockResolvedValue(mockOption);
        prismaMock.option.update.mockResolvedValue(updatedOption);
  
        const res = await optionResolver.Mutation.editOption(
          {},
          { questionId: 1, optionId: 1, content: 'Updated Option', isCorrect: true },
          mockAuthenticatedContext(1)
        );
  
        expect(prismaMock.option.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(prismaMock.option.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            content: 'Updated Option',
            isCorrect: true,
          },
        });
        expect(res).toEqual(updatedOption);
      });
  
      test('Unauthenticated user cannot edit an option', async () => {
        await expect(
          optionResolver.Mutation.editOption(
            {},
            { questionId: 1, optionId: 1, content: 'Updated Option' },
            mockUnauthenticatedContext()
          )
        ).rejects.toThrow('Authentication Required');
      });
    });
  
    describe('Mutation: deleteOption', () => {
      test('Authenticated user can delete an option', async () => {
        const mockOption = { id: 1, content: 'Option A', isCorrect: false,questionId:1 };
  
        prismaMock.option.findUnique.mockResolvedValue({
            id: 1,
            content: 'Option A',
            isCorrect: false,
            questionId: 1, // Mock the related questionId
          });
        prismaMock.option.delete.mockResolvedValue(null);
  
        const res = await optionResolver.Mutation.deleteOption(
          {},
          { questionId: 1, optionId: 1 },
          mockAuthenticatedContext(1)
        );
  
        expect(prismaMock.option.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(prismaMock.option.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(res).toEqual({ message: 'Option deleted successfully' });
      });
  
      test('Unauthenticated user cannot delete an option', async () => {
        await expect(
          optionResolver.Mutation.deleteOption(
            {},
            { questionId: 1, optionId: 1 },
            mockUnauthenticatedContext()
          )
        ).rejects.toThrow('Authentication Required');
      });
    });
  });
  