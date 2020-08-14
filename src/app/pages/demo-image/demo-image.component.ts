/*
 *  Copyright 2020 SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'warpview-demo-image',
  templateUrl: './demo-image.component.html',
  styleUrls: ['./demo-image.component.scss']
})
export class DemoImageComponent implements OnInit {
  visible = false;
  warpscript = `//simple example
// @preview image
200 150 '2D3' PGraphics //new image instance, 200x150 pixels

0xffffff6c Pbackground //yellow background
3 PstrokeWeight //stroke width 3pixels
0xff0000ff Pstroke //blue stroke (ARGB color)
0x7fff0000 Pfill //semi transparent red fill
10 30 100 50 Prect //draw a rectangle, left corner 10 30, size 100 50
20 PtextSize //set text size to 20pt
0xffff0000 Pfill //red fill
"Hello Warp 10" 10 100 Ptext //text, bottom left at 10 100.

Pencode //render the image in a base64 format on the stack
  `;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }
}
