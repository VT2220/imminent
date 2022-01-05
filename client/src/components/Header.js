import { Transition, animated } from '@react-spring/web';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import Avatar from '../assets/images/avatar.jpg';
import Logo from '../assets/images/logo.jpg';
import { CLIENT_ID } from '../config';
import { setUserData } from '../store/user-slice';

const Header = () => {
  const user = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const onSignInSuccess = (res) => {
    dispatch(setUserData(res.profileObj));
  };

  const onSignInFailure = (err) => {
    toast.error(err.error.replace(/_/g, ' '));
  };

  const logout = () => {
    dispatch(setUserData({}));
  };

  return (
    <>
      <div className="flex justify-between p-3">
        <Link className="flex items-center gap-x-2.5" to={'/'}>
          <img src={Logo} width={40} className="rounded-full" />
          <span className="text-2xl font-semibold hover:text-sky-700">imminent</span>
        </Link>
        <Transition items={Object.keys(user).length} from={{ opacity: 0 }} enter={{ opacity: 1 }}>
          {(styles, item) =>
            item ? (
              <animated.div style={styles} className="flex items-center gap-x-2.5">
                <div className="flex flex-col items-end text-xs font-semibold">
                  <span className="hidden sm:block">{user.email}</span>
                  <GoogleLogout
                    clientId={CLIENT_ID}
                    render={(props) => (
                      <span
                        className="text-sky-800 underline hover:decoration-double cursor-pointer"
                        onClick={props.onClick}>
                        logout
                      </span>
                    )}
                    onLogoutSuccess={logout}
                  />
                </div>
                <img src={user.imageUrl} width={40} className="rounded-full" />
              </animated.div>
            ) : (
              <GoogleLogin
                clientId={CLIENT_ID}
                render={(props) => (
                  <animated.div
                    className="flex items-center gap-x-2.5 cursor-pointer"
                    style={styles}
                    onClick={props.onClick}
                    disabled={props.disabled}>
                    <span className="font-semibold hover:text-sky-700">Sign in</span>
                    <img src={Avatar} width={40} className="rounded-full" />
                  </animated.div>
                )}
                onSuccess={onSignInSuccess}
                onFailure={onSignInFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                uxMode="redirect"
              />
            )
          }
        </Transition>
      </div>
    </>
  );
};

export default Header;
