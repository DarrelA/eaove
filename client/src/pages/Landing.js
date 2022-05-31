import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Idea, Navbar } from '../components';
import useUserContext from '../context/userContext';
import classes from './Landing.module.css';

const Landing = () => {
  const userContext = useUserContext();
  const { isLoading, message, ideas, getAllIdeas, getIdeasByTags } = userContext;

  const { tag } = useParams();

  useEffect(() => {
    if (message === 'success') window.location.reload(); // @TODO Fix rerender for deep compare
    if (!!message && message !== 'success') toast.error(message);
  }, [message]);

  useEffect(() => {
    const fetchAllIdeas = async () => await getAllIdeas();
    const fetchIdeasByTags = async () => await getIdeasByTags(tag);
    !!tag ? fetchIdeasByTags() : fetchAllIdeas();
  }, [getAllIdeas, getIdeasByTags, tag]);

  if (isLoading) return; // @TODO Add spinner

  return (
    <>
      <Navbar />
      <div className={`container ${classes.grid}`}>
        {ideas?.map((idea) => (
          <Idea key={idea._id} idea={idea} />
        ))}
      </div>
    </>
  );
};

export default Landing;
