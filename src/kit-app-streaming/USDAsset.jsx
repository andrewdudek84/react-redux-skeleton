import React, { useState, useEffect } from "react";
import './USDAsset.css';

const USDAsset = (props) => {
    const [selectedUSDAssetIndex, setSelectedUSDAssetIndex] = useState(null);

    useEffect(() => {
        setSelectedUSDAssetIndex(findAssetIndexByUrl(props.selectedAssetUrl));
    }, [props.selectedAssetUrl]);

    const handleSelectChange = (event) => {
        const selectedIndex = parseInt(event.target.value, 10);
        setSelectedUSDAssetIndex(selectedIndex);
        if (props.onSelectUSDAsset) {
            props.onSelectUSDAsset(props.usdAssets[selectedIndex]);
        }
    };

    const findAssetIndexByUrl = (url) => {
        return props.usdAssets.findIndex(asset => asset.url === url);
    };

    const renderSelector = () => {
        const options = props.usdAssets.map((asset, index) => (
            <option key={index} value={index} className="usdAssetOption">
                {asset.name}
            </option>
        ));

        return (
            <select
                className="usdAssetSelector"
                onChange={handleSelectChange}
                value={selectedUSDAssetIndex || ''}>
                {options}
            </select>
        );
    };

    return (
        <div className="usdAssetContainer" style={{ width: props.width }}>
            <div className="usdAssetHeader">
                {'USD Asset'}
            </div>
            <div className="usdAssetSelectorContainer">
                {renderSelector()}
            </div>
        </div>
    );
};

export default USDAsset;