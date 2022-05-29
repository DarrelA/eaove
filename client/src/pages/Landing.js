import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';
import { Navbar, Idea } from '../components';
import classes from './Landing.module.css';

const Landing = () => {
  const userContext = useUserContext();
  const { isLoading, message, getAllIdeas, ideas } = userContext;

  useEffect(() => {
    if (message === 'success') window.location.reload(); // @TODO Fix rerender for deep compare
    if (!!message && message !== 'success') toast.error(message);
  }, [message]);

  useEffect(() => {
    const fetchAllIdeas = async () => await getAllIdeas();
    fetchAllIdeas();
  }, [getAllIdeas]);

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
