import { Link, useParams } from 'react-router-dom';
import { GoPencil } from 'react-icons/go';

const ThisIdea = () => {
  const { ideaId } = useParams();

  // @TODO Display a single card
  return (
    <>
      <Link to={`/idea/edit/${ideaId}`}>
        <GoPencil size={'5rem'} />
      </Link>
    </>
  );
};

export default ThisIdea;
