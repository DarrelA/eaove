import React, { useCallback, useContext, useReducer } from 'react';

const UserContext = React.createContext();
const { _id, avatar, name } = JSON.parse(localStorage.getItem('userData')) || {};

const initialState = {
  isLoading: false,
  _id: _id || '',
  avatar: avatar || '',
  name: name || '',
  isAdmin: false,
  message: '',
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_MESSAGE': {
      return { ...state, message: '' };
    }

    case 'IS_LOADING': {
      return { ...state, isLoading: true };
    }

    case 'FETCH_PASSPORT_USER_SUCCESS': {
      const { _id, avatar, name, isAdmin } = action.payload;
      return { ...state, _id, avatar, name, isAdmin };
    }

    case 'LOGOUT_USER_SUCCESS': {
      return {
        ...state,
        isLoading: false,
        _id: '',
        avatar: '',
        name: '',
        isAdmin: false,
        message: '',
      };
    }

    default:
      return initialState;
  }
};

const UserProvider = ({ children }) => {
  const [userState, dispatch] = useReducer(userReducer, initialState);

  const clearAlert = () => setTimeout(() => dispatch({ type: 'CLEAR_MESSAGE' }, 500));

  const addUserDataToLocalStorage = async (_id, avatar, name) => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const updatedUserData = {
      _id: _id || userData._id,
      avatar: avatar || userData.avatar,
      name: name || userData.name,
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const fetchPassportUserData = useCallback(async () => {
    try {
      const response = await fetch(`/api/auth/passport_user`, {
        credentials: 'include',
      });

      const data = await response.json();
      const { _id, avatar, name, isAdmin } = data;
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'FETCH_PASSPORT_USER_SUCCESS',
        payload: { _id, avatar, name, isAdmin },
      });

      addUserDataToLocalStorage(_id, avatar, name, isAdmin);
      clearAlert();
    } catch (e) {}
  }, []);

  const logout = async () => {
    dispatch({ type: 'IS_LOADING' });
    try {
      await fetch(`/api/auth/logout`, {
        method: 'POST',
        headers: { credentials: 'include' },
      });

      dispatch({ type: 'LOGOUT_USER_SUCCESS' });
      localStorage.removeItem('userData');
      clearAlert();
    } catch (e) {
      console.log(e);
      clearAlert();
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        fetchPassportUserData,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };
