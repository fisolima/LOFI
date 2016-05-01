/* global lofi */

"use strict";

lofi.app = (function(){
    
    var maxDistance = 1000;
    var availableDistances = [100, 200, 500, 1000, 1500, 2000, 0];
    
    var maxPrize = 500;
    var availablePrize = [10, 20, 50, 100, 250, 500, 1000, 0];
    
    var deals = [];
    var selectedDeal = null;
    
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

            _showDealList();
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

            _showDealList();
        });
    };
    
    var _setupDetailsSection = function(){
        var backButton = document.getElementById('detailsBack');
        
        backButton.addEventListener('click', function(){
            _switchSection('overview');
        });
        
        var confirmButton = document.getElementById('detailsConfirm');
        
        confirmButton.addEventListener('click', function(){
            _switchSection('reserve');
        });
    };
    
    var _setupRequestSection = function(){
        var cancelButton = document.getElementById('requestCancel');
        
        cancelButton.addEventListener('click', function(evt){
            evt.preventDefault();
            
            _switchSection('overview');
        });
        
        var form = document.getElementById('reserveForm');
        
        form.addEventListener('submit', function(evt){            
            evt.preventDefault();
            
            lofi.DealService.reserveDeal(
                    form['reserveName'].value, 
                    form['reserveAddress'].value,
                    selectedDeal.id,
                    function (){
                        _confirmMessage('request sent!');
                        
                        _switchSection('overview');
                    },
                    _errorMessage);
        });
    };
    
    var _updateDeals = function(newDeals){
        if (newDeals === null)
            deals.length = 0;
        else
            deals = newDeals;
        
        _showDealList();
    };
    
    var _errorMessage = function(msg){
        // TODO visualizzare in dialog
        alert('Error: ' + msg);
    };
    
    var _confirmMessage = function(msg){
        // TODO visualizzare in dialog
        alert('Success: ' + msg);
    };
    
    var _getPosition = function(){
        
        // Test: considero l'utente nel punto zero
        // TODO prendere positione da navigator.geolocation.getCurrentPosition
        return {
            x: 0,
            y: 0
        };
    };
    
    var _startServices = function(){
        lofi.DealService.registerDealScan(_updateDeals, _getPosition, _errorMessage);
        
        console.log("Services started");
    };
    
    var _switchSection = function(sectionId){
        var sections = document.querySelectorAll("section.mainSection");
        
        for (var i=0; i<sections.length; i++)
            sections[i].style.display = 'none';
        
        var selectedSection = document.getElementById(sectionId);
        
        selectedSection.style.display = 'block';
    };
    
    var _selectDeal = function(dealId){
        selectedDeal = null;
                         
        for(var i=0; i<deals.length; i++){
           if (deals[i].id === dealId){
               selectedDeal = deals[i];
               break;
           }
        }
        
        if (!selectedDeal)
            return;
        
        // cambia pagina, mostra i dettagli dell'offerta
        _switchSection('details');
        
        // tempo stimato consegna
        var pickUpElement = document.getElementById('reservePickUpTime');
        pickUpElement.value = selectedDeal.estimatedDeliver + ' minutes';
        
        lofi.DealRenderHelper.renderDetails(selectedDeal);
    };
    
    var _showDealList = function(){
        var availableDeals =
            deals.filter(function(deal){
                // scaduta
                if (deal.expiry < new Date())
                    return false;
                
                // magazzino finito
                if (deal.stock === 0)
                    return false;
                
                // troppo lontana
                if (maxDistance > 0 && deal.distance > maxDistance)
                    return false;
                
                // troppo costosa
                if (maxPrize > 0 && deal.prize > maxPrize)
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
        
        availableDeals.forEach(function(deal){
            lofi.DealRenderHelper.renderOverview(deal, overviewContainer, _selectDeal);
        });
    };
    
    return {      
        start: function(){
            _switchSection('overview');
            
            _startServices();
            
            _setupOverviewSection();
            
            _setupDetailsSection();
            
            _setupRequestSection();
            
            lofi.DealService.getDeals();
            
            console.log("App started");
        }
    };
}());


