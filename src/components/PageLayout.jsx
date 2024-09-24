import { AuthenticatedTemplate } from '@azure/msal-react';
import { NavigationBar } from './NavigationBar.jsx';
import Messages from "./GlobalState.js";

import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import 'powerbi-report-authoring';
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
            
                    <div className="messsages-div">

                        <h2>Redux - Global State</h2>
                        <Messages />

                        <h2>Power BI Embedded</h2>
                        <div className="border-div">
                        <PowerBIEmbed
                            embedConfig = {{
                                type: 'report',  
                                id: "9db46e64-3db7-4afb-a6ba-cd52b5cd84f7&ctid=72f988bf-86f1-41af-91ab-2d7cd011db47",
                                embedUrl: "https://msit.powerbi.com/reportEmbed?reportId=9db46e64-3db7-4afb-a6ba-cd52b5cd84f7&ctid=72f988bf-86f1-41af-91ab-2d7cd011db47",
                                accessToken: undefined, // Keep undefined
                                tokenType: models.TokenType.Embed
                            }}
                        />
                        </div>

                        <h2>Kit App Streaming</h2>
                        <div className="border-div">

                        </div>
                    </div>

                </Provider>
            </AuthenticatedTemplate>
        </>
    );
}