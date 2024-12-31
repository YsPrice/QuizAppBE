const bcrypt = require('bcrypt');
const prisma = require('../../utils/prisma');
const { generateToken } = require('../../utils/jwtHelper');
const { validateId } = require('../../utils/helperFunctions');

const userResolver = {
  Mutation: {
    signUp: async (_, { email, password, userName }) => {
        try {
          const userExists = await prisma.user.findUnique({ where: { email } });
          if (userExists) throw new Error("Email is already taken");
      
          const hashedPassword = await bcrypt.hash(password, 10);
      
          const user = await prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              userName,
            },
          });
      
          const { token, expiresAt } = generateToken({ userId: user.id });
          return { user, token, expiresAt };
        } catch (error) {
          console.error("Error in signUp resolver:", error);
          throw new Error(error.message || "An error occurred during sign-up.");
        }
      },
      
      logIn: async (_, { email, password }) => {
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) throw new Error("Invalid email or password");
      
          const validPassword = await bcrypt.compare(password, user.password);
          if (!validPassword) throw new Error("Invalid email or password");
      
          const { token, expiresAt } = generateToken({ userId: user.id });
          return { user, token, expiresAt };
        } catch (error) {
          console.error("Error in logIn resolver:", error);
          throw new Error(error.message || "An error occurred during login.");
        }
      },
      
   
    logOut: async (_, __, context) => {
      if (!context.userId) throw new Error("User not signed in");
      return { message: "Successfully logged out!" };
    },

    deleteUser: async (_, { id }, context) => {
      try {
        if (!context.userId) throw new Error("Authentication required");

        const userId = validateId(id, "user");
        if (context.userId !== userId) throw new Error("You can only delete your own account");

        return await prisma.user.delete({ where: { id: userId } });
      } catch (error) {
        console.error("Error in deleteUser resolver:", error);
        throw new Error(error.message || "An error occurred while deleting the account.");
      }
    },

    saveQuiz: async (_, { quizId }, context) => {
        if (!context.userId) throw new Error("Authentication required");
      
        const user = await prisma.user.findUnique({
          where: { id: context.userId },
          select: { savedQuizzes: true },
        });
      
        if (!user) throw new Error("User not found");
      
        const updatedQuizzes = [...new Set([...user.savedQuizzes.map((id) => parseInt(id,10)), parseInt(quizId,10)])];
      
        return await prisma.user.update({
          where: { id: context.userId },
          data: {
            savedQuizzes: {
              set: updatedQuizzes,
            },
          },
        });
      },
      

    completeQuiz: async (_, { quizId }, context) => {
        
      if (!context.userId) throw new Error("Authentication required");

      const user = await prisma.user.findUnique({ where: { id: context.userId }, select: { quizzesTaken: true } });
      if (!user) throw new Error("User not found");
      const parsedQuizId = parseInt(quizId, 10);
      if (isNaN(parsedQuizId)) {
        throw new Error("Invalid quiz ID provided");
      }
      return await prisma.user.update({
        where: { id: context.userId },
        data: { quizzesTaken: { set: [...(user.quizzesTaken || []), parsedQuizId] } },
      });
    },
    unsaveQuiz: async (_, { quizId }, context) => {
        if (!context.userId) throw new Error("Authentication required");
      
        const user = await prisma.user.findUnique({
          where: { id: context.userId },
          select: { savedQuizzes: true },
        });
      
        if (!user) throw new Error("User not found");
      
        const updatedQuizzes = user.savedQuizzes
          .map((id) => parseInt(id, 10))
          .filter((id) => id !== parseInt(quizId, 10));
      
        return await prisma.user.update({
          where: { id: context.userId },
          data: {
            savedQuizzes: {
              set: updatedQuizzes,
            },
          },
        });
      },
      
      
  },
  

  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },

    user: async (_, { id }) => {
      try {
        const userId = validateId(id, "user");
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        console.error("Error in user query:", error);
        throw new Error(error.message || "An error occurred while fetching the user.");
      }
    },

    getQuizzesTaken: async (_, __, context) => {
      try {
        if (!context.userId) throw new Error("Authentication required");

        const user = await prisma.user.findUnique({ where: { id: context.userId }, select: { quizzesTaken: true } });
        if (!user) throw new Error("User not found");

        const quizzesTaken = user.quizzesTaken || [];
        const quizzes = await prisma.quiz.findMany({
          where: { id: { in: quizzesTaken } },
          include: { createdBy: true },
        });

        return quizzes;
      } catch (error) {
        console.error("Error in getQuizzesTaken query:", error);
        throw new Error(error.message || "An error occurred while fetching quizzes taken.");
      }
    },
    getSavedQuizzes: async (_, __, context) => {
        if (!context.userId) throw new Error("Authentication Required!");
      
        const user = await prisma.user.findUnique({
          where: { id: context.userId },
          select: { savedQuizzes: true },
        });
      
        if (!user) throw new Error("User not found.");
        const quizzes = await prisma.quiz.findMany({
            where: {
              id: { in: user.savedQuizzes },
            },
          });
       
          return quizzes.filter((quiz) => quiz.id);
      },
      getCreatedQuizzes: async (_, { userId }) => {
        const id = parseInt(userId)
        return await prisma.quiz.findMany({
          where: {
            createdById: id,
          },
          include: {
            createdBy: true,
          },
        });
      },
      
  },
  
  
  
};


module.exports = userResolver;
