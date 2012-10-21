var cubepuzzle = function () {

	var scene, camera, renderer, cubes, light, domEvent, matts;
	var radian90 = 90 * (Math.PI/180);
	
	function initialize(width, height) {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
		camera.position.z = 5;
		THREE.Object3D._threexDomEvent.camera(camera);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(width, height);

		$("body").append(renderer.domElement);

		light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(3, 3, 3);
		scene.add(light);

		createMaterials();
		createCubes();
		
		$(document).on('keyup', handleKeyboard);
	}
	
	function handleKeyboard(e) {
		switch (e.which) {
			case 32:
				
				break;
			case 37:
				rotateSelected('left');
				break;
			case 38:
				rotateSelected('up');
				break;
			case 39:
				rotateSelected('right');
				break;
			case 40:
				rotateSelected('down');
				break;			
		}
	}
	
	function rotateSelected(direction) {
		selected = $.grep(cubes, function (n, i) {
			return n.position.z == 0;
		})[0];

		if (selected !== undefined) {
			var rotation_matrix = new THREE.Matrix4();
			var axis = new THREE.Vector3(0, 1, 0);
			var amount = radian90;
			switch (direction) {
				case 'left':					
					amount = -amount;
					break;
				case 'right':
					break;
				case 'up':
					axis = new THREE.Vector3(1, 0, 0);
					amount = -amount;
					break;
				case 'down':
					axis = new THREE.Vector3(1, 0, 0);
					break;
			}
			rotation_matrix.makeRotationAxis(axis.normalize(), amount);
			rotation_matrix.multiplySelf(selected.matrix);
			selected.matrix = rotation_matrix;
			selected.rotation.setEulerFromRotationMatrix(selected.matrix);			
		}
	}
	
	function degreesToRadians(degrees) {
		return degrees * (Math.PI/180);
	}
	
	function radiansToDegrees(radians) {
		return radians / (Math.PI/180);
	}
	
	function createMaterials() {
		matts = new Array();
		matts.push(new THREE.MeshLambertMaterial({color: 0xFF00FF}));
		matts.push(new THREE.MeshLambertMaterial({color: 0xFFFF00}));
		matts.push(new THREE.MeshLambertMaterial({color: 0x00FFFF}));
		matts.push(new THREE.MeshLambertMaterial({color: 0xff0000}));
		//face:
		//matts.push(new THREE.MeshLambertMaterial({color: 0x00ff00}));
		
		
		var image = new Image();
		image.src = '500.jpg';
		var testcanvas = $("<canvas width='100' height='100'></canvas>")[0];
		var ctx = testcanvas.getContext("2d");
		var tex = new THREE.Texture(testcanvas);
		
		image.onload = function () {			
			//ctx.drawImage(image, 0, 0, 100, 100, 0, 0, 100, 100);		
			ctx.fillStyle = "rgb(255, 0,0)";
			ctx.fillRect(0,0,100,100);
			tex = new THREE.Texture(testcanvas);
			tex.needsUpdate = true;
		};		
		
		//image.tex = tex;
		
		//image.onload = function() {
		//	this.tex.needsUpdate = true;
		//}
		matts.push(new THREE.MeshLambertMaterial({map: tex, overdraw: true}));
		matts.push(new THREE.MeshLambertMaterial({color: 0x0000ff}));
	}

	function selectCube(e) {
		from = e.target.position.z;
		to = from < 0 ? 0 : -0.5;

		$.each(cubes, function () {
			this.position.z = -0.5;
		});
		
		e.target.position.z = to;				
	}
	
	

	function createCubes() {
		cubes = new Array();
		var cubegeo = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1, matts);		

		x = -2.6;
		y = +2.6;
		var counter = 0;
		for (var j = 0; j < 5; j++) {
			for (var i = 0; i < 5; i++) {
				if (counter == 24) { continue; }
				var cube = new THREE.Mesh(cubegeo, new THREE.MeshFaceMaterial());								
				cube.on('click', selectCube);

				cube.position.x = x;
				cube.position.y = y;
				cube.position.z = -0.5;
				scene.add(cube);				
				cubes.push(cube);
				x += 1.3;
				counter++;
			}
			x = -2.6;
			y -= 1.3;
		}		
	}

	function render() {
		requestAnimationFrame(render);

		//cubes[0].rotation.x += 0.01;

		renderer.render(scene, camera);
	} 

	return {
		init: initialize,
		start: render,
		cubes: function () { return cubes; } //temp for dev
	};
}();

$(function () {

	cubepuzzle.init(window.innerWidth, window.innerHeight);

	cubepuzzle.start();
});

