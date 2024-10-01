import React from 'react';
import './Window.css';
import AppStream from './AppStream'; // Ensure .tsx extension if needed
import StreamConfig from '../stream.config.json';

export default class AppNoUI extends React.Component {
    constructor(props) {
        super(props);
    }

    _onStreamStarted() {
        console.log("The streaming session has started!");
    }

    _handleCustomEvent(event) {
        console.log(event);
    }

    _handleAppStreamFocus() {
        console.log('User is interacting in streamed viewer');
    }

    _handleAppStreamBlur() {
        console.log('User is not interacting in streamed viewer');
    }

    render() {
        const streamConfig = {
            source: StreamConfig.source,
            gfn: StreamConfig.gfn,
            local: StreamConfig.local
        };

        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}
            >
                <AppStream
                    streamConfig={streamConfig}
                    onLoggedIn={(userId) => console.log(`User logged in: ${userId}`)}
                    onStarted={() => this._onStreamStarted()}
                    onFocus={() => this._handleAppStreamFocus()}
                    onBlur={() => this._handleAppStreamBlur()}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%'
                    }}
                    handleCustomEvent={(event) => this._handleCustomEvent(event)}
                />
            </div>
        );
    }
}