class FlowerOfLife{
	
	constructor(circle_diam, padding){
		this.diam = circle_diam;
		this.padding = padding;
		this.canvas = document.createElement('canvas');
		this.canvas.width = (circle_diam * 3) + padding;
		this.canvas.height = (circle_diam * 3) + padding;
		this.ctx = this.canvas.getContext('2d');
		this.centers = [];
		this.drawFlower();
	}
	
	drawFlower(){
		// Draw initial center circle
		const canvas_center_x = this.canvas.width / 2;
		const canvas_center_y = this.canvas.height / 2;
		this.drawFullCircle(canvas_center_x, canvas_center_y);
		
		// draw surrounding 6 circles
		const centers = this.drawSurroundingCircles(canvas_center_x, canvas_center_y);
		
		// draw surrounding circles around those circles
		for(let i=0; i<centers.length; i++){
			let [x, y] = centers[i];
			this.drawSurroundingCircles(x, y);
		}
		
		// draw outer ring
		var outer_radius = this.diam*1.5;
		this.drawFullCircle(canvas_center_x, canvas_center_y, outer_radius);
		this.drawFullCircle(canvas_center_x, canvas_center_y, outer_radius+this.padding/2);
	}
	
	drawSurroundingCircles(x, y){
		const centers = [];
		const sixth_turn = 360 / 6;
		const radius = this.diam/2;
		for(let i=0, degrees=90; i<6; i++){
			let [centerx, centery] = this.getNewPosition(x, y, radius, degrees);
			this.drawFullCircle(centerx, centery);
			centers.push([centerx, centery]);
			degrees += sixth_turn;
		}
		return centers;
	}
	
	drawFullCircle(centerx, centery, radius=null){
		if(!radius) radius = this.diam/2;
		if(this.isCircleDrawn(centerx, centery, radius)) return;
		this.ctx.beginPath();
		this.ctx.arc(centerx, centery, radius, 0, this.degreesToRadians(360));
		this.ctx.stroke();
		this.centers.push([centerx, centery, radius]);
	}
	
	isCircleDrawn(x, y, r){
		for(let i=0; i<this.centers.length; i++){
			if(this.centers[i][0] === x && this.centers[i][1] === y && this.centers[i][2] === r){
				return true;
			}
		}
		return false;
	}
	
	degreesToRadians(degrees){
		return degrees * Math.PI / 180;
	}
	
	getNewPosition(startx, starty, dist, angle_degrees){
		const xx = Math.cos(this.degreesToRadians(angle_degrees)) * dist + startx;
		const yy = Math.sin(this.degreesToRadians(angle_degrees)) * dist + starty
		return [xx, yy];
	}
}