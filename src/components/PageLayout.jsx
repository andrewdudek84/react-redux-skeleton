import { AuthenticatedTemplate } from '@azure/msal-react';
import { NavigationBar } from './NavigationBar.jsx';
import GlobalState from "./GlobalState.js";
import { Provider } from "react-redux";
import store from "../redux/store";


export const PageLayout = (props) => {

    return (
        <>
            <NavigationBar />
            {props.children}
            <br />
            <AuthenticatedTemplate>
                <Provider store={store}>
                    <GlobalState />
                </Provider>
            </AuthenticatedTemplate>
        </>
    );
}