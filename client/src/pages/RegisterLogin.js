import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/icons8-google.svg';
import useUserContext from '../context/userContext';

const Register = () => {
  const userContext = useUserContext();
  const { isLoading, _id, message } = userContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !!_id) navigate('/');
    if (!!message) toast.error(message);
  }, [isLoading, _id, navigate, message]);

  return (
    <section className="container center" id="cta">
      <div className="passport">
        <a href="/api/auth/google">
          <img src={googleIcon} alt="google" />
        </a>
      </div>
    </section>
  );
};

export default Register;
