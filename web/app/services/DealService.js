/* global lofi */

"use strict";

lofi.DealService = (function(){
    
    var dealScanCbs = null;    
    var dealVersion = -1;
    
    var _queryDeals = function(async){
        if (!dealScanCbs)
                return;
            
        //var conn = new XMLHttpRequest();
        
        // test
        var deals = [];
        
        var deal = new Deal();
        deal.id = 1;
        deal.dealerName = 'dealer1';
        deal.productName = 'prd1';
        deal.dealerAddress = 'address1';
        deal.prize = 50;
        deal.distance = 100;
        deal.openHours = {
          start: 1,
          end: 9
        };
        deal.estimatedDeliver = 123;
        deal.stock = 10;
        deal.expiry = new Date(2016, 4, 10);
        
        deals.push(deal);
        //
        deal = new Deal();
        deal.id = 2;
        deal.dealerName = 'dealer2';
        deal.productName = 'prd2';
        deal.dealerAddress = 'address2';
        deal.prize = 70;
        deal.distance = 150;
        deal.openHours = {
          start: 1,
          end: 9
        };
        deal.estimatedDeliver = 123;
        deal.stock = 15;
        deal.expiry = new Date(2016, 4, 10);
        
        deals.push(deal);
        //
        deal = new Deal();
        deal.id = 3;
        deal.dealerName = 'dealer1';
        deal.productName = 'prd3';
        deal.dealerAddress = 'address1';
        deal.prize = 55;
        deal.distance = 1500;
        deal.openHours = {
          start: 1,
          end: 9
        };
        deal.estimatedDeliver = 223;
        deal.stock = 20;
        deal.expiry = new Date(2016, 4, 10);
        
        deals.push(deal);
        //
        deal = new Deal();
        deal.id = 4;
        deal.dealerName = 'dealer1';
        deal.productName = 'prd4';
        deal.dealerAddress = 'address1';
        deal.prize = 500;
        deal.distance = 200;
        deal.openHours = {
          start: 1,
          end: 9
        };
        deal.estimatedDeliver = 223;
        deal.stock = 20;
        deal.expiry = new Date(2016, 4, 10);
        
        deals.push(deal);
        
        dealScanCbs.onupdate(deals);
    };
    
    var _reserveDeal = function(name, address, dealId, successCb, errorCb){
        var dealReservation = new DealReservation(name, address, dealId);
        
        console.log(dealReservation);
        
        // TODO sync ajax request
        
        successCb();
    };
    
    setInterval(function(){
        _queryDeals(true);
    }, 5000);
    
    return {
        registerDealScan: function(updateDealCb, getPositionCb, errorCb){
            dealScanCbs = {
                onupdate: updateDealCb,
                getPosition: getPositionCb,
                onerror: errorCb
            };
        },
        getDeals: function(){
            _queryDeals(false);
        },
        reserveDeal: _reserveDeal
    };
}());

