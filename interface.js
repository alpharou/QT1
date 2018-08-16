function setup() {

  createCanvas(windowWidth, windowHeight);

  qt = new QuadTree(windowWidth, windowHeight, 1);

  for (let i = 0; i < 0; i++) {

	  qt.insert(new Point(random(windowWidth), random(windowHeight)));

  }

}

function draw() {

	background(255);

	stroke(0);
	strokeWeight(3);
	noFill();

	//DRAW!
	qt.draw();

}

//Reactive sizing
function windowResized() {

 	setup();

}

function mouseClicked() {

	qt.insert(new Point(mouseX, mouseY));


}
