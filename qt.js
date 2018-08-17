//QuadTree1
//Coordinates are based on TOP_LEFT XY

class Point {

	constructor(x, y) {

		this.x = x;
		this.y = y;

	}

	isContained(q) {

		if (this.x >= q.x + q.w
			|| this.x < q.x
			|| this.y >= q.y + q.h
			|| this.y < q.y) {

				return false;

			} else {return true;}

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

	intersects(q) {

		//The equals are because of the top and left edge tesselation
		if (q.x + q.w < this.x
			|| q.x > this.x + this.w
			|| q.y + q.h < this.y
			|| q.y > this.y + this.h
		) {

			return false;

		} else {return true;}

	}

	queryContained(q) {

		if (!this.intersects(q)) {return [];}

		if (this.childs.length == 0) {

			return this.points;

		} else {

			let queryPoints = [];

			for (let i = 0; i < this.childs.length; i++) {

				//Add all the points to the end of queryPoints
				Array.prototype.push.apply(queryPoints, this.childs[i].queryContained(q));

			}

			return queryPoints;

		}

	}

	getLeaves() {

		//Return if this is a leaf
		if (this.childs.length == 0) {return [this];}

		let leaves = [];

		for (let i = 0; i < this.childs.length; i++) {

			Array.prototype.push.apply(leaves, this.childs[i].getLeaves());

		}

		return leaves;

	}

}

class QuadTree {

  	constructor(w, h, c) {

    	this.w = w;
    	this.h = h;
    	this.c = c;
		this.queryQuadrant = new Quadrant(0, 0, this.w, this.h, this);
		this.queryPoints = [[], []]; //A 2DArray to store the queries
    	this.allPoints = []; //A log of all inserted points
		//The origin point is 0,0 for the QuadTree
    	this.rootQuadrant = new Quadrant (0, 0, this.w, this.h, this);

  	}

	getAllPoints() {return this.allPoints;}

	getQueryArea() {return this.queryQuadrant;}

	getLatestQuery() {return this.queryPoints;}

	getRootQuadrant() {return this.rootQuadrant;}

	//Return an array of all non-subdivided quadrants (leaves)
	getLeaves() {

		return this.rootQuadrant.getLeaves();

	}

	clear() {

		this.allPoints = [];
    	this.rootQuadrant = new Quadrant (0, 0, this.w, this.h, this);
		return;

	}

	remake() {

		let allPoints = this.allPoints;

		this.clear();

		for (let p of allPoints) {

			this.insert(p);

		}

	}

  	insert(p) {

    	//If p is not a Point object don't do anything.
    	if (!(p instanceof Point)) {
			console.log("Cannot insert anything but Point objects");
			return;
		}

		//Prevent duplicates
		for (let p2 of this.allPoints) {

			if (p.x == p2.x && p.y == p2.y) {return;}

		}

    	//Add it to the root list
    	this.allPoints.push(p);

    	//Let the Quadrants manage themselves
    	this.rootQuadrant.insert(p);

  	}

	query(x, y, w, h) {

		this.queryQuadrant = new Quadrant(x, y, w, h, this);

		//Clear query[0] with possible points and query[1] with contained points.
		this.queryPoints = [[], []];

		this.queryPoints[0] = this.rootQuadrant.queryContained(this.queryQuadrant);
		this.queryPoints[1] = [];

		for(let i = 0; i < this.queryPoints[0].length; i++) {

			if (this.queryPoints[0][i].isContained(this.queryQuadrant)) {

				this.queryPoints[1].push(this.queryPoints[0][i]);

			}

		}

		return this.queryPoints;

	}

}
