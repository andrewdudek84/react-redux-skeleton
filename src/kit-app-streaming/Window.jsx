/*
 * SPDX-FileCopyrightText: Copyright (c) 2024 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
 * SPDX-License-Identifier: LicenseRef-NvidiaProprietary
 *
 * NVIDIA CORPORATION, its affiliates and licensors retain all intellectual
 * property and proprietary rights in and to this material, related
 * documentation and any modifications thereto. Any use, reproduction,
 * disclosure or distribution of this material and related documentation
 * without an express license agreement from NVIDIA CORPORATION or
 * its affiliates is strictly prohibited.
 */
import React from 'react';
import './Window.css';
import AppStream from './AppStream'; 
import StreamConfig from './stream.config.json';
import USDAsset from './USDAsset'; 
import USDStage from './USDStage'; 

    
class Window extends React.Component {
    constructor(props) {
            super(props);
            const usdAssets = [
                { name: "Sample 1", url: "./samples/stage01.usd" },
                { name: "Sample 2", url: "./samples/stage02.usd" },
                { name: "PAL POC", url: "./samples/stage_pal_poc.usd" },
            ];
            
            this.state = {
                selectedUSDPrims: new Set(),
                usdPrims: [],
                loadingProgress: 0,
                loadingActivity: '',
                gfnUser: null,
                streamReady: false,
                usdAssets: usdAssets,
                selectedUSDAsset: usdAssets[2],
                isLoadingAsset: false
            };
            this.usdStageRef = React.createRef();
            
           
        }

    /**
     * @function _toggleLoadingState
     *
     * Toggle state of loading asset indicator.
     */
    _toggleLoadingState(isLoading) {
        console.log(`Setting loading indicator visibility to: ${isLoading ? "visible" : "hidden"}.`);
        this.setState({ loadingProgress: 0 });
        this.setState({ isLoadingAsset: isLoading });
    }

