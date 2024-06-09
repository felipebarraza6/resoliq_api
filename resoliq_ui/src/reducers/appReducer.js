export const appReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuth: true,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "UPDATE":
      return {
        ...state,
        isAuth: true,
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user")),
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuth: false,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};
