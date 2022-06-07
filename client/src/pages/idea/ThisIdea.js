import { useEffect, useState } from 'react';
import { RiReplyLine } from 'react-icons/ri';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Idea, Navbar } from '../../components';
import classes from '../../components/Card.module.css';
import useUserContext from '../../context/userContext';

const ThisIdea = () => {
  const userContext = useUserContext();
  const { isLoading, message, ideas, getAllComments, ideaComments } = userContext;
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

  useEffect(() => {
    if (ideaId) {
      const fetchAllComments = async () => await getAllComments(ideaId);
      fetchAllComments();
    }
  }, [getAllComments, ideaId]);

  if (isLoading) return; // @TODO Add spinner

  // @TODO Map out comments and replies recursively
  const commentCard =
    ideaComments &&
    ideaComments.map((ideaComment) => (
      <Card key={ideaComment._id}>
        {ideaComment.user.name}
        {ideaComment.comment}
        <div className={classes.actions}>
          <Link
            to={`/newcomment/${idea?._id}`}
            state={{ idea, thisIdeaComment: ideaComment }}
          >
            <button type="button" id="reply">
              <RiReplyLine size={'4rem'} className={classes.icon} />
            </button>
          </Link>
        </div>
      </Card>
    ));

  // @TODO Display a single card
  return (
    <>
      <Navbar />
      <div className="container center">
        {idea && <Idea key={idea._id} idea={idea} cardSize="big" />}
        {commentCard}
      </div>
    </>
  );
};

export default ThisIdea;
