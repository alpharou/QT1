function setup() {

  createCanvas(windowWidth, windowHeight);

  qt = new QuadTree(windowWidth, windowHeight, 2);

  for (let i = 0; i < 0; i++) {

	  qt.insert(new Point(random(windowWidth), random(windowHeight)));

  }

}

function draw() {

	background(0);

	//Test
	stroke(255);
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
