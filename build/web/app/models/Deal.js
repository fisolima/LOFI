"use strict";

function Deal(){
    this.id = 0;
    this.productName = '';
    this.dealerName = '';
    this.dealerAddress = '';
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

