/* global lofi */

"use strict";

lofi.DealService = (function(){
    
    var dealScanCbs = null;
    
    var _queryDeals = function(){
        if (!dealScanCbs)
                return;
            
        var position = dealScanCbs.getPosition();
        
        var conn = new XMLHttpRequest();
        
        conn.open('GET', lofi.URLs.deals + '?x=' + position.x + '&y=' + position.y, true);
        
        conn.setRequestHeader("Content-type", "application/json");
        
        conn.onreadystatechange = function(){
            // not ready
            if (conn.readyState !== 4)
                return;
                     
            if (conn.status === 200)
                dealScanCbs.onupdate(JSON.parse(conn.responseText));
            else
                dealScanCbs.onerror('[' + conn.status + '] - ' + conn.statusText);                
        };
        
        conn.send();
    };
    
    var _reserveDeal = function(name, address, dealId, successCb, errorCb){
        var position = dealScanCbs.getPosition();
        
        var dealReservation = new DealReservation(name, address, position.x, position.y, dealId);
        
        var conn = new XMLHttpRequest();
        
        conn.open('POST', lofi.URLs.deals, true);
        
        conn.setRequestHeader("Content-type", "application/json");
        
        conn.onreadystatechange = function(){
            // not ready
            if (conn.readyState !== 4)
                return;
                     
            if (conn.status === 200)
                successCb();
            else
                errorCb('[' + conn.status + '] - ' + conn.responseText);
        };
        
        conn.send(JSON.stringify(dealReservation));
    };
    
    setInterval(function(){
        _queryDeals();
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
            _queryDeals();
        },
        reserveDeal: _reserveDeal
    };
}());

