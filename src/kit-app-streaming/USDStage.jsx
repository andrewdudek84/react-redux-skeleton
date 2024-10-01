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
import React from "react";
import './USDStage.css';

class USDStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expandedIds: new Set() };
  }

  /**
   * @function resetExpandedIds
   *
   * Public function for resetting the expanded state of the list.
   */
  resetExpandedIds() {
    this.setState({ expandedIds: new Set() });
  }

  /**
   * @function _toggleExpand
   *
   * Toggle the expanded states in the list.
   */
  _toggleExpand = (obj, event) => {
    event.stopPropagation(); // Prevents the click from bubbling up to parent elements
    this.props.fillUSDPrim(obj);
    this.setState(prevState => {
      const newExpandedIds = new Set(prevState.expandedIds); // Create a copy of the current Set
      if (newExpandedIds.has(obj.path)) {
        newExpandedIds.delete(obj.path); // Remove id if it's already expanded
      } else {
        newExpandedIds.add(obj.path); // Add id if it's not expanded
      }
      return { expandedIds: newExpandedIds };
    });
  };

  /**
   * @function _handleListClick
   *
   * Change state when list selection changes.
   */
  _handleListClick = (obj, event) => {
    event.stopPropagation();
    const newSelectedItems = new Set(this.props.selectedUSDPrims);
    if (newSelectedItems.has(obj)) {
      newSelectedItems.delete(obj); // Deselect if already selected
    } else {
      newSelectedItems.add(obj); // Add to selection if not already selected
    }
    this.props.onSelectUSDPrims(newSelectedItems);
  }

  /**
   * @function _renderList
   *
   * Render the list.
   */
  _renderList = (usdPrims) => {
    if (!usdPrims || !Array.isArray(usdPrims)) {
      return;
    }
    return usdPrims.map((obj, index) => {
      const isLeaf = !obj.children || obj.children.length === 0;
      const isOpen = this.state.expandedIds.has(obj.path);
      const isSelected = this.props.selectedUSDPrims.has(obj);
      const listItemClass = `list-item ${isLeaf ? 'leaf' : 'parent'} ${isOpen ? 'open' : ''} ${isSelected ? 'selected' : ''}`;
      const itemContentClass = `item-content ${isLeaf ? 'leaf' : 'parent'} ${isOpen ? 'open' : ''} ${isSelected ? 'selected' : ''}`;
      const expandToggleClass = `expand-toggle ${isSelected ? 'selected' : 'deselected'}`;

      return (
        <div key={index} className={listItemClass} onClick={e => this._handleListClick(obj, e)} tabIndex={0}>
          {!isLeaf && (
            <span onClick={e => this._toggleExpand(obj, e)} className={expandToggleClass}>
              {isOpen ? '▼' : '▶'}
            </span>
          )}
          {obj.name}

          {isOpen && !isLeaf && obj.children && (
            <div className="children">
              {this._renderList(obj.children)}
            </div>
          )}
        </div>
      );
    });
  };

  _onReset = () => {
    this.props.onReset();
  };

  _onFrame = () => {
    this.props.onFrame();
  };

  render() {
    return (
      <div style={{ width: this.props.width }}>
        <div>
          <h1>USD Stage</h1>
          <button onClick={this._onReset}>Reset</button>
          <button onClick={this._onFrame}>Frame</button>
        </div>
        <div className="usd-stage-list">
          {this._renderList(this.props.usdPrims)}
        </div>
      </div>
    );
  }
}

export default USDStage;