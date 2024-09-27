import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';
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
        <div className="App"></div>
    );
};


const App = ({ instance }) => {

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };
    return (
        <Provider store={store}>
            <MsalProvider instance={instance}>
                <PageLayout>
                    <MainContent/>
                </PageLayout>
            </MsalProvider>
        </Provider>
    );
};

export default App