const mockAuthenticatedContext = (userId = 1) => ({
    userId, 
  });
  
  const mockUnauthenticatedContext = (userId = null || 30875649) => ({
    userId
  });
  
  module.exports = { mockAuthenticatedContext, mockUnauthenticatedContext };
  