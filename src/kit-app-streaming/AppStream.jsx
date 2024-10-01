import React from "react";
import { AppStreamer, RagnarokConfig, GFNConfig, StreamEvent } from '@nvidia/omniverse-webrtc-streaming-library';
import './AppStream.css';

class AppStream extends React.Component {
  constructor(props) {
    super(props);

    this._requested = false;
   
    this.state = {
      streamReady: false,
    };
    


  }

  componentDidMount() {
    if (!this._requested) {
      this._requested = true;

      let streamConfig;

      if (this.props.streamConfig.source === 'gfn') {
        streamConfig = {
          source: 'gfn',
          GFN: this.props.streamConfig.gfn,
          catalogClientId: this.props.streamConfig.gfn.catalogClientId,
          clientId: this.props.streamConfig.gfn.clientId,
          cmsId: this.props.streamConfig.gfn.cmsId,
        };
      } else if (this.props.streamConfig.source === 'local') {
        this.props.onLoggedIn('localUser');

        const server = this.props.streamConfig.local.server;
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
          doReconnect: false,
          streamConfig: streamConfig,
          onUpdate: (message) => this._onUpdate(message),
          onStart: (message) => this._onStart(message),
          onCustomEvent: (message) => this._onCustomEvent(message),
          authenticate: false,
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
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.streamReady === false && this.state.streamReady === true) {
      const player = document.getElementById("gfn-stream-player-video");

      if (player) {
        player.tabIndex = -1;
        player.playsInline = true;
        player.muted = true;

        player.play().catch(e => console.error('Error playing video:', e));
      }
    }
  }

  static sendMessage(message) {
   
    AppStreamer.sendMessage(message);
  }

  _onStart(message) {
    if (message.action === 'start' && message.status === 'success' && !this.state.streamReady) {
      console.info('streamReady');
      this.setState({ streamReady: true });
      this.props.onStarted();
    }

    console.debug(message);
  }

  _onUpdate(message) {
    try {
      if (message.action === 'authUser' && message.status === 'success') {
        if (typeof message.info === "string") {
          this.props.onLoggedIn(message.info);
        } else {
          throw new Error("Not implemented.");
        }
      }
    } catch (error) {
      console.error(message);
    }
  }

  _onCustomEvent(message) {
    this.props.handleCustomEvent(message);
  }

  _onFocus() {
    console.log("FOCUS");
  }

  _onBlur() {
    console.log("BLUR");
  }

  render() {

    return (

      <div key='stream-canvas' id='main-div'>
    
        <div id='aspect-ratio-div' style={this.props.style} onFocus={this._onFocus} onBlur={this._onBlur}>
          {this.props.streamConfig.source === 'gfn' && (
            <div>
              <video id="gfn-stream-player-video" />
              <audio id="gfn-stream-player-audio" />
              <div id="message-display" />
            </div>
          )}
        
          {this.props.streamConfig.source === 'local' && (
            <div>
              <video key='video-canvas' id="remote-video" playsInline muted autoPlay></video>
              <audio id="remote-audio" muted></audio>
              <div id="message-display"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AppStream;

