import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'warpview-sample5',
  templateUrl: './sample5.component.html',
  styleUrls: ['./sample5.component.scss']
})
export class Sample5Component implements OnInit {

  visible = false;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }

}
