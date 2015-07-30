ngFlowGrid
==========

pinterest layout like responsive image grid for AngularJS app with no jQuery dependency;

![preview](snapshot.jpg 'ngFlowGrid preview')

#Installation

	bower install ngFlowGrid#latest


1.include angularJS and ngFlowGrid to your page:

```html
<script src="path/angular.min.js"></script>
<script src="src/ngFlowGrid.js"></script>

```
2.add ngFlowGrid to your app's dependency:
```javascript
var myApp = angular.module('myAppName', ['ngFlowGrid']);
```

3.use ngFlowGrid directive in you html code:
```html
<ul class="flowGrid" ng-flow-grid="homePageGrid" min-item-width="200">
	<li class="flowGridItem" ng-repeat="item in items">
		<a href=""><img ng-src="{{item.img}}"></a>
		<h2>{{item.description}}</h2>
	</li>
</ul>

```

4.add some basic css to format the layout

```css
*{box-sizing: border-box;}
.flowGrid:before,.flowGrid:after{
	content: "";
	display: table;
}
.flowGrid:after{
	clear:both;
}
.flowGridItem{ margin-bottom:10px;}
.flowGridItem img{width:100%;}
.flowGridColumn{
	float: left;
	padding-left: 10px;
}
.flowGridColumn:last-of-type{
	padding-right: 10px;
}

```
5.control the grid in your controller:
```javascript
app.controller('appCtrl',['$scope','fgDelegate',function($scope,fgDelegate){
	
	$scope.updateGrid = function(){
		var homePageGrid = fgDelegate.getFlow('homePageGrid');
	
		// then you can:
		homePageGrid.minItemWidth += 20;
    	homePageGrid.refill(true);
	}

}]);

```
take look at demo app;


#Directive options
###ngFlowGrid
give a name for your grid, so that you can controll mutil grid in one page.
###itemSelector(default:'.flowGridItem')
###minItemWidth(default:150)
this value will affect how many columns you have, the smaller it is the more columns there will be;

#Service
through `fgDelegate` service you can get flow object and controll it in your controller or directive:

###new(option)
options are:
 - `container`: container element.
 - `name`: string,the name of new grid.
 - `itemSelector`: string
 - `minItemWidth`: number, this will affect how many columns in grid;

###getFlow(name)
this will return a flowgrid object ,and you can controll that grid throght this object
 - `minItemWidth`:number
 - `container`:element
 - `autoCalculation`: boolean
 - `columnsHeights`: array
 - `itemsHeights`: object
 - `items`: array of element
 - `refill([forceRefill]) `: calculate culums based on minItemWidth,and put items into columns; [forceRefill]:boolean;
 - `itemsChanged()`: tell flow grid you have added or removed items in your controller; before you call this method, make sure ngRepeat is finished rendering ,so you should call it like this:

```javascript
 	// make sure ngRepeat is finished rendering
	$scope.$watch('$last',function(){
		fgDelegate.getFlow('demoGrid').itemsChanged();
	});
```
 - `empty()` : remove all items inside of columns
