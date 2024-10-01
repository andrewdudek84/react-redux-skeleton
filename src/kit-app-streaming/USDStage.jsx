import React, { useState, useEffect } from "react";
import './USDStage.css';

const USDStage = (props) => {
    const [expandedIds, setExpandedIds] = useState(new Set());

    useEffect(() => {
        setExpandedIds(new Set());
    }, []);

    const resetExpandedIds = () => {
        setExpandedIds(new Set());
    };

    const toggleExpand = (obj, event) => {
        event.stopPropagation();
        props.fillUSDPrim(obj);
        setExpandedIds(prevExpandedIds => {
            const newExpandedIds = new Set(prevExpandedIds);
            if (newExpandedIds.has(obj.path)) {
                newExpandedIds.delete(obj.path);
            } else {
                newExpandedIds.add(obj.path);
            }
            return newExpandedIds;
        });
    };

    const handleListClick = (obj, event) => {
        event.stopPropagation();
        const newSelectedItems = new Set(props.selectedUSDPrims);
        if (newSelectedItems.has(obj)) {
            newSelectedItems.delete(obj);
        } else {
            newSelectedItems.add(obj);
        }
        props.onSelectUSDPrims(newSelectedItems);
    };

    const renderList = (usdPrims) => {
        if (usdPrims === null || !Array.isArray(usdPrims)) {
            return;
        }
        return usdPrims.map((obj, index) => {
            const isLeaf = !obj.children || obj.children.length === 0;
            const isOpen = expandedIds.has(obj.path);
            const isSelected = props.selectedUSDPrims.has(obj);
            const listItemClass = `list-item ${isLeaf ? 'leaf' : 'parent'} ${isOpen ? 'open' : ''} ${isSelected ? 'selected' : ''}`;
            const itemContentClass = `item-content ${isLeaf ? 'leaf' : 'parent'} ${isOpen ? 'open' : ''} ${isSelected ? 'selected' : ''}`;
            const expandToggleClass = `expand-toggle ${isSelected ? 'selected' : 'deselected'}`;

            return (
                <li key={obj.name || index} className={listItemClass}>
                    <div className={itemContentClass} onClick={(e) => handleListClick(obj, e)}
                        tabIndex={0}
                    >
                        {!isLeaf && (
                            <span onClick={(e) => toggleExpand(obj, e)} className={expandToggleClass}>
                                {isOpen ? '▼' : '▶'}
                            </span>
                        )}
                        {obj.name}
                    </div>
                    {isOpen && !isLeaf && obj.children && (
                        <ul className="nested-list">
                            {renderList(obj.children)}
                        </ul>
                    )}
                </li>
            );
        });
    };

    const onReset = () => {
        props.onReset();
    };

    return (
        <div className="usdStageContainer" style={{ width: props.width }}>
            <div className="usdStageHeader">
                {'USD Stage'}
                <button className="usdStageButton" onClick={onReset}>Reset</button>
            </div>
            <ul className="list-container">
                {renderList(props.usdPrims)}
            </ul>
        </div>
    );
};

export default USDStage;