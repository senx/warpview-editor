import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'warpview-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent implements OnInit {

  visible = false;

  constructor() {
  }

  ngOnInit() {
    this.visible = true;
  }

}
