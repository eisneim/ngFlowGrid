ngFlowGrid
==========

pinterest layout like responsive image grid using AngularJS (and currently using jquery , will remove jquery in the next version);

#Installation
1.include angularJS, jquery and ngFlowGrid to your page:

```html
<script src="path/jquery.js"></script>
<script src="path/angular.min.js"></script>
<script src="src/ngFlowGrid.js"></script>

```

2.use ngFlowGrid directive in you html code:
```html
<ul class="flowGrid" ng-flow-grid="homePageGird" min-item-width="200">
	<li class="flowGridItem" ng-repeat="item in items">
		<a href=""><img ng-src="{{item.img}}"></a>
		<h2>{{item.description}}</h2>
	</li>
	......
</ul>

```

3.add some basic css to format the layout

```css

.flowGrid:before,.flowGrid:after{
	content: "";
	display: table;
}
.flowGrid:after{
	clear:both;
}
.flowGridItem{
	margin-bottom: 5px;
	a{color:#555;}
	&>a>img{width: 100%;}
	&>h4{margin: 2px 0;font-size: 14px;}
	.itemStat{font-size: 18px;color: #999;}	
}
.flowGridColumn{
	float: left;
	padding-left: 10px;
}
.flowGridColumn:last-of-type{
	padding-right: 10px;
}

```
4.controll the gird in your controller:
```javascript
app.controller('appCtrl',['$scope','fgDelegate',function($scope,fgDelegate){
	
	var homePageGrid = fgDelegate.getFlow('homePageGird');
	
	// then you can:
	homePageGrid.minItemWidth = 150;
	homePageGrid.refill();

}]);

```

#API

