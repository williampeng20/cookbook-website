import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import { firebaseConfig } from '../firebase-creds';
import { ROUTES } from '../util/routeUtils';
import { setUserCookie } from '../util/authUtils';

import '../Styles/SignInScreen.css';

firebase.initializeApp(firebaseConfig);
const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult: any, redirectUrl: string) {
        setUserCookie(authResult.user.uid, authResult.user.displayName);
        return true;
      },
    },
    signInFlow: 'popup',
    signInSuccessUrl: ROUTES.recipeList,
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
};


function SignInScreen() {
    return (
      <div>
        <div className="center">
          <h1>Cloud Cookbook</h1>
          <p>Please sign-in:</p>
        </div>
        <div className="authPanel">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>
    );
  }
  
  export default SignInScreen;

