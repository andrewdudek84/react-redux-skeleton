import React, { useState, useEffect } from "react";
import { AppStreamer, RagnarokConfig, GFNConfig, StreamEvent } from '@nvidia/omniverse-webrtc-streaming-library';
import './AppStream.css';

const AppStream = (props) => {
    const [streamReady, setStreamReady] = useState(false);
    const [requested, setRequested] = useState(false);
    
    useEffect(() => {
        if (!requested) {
            setRequested(true);

            let streamConfig;

            if (props.streamConfig.source === 'gfn') {
                streamConfig = {
                    source: 'gfn',
                    catalogClientId: props.streamConfig.gfn.catalogClientId,
                    clientId: props.streamConfig.gfn.clientId,
                    cmsId: props.streamConfig.gfn.cmsId,
                };
            } else if (props.streamConfig.source === 'local') {
                const server = props.streamConfig.local.server;
                const width = 1920;
                const height = 1080;
                const fps = 60;
                const url = `server=${server}&resolution=${width}:${height}&fps=${fps}&mic=0&cursor=free&autolaunch=true`;

                streamConfig = {
                    source: 'local',
                    videoElementId: 'remote-video',
                    audioElementId: 'remote-audio',
                    messageElementId: 'message-display',
                    urlLocation: { search: url }
                };
            } else {
                return;
            }

            try {
                AppStreamer.setup({
                    streamConfig: streamConfig,
                    onUpdate: (message) => _onUpdate(message),
                    onStart: (message) => _onStart(message),
                    onCustomEvent: (message) => _onCustomEvent(message),
                    authenticate: false,
                    nativeTouchEvents: true,
                    doReconnect: true,
                    onStop: function (message) {
                        console.log(message);
                    },
                    onTerminate: function (message) {
                        console.log(message);
                    },
                    onISSOUpdate: function (message) {
                        console.log(message);
                    }
                })
                .then((result) => {
                    console.info(result);
                })
                .catch((error) => {
                    console.error(error);
                });
            } catch (error) {
                console.error(error);
            }
        }
    }, [requested, props.streamConfig]);

    useEffect(() => {
        if (!streamReady && streamReady) {
            const player = document.getElementById("gfn-stream-player-video");

            if (player) {
                player.tabIndex = -1;
                player.playsInline = true;
                player.muted = true;

                player.play().catch(e => console.error('Error playing video:', e));
            }
        }
    }, [streamReady]);

    const _onStart = (message) => {
        if (message.action === 'start' && message.status === 'success' && !streamReady) {
            console.info('streamReady');
            setStreamReady(true);
            props.onStarted();
        }

        console.debug(message);
    };

    const _onUpdate = (message) => {
        try {
            if (message.action === 'authUser' && message.status === 'success') {
                if (typeof message.info === "string") {
                    props.onLoggedIn(message.info);
                } else {
                    throw new Error("Not implemented.");
                }
            }
        } catch (error) {
            console.error(message);
        }
    };

    const _onCustomEvent = (message) => {
        props.handleCustomEvent(message);
    };

    return (
        <div
            key={'stream-canvas'}
            id={'main-div'}
            style={{
                visibility: streamReady ? 'visible' : 'hidden',
                outline: 'none',
                ...props.style
            }}
        >
            <div
                id={'aspect-ratio-div'}
                tabIndex={0}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                style={{
                    position: 'relative',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingBottom: '56.25%',
                    outline: 'none'
                }}
            >
                {props.streamConfig.source === 'gfn' &&
                    <div
                        id="view"
                        style={{
                            backgroundColor: '#dddddd',
                            display: 'flex', justifyContent: 'space-between',
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            outline: 'none'
                        }}
                    />}
                {props.streamConfig.source === 'local' &&
                    <>
                        <video
                            key={'video-canvas'}
                            id={'remote-video'}
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                outline: 'none'
                            }}
                            tabIndex={-1}
                            playsInline
                            muted
                            autoPlay />
                        <audio id="remote-audio" muted></audio>
                        <h3 style={{ visibility: 'hidden' }} id="message-display">...</h3>
                    </>
                }
            </div>
        </div>
    );
};

export default AppStream;