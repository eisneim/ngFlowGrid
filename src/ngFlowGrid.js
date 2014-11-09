/*! 
 * ngFlowGrid v0.0.1
 * http://eisneim.github.io/ngFlowGrid
 * Copyright (c) 2014 eisneim.com
 * License: MIT
 */

(function() {

'use strict';

angular.module('ngFlowGrid', [])
	.factory('fgDelegate',[function(){
		var cnt = 0;// for generate id

		var flows = {};// all flow instance;
		var Flow = function(data){
			// delete old one
			if(flows[data.name]){
				delete flows[data.name];
			}

			this.keyName = data.name||'amzFlow_'+ cnt++;// there might be more than 1 flow grid
			this.__uid_item_counter = 0;

			this.minItemWidth = parseInt(data.minItemWidth,10) || 150;
			this.itemSelector = data.itemSelector;
			this.autoCalculation = true;//false, you have to puat height in image
			this.columns = $([]);

			this.columnsHeights = [];
			this.itemsHeights = {};

			this.container = data.container;//element;
			this.items = this.container.find( this.itemSelector||'.flowGridItem');
			this.tempContainer = $('<div class="flowGridTemp">').css('visibility', 'hidden');
			// put temp container to container, 
			this.container.append(this.tempContainer);

			
			// hide the container temporarily,while doing the transform
			this.container.css('visibility', 'hidden');	
			// start
			this.refill();
			// when resize we also need to refill
			$(window).resize($.proxy(this.refill, this));

			// console.log(this.items);
			// console.log(this.container);
			// console.log(this.itemsHeights);
			// console.log(this.itemsHeights);
		}

		Flow.prototype.refill = function(forceRefill){
			var that = this;
			// give every item a ubique id
			this.items.each(function(){
				var elm = $(this);
				var id = elm.attr('id');
				// give every item a unique id
				if (!id) {
					// Generate an unique id
					id = that.generateUniqueId();
					elm.attr('id', id);
				}
			});

			this.numberOfColumns = Math.floor(this.container.width() / this.minItemWidth);
			// always keep at least one column 
			if (this.numberOfColumns < 1)
	            this.numberOfColumns = 1;

	        var needToRefill = this.ensureColumns();
	        if (needToRefill || forceRefill) {
				this.fillColumns();

				// Remove excess columns
				this.columns.filter(':hidden').remove();
				// update this.colums array
				var diff = this.columns.length - this.numberOfColumns;
				this.columns.splice(this.columns.length-diff,diff);
			}
			this.container.css('visibility', 'visible');

		}
		Flow.prototype.ensureColumns = function(){
			var createdCnt = this.columns.length;
			var calculatedCnt = this.numberOfColumns;
			// console.log('createdCnt',createdCnt);
			// console.log('calculatedCnt',calculatedCnt);

			this.tempContainer.width(this.container.width());
			// in the first time, working container is tempContainer
			this.workingContainer = createdCnt === 0 ? this.tempContainer : this.container;
			// if  columns are not enough, we add new columns
			if (calculatedCnt > createdCnt) {
				// how many more do we need?
				var neededCnt = calculatedCnt - createdCnt;
				for (var columnIdx = 0; columnIdx < neededCnt; columnIdx++) {
					var column = $('<div>', {
						'class': 'flowGridColumn'
					});

					this.workingContainer.append(column);
				}
			// what we already have is more than what we need, we hide what we don' need;
			}else if(calculatedCnt < createdCnt){
				var lastColumn = createdCnt;
				while (calculatedCnt <= lastColumn) {
					// We can't remove columns here becase it will remove items to. So we hide it and will remove later.
					this.columns.eq(lastColumn).hide();
					lastColumn--;
				}

				var diff = createdCnt - calculatedCnt;
				// reduce the length of columnsHeights
				this.columnsHeights.splice(this.columnsHeights.length - diff, diff);
			}
			// we already make column exactly what we need ,now make the emtp this.column array to be filled with element;
			if (calculatedCnt !== createdCnt) {

				this.columns = this.workingContainer.find('.flowGridColumn');
				this.columns.each(function(){
					$(this).css('width',(100 / calculatedCnt) + '%');
				});
				return true;
			}
			return false;
		}
		Flow.prototype.fillColumns = function(){
			var columnsCnt = this.numberOfColumns;
			var itemsCnt = this.items.length;
			// loop through all colums ,and add item to it
			for (var columnIdx = 0; columnIdx < columnsCnt; columnIdx++) {
				var column = this.columns.eq(columnIdx);
				this.columnsHeights[columnIdx] = 0;
				for (var itemIdx = columnIdx; itemIdx < itemsCnt; itemIdx += columnsCnt) {
					var item = this.items.eq(itemIdx);
					var height = 0;
					column.append(item);
					if (this.autoCalculation) {
						// Check height after being placed in its column
						height = item.outerHeight();
					}
					else {
						// Read img height attribute
						height = parseInt(item.find('img').attr('height'), 10);
					}
					// record their height
					this.itemsHeights[item.attr('id')] = height;
					this.columnsHeights[columnIdx] += height;
				}
			}
			// prevent too much height difference between colums
			this.levelBottomEdge(this.itemsHeights, this.columnsHeights);
			// first time workingContainer is tempContainer, otherwise is this.container;
			if (this.workingContainer === this.tempContainer) {
				this.container.append(this.tempContainer.children());
				this.tempContainer.empty();
			}
			// this.container.trigger('mosaicflow-layout');
		};
		// rearrange
		Flow.prototype.levelBottomEdge = function(itemsHeights, columnsHeights){
			while (true) {
				// get indexof lowest and highest column
				var lowestColumn = $.inArray(Math.min.apply(null, columnsHeights), columnsHeights);
				var highestColumn = $.inArray(Math.max.apply(null, columnsHeights), columnsHeights);
				if (lowestColumn === highestColumn) return;// nothing to do ,return;

				var lastInHighestColumn = this.columns.eq(highestColumn).children().last();
				var lastInHighestColumnHeight = itemsHeights[lastInHighestColumn.attr('id')];
				
				var lowestHeight = columnsHeights[lowestColumn];
				var highestHeight = columnsHeights[highestColumn];
				var newLowestHeight = lowestHeight + lastInHighestColumnHeight;

				// not much difference between lowest and highest, return
				if (newLowestHeight >= highestHeight) return;

				// too much difference between lowest and highest,
				// move last item in the highest to the lowest column
				this.columns.eq(lowestColumn).append(lastInHighestColumn);
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

			this.items = $([]);
			this.itemsHeights = {};

			for (var columnIdx = 0; columnIdx < columnsCnt; columnIdx++) {
				var column = this.columns.eq(columnIdx);
				this.columnsHeights[columnIdx] = 0;
				column.empty();
			}
		}
		Flow.prototype.recomputeHeights = function(){
			var columnsCnt = this.numberOfColumns;
			for (var columnIdx = 0; columnIdx < columnsCnt; columnIdx++) {
				var that = this;
				var column = this.columns.eq(columnIdx);

				this.columnsHeights[columnIdx] = 0;
				column.children().each(function(){
					var height = 0;
					var item = $(this);
					if (that.autoCalculation) {
						// Check height after being placed in its column
						height = item.outerHeight();
					}
					else {
						// Read img height attribute
						height = parseInt(item.find('img').attr('height'), 10);
					}

					that.itemsHeights[item.attr('id')] = height;
					that.columnsHeights[columnIdx] += height;
				});
			}
			
		}
		Flow.prototype.itemsChanged = function(){
			this.items = this.container.find( this.itemSelector||'.flowGridItem');	
			this.refill(true);	
		}

		return {
			// grab some dom element;
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
						container: element,
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