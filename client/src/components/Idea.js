import { Card } from './';

const Idea = ({ idea }) => {
  const tag = idea.tags.map((tag, i) => <span key={i}>{tag}</span>);

  return (
    <Card>
      <h2>{idea.title}</h2>
      <div>{tag}</div>
      <p>{idea.description}</p>
    </Card>
  );
};

export default Idea;
