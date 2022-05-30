import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Idea, Navbar } from '../../components';
import useUserContext from '../../context/userContext';

const ThisIdea = () => {
  const userContext = useUserContext();
  const { isLoading, message, ideas } = userContext;
  const [idea, getIdea] = useState(null);

  const { ideaId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (message === 'success') navigate('/'); // @TODO Rerender page without navigating away
    if (!!message && message !== 'success') toast.error(message);
  }, [message, navigate]);

  useEffect(() => {
    if (ideas) {
      const ideaIdx = ideas.findIndex((idea) => idea._id === ideaId);
      getIdea({ ...ideas[ideaIdx] });
    }
  }, [ideas, ideaId]);

  if (isLoading) return; // @TODO Add spinner

  // @TODO Display a single card
  return (
    <>
      <Navbar />
      <div className="container center">
        {idea && <Idea key={idea._id} idea={idea} />}
      </div>
    </>
  );
};

export default ThisIdea;
