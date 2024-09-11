import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { Container, Button } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';
import { IdTokenData } from './components/DataDisplay';
import { loginRequest } from './authConfig';
import { Provider } from "react-redux";
import store from "./redux/store";
import './styles/App.css';

const MainContent = () => {

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };
    return (
        <div className="App">
            <AuthenticatedTemplate>
                {activeAccount ? (
                    <IdTokenData idTokenClaims={activeAccount.idTokenClaims} />
                ) : null}
            </AuthenticatedTemplate>
        </div>
    );
};

const App = ({ instance }) => {
    return (
        <Provider store={store}>
            <MsalProvider instance={instance}>
                <PageLayout>
                    <MainContent />
                </PageLayout>
            </MsalProvider>
        </Provider>
    );
};

export default App;