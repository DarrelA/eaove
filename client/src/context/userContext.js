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

    case 'NEW_IDEA_SUCCESS': {
      return { ...state, isLoading: false, ...action.payload };
    }

    case 'NEW_IDEA_FAIL': {
      return { ...state, isLoading: false, message: action.payload };
    }

    case 'GET_ALL_IDEAS_SUCCESS': {
      return { ...state, isLoading: false, ideas: action.payload };
    }

    case 'GET_ALL_IDEAS_FAIL': {
      return { ...state, isLoading: false, message: action.payload };
    }

    case 'VOTE_IDEA_SUCCESS': {
      return { ...state, isLoading: false };
    }

    case 'VOTE_IDEA_FAIL': {
      return { ...state, isLoading: false, message: action.payload };
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
      console.log(data);
      if (!response.ok) throw new Error(data.message);

      dispatch({
        type: 'FETCH_PASSPORT_USER_SUCCESS',
        payload: { _id, avatar, name, isAdmin },
      });

      addUserDataToLocalStorage(_id, avatar, name, isAdmin);
    } catch (e) {}
  }, []);

  const logout = async () => {
    dispatch({ type: 'IS_LOADING' });
    clearAlert();

    try {
      await fetch(`/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      dispatch({ type: 'LOGOUT_USER_SUCCESS' });
      localStorage.removeItem('userData');
    } catch (e) {
      console.log(e);
    }
  };

  const newIdea = async ({ title, description, tags }) => {
    dispatch({ type: 'IS_LOADING' });
    clearAlert();

    try {
      const response = await fetch(`/api/idea/newidea`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'NEW_IDEA_SUCCESS', payload: data });
    } catch (e) {
      dispatch({ type: 'NEW_IDEA_FAIL', payload: e });
    }
  };

  const getAllIdeas = useCallback(async () => {
    dispatch({ type: 'IS_LOADING' });
    clearAlert();

    try {
      const response = await fetch(`/api/idea/ideas`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'GET_ALL_IDEAS_SUCCESS', payload: data });
    } catch (e) {
      dispatch({ type: 'GET_ALL_IDEAS_FAIL', payload: e });
    }
  }, []);

  const voteIdea = async ({ ideaId, vote }) => {
    dispatch({ type: 'IS_LOADING' });
    clearAlert();

    try {
      const response = await fetch(`/api/idea/voteidea`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, vote }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'NEW_IDEA_SUCCESS', payload: data });
    } catch (e) {
      dispatch({ type: 'NEW_IDEA_FAIL', payload: e });
    }
  };

  return (
    <UserContext.Provider
      value={{
        ...userState,
        fetchPassportUserData,
        logout,
        newIdea,
        getAllIdeas,
        voteIdea,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };
