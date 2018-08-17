function setup() {

	areaR = 50;
	pointSize = 6;
	strokeWheight = 2;
	initialPoints = 500;

  	createCanvas(windowWidth, windowHeight);

  	qt = new QuadTree(windowWidth, windowHeight, 1);

  	for (let i = 0; i < initialPoints; i++) {

	  	qt.insert(new Point(random(windowWidth), random(windowHeight)));

 	}

	qt.query(0, 0, windowWidth, windowHeight);

}

function draw() {

	//qt.remake();

	background(255);
	strokeWeight(strokeWheight);
	noFill();

	//Draw Quadrants (leaves)
	stroke(0);
	let leaves = qt.getLeaves();
	for (let i = 0; i < leaves.length; i++) {

		rect(leaves[i].x, leaves[i].y, leaves[i].w, leaves[i].h);

	}

	let query = qt.query(mouseX - areaR/2, mouseY - areaR/2, areaR, areaR);
	let allPoints = qt.getAllPoints();

	//Draw the Query Area
	stroke(0,255,0);
	rect(mouseX - areaR/2, mouseY - areaR/2, areaR, areaR);

	//Draw all the Points
	fill(0);
	noStroke();
	for (let i = 0; i < allPoints.length; i++) {

		ellipse(allPoints[i].x, allPoints[i].y, pointSize, pointSize);

	}

	//Draw all the Candidate points
	fill(255, 0, 0);
	for (let i = 0; i < query[0].length; i++) {

		ellipse(query[0][i].x, query[0][i].y, pointSize, pointSize);

	}

	for (let i = 0; i < query[1].length; i++) {

		stroke(0, 255, 0);
		line(query[1][i].x, query[1][i].y, mouseX, mouseY);

	}

	//Draw all the Contained Points

	for (let i = 0; i < query[1].length; i++) {

		fill(0, 255, 0);
		noStroke();
		ellipse(query[1][i].x, query[1][i].y, pointSize + 1, pointSize + 1);

	}

	//Draw the cursor
	fill(0, 100, 255);
	ellipse(mouseX, mouseY, pointSize + 1, pointSize + 1);

}

//Reactive sizing
function windowResized() {

 	setup();

}

function mouseClicked() {

	qt.insert(new Point(mouseX, mouseY));

}

function mouseWheel(event) {

	let temp = areaR;

	areaR += event.delta;

	if (areaR < 0) {areaR = 0}

}
