import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navbar } from '../../components';
import useUserContext from '../../context/userContext';

const NewOrUpdateIdea = () => {
  const userContext = useUserContext();
  const { isLoading, message, newComment } = userContext;

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const location = useLocation();
  const { idea } = location.state || {};

  const navigate = useNavigate();
  const { ideaId } = useParams();

  useEffect(() => {
    if (message === 'success') navigate('/');
    if (!!message && message !== 'success') toast.error(message);
  }, [message, navigate]);

  useEffect(() => {
    if (idea) setTitle(idea.title);
  }, [idea, ideaId]);

  const submitHandler = (e) => {
    e.preventDefault();
    comment.trim();

    if (comment.length > 1500)
      return toast.error('Please keep it within 1,500 characters.');

    newComment({ ideaId, comment });
  };

  if (isLoading) return; // @TODO Add spinner

  return (
    <>
      <Navbar />
      <section className="container center" id="cta">
        <form className="form" onSubmit={submitHandler}>
          <h2>{title}</h2>

          <div>
            <label htmlFor="comment">Comment</label>
            <input
              type="text"
              name="comment"
              id="comment"
              value={comment}
              placeholder="Free speech!"
              required
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button className="btn btn--form">Submit</button>
        </form>
      </section>
    </>
  );
};

export default NewOrUpdateIdea;
