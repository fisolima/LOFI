"use strict";

var app = (function(){
    
    var maxDistance = 1000;
    var availableDistances = [100, 200, 500, 1000, 1500, 2000, 0];
    
    var maxPrize = 500;
    var availablePrize = [10, 20, 50, 100, 250, 500, 1000, 0];
    
    var deals = [];
    
    var _setupOverviewSection = function(){
        // selezione distanze
        var distanceCombo = document.getElementById("distance");
        
        availableDistances.forEach(function(dist, index){
            var option = document.createElement("option");
            
            option.setAttribute("value", dist);
            
            if (dist === 0){
                option.className += ' unlimited';
                option.innerText = 'Everywhere';
            }
            else {
                option.innerText = dist + 'm';
            }
            
            distanceCombo.appendChild(option);
            
            if (dist === maxDistance)
                distanceCombo.selectedIndex = index;
        });
        
        distanceCombo.addEventListener('change', function(){
            if (this.selectedIndex < 0)
                return;
            
            maxDistance = parseInt(this.options[this.selectedIndex].value);

            _updateDealList();
        });
        
        // selezione prezzi
        var prizeCombo = document.getElementById("prize");
        
        availablePrize.forEach(function(prize, index){
            var option = document.createElement("option");
            
            option.setAttribute("value", prize);
            
            if (prize === 0){
                option.className += ' unlimited';
                option.innerText = 'I\'m rich';
            }
            else {
                option.innerText = prize + '€';
            }
            
            prizeCombo.appendChild(option);
            
            if (prize === maxPrize)
                prizeCombo.selectedIndex = index;
        });
        
        prizeCombo.addEventListener('change', function(){
            if (this.selectedIndex < 0)
                return;
            
            maxPrize = parseInt(this.options[this.selectedIndex].value);

            _updateDealList();
        });
    };
    
    var _startServices = function(){
        
        console.log("Services started");
    };
    
    var _updateDealList = function(){
        var availableDeals =
            deals.filter(function(deal){
                // scaduta
                if (deal.expiry < new Date())
                    return false;
                
                // magazzino finito
                if (deal.stock === 0)
                    return false;
                
                // troppo lontana
                if (maxDistance > 0 && deal.distance < maxDistance)
                    return false;
                
                // troppo costosa
                if (maxPrize > 0 && deal.prize < maxPrize)
                    return false;
                
                return true;
            });
            
        var overviewContainer = document.getElementById('overview');
                
        while (overviewContainer.hasChildNodes())
            overviewContainer.removeChild(overviewContainer.lastChild);
        
        if (availableDeals.length === 0){
            overviewContainer.innerText = 'No deals available';
            return;
        }
    };
    
    return {      
        start: function(){
            _startServices();
            
            _setupOverviewSection();
         
            _updateDealList();
            
            console.log("App started");
        }
    };
}());


