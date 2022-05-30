import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Navbar } from '../../components';
import useUserContext from '../../context/userContext';

const NewOrUpdateIdea = () => {
  const userContext = useUserContext();
  const { isLoading, message, newIdea, updateIdea } = userContext;
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const location = useLocation();
  const { idea } = location.state || {};

  const navigate = useNavigate();
  const { mode, ideaId } = useParams();

  useEffect(() => {
    mode === 'edit' ? setEditMode(true) : setEditMode(false);
    if (message === 'success') navigate('/');
    else if (!!message) toast.error(message);
  }, [mode, message, navigate]);

  useEffect(() => {
    if (editMode && idea) {
      setTitle(idea.title);
      setDescription(idea.description);
      setTags(idea.tags.join(','));
    }
  }, [editMode, idea, ideaId]);

  const submitHandler = (e) => {
    e.preventDefault();
    title.trim();
    tags.trim();

    if (title.length > 150) return toast.error('Please keep within 150 characters.');

    if (tags.split(',').length > 5)
      return toast.error('Please keep it within a maximum of 5 tags');

    // @TODO Add validation for tag's length

    if (description.length > 3000)
      return toast.error('Please keep within 3,000 characters.');

    editMode
      ? updateIdea({ title, description, tags, ideaId })
      : newIdea({ title, description, tags });
  };

  if (isLoading) return; // @TODO Add spinner

  return (
    <>
      <Navbar />
      <section className="container center" id="cta">
        <form className="form" onSubmit={submitHandler}>
          <h2>{editMode ? 'Update Idea' : 'New Idea'}</h2>

          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              placeholder="Million dollars super original idea!"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              value={description}
              placeholder="It is something that no one on Earth have thought about! I am so smart!"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={tags}
              placeholder="onewordtag,comma,thirdtag"
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <button className="btn btn--form">{editMode ? 'Update' : 'Submit'}</button>
        </form>
      </section>
    </>
  );
};

export default NewOrUpdateIdea;
