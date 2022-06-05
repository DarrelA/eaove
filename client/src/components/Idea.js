import { useEffect, useState } from 'react';
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiBoxingFill,
  RiDeleteBin5Line,
  RiExchangeDollarLine,
  RiPencilFill,
  RiChatNewLine,
} from 'react-icons/ri';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useUserContext from '../context/userContext';
import { Card } from './';
import classes from './Card.module.css';

const initialState = {
  ideaId: '',
  vote: '',
};

const Idea = ({ idea, cardSize }) => {
  const userContext = useUserContext();
  const { _id, isLoading, message, voteIdea, deleteIdea } = userContext;
  const [formData, setFormData] = useState(initialState);

  const { ideaId } = useParams();

  const date = new Date(idea.bounty.timeLimit).toString();
  const tag =
    idea.tags[0] !== '' && // Prevent empty span when there is no tag
    idea.tags.map((tag, i) => (
      <Link to={`/${tag}`} key={i} className={classes.tag}>
        <span>{tag}</span>
      </Link>
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
    <Card size={cardSize}>
      <div className={classes.content}>
        <Link to={`/ideas/${idea._id}`}>
          <h3>{idea.title}</h3>
        </Link>
        {!!idea.bounty.value && <h4>{date}</h4>}
        <div className={classes.tags}>{tag}</div>
        <p>{idea.description}</p>
      </div>

      {/* @TODO Redirect to signup page instead of hiding action buttons */}

      {_id && (
        <>
          <p>{'Donate via: ' + idea.bounty.fundsTransferPlatform}</p>
          <div className={classes.actions}>
            {ideaId && _id === idea.creator._id && (
              <>
                <Link to={`/idea/edit/${idea._id}`} state={{ idea }}>
                  <RiPencilFill size={'4rem'} className={classes.icon} />
                </Link>

                <button type="button" onClick={() => deleteIdea(ideaId)}>
                  <RiDeleteBin5Line size={'4rem'} className={classes.icon} />
                </button>
              </>
            )}

            {!!idea.bounty.value && (
              <Link to={`/`}>
                <button type="button" id="bounty">
                  <h4>{idea.bounty.currency + ' ' + idea.bounty.value}</h4>
                  <RiExchangeDollarLine size={'4rem'} className={classes.icon} />
                </button>
              </Link>
            )}

            <Link to={`/acceptideachallenge/${idea._id}`}>
              <button type="button" id="challengerscount">
                <h4>{idea.challengersCount}</h4>
                <RiBoxingFill size={'4rem'} className={classes.icon} />
              </button>
            </Link>

            <Link to={`/newcomment/${idea._id}`} state={{ idea }}>
              <button type="button" id="newcomment">
                <h4>{idea.commentsCount}</h4>
                <RiChatNewLine size={'4rem'} className={classes.icon} />
              </button>
            </Link>

            <button type="button" id="downvote" onClick={voteHandler}>
              <h4>{idea.downvotesCount}</h4>
              <RiArrowDownSFill
                size={'4rem'}
                className={
                  idea.downvotes?.length === 1
                    ? `${classes.icon} ${classes.vote}`
                    : classes.icon
                }
              />
            </button>

            <button type="button" id="upvote" onClick={voteHandler}>
              <h4>{idea.upvotesCount}</h4>
              <RiArrowUpSFill
                size={'4rem'}
                className={
                  idea.upvotes?.length === 1
                    ? `${classes.icon} ${classes.vote}`
                    : classes.icon
                }
              />
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

export default Idea;
