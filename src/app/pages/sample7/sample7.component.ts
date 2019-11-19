import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'warpview-sample7',
  templateUrl: './sample7.component.html',
  styleUrls: ['./sample7.component.scss']
})
export class Sample7Component implements OnInit {

  visible = false;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }
}