    /**
     * @function _onStreamStarted
     *
     * Sends a request to open an asset. If the stream is from GDN it is assumed that the
     * application will automatically load an asset on startup so a request to open a stage
     * is not sent. Instead, we wait for the streamed application to send a
     * openedStageResult message.
     */
    _onStreamStarted() {
        
        if (StreamConfig.source === 'local') {
            this._openSelectedAsset();
        }
    }

    
    /**
    * @function _openSelectedAsset
    *
    * Send a request to load an asset.
    */
    _openSelectedAsset () {
        this._toggleLoadingState(true);
        this.setState({ usdPrims: [], selectedUSDPrims: new Set() });
        this.usdStageRef.current?.resetExpandedIds();
        console.log(`Sending request to open asset: ${this.state.selectedUSDAsset.url}.`);
        const message = {
            event_type: "openStageRequest",
            payload: {
                url: this.state.selectedUSDAsset.url
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    }

    /**
     * @function _onSelectUSDAsset
     *
     * React to user selecting an asset in the USDAsset selector.
     */
    _onSelectUSDAsset(usdAsset) {
        console.log(`Asset selected: ${usdAsset.name}.`);
        this.setState({ selectedUSDAsset: usdAsset }, () => {
            this._openSelectedAsset();
        });
    }

    /**
     * @function _getChildren
     *
     * Send a request for the child prims of the given usdPrim.
     */
    _getChildren(usdPrim = null) {
        // Get geometry prims. If no usdPrim is specified then get children of /World.
        console.log(`Requesting children for path: ${usdPrim ? usdPrim.path : '/World'}.`);
        const message = {
            event_type: "getChildrenRequest",
            payload: {
                prim_path: usdPrim ? usdPrim.path : '/World',
                filters: ['USDGeom']
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    }

    /**
     * @function _makePickable
     *
     * Send a request for the child prims of the given usdPrim.
     */
    _makePickable(usdPrims) {
        const paths = usdPrims.map(prim => prim.path);
        console.log(`Sending request to make prims pickable: ${paths}.`);
        const message = {
            event_type: "makePrimsPickable",
            payload: {
                paths: paths,
                criteria: "alpine_data_lake_id"
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    }

    /**
     * @function _onSelectUSDPrims
     *
     * React to user selecting items in the USDStage list.
     * Sends a request to change the selection in the USD Stage.
     */
    _onSelectUSDPrims(selectedUsdPrims) {
        console.log(`Sending request to select: ${selectedUsdPrims}.`);
        this.setState({ selectedUSDPrims: selectedUsdPrims });
        const paths = Array.from(selectedUsdPrims).map(obj => obj.path);
        const message = {
            event_type: "selectPrimsRequest",
            payload: {
                paths: paths,
                criteria: "alpine_data_lake_id"
            }
        };
        AppStream.sendMessage(JSON.stringify(message));

        selectedUsdPrims.forEach(usdPrim => { this._onFillUSDPrim(usdPrim) });
    }

    /**
     * @function _onStageReset
     *
     * Clears the selection and sends a request to reset the stage to how it was at the time it loaded.
     */
    _onStageReset() {
        this.setState({ selectedUSDPrims: new Set() });
        const selection_message = {
            event_type: "selectPrimsRequest",
            payload: {
                paths: []
            }
        };
        AppStream.sendMessage(JSON.stringify(selection_message));

        const reset_message = {
            event_type: "resetStage",
            payload: {}
        };
        AppStream.sendMessage(JSON.stringify(reset_message));
    }

    /**
     * @function _onStageFrame
     *
     * Clears the selection and sends a request to reset the stage to how it was at the time it loaded.
     */
    _onStageFrame() {
        const frame_message = {
            event_type: "frameSelected",
            payload: {}
        };
        AppStream.sendMessage(JSON.stringify(frame_message));
    }

    /**
     * @function _onFillUSDPrim
     *
     * If the usdPrim has a children property, a request is sent for its children.
     * When the streaming app sends an empty children value it is not an array.
     * When a prim does not have children, the streaming app does not provide a children
     * property to begin with.
     */
    _onFillUSDPrim(usdPrim) {
        if (usdPrim !== null && "children" in usdPrim && !Array.isArray(usdPrim.children)) {
            this._getChildren(usdPrim);
        }
    }

    /**
         * @function _findUSDPrimByPath
         *
         * Recursive search for a USDPrimType object by path.
         */
    _findUSDPrimByPath(path, array = this.state.usdPrims) {
        if (Array.isArray(array)) {
            for (const obj of array) {
                if (obj.path === path) {
                    return obj;
                }
                if (obj.children && obj.children.length > 0) {
                    const found = this._findUSDPrimByPath(path, obj.children);
                    if (found) {
                        return found;
                    }
                }
            }
        }
        return null;
    }


    /**
     * @function _handleCustomEvent
     *
     * Handle message from stream.
     */
    _handleCustomEvent(event) {
       
        if (!event) {
            return;
        }
        // Streamed app notification of asset loaded.
        if (event.event_type === "openedStageResult") {
            if (event.payload.result === "success") {
                console.log('Kit App communicates an asset was loaded: ' + event.payload.url);
                this._getChildren(null); // Hide progress indicator
            } else {
                console.error('Kit App communicates there was an error loading: ' + event.payload.url);
                this._toggleLoadingState(false); // Hide progress indicator
            }
        }
        // Progress amount notification.
        else if (event.event_type === "updateProgressAmount") {
            console.log('Kit App communicates progress amount.');
            console.log(event.payload);
            const progress = Math.round(Number(event.payload.progress) * 100.0);
            if (progress > 0) {
                this.setState({ loadingProgress: progress });
            }
        }
        // Progress activity notification.
        else if (event.event_type === "updateProgressActivity") {
            console.log('Kit App communicates progress activity.');
            console.log(event.payload);
            this.setState({ loadingActivity: event.payload.text });
        }
        // Selection changed because user made a selection in streamed viewport.
        else if (event.event_type === "stageSelectionChanged") {
            console.log(event.payload.prims.constructor.name);
            if (!Array.isArray(event.payload.prims) || event.payload.prims.length === 0) {
                console.log('Kit App communicates an empty stage selection.');
                this.setState({ selectedUSDPrims: new Set() });
            } else {
                console.log('Kit App communicates selection of a USDPrimType: ' + event.payload.prims.map((obj) => obj).join(', '));
                const usdPrimsToSelect = new Set();
                event.payload.prims.forEach((obj) => {
                    const result = this._findUSDPrimByPath(obj);
                    if (result !== null) {
                        usdPrimsToSelect.add(result);
                    }
                });
                this.setState({ selectedUSDPrims: usdPrimsToSelect });

                // returned criteria ids
                event.payload.criteria_ids.forEach((obj) => {
                    console.log('returned criteria_id: ' + JSON.stringify(obj));
                });
            }
        }
        // Streamed app provides children of a parent USDPrimType
        else if (event.event_type === "getChildrenResponse") {
            console.log('Kit App sent stage prims');
            const prim_path = event.payload.prim_path;
            const children = event.payload.children;
            const usdPrim = this._findUSDPrimByPath(prim_path);
            if (usdPrim === null) {
                this.setState({ usdPrims: children });
                this._toggleLoadingState(false);
            } else {
                usdPrim.children = children;
                this.setState({ usdPrims: this.state.usdPrims });
            }
            if (Array.isArray(children)) {
                this._makePickable(children);
            }
        }
        // other messages from app to kit
        else if (event.messageRecipient === "kit") {
            console.log("onCustomEvent");
            console.log(JSON.parse(event.data).event_type);
        }
    }


    
    render() {
        const sidebarWidth = 300;
        const headerHeight = 60;
        
        const streamConfig = {
            source: StreamConfig.source,
            gfn: StreamConfig.gfn,
            local: StreamConfig.local
        };

        return (
            <div>
               
                {this.state.isLoadingAsset &&
                    <div>
                        <div>
                            Loading {this.state.selectedUSDAsset.name} - {this.state.loadingProgress}%
                            <div>File: {this.state.loadingActivity}</div>
                        </div>
                    </div>
                }
      

                {/* Streamed app */}
                <AppStream
                    streamConfig={streamConfig}
                    onLoggedIn={(userId) => this.setState({ gfnUser: userId })}
                    onStarted={() => this._onStreamStarted()}
                    onFocus={() => this._handleAppStreamFocus()}
                    onBlur={() => this._handleAppStreamBlur()}
                    style={{
                        height: `calc(100% - ${headerHeight}px)`,
                        width: `calc(100% - ${sidebarWidth}px)`,
                        position:'relative',
                        visibility: this.state.gfnUser ? 'visible' : 'hidden'
                    }}
                    handleCustomEvent={(event) => this._handleCustomEvent(event)}
                />

                {this.state.gfnUser &&
                    <>
                        {/* USD Asset Selector */}
                        <USDAsset
                            usdAssets={this.state.usdAssets}
                            selectedAssetUrl={this.state.selectedUSDAsset?.url}
                            onSelectUSDAsset={(value) => this._onSelectUSDAsset(value)}
                            width={sidebarWidth}
                        />
                        {/* USD Stage Listing */}
                        <USDStage
                            onSelectUSDPrims={(value) => this._onSelectUSDPrims(value)}
                            selectedUSDPrims={this.state.selectedUSDPrims}
                            fillUSDPrim={(value) => this._onFillUSDPrim(value)}
                            onReset={() => this._onStageReset()}
                            onFrame={() => this._onStageFrame()}
                        />
                    </>
                }
            </div>
        );
    }
}

export default Window;