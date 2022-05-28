import { useEffect } from 'react';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';
import { Navbar } from '../components';
import classes from './Landing.module.css';

const Landing = () => {
  const userContext = useUserContext();
  const { isLoading, message, getAllIdeas, ideas } = userContext;

  useEffect(() => {
    if (!!message) toast.error(message);
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
        <h2>{ideas?.map((idea) => idea.title)}</h2>
      </div>
    </>
  );
};

export default Landing;
