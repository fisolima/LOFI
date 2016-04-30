"use strict";

function Deal(){
    this.id = '';
    this.name = '';
    this.address = '';
    this.category = '';
    this.prize = 0;
    this.distance = 0;
    this.openHours = {
      start: 0,
      end: 0
    };
    this.estimatedDeliver = 0;
    this.stock = 0;
    this.expiry = new Date();
};

