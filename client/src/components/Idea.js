import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';
import { Card } from './';
import classes from './Card.module.css';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';

const initialState = {
  ideaId: '',
  vote: '',
};

const Idea = ({ idea }) => {
  const userContext = useUserContext();
  const { _id, isLoading, message, voteIdea } = userContext;
  const [formData, setFormData] = useState(initialState);

  const tag = idea.tags.map((tag, i) => <span key={i}>{tag}</span>);

  useEffect(() => {
    if (!!message && message !== 'success') toast.error(message);
  }, [message]);

  const voteHandler = (e) => {
    console.log(e.target.id);
    setFormData((formData.ideaId = idea._id));
    setFormData((formData.vote = e.target.id));
    if (!formData.vote) return;
    voteIdea(formData);
  };

  if (isLoading) return; // @TODO Add spinner

  return (
    <Card>
      <h2>{idea.title}</h2>
      <div className={classes.tag}>{tag}</div>
      <p>{idea.description}</p>
      {_id && (
        <div className={classes.actions}>
          <button type="button" id="upvote" onClick={voteHandler}>
            <GoTriangleUp
              size={'4rem'}
              className={idea.upvotes?.length === 1 ? classes.icons : ''}
            />
          </button>
          <button type="button" id="downvote" onClick={voteHandler}>
            <GoTriangleDown
              size={'4rem'}
              className={idea.downvotes?.length === 1 ? classes.icons : ''}
            />
          </button>
        </div>
      )}
    </Card>
  );
};

export default Idea;
