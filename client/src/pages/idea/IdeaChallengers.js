import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Navbar } from '../../components';
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
    completedIdeaChallenge,
  } = userContext;
  const [accepted, setAccepted] = useState(false);
  const [completed, setCompleted] = useState(false);

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

    const completedByUser = challengeIdea?.challengersCompleted.findIndex(
      (challenger) => String(challenger) === String(_id)
    );

    challengedByUser !== -1 ? setAccepted(true) : setAccepted(false);
    completedByUser !== -1 ? setCompleted(true) : setCompleted(false);
  }, [_id, challengeIdea?.challengers, challengeIdea?.challengersCompleted]);

  if (isLoading) return; // @TODO Add spinner

  return (
    <>
      <Navbar />

      <div className={`container center`}>
        {_id && ideaId && !completed && (
          <button
            id="challengeIdea"
            onClick={() => acceptIdeaChallenge(ideaId)}
            className={`btn btn--full`}
          >
            {accepted ? 'ACCEPTED' : 'CHALLENGE!'}
          </button>
        )}

        {/* @TODO: Evidence validation - post youtube video link in comment*/}
        {_id && ideaId && accepted && (
          <button
            id="completedIdea"
            onClick={() => completedIdeaChallenge(ideaId)}
            className={`btn btn--full`}
          >
            {completed ? 'COMPLETED' : 'IN PROGRESS'}
          </button>
        )}

        {challengeIdea?.challengers.map((challenger) => (
          <Card key={challenger._id} size="long">
            {challenger._id}
            <h3>{challenger.name}</h3>
          </Card>
        ))}
      </div>
    </>
  );
};

export default IdeaChallengers;
