var app = angular.module('demo', ['ngFlowGrid']);

app.controller('appCtrl',['$scope','fgDelegate',function($scope,fgDelegate){
	$scope.items = [
		{
			img:'http://placehold.it/300x600/E97452/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/300x300/4C6EB4/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/300x250/449F93/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/200x320/936FBC/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/400x500/D25064/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/300x200/CF364A/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/300x400/E59649/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/350x500/75A0CC/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/300x200/4296AD/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/300x400/9FDBC7/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		{
			img:'http://placehold.it/300x300/4E8EF7/fff',
			name:'Lorem ipsum dolor sit amet',
		},
		
	]

    $scope.addItem = function(){
    	var randomIndex = Math.floor(Math.random(0,1)* $scope.items.length)
    	var newItem = {
    		name:$scope.items[randomIndex].name,
    		img:$scope.items[randomIndex].img
    	}
    	// add a new item;
    	$scope.items.splice(0,0,newItem);

    	// make sure ngRepeat is finished rendering
    	$scope.$watch('$last',function(){
			fgDelegate.getFlow('demoGird').itemsChanged();
		});
    }

    $scope.changeWidth = function(width){
    	var flow = fgDelegate.getFlow('demoGird')

    	flow.minItemWidth += width;
    	fgDelegate.getFlow('demoGird').refill(true);
    }

    // then you can:
    // homePageGrid.minItemWidth = 150;
    // homePageGrid.refill();

}]);