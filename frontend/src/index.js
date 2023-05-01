import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import Translate from './Translate';
import theme from './theme';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
const router = createBrowserRouter([
  {
    path: "/",
    element:<App />,
  },
  {
    path: "translate",
    element:<Translate />,
  },
]);




root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />

    <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>

    
    
  </ThemeProvider>,
);
