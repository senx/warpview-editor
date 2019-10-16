import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'warpview-sample3',
  templateUrl: './sample3.component.html',
  styleUrls: ['./sample3.component.scss']
})
export class Sample3Component implements OnInit {

  visible = false;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }
}
