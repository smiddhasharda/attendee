const initialState = {
    email: '',
    password: '',
    rememberMe: false, 
  };

  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'RememberMe':
        return {
          ...state,
          rememberMe: action.payload, 
        };
        case 'SET_REMEMBERED_CREDENTIALS':
          return {
            ...state,
            email: action.payload.email,
            password: action.payload.password,
          };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  