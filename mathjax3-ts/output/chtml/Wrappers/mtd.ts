/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Implements the CHTMLmtd wrapper for the MmlMtd object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper} from '../Wrapper.js';
import {CHTMLWrapperFactory} from '../WrapperFactory.js';
import {BBox} from '../BBox.js';
import {MmlMtd} from '../../../core/MmlTree/MmlNodes/mtd.js';
import {StyleList} from '../CssStyles.js';

/*****************************************************************/
/*
 *  The CHTMLmtd wrapper for the MmlMtd object
 */

export class CHTMLmtd extends CHTMLWrapper {
    public static kind = MmlMtd.prototype.kind;

    public static styles: StyleList = {
        'mjx-mtd': {
            display: 'table-cell',
            'text-align': 'center',
            'padding': '.25em .5em'
        },
        'mjx-mtd:first-child': {
            'padding-left': 0
        },
        'mjx-mtd:last-child': {
            'padding-right': 0
        },
        'mjx-mtable > mjx-itable > *:first-child > mjx-mtd': {
            'padding-top': 0
        },
        'mjx-mtable > mjx-itable > *:last-child > mjx-mtd': {
            'padding-bottom': 0
        },
        'mjx-tstrut': {
            display: 'inline-block',
            height: '1em',
            'vertical-align': '-.25em'
        }
    };

    /*
     * @override
     */
    public toCHTML(parent: HTMLElement) {
        super.toCHTML(parent);
        //
        // Include a strut to force minimum height and depth
        //
        this.chtml.appendChild(this.html('mjx-tstrut'));
    }

}
