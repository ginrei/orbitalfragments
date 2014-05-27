Array.prototype.max = function() {
	return Math.max.apply(null, this);
};

Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

Array.prototype.randomInRange = function() {
	return this.min() + Math.round(Math.random() * Math.abs(this.max() - this.min()));
};

Number.prototype.randomInRange = function() {
	return this;
}

function Fragment(centerPoint, innerRadius, outerRadius, startAngle, endAngle){
	this.center = centerPoint;
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.startAngle = startAngle;
	this.endAngle = endAngle;
	this.angle = endAngle - startAngle;

	this.innerArcStartPoint = new Point(this.innerRadius * Math.sin(this.startAngle), this.innerRadius * Math.cos(this.startAngle)) + this.center;
	this.innerArcEndPoint = new Point(this.innerRadius * Math.sin(this.endAngle), this.innerRadius * Math.cos(this.endAngle)) + this.center;
	this.innerArcMiddlePoint = new Point(this.innerRadius * Math.sin(this.startAngle + this.angle/2), this.innerRadius * Math.cos(this.startAngle + this.angle/2)) + this.center;
	this.outerArcStartPoint = new Point(this.outerRadius * Math.sin(this.startAngle), this.outerRadius * Math.cos(this.startAngle)) + this.center;
	this.outerArcEndPoint = new Point(this.outerRadius * Math.sin(this.endAngle), this.outerRadius * Math.cos(this.endAngle)) + this.center;
	this.outerArcMiddlePoint = new Point(this.outerRadius * Math.sin(this.startAngle + this.angle/2), this.outerRadius * Math.cos(this.startAngle + this.angle/2)) + this.center;

	this.path = new Path({
		fillColor: 255,
		pivot: this.center
	});

	this.path.moveTo(this.innerArcStartPoint);
	this.path.arcTo(this.innerArcMiddlePoint, this.innerArcEndPoint);
	this.path.lineTo(this.outerArcEndPoint);
	this.path.arcTo(this.outerArcMiddlePoint, this.outerArcStartPoint);
	this.path.closePath();
}

Fragment.prototype = {
	iterate: function() {
		this.updateShape();
	},

	updateShape: function() {
	}
}

function Orbit(centerPoint, fragmentNumRange, fragmentRadius, fragmentWidth, fragmentAngleRange, slitAngleRange, angularVelocity){
	this.center = centerPoint;
	this.vAngle = angularVelocity;
	this.orbit = new Group();
	this.fragments = [];
	this.fragmentNum = fragmentNumRange.randomInRange();
	this.innerRadius = fragmentRadius;
	this.outerRadius = fragmentRadius + fragmentWidth;
	
	for (var i = 0, currentAngle = 0; i < this.fragmentNum; i++) {
		var fragmentAngle = fragmentAngleRange.randomInRange();
		var slitAngle = slitAngleRange.randomInRange();
		var fragment = new Fragment(this.center, this.innerRadius, this.outerRadius, currentAngle, currentAngle + fragmentAngle);
		this.orbit.addChild(fragment.path);
		this.fragments.push(fragment);
		currentAngle += fragmentAngle + slitAngle;
	}
}

Orbit.prototype = {
	iterate: function() {
		for (var i = 0; i < this.fragmentNum; i++) {
			this.orbit.children[i].scale(scaleOffset + Math.random() * scaleVelocity);
		} 

		this.orbit.rotate(this.vAngle);
	},

	updateShape: function() {
	}
}

var system = new Item();
var orbits;
var orbitsNum = 4;
var arcsNum	  = 10;
var scaleOffset = 1;
var scaleVelocity = 0;


function init (){
	project.clear();
	orbits    = [];
	for (var i = 0, radius = 100; i < orbitsNum; i++) {
		var orbit = new Orbit(view.center, [80, 90], radius, 6, [Math.PI/100, Math.PI/120], Math.PI/60, Math.random()*2 - 1);
		orbits.push(orbit);
		system.addChild(orbit.orbit);
		radius += 10;
	}
}

function onFrame() {	
	for (var i = 0; i < orbitsNum; i++){
		orbits[i].iterate();
	}
}

jQuery(document).ready(function () {
	$('.initOrbits').click(function(){
		scaleOffset = Number($(this).attr("offset"));
		scaleVelocity = Number($(this).attr("velocity"));
		console.log(scaleOffset + ", " + scaleVelocity);
		init();
	});
});

init();