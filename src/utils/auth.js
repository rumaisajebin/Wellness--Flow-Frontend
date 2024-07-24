export const isTokenValid = (token) => {
    if (!token) return false;
  
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return false;
  
    let payload;
    try {
      payload = JSON.parse(atob(tokenParts[1]));
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return false;
    }
  
    const { exp } = payload;
  
    if (Date.now() >= exp * 1000) {
      return false;
    }
  
    return true;
  };
  
  export const getUserIdFromToken = (token) => {
    if (!token) return null;
  
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return null;
  
    let payload;
    try {
      payload = JSON.parse(atob(tokenParts[1]));
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  
    return payload.user_id || null; // Adjust according to your token payload structure
  };
  
  export const getUserIdFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      return user.id; // Adjust according to your user data structure
    } else {
      const token = JSON.parse(localStorage.getItem("access"));
      if (token && isTokenValid(token)) {
        return getUserIdFromToken(token);
      }
    }
    return null;
  };
  