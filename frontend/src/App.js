import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBYFnkX1TD8cG9ThXBVsIlSe_MjuPFqsIM",
  authDomain: "persepolis-risen.firebaseapp.com",
  projectId: "persepolis-risen",
  storageBucket: "persepolis-risen.appspot.com",
  messagingSenderId: "484370508386",
  appId: "1:484370508386:web:5a7bacbe6a67e90f857f3b",
  measurementId: "G-E06TSXNECZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Shaun Maher - Columbia University"}
    </Typography>
  );
}



const footers = [
];

function AppContent() {
  const [isAuth, setAuth] = React.useState(
    JSON.parse(localStorage.getItem('authedUser'))
  );


  const loginButton = () => {
    if (isAuth != null) {

      return <Button href="#" variant="outlined" onClick={() => {
        console.log("Click Registered")
        signOut(auth).then(() => {
          const loginState = null
          console.log(loginState)
          localStorage.setItem('authedUser', loginState);

          setAuth(loginState);
        }).catch((error) => {
          // An error happened.
        });
      }} sx={{ my: 1, mx: 1.5 }}>
        Logout
      </Button>

    }

    else {
      return <Button href="#" variant="outlined" onClick={() => {
        console.log("Click Registered")
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            // IdP data available using getAdditiolUserInfo(result)
            // ...
            // localStorage.setItem()
            const loginState = {
              "authed": true,
              "id": user.uid,
              "token": user.accessToken,
              "name": user.displayName,
              "email": user.email,
            }
            console.log(loginState)
            localStorage.setItem('authedUser', JSON.stringify(loginState));

            setAuth(loginState);
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;

            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(error, errorCode, credential)
          })
      }} sx={{ my: 1, mx: 1.5 }}>
        Login
      </Button>

    }
  }

  const navBar = () => {
    if (isAuth != null) {
      return <nav>
        <Link
          variant="button"
          color="text.primary"
          href="translate"
          sx={{ my: 1, mx: 1.5 }}
        >
          Translate
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          My Account
        </Link>
        {loginButton()}
      </nav>
    }
    else {
      return <nav>
        {loginButton()}
      </nav>

    }
  }

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Persepolis
          </Typography>

          {navBar()}

        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Persepolis
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Help translate and preserve some of the world's most ancient texts.
        </Typography>
        <Box align="center" style={{ "padding": 20 }}>
          {
            loginButton()

          }

        </Box>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
        </Grid>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid container spacing={4} justifyContent="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {footer.title}
              </Typography>
              <ul>
                {footer.description.map((item) => (
                  <li key={item}>
                    <Link href="#" variant="subtitle1" color="text.secondary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}

export default function App() {
  return <AppContent />;
}
/*
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

auth_sign_out.js


*/