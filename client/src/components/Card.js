import classes from './Card.module.css';

const Card = ({ children, ideaId }) => {
  // small cards for Landing page & big card for ThisIdea page
  const cardClasses = ideaId
    ? `${classes.big} ${classes.card} `
    : `${classes.small} ${classes.card} `;

  return <div className={cardClasses}>{children}</div>;
};

export default Card;
