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
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'GET_ALL_IDEAS_SUCCESS': {
      return { ...state, isLoading: false, ideas: action.payload };
    }

    case 'GET_ALL_IDEAS_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'GET_IDEAS_BY_TAG_SUCCESS': {
      return { ...state, isLoading: false, ideas: action.payload };
    }

    case 'GET_IDEAS_BY_TAG_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'GET_IDEA_CHALLENGERS_SUCCESS': {
      return { ...state, isLoading: false, challengeIdea: action.payload };
    }

    case 'GET_IDEA_CHALLENGERS_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'VOTE_IDEA_SUCCESS': {
      return { ...state, isLoading: false };
    }

    case 'VOTE_IDEA_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'ACCEPT_CHALLENGE_IDEA_SUCCESS': {
      return { ...state, isLoading: false };
    }

    case 'ACCEPT_CHALLENGE_IDEA_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'COMPLETED_CHALLENGE_IDEA_SUCCESS': {
      return { ...state, isLoading: false };
    }

    case 'COMPLETED_CHALLENGE_IDEA_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'UPDATE_IDEA_SUCCESS': {
      return { ...state, isLoading: false, ...action.payload };
    }

    case 'UPDATE_IDEA_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'DELETE_IDEA_SUCCESS': {
      return { ...state, isLoading: false, ...action.payload };
    }

    case 'DELETE_IDEA_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
    }

    case 'NEW_COMMENT_SUCCESS': {
      return { ...state, isLoading: false, ...action.payload };
    }

    case 'NEW_COMMENT_FAIL': {
      return { ...state, isLoading: false, message: action.payload.message };
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
      if (data.message === 'User not found.') dispatch({ type: 'LOGOUT_USER_SUCCESS' });
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

    try {
      await fetch(`/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      dispatch({ type: 'LOGOUT_USER_SUCCESS' });
      localStorage.removeItem('userData');
      clearAlert();
    } catch (e) {
      console.log(e);
      clearAlert();
    }
  };

  const newIdea = async ({
    title,
    description,
    tags,
    bounty,
    currency,
    fundsTransferPlatform,
  }) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/newidea`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          tags,
          bounty,
          currency,
          fundsTransferPlatform,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'NEW_IDEA_SUCCESS', payload: data });
      clearAlert();
    } catch (e) {
      dispatch({ type: 'NEW_IDEA_FAIL', payload: e });
      clearAlert();
    }
  };

  const getAllIdeas = useCallback(async () => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/ideas`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'GET_ALL_IDEAS_SUCCESS', payload: data });

      // @TODO: Store ideas in localStorage
      clearAlert();
    } catch (e) {
      dispatch({ type: 'GET_ALL_IDEAS_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const getIdeasByTags = useCallback(async (tag) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/ideas/${tag}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'GET_IDEAS_BY_TAG_SUCCESS', payload: data });

      // @TODO: Store ideas in localStorage
      clearAlert();
    } catch (e) {
      dispatch({ type: 'GET_IDEAS_BY_TAG_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const getIdeaChallengers = useCallback(async (ideaId) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/${ideaId}/challengers`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'GET_IDEA_CHALLENGERS_SUCCESS', payload: data });

      clearAlert();
    } catch (e) {
      dispatch({ type: 'GET_IDEA_CHALLENGERS_FAIL', payload: e });
      clearAlert();
    }
  }, []);

  const voteIdea = async ({ ideaId, vote }) => {
    dispatch({ type: 'IS_LOADING' });

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
      clearAlert();
    } catch (e) {
      dispatch({ type: 'NEW_IDEA_FAIL', payload: e });
      clearAlert();
    }
  };

  const acceptIdeaChallenge = async (ideaId) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/acceptideachallenge/${ideaId}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      getIdeaChallengers(ideaId); // @TODO Better method? And fix flickering?
      dispatch({ type: 'ACCEPT_CHALLENGE_IDEA_SUCCESS', payload: data });
      clearAlert();
    } catch (e) {
      dispatch({ type: 'ACCEPT_CHALLENGE_IDEA_FAIL', payload: e });
      clearAlert();
    }
  };

  const completedIdeaChallenge = async (ideaId) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/completedideachallenge/${ideaId}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      getIdeaChallengers(ideaId); // @TODO Better method? And fix flickering?
      dispatch({ type: 'COMPLETED_CHALLENGE_IDEA_SUCCESS', payload: data });
      clearAlert();
    } catch (e) {
      dispatch({ type: 'COMPLETED_CHALLENGE_IDEA_FAIL', payload: e });
      clearAlert();
    }
  };

  const updateIdea = async ({ title, description, tags, ideaId }) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/updateidea`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags, ideaId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'UPDATE_IDEA_SUCCESS', payload: data });
      clearAlert();
    } catch (e) {
      dispatch({ type: 'UPDATE_IDEA_FAIL', payload: e });
      clearAlert();
    }
  };

  const deleteIdea = async (ideaId) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/idea/deleteidea/${ideaId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'DELETE_IDEA_SUCCESS', payload: data });
      clearAlert();
    } catch (e) {
      dispatch({ type: 'DELETE_IDEA_FAIL', payload: e });
      clearAlert();
    }
  };

  const newComment = async ({ ideaId, comment }) => {
    dispatch({ type: 'IS_LOADING' });

    try {
      const response = await fetch(`/api/comments/newcomment`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, comment }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      dispatch({ type: 'NEW_COMMENT_SUCCESS', payload: data });
      clearAlert();
    } catch (e) {
      dispatch({ type: 'NEW_COMMENT_FAIL', payload: e });
      clearAlert();
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
        getIdeasByTags,
        getIdeaChallengers,
        voteIdea,
        acceptIdeaChallenge,
        completedIdeaChallenge,
        updateIdea,
        deleteIdea,
        newComment,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);
export { useUserContext as default, UserProvider };
