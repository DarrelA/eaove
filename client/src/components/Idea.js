import { useEffect, useState } from 'react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';
import { Card } from './';
import classes from './Card.module.css';

const initialState = {
  ideaId: '',
  vote: '',
};

const Idea = ({ idea }) => {
  const userContext = useUserContext();
  const { _id, isLoading, message, voteIdea } = userContext;
  const [formData, setFormData] = useState(initialState);

  const tag = idea.tags.map((tag, i) => (
    <span key={i} className={classes.tag}>
      {tag}
    </span>
  ));

  useEffect(() => {
    if (!!message && message !== 'success') toast.error(message);
  }, [message]);

  const voteHandler = (e) => {
    setFormData((formData.ideaId = idea._id));
    setFormData((formData.vote = e.target.id));
    if (!formData.vote) return;
    voteIdea(formData);
  };

  if (isLoading) return; // @TODO Add spinner

  return (
    <Card>
      <div className={classes.content}>
        <Link to={`/ideas/${idea._id}`}>
          <h3>{idea.title}</h3>
        </Link>
        <div className={classes.tags}>{tag}</div>
        <p>{idea.description}</p>
      </div>
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
