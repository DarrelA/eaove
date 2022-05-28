import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navbar } from '../../components';
import useUserContext from '../../context/userContext';

const initialState = {
  title: '',
  description: '',
  tags: '',
};

const NewIdea = () => {
  const userContext = useUserContext();
  const { isLoading, message, newIdea } = userContext;
  const [formData, setFormData] = useState(initialState);

  const navigate = useNavigate();

  useEffect(() => {
    if (message === 'success') navigate('/');
    else if (!!message) toast.error(message);
  }, [message, navigate]);

  const inputHandler = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });

  const submitHandler = (e) => {
    e.preventDefault();
    newIdea(formData);
  };

  if (isLoading) return; // @TODO Add spinner

  return (
    <>
      <Navbar />
      <section className="container center" id="cta">
        <form className="form" onSubmit={submitHandler}>
          <h2>New Idea</h2>

          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Million dollars super original idea!"
              required
              onChange={inputHandler}
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              placeholder="It is something that no one on Earth have thought about! I am so smart!"
              onChange={inputHandler}
            />
          </div>

          <div>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              name="tags"
              id="tags"
              placeholder="onewordtag,comma,thirdtag"
              onChange={inputHandler}
            />
          </div>

          <button className="btn btn--form">Submit</button>
        </form>
      </section>
    </>
  );
};

export default NewIdea;
