/*! 
 * ngFlowGrid v0.0.1
 * http://eisneim.github.io/ngFlowGrid
 * Copyright (c) 2014 eisneim.com
 * License: MIT
 */

/**
 * TODO 
 * 1.css3 transition option
 * 2. in one column split 2 image;
 */
(function() {

'use strict';

angular.module('ngFlowGrid', [])
	.factory('fgDelegate',[function(){
		var cnt = 0;// for generating id

		var flows = {};//store all flowGrid instance;
		var Flow = function(data){
			// delete old one if exists
			if(flows[data.name]){
				delete flows[data.name];
			}

			var flowInstance = this;

			this.keyName = data.name||'ngFlow_'+ cnt++;// there might be more than 1 flow grid
			this.__uid_item_counter = 0;

			this.minItemWidth = parseInt(data.minItemWidth,10) || 150;
			this.itemSelector = data.itemSelector;
			this.autoCalculation = true;//false, you have to put height in img tag;
			this.columns = []; // array of html elements

			this.columnsHeights = [];
			this.itemsHeights = {};

			this.container = data.container;//html element, not jquery object;
			this.items = this.container.querySelectorAll( this.itemSelector||'.flowGridItem');
			this.tempContainer = document.createElement('div');
			this.tempContainer.className = 'flowGridTemp';
			// put temp container to container, 
			this.container.appendChild( this.tempContainer );

			
			// hide the container temporarily,while doing the transform
			this.container.style['visibility'] = 'hidden';
			this.tempContainer.style['visibility'] = 'hidden';
			// start to calculate columns and fill items;
			this.refill();
			// when resize we also need to refill
			window.addEventListener('resize', this.refill.bind( this ) );

			// console.log(this.items);
			// console.log(this.container);
			// console.log(this.itemsHeights);
			// console.log(this.itemsHeights);
		}

		Flow.prototype.refill = function( forceRefill ){
			var that = this;
			// give every item a ubique id
			Array.prototype.forEach.call(this.items, function(elm){
				var id = elm.getAttribute('id');
				// give every item a unique id
				if (!id) {
					// Generate an unique id
					id = that.generateUniqueId();
					elm.setAttribute('id', id);
				}
			});

			this.numberOfColumns = Math.floor(this.container.clientWidth / this.minItemWidth);
			// always keep at least one column 
			if (this.numberOfColumns < 1)
	            this.numberOfColumns = 1;

	        var needToRefill = this.ensureColumns();
	        if (needToRefill || forceRefill == true) {
				this.fillColumns();

				var shouldBeRemoved = this.container.querySelectorAll('.flowGridColumn.shouldBeRemoved');
				[].forEach.call(shouldBeRemoved,function(elm){
					that.container.removeChild( elm );
				});
			}
			this.container.style['visibility'] = 'visible';

		}
		Flow.prototype.ensureColumns = function(){
			var createdCnt = this.columns.length;
			var calculatedCnt = this.numberOfColumns;
			
			// console.log('createdCnt',createdCnt);
			// console.log('calculatedCnt',calculatedCnt);

			this.tempContainer.style.width = this.container.clientWidth;
			// in the first time, working container is tempContainer
			this.workingContainer = createdCnt === 0 ? this.tempContainer : this.container;
			// if  columns are not enough, we add new columns
			if (calculatedCnt > createdCnt) {
				// how many more do we need?
				var neededCnt = calculatedCnt - createdCnt;
				for (var columnIdx = 0; columnIdx < neededCnt; columnIdx++) {
					var column = document.createElement('div');
					column.className = 'flowGridColumn';

					this.workingContainer.appendChild(column);
				}

			// what we already have is more than what we need, we hide what we don't need;
			}else if(calculatedCnt < createdCnt){
				var lastColumn = createdCnt;
				while (calculatedCnt < lastColumn) {
					// We can't remove columns here becase it will remove items to. So we hide it and will remove later.
					this.columns[lastColumn-1].style['visibility'] = 'hidden';
					this.columns[lastColumn-1].classList.add('shouldBeRemoved');
					lastColumn--;
					// console.log('---loop for remove old columns');
				}

				var diff = createdCnt - calculatedCnt;
				// reduce the length of columnsHeights
				this.columnsHeights.splice(this.columnsHeights.length - diff, diff);
			}
			// we already make column exactly what we need ,now make the emtp this.column array to be filled with element;
			if (calculatedCnt !== createdCnt) {
				this.columns = this.workingContainer.querySelectorAll('.flowGridColumn:not(.shouldBeRemoved)');

				for(var jj=0; jj< this.columns.length; jj++){
					this.columns[jj].style['width'] = (100 / calculatedCnt) + '%';
				}
				return true;
			}
			return false;
		}
		Flow.prototype.fillColumns = function(){
			var columnsCnt = this.numberOfColumns;
			var itemsCnt = this.items.length;
			// loop through all colums ,and add item to it
			for (var columnIdx = 0; columnIdx < columnsCnt; columnIdx++) {
				var column = this.columns[columnIdx];
				this.columnsHeights[columnIdx] = 0;
				for (var itemIdx = columnIdx; itemIdx < itemsCnt; itemIdx += columnsCnt) {
					var item = this.items[itemIdx];
					var height = 0;
					column.appendChild(item);
					if (this.autoCalculation) {
						// Check height after being placed in its column
						height = item.offsetHeight;
					}else {
						// Read img height attribute
						height = parseInt(item.querySelector('img').getAttribute('height'), 10);
					}
					// record their height
					this.itemsHeights[item.id] = height;
					this.columnsHeights[columnIdx] += height;
				}
			}

			// console.log(this.itemsHeights);
			// console.log(this.columnsHeights);

			// prevent too much height difference between colums
			this.levelBottomEdge(this.itemsHeights, this.columnsHeights);
			// first time workingContainer is tempContainer, otherwise is this.container;
			if (this.workingContainer === this.tempContainer) {
				for(var kk= this.tempContainer.children.length-1;kk>=0 ; kk--){
					this.container.appendChild(this.tempContainer.children[kk] );
				}
				this.tempContainer.innerHTML = '';
			}

		};
		// rearrange
		Flow.prototype.levelBottomEdge = function(itemsHeights, columnsHeights){
			while (true) {
				// get indexof lowest and highest column
				var lowestColumn = columnsHeights.indexOf( Math.min.apply(null, columnsHeights) );
				var highestColumn = columnsHeights.indexOf( Math.max.apply(null, columnsHeights) );
				if (lowestColumn === highestColumn) return;// nothing to do ,return;

				var lastInHighestColumn = this.columns[highestColumn].lastChild;
				var lastInHighestColumnHeight = itemsHeights[ lastInHighestColumn.id ];
				
				var lowestHeight = columnsHeights[lowestColumn];
				var highestHeight = columnsHeights[highestColumn];
				var newLowestHeight = lowestHeight + lastInHighestColumnHeight;

				// not much difference between lowest and highest, return
				if (newLowestHeight >= highestHeight) return;

				// too much difference between lowest and highest,
				// move last item in the highest to the lowest column
				this.columns[lowestColumn].appendChild(lastInHighestColumn);
				// update new hight record;
				columnsHeights[highestColumn] -= lastInHighestColumnHeight;
				columnsHeights[lowestColumn] += lastInHighestColumnHeight;
			}
		};

		Flow.prototype.generateUniqueId = function() {
			// Increment the counter
			this.__uid_item_counter++;

			// Return an unique ID
			return this.keyName + '-itemid-' + this.__uid_item_counter;
		}

		Flow.prototype.add = function(){

		}
		Flow.prototype.empty = function(){
			var columnsCnt = this.numberOfColumns;

			this.items = [];
			this.itemsHeights = {};

			for (var columnIdx = 0; columnIdx < columnsCnt; columnIdx++) {
				var column = this.columns.eq(columnIdx);
				this.columnsHeights[columnIdx] = 0;
				column.innerHTML = '';
			}
		}
		Flow.prototype.recomputeHeights = function(){
			var columnsCnt = this.numberOfColumns;
			for (var columnIdx = 0; columnIdx < columnsCnt; columnIdx++) {
				var that = this;
				var column = this.columns.eq(columnIdx);

				this.columnsHeights[columnIdx] = 0;
				for(var ii=0; ii<column.children.length; ii++ ){
					var height = 0;
					var item = column.children[ii];
					if (that.autoCalculation) {
						// Check height after being placed in its column
						height = item.offsetHeight;
					}else {
						// Read img height attribute
						height = parseInt( item.querySelectorAll('img').getAttribute('height'), 10 );
					}

					that.itemsHeights[ item.id ] = height;
					that.columnsHeights[columnIdx] += height;
				}
			}
			
		}
		Flow.prototype.itemsChanged = function(){
			this.items = this.container.querySelectorAll( this.itemSelector||'.flowGridItem');	
			this.refill(true);	
		}

		return {
			new:function(option){
				flows[option.name] = new Flow(option);
				return flows[option.name];
			},
			getFlow:function(name){
				return flows[name];
			}
		}
	}])
	.directive('ngFlowGrid',['fgDelegate','$timeout',function(amzFlowDelegate,$timeout){
		return {
			restrict:'A',
			link:function($scope,element,attrs){
				function newGrid(){
					var flow = amzFlowDelegate.new({
						container: element[0],
						name: attrs['ngFlowGrid'] || 'ngFlowGrid',
						itemSelector: attrs['itemSelector'] || '.flowGridItem',
						minItemWidth: attrs['minItemWidth']||150,
					});
				}
				// you can watch $last as well;
				$scope.$watch(element.children(),newGrid);

				$scope.$on('$destroy',function(){
					$(window).unbind('resize',false);
				});
			}
		}
	}]);


})();