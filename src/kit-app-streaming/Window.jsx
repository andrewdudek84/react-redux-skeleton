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
import React, { Component, createRef } from 'react';
import './Window.css';
import AppStream from './AppStream'; // Ensure .tsx extension if needed
import StreamConfig from '../stream.config.json';
import USDAsset from "./USDAsset";
import USDStage from "./USDStage";

export default class Window extends Component {
    constructor(props) {
        super(props);

        // list of selectable USD assets
        const usdAssets = [
            { name: "Sample 1", url: "./samples/stage01.usd" },
            { name: "Sample 2", url: "./samples/stage02.usd" }
        ];

        this.state = {
            usdAssets: usdAssets,
            selectedUSDAsset: usdAssets[0],
            usdPrims: [],
            selectedUSDPrims: new Set(),
            isKitReady: false,
            showStream: false,
            showUI: false,
            loadingText: StreamConfig.source === "gfn" ? "Log in to GeForce NOW to view stream" : "Waiting for stream to begin"
        };

        this.usdStageRef = createRef();
    }

    _queryLoadingState() {
        const message = {
            event_type: "loadingStateQuery",
            payload: {}
        };
        AppStream.sendMessage(JSON.stringify(message));
    }

    async _pollForKitReady() {
        if (this.state.isKitReady === true) return

        console.info("polling Kit availability")
        this._queryLoadingState()
        setTimeout(() => this._pollForKitReady(), 3000); // Poll every 3 seconds
    }

    _getAsset(path) {
        if (!path)
            return { name: "", url: "" }

        // returns the file name from a path
        const getFileNameFromPath = (path) => path.split(/[/\\]/).pop();

        for (const asset of this.state.usdAssets) {
            if (getFileNameFromPath(asset.url) === getFileNameFromPath(path))
                return asset
        }

        return { name: "", url: "" }
    }

    _onLoggedIn(userId) {
        console.info(`Logged in to GeForce NOW as ${userId}`)
        this.setState({ loadingText: "Waiting for stream to begin" })
    }

