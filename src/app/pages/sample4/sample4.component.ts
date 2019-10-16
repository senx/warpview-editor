import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'warpview-sample4',
  templateUrl: './sample4.component.html',
  styleUrls: ['./sample4.component.scss']
})
export class Sample4Component implements OnInit {

  visible = false;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }
}
