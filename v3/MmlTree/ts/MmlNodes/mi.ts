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
 * @fileoverview  Implements the MmlMi node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../Node.js';
import {AMmlTokenNode, AMmlNode, AttributeList, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/*
 *  Implements the MmlMi node class (subclass of AMmlTokenNode)
 */

export class MmlMi extends AMmlTokenNode {
    public static defaults: PropertyList = {
        ...AMmlTokenNode.defaults
    };
    /*
     * Patterns for operator names and single-character texts
     */
    public static operatorName: RegExp = /^[a-z][a-z0-9]*$/i;
    public static singleCharacter: RegExp = /^[\uD800-\uDBFF]$/;

    public texClass = TEXCLASS.ORD;

    /*
     * @return {string}  The mi kind
     */
    public get kind() {
        return 'mi';
    }

    /*
     * Do the usual inheritance, then check the text length to see
     *   if mathvariant should be normal or italic.
     *
     * @override
     */
    public setInheritedAttributes(attributes: AttributeList = {},
                           display: boolean = false, level: number = 0, prime: boolean = false) {
        super.setInheritedAttributes(attributes, display, level, prime);
        let text = this.getText();
        if (text.match(MmlMi.singleCharacter)) {
            this.attributes.setInherited('mathvariant', 'italic');
        }
    }

    /*
     * Mark multi-character texts as OP rather than ORD for spacing purposes
     *
     * @override
     */
    public setTeXclass(prev: AMmlNode) {
        this.getPrevClass(prev);
        let name = this.getText();
        if (name.length > 1 && name.match(MmlMi.operatorName) && this.texClass === TEXCLASS.ORD) {
            this.texClass = TEXCLASS.OP;
            this.setProperty('autoOP', true);
        }
        return this;
    }
}