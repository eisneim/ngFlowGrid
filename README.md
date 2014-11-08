ngFlowGrid
==========

pinterest layout like responsive image grid for AngularJS app (and currently using jquery , will remove jquery in next version);

![preview](snapshot.jpg 'ngFlowGrid preview')

#Installation
1.include angularJS, jquery and ngFlowGrid to your page:

```html
<script src="path/jquery.js"></script>
<script src="path/angular.min.js"></script>
<script src="src/ngFlowGrid.js"></script>

```
2.add ngFlowGrid to your app's dependency:
```javascript
var myApp = angular.module('myAppName', ['ngFlowGrid']);
```

3.use ngFlowGrid directive in you html code:
```html
<ul class="flowGrid" ng-flow-grid="homePageGird" min-item-width="200">
	<li class="flowGridItem" ng-repeat="item in items">
		<a href=""><img ng-src="{{item.img}}"></a>
		<h2>{{item.description}}</h2>
	</li>
	......
</ul>

```

4.add some basic css to format the layout

```css

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
5.controll the gird in your controller:
```javascript
app.controller('appCtrl',['$scope','fgDelegate',function($scope,fgDelegate){
	
	var homePageGrid = fgDelegate.getFlow('homePageGird');
	
	// then you can:
	homePageGrid.minItemWidth = 150;
	homePageGrid.refill();

}]);

```

#Directive options
###ngFlowGrid
give a name to your grid, so that you can control mutil grid in one page.
###itemSelector(default:'.flowGridItem')
###minItemWidth(default:150)
this value will affect how many colums you have, the smaller it is the more columns there will be;

#Service
the through `fgDelegate` service you can get your flow object and you can controll it in your controller or directive:

###new(option)
options are:
 - `container`: container element.
 - `name`: string,the name of new grid.
 - `itemSelector`: string
 - `minItemWidth`: number, this will affect how many columns in grid;
###getFlow(name)
 this will return a flowgrid object ,and you can controll that grid throght this object
  - minItemWidth:number
  - container:element
  - autoCalculation: boolean
  - columnsHeights: array
  - itemsHeights: object
  - items: array of element
  - refill() : calculate culums based on minItemWidth,and put items into columns;
  - empty() : remove all items inside of columns