    _openSelectedAsset() {
        this.setState({ loadingText: "Loading Asset...", showStream: false })
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

    _onSelectUSDAsset(usdAsset) {
        console.log(`Asset selected: ${usdAsset.name}.`);
        this.setState({ selectedUSDAsset: usdAsset }, () => {
            this._openSelectedAsset();
        });
    }

    _getChildren(usdPrim = null) {
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

    _makePickable(usdPrims) {
        const paths = usdPrims.map(prim => prim.path);
        console.log(`Sending request to make prims pickable: ${paths}.`);
        const message = {
            event_type: "makePrimsPickable",
            payload: {
                paths: paths,
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    }

    _onSelectUSDPrims(selectedUsdPrims) {
        console.log(`Sending request to select: ${selectedUsdPrims}.`);
        this.setState({ selectedUSDPrims: selectedUsdPrims });
        const paths = Array.from(selectedUsdPrims).map(obj => obj.path);
        const message = {
            event_type: "selectPrimsRequest",
            payload: {
                paths: paths
            }
        };
        AppStream.sendMessage(JSON.stringify(message));

        selectedUsdPrims.forEach(usdPrim => { this._onFillUSDPrim(usdPrim) });
    }

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

    _onFillUSDPrim(usdPrim) {
        if (usdPrim !== null && "children" in usdPrim && !Array.isArray(usdPrim.children)) {
            this._getChildren(usdPrim);
        }
    }

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

    _queryLoadingState = () => {
        const message = {
            event_type: "loadingStateQuery",
            payload: {}
        };
        AppStream.sendMessage(JSON.stringify(message));
    };

    _pollForKitReady = async () => {
        if (this.state.isKitReady === true) return;

        console.info("polling Kit availability");
        this._queryLoadingState();
        setTimeout(() => this._pollForKitReady(), 3000); // Poll every 3 seconds
    };

    _getAsset = (path) => {
        if (!path) return { name: "", url: "" };

        const getFileNameFromPath = (path) => path.split(/[/\\]/).pop();

        for (const asset of this.state.usdAssets) {
            if (getFileNameFromPath(asset.url) === getFileNameFromPath(path)) return asset;
        }

        return { name: "", url: "" };
    };

    _onLoggedIn = (userId) => {
        console.info(`Logged in to GeForce NOW as ${userId}`);
        this.setState({ ...this.state, loadingText: "Waiting for stream to begin" });
    };

    _openSelectedAsset = () => {
        this.setState({ ...this.state, loadingText: "Loading Asset...", showStream: false });
        this.setState({ ...this.state, usdPrims: [], selectedUSDPrims: new Set() });
        this.usdStageRef.current?.resetExpandedIds();
        console.log(`Sending request to open asset: ${this.state.selectedUSDAsset.url}.`);
        const message = {
            event_type: "openStageRequest",
            payload: {
                url: this.state.selectedUSDAsset.url
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    };

    _onSelectUSDAsset = (usdAsset) => {
        console.log(`Asset selected: ${usdAsset.name}.`);
        this.setState({ ...this.state, selectedUSDAsset: usdAsset }, () => {
            this._openSelectedAsset();
        });
    };

    _getChildren = (usdPrim = null) => {
        console.log(`Requesting children for path: ${usdPrim ? usdPrim.path : '/World'}.`);
        const message = {
            event_type: "getChildrenRequest",
            payload: {
                prim_path: usdPrim ? usdPrim.path : '/World',
                filters: ['USDGeom']
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    };

    _makePickable = (usdPrims) => {
        const paths = usdPrims.map(prim => prim.path);
        console.log(`Sending request to make prims pickable: ${paths}.`);
        const message = {
            event_type: "makePrimsPickable",
            payload: {
                paths: paths,
            }
        };
        AppStream.sendMessage(JSON.stringify(message));
    };

    _onSelectUSDPrims = (selectedUsdPrims) => {
        console.log(`Sending request to select: ${selectedUsdPrims}.`);
        this.setState({ ...this.state, selectedUSDPrims: selectedUsdPrims });
        const paths = Array.from(selectedUsdPrims).map(obj => obj.path);
        const message = {
            event_type: "selectPrimsRequest",
            payload: {
                paths: paths
            }
        };
        AppStream.sendMessage(JSON.stringify(message));

        selectedUsdPrims.forEach(usdPrim => { this._onFillUSDPrim(usdPrim) });
    };

    _onStageReset = () => {
        this.setState({ ...this.state, selectedUSDPrims: new Set() });
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
    };

    _onFillUSDPrim = (usdPrim) => {
        if (usdPrim !== null && "children" in usdPrim && !Array.isArray(usdPrim.children)) {
            this._getChildren(usdPrim);
        }
    };

    _findUSDPrimByPath = (path, array = this.state.usdPrims) => {
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
    };

    _handleCustomEvent = (event) => {
        if (!event) {
            return;
        }

        // response received once a USD asset is fully loaded
        if (event.event_type === "openedStageResult") {
            if (event.payload.result === "success") {
                this._queryLoadingState() 
                console.log('Kit App communicates an asset was loaded: ' + event.payload.url);
                this._getChildren(null); // Hide progress indicator
            }
            else {
                console.error('Kit App communicates there was an error loading: ' + event.payload.url);
            }
        }
        
        // response received from the 'loadingStateQuery' request
        else if (event.event_type == "loadingStateResponse") {
            // loadingStateRequest is used to poll Kit for proof of life.
            // For the first loadingStateResponse we set isKitReady to true
            // and run one more query to find out what the current loading state
            // is in Kit
            if (this.state.isKitReady === false) {
                console.info("Kit is ready to load assets")
                this.setState({ ...this.state, isKitReady: true })
                this._queryLoadingState()
            }
            
            else {
                const usdAsset = this._getAsset(event.payload.url)
                const isStageValid = !!(usdAsset.name && usdAsset.url)
                
                // set the USD Asset dropdown to the currently opened stage if it doesn't match
                if (isStageValid && usdAsset !== undefined && this.state.selectedUSDAsset !== usdAsset)
                    this.setState({ ...this.state, selectedUSDAsset: usdAsset })

                // if the stage is empty, force-load the selected usd asset; the loading state is irrelevant
                if (!event.payload.url)
                    this._openSelectedAsset()
                
                // if a stage has been fully loaded and isn't a part of this application, force-load the selected stage
                else if (!isStageValid && event.payload.loading_state === "idle"){
                    console.log(`The loaded asset ${event.payload.url} is invalid.`)
                    this._openSelectedAsset()
                }
                
                // show stream and populate children if the stage is valid and it's done loading
                if (isStageValid && event.payload.loading_state === "idle")
                {
                    this._getChildren()
                    this.setState({ ...this.state, showStream: true, loadingText: "Asset loaded", showUI: true })
                }
            }
        }
        
        // Loading progress amount notification.
        else if (event.event_type === "updateProgressAmount") {
            console.log('Kit App communicates progress amount.');
        }
            
        // Loading activity notification.
        else if (event.event_type === "updateProgressActivity") {
            console.log('Kit App communicates progress activity.');
            if (this.state.loadingText !== "Loading Asset...")
                this.setState({ ...this.state, loadingText: "Loading Asset..." })
        }
            
        // Notification from Kit about user changing the selection via the viewport.
        else if (event.event_type === "stageSelectionChanged") {
            console.log(event.payload.prims.constructor.name);
            if (!Array.isArray(event.payload.prims) || event.payload.prims.length === 0) {
                console.log('Kit App communicates an empty stage selection.');
                this.setState({ ...this.state, selectedUSDPrims: new Set() });
            }
            else {
                console.log('Kit App communicates selection of a USDPrimType: ' + event.payload.prims.map((obj) => obj).join(', '));
                const usdPrimsToSelect = new Set();
                event.payload.prims.forEach((obj) => {
                    const result = this._findUSDPrimByPath(obj);
                    if (result !== null) {
                        usdPrimsToSelect.add(result);
                    }
                });
                this.setState({ ...this.state, selectedUSDPrims: usdPrimsToSelect });
            }
        }
        // Streamed app provides children of a parent USDPrimType
        else if (event.event_type === "getChildrenResponse") {
            console.log('Kit App sent stage prims');
            const prim_path = event.payload.prim_path;
            const children = event.payload.children;
            const usdPrim = this._findUSDPrimByPath(prim_path);
            if (usdPrim === null) {
                this.setState({ ...this.state, usdPrims: children });
            }
            else {
                usdPrim.children = children;
                this.setState({ ...this.state, usdPrims: this.state.usdPrims });
            }
            if (Array.isArray(children)){
                this._makePickable(children);
            }
        }
        // other messages from app to kit
        else if (event.messageRecipient === "kit") {
            console.log("onCustomEvent");
            console.log(JSON.parse(event.data).event_type);
        }
    };

    _handleAppStreamFocus = () => {
        console.log('User is interacting in streamed viewer');
    };

    _handleAppStreamBlur = () => {
        console.log('User is not interacting in streamed viewer');
    };

    render() {
        const sidebarWidth = 300;
        const headerHeight = 60;
        const streamConfig = {
            source: StreamConfig.source,
            gfn: StreamConfig.gfn,
            local: StreamConfig.local
        };

        return (
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                }}
                >
                
                {/* Loading text indicator */}
                {!this.state.showStream &&
                <div
                    className="loading-indicator-container"
                    style={{
                        position: 'absolute',
                        height: `calc(100% - ${headerHeight}px)`,
                        width: `calc(100% - ${sidebarWidth}px)`,
                    }}
                >
                    <div className="loading-indicator-label">
                        {this.state.loadingText}
                    </div>
                </div>
                
                }
                {/* Streamed app */}
                <AppStream
                    streamConfig={streamConfig}
                    onLoggedIn={(userId) => this._onLoggedIn(userId)}
                    onStarted={() => this._pollForKitReady()}
                    onFocus={() => this._handleAppStreamFocus()}
                    onBlur={() => this._handleAppStreamBlur()}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: `${headerHeight}px`,
                        height: `calc(100% - ${headerHeight}px)`,
                        width: `calc(100% - ${sidebarWidth}px)`,
                        visibility: this.state.showStream ? 'visible' : 'hidden'
                    }}
                    handleCustomEvent={(event) => this._handleCustomEvent(event)}
                />

                {this.state.showUI &&
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
                    ref={this.usdStageRef}
                    width={sidebarWidth}
                    usdPrims={this.state.usdPrims}
                    onSelectUSDPrims={(value) => this._onSelectUSDPrims(value)}
                    selectedUSDPrims={this.state.selectedUSDPrims}
                    fillUSDPrim={(value) => this._onFillUSDPrim(value)}
                    onReset={() => this._onStageReset()}
                />
                </>
                }
            </div>
        );
    }
};
