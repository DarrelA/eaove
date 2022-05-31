import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Navbar } from '../../components';
import classes from '../../components/Card.module.css';
import useUserContext from '../../context/userContext';

const IdeaChallengers = () => {
  const userContext = useUserContext();
  const {
    _id,
    isLoading,
    message,
    getIdeaChallengers,
    challengeIdea,
    acceptIdeaChallenge,
  } = userContext;
  const [accepted, setAccepted] = useState(false);

  const { ideaId } = useParams();

  useEffect(() => {
    if (!!message && message !== 'success') toast.error(message);
  }, [message]);

  useEffect(() => {
    const IdeaChallengers = async () => await getIdeaChallengers(ideaId);
    IdeaChallengers();
  }, [getIdeaChallengers, ideaId]);

  useEffect(() => {
    const challengedByUser = challengeIdea?.challengers.findIndex(
      (challenger) => String(challenger._id) === String(_id)
    );
    challengedByUser === 1 ? setAccepted(true) : setAccepted(false);
  }, [_id, challengeIdea?.challengers]);

  const challengeHandler = () => acceptIdeaChallenge(ideaId);

  if (isLoading) return; // @TODO Add spinner
  console.log();

  return (
    <>
      <Navbar />

      {ideaId && (
        <button
          id="challengeIdea"
          onClick={challengeHandler}
          className={`btn btn--full ${classes.challengeIdea}`}
        >
          {accepted ? 'ACCEPTED' : 'CHALLENGE!'}
        </button>
      )}

      <div className={`container ${classes.grid}`}>
        {challengeIdea?.challengers.map((challenger) => (
          <Card key={challenger._id}>
            {challenger._id}
            <h3>{challenger.name}</h3>
          </Card>
        ))}
      </div>
    </>
  );
};

export default IdeaChallengers;
