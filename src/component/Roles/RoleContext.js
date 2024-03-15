// RoleContext.js
import React, { createContext, useContext, useReducer } from 'react';

const RoleContext = createContext();

const initialState = {
  roles: [
    { id: 1, name: 'admin', permissions: ['create', 'read', 'update', 'delete'] },
    { id: 2, name: 'user', permissions: ['read'] },
  ],
  userRole: 'guest',
};

const roleReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, userRole: action.payload };
    case 'ADD_ROLE':
      return { ...state, roles: [...state.roles, action.payload] };
    case 'UPDATE_ROLE':
      return {
        ...state,
        roles: state.roles.map((role) =>
          role.id === action.payload.id ? { ...role, ...action.payload.updatedRole } : role
        ),
      };
    case 'DELETE_ROLE':
      return { ...state, roles: state.roles.filter((role) => role.id !== action.payload.id) };
    default:
      return state;
  }
};

export const RoleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roleReducer, initialState);

  return (
    <RoleContext.Provider value={{ state, dispatch }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
