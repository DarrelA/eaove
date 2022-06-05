import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import useUserContext from './context/userContext';
import {
  IdeaChallengers,
  IdeaComments,
  Landing,
  NewOrUpdateIdea,
  NotFound,
  RegisterLogin,
  SharedLayout,
  ThisIdea,
} from './pages/index.js';

const App = () => {
  const { fetchPassportUserData } = useUserContext();

  useEffect(() => {
    fetchPassportUserData();
  }, [fetchPassportUserData]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:tag" element={<Landing />} />
      <Route path="/login" element={<RegisterLogin />} />
      <Route path="/dashboard" element={<SharedLayout />} />
      <Route path="/ideas/:ideaId" element={<ThisIdea />} />
      <Route path="/idea/:mode/:ideaId" element={<NewOrUpdateIdea />} />
      <Route path="/acceptideachallenge/:ideaId" element={<IdeaChallengers />} />
      <Route path="/newcomment/:ideaId" element={<IdeaComments />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
