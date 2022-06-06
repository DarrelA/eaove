import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Idea, Navbar } from '../../components';
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

  const commentCard =
    ideaComments &&
    ideaComments.map((ideaComment) => (
      <Card key={ideaComment._id}>
        {ideaComment.user.name}
        {ideaComment.comment}
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
