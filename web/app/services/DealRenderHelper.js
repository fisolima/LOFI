/* global lofi */

"use strict";

lofi.DealRenderHelper = (function(){

    var _renderDealOverview = function(deal,target,selectCb){
        var container = document.createElement('div');
        
        container.className = "dealItem";
        
        var name = document.createElement('div');
        name.innerHTML = 'Product: <b>' + deal.productName + '</b>';
        container.appendChild(name);
        
        var prize = document.createElement('div');
        prize.innerHTML = 'Prize: <b>' + deal.prize + '€</b>';
        container.appendChild(prize);
        
        var distance = document.createElement('div');
        distance.innerHTML = 'Distance: <b>' + deal.distance + ' m</b>';
        container.appendChild(distance);
        
        container.setAttribute('data-dealId', deal.id);
        
        container.addEventListener('click', function(){
            if (selectCb)
                selectCb( parseInt(this.getAttribute('data-dealId')));
        });
        
        target.appendChild(container);
    };
    
    var _renderDealDetails = function(deal){
        //nome prodotto
        document.getElementById('detailProduct').value = deal.productName;
        //prezzo
        document.getElementById('detailPrize').value = deal.prize + '€';
        // dealer
        document.getElementById('detailDealer').value = deal.dealerName;
        // address
        document.getElementById('detailAddress').value = deal.dealerAddress;
        // opnening time
        document.getElementById('detailOpeningTime').value = 'from ' + deal.openHours.start + ' to ' + deal.openHours.end;
        // quantitya
        document.getElementById('detailStock').value = deal.stock;
    };
    
    return {
        renderOverview: _renderDealOverview,
        renderDetails: _renderDealDetails
    };
}());