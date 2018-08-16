//QuadTree1
//Coordinates are based on TOP_LEFT XY

class Point {

	constructor(x, y) {

		this.x = x;
		this.y = y;

	}

}

class Quadrant {

	constructor(x, y, w, h, p) {

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.parent = p; //Parent reference

		//Get the capacity from QuadTree or another Quadrant
		this.c = this.parent.c;
	 	this.points = []; //Points stored

		//Divided
		this.childs = [];

  	}

  	insert(p) {

		//This check tesselates including only left and top edges.
		if (p.x >= this.x + this.w || p.x < this.x || p.y >= this.y + this.h || p.y < this.y) {return;}

    	if (this.points.length < this.c && this.childs.length == 0) {

			this.points.push(p);

    	} else {

			//Add the point and let it rework its data.
			this.points.push(p);
      		this.subdivide();

    	}

  	}

	subdivide() {

		//Create the subQuadrants only once
		if (this.childs.length == 0) {

			this.childs.push(new Quadrant(this.x, this.y, this.w/2, this.h/2, this));
			this.childs.push(new Quadrant(this.x + this.w/2, this.y, this.w/2, this.h/2, this));
			this.childs.push(new Quadrant(this.x, this.y + this.h/2, this.w/2, this.h/2, this));
			this.childs.push(new Quadrant(this.x + this.w/2, this.y + this.h/2, this.w/2, this.h/2, this));

		}

		//Broadcast the points to insert into the childs.
		for (let i = 0; i < this.points.length; i++) {

			for (let j = 0; j < this.childs.length; j++) {

				this.childs[j].insert(this.points[i]);

			}

		}

		this.points.length = 0;

	}

	draw() {

		for (let i = 0; i < this.childs.length; i++) {

			this.childs[i].draw();

		}

		rect(this.x, this.y, this.w, this.h);

	}

}

class QuadTree {

  	constructor(w, h, c) {

    	this.w = w;
    	this.h = h;
    	this.c = c;
    	//The origin point is 0,0 for the QuadTree
    	this.allPoints = [];
    	this.rootQuadrant = new Quadrant (0, 0, width, height, this);

  	}

  	insert(p) {

    	//If p is not a Point object don't do anything.
    	if (!(p instanceof Point)) {
			console.log("Cannot insert anything but Point objects");
			return;
		}

    	//Add it to the root list
    	this.allPoints.push(p);

    	//Let the Quadrants manage themselves
    	this.rootQuadrant.insert(p);

  	}

	draw() {

		stroke(255);
		noFill();
		this.rootQuadrant.draw();
		rect(0, 0, this.w, this.h);
		for (let i = 0; i < this.allPoints.length; i++) {

			ellipse(this.allPoints[i].x, this.allPoints[i].y, 3, 3);

		}

	}

}
