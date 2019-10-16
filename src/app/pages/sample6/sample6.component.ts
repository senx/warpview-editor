import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'warpview-sample6',
  templateUrl: './sample6.component.html',
  styleUrls: ['./sample6.component.scss']
})
export class Sample6Component implements OnInit {

  visible = false;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }
}
