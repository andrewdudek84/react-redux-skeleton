import React from "react";
import './USDAsset.css';

class USDAsset extends React.Component {
  constructor(props) {
    super(props);

    // Initialize state with the index of the asset matching the initial URL if provided
    this.state = {
      selectedUSDAssetIndex: this._findAssetIndexByUrl(props.selectedAssetUrl)
    };
  }

  /**
   * @function _handleSelectChange
   *
   * Handle selection in list.
   */
  _handleSelectChange = (event) => {
    const selectedIndex = parseInt(event.target.value, 10);
    this.setState({ selectedUSDAssetIndex: selectedIndex });
    if (this.props.onSelectUSDAsset) {
      this.props.onSelectUSDAsset(this.props.usdAssets[selectedIndex]);
    }
  };

  /**
   * @function componentDidUpdate
   *
   * Update state if the selectedAssetUrl prop changes.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.selectedAssetUrl !== this.props.selectedAssetUrl) {
      const newIndex = this._findAssetIndexByUrl(this.props.selectedAssetUrl);
      if (newIndex !== this.state.selectedUSDAssetIndex) {
        this.setState({ selectedUSDAssetIndex: newIndex });
      }
    }
  }

  /**
   * @function _findAssetIndexByUrl
   *
   * Find index of asset by url.
   */
  _findAssetIndexByUrl(url) {
    return this.props.usdAssets.findIndex(asset => asset.url === url);
  }

  /**
   * @function _renderSelector
   *
   * Render the selector.
   */
  _renderSelector() {
    const options = this.props.usdAssets.map((asset, index) => (
      <option key={index} value={index}>
        {asset.name}
      </option>
    ));

    return (
      <select
        value={this.state.selectedUSDAssetIndex !== null ? this.state.selectedUSDAssetIndex : ""}
        onChange={this._handleSelectChange}
      >
        {options}
      </select>
    );
  }

  render() {
    const { width } = this.props;
    return (
      <div style={{ width }}>
        <label>
          {'USD Asset'}
          {this._renderSelector()}
        </label>
      </div>
    );
  }
}

export default USDAsset;