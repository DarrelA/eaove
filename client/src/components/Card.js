import classes from './Card.module.css';

const Card = ({ children, size }) => {
  // small cards: Landing page
  // big card: ThisIdea page
  // long card: IdeaChallengers page

  return <div className={`${classes.card} ${classes[`${size}`]}`}>{children}</div>;
};

export default Card;
