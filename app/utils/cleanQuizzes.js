const prisma = require('./utils/prisma'); 

const cleanSavedQuizzes = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { savedQuizzes: true },
    });

    if (!user) throw new Error("User not found");

    const cleanedQuizzes = [...new Set(user.savedQuizzes.map((id) => String(id)))];

    await prisma.user.update({
      where: { id: userId },
      data: { savedQuizzes: { set: cleanedQuizzes } },
    });

    console.log("Cleaned savedQuizzes for user:", userId);
  } catch (error) {
    console.error(`Error cleaning savedQuizzes for user ${userId}:`, error.message);
  }
};


const userId = 5;
cleanSavedQuizzes(userId)
  .then(() => console.log("Cleanup completed"))
  .catch((error) => console.error("Cleanup failed:", error.message))
  .finally(() => process.exit());
