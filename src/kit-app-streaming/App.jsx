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

/*
 * When connecting the Web Viewer Sample to a Kit Application with menus and other UI elements,
 * it is recommended to modify the source code and make the following change:
 * 
 * Change:
 * import Window from './Window';
 * 
 * To:
 * import Window from './WindowNoUI';
 */

import React from 'react';
import "./App.css";
import Window from './Window';

function App() {
  return (
    <div>
      <Window />
    </div>
  );
}

export default App;
