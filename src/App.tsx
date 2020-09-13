import React from 'react';

import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';

import Toast from './components/ToastContainer';
import { AuthProvider } from './hooks/AuthContext';

import GlobalStyle from './styles/global';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <SignIn />
    </AuthProvider>

    <Toast />

    <GlobalStyle />
  </>
);

export default App;
