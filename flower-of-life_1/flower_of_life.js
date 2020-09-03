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
	
	createCirclularClippingPath(centerx, centery, radius=null){
		if(!radius) radius = this.diam/2;
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(centerx, centery, radius, 0, this.degreesToRadians(360));
		this.ctx.clip();
	}
	
	removeClippingPath(){
		this.ctx.restore();
	}
	
	drawFlower(){
		var outer_radius = this.diam*1.5;
		const canvas_center_x = this.canvas.width / 2;
		const canvas_center_y = this.canvas.height / 2;
		
		// create clipping path
		this.createCirclularClippingPath(canvas_center_x, canvas_center_y, outer_radius);
		
		// Draw initial center circle
		this.drawFullCircle(canvas_center_x, canvas_center_y);
		
		// draw surrounding 6 circles
		const centers = this.drawSurroundingCircles(canvas_center_x, canvas_center_y);
		
		// draw surrounding circles around those circles
		const outerCenters = [];
		for(let i=0; i<centers.length; i++){
			let [x, y] = centers[i];
			outerCenters.push(...this.drawSurroundingCircles(x, y));
		}
		
		// Draw outer circles.. 
		// these ones will be the first to be partially cut off by the clipping path
		const outermostCenters = [];
		for(let i=0; i<outerCenters.length; i++){
			let [x, y] = outerCenters[i];
			outermostCenters.push(...this.drawSurroundingCircles(x, y));
		}
		
		// outermost layer of circles
		for(let i=0; i<outermostCenters.length; i++){
			let [x, y] = outermostCenters[i];
			this.drawSurroundingCircles(x, y);
		}
		
		// clear clipping path and draw outer ring
		this.removeClippingPath();
		this.drawFullCircle(canvas_center_x, canvas_center_y, outer_radius);
		this.drawFullCircle(canvas_center_x, canvas_center_y, outer_radius+this.padding/2);
	}
	
	drawSurroundingCircles(x, y){
		const centers = [];
		const sixth_turn = 360 / 6;
		const radius = this.diam/2;
		for(let i=0, degrees=90; i<6; i++){
			let [centerx, centery] = this.getNewPosition(x, y, radius, degrees);
			var drawn = this.drawFullCircle(centerx, centery);
			if(drawn) centers.push([centerx, centery]);
			degrees += sixth_turn;
		}
		return centers;
	}
	
	drawFullCircle(centerx, centery, radius=null){
		if(!radius) radius = this.diam/2;
		if(this.isCircleDrawn(centerx, centery, radius)) return false;
		this.ctx.beginPath();
		this.ctx.arc(centerx, centery, radius, 0, this.degreesToRadians(360));
		this.ctx.stroke();
		this.centers.push([centerx, centery, radius]);
		return true;
	}
	
	isCircleDrawn(x, y, r){
		for(let i=0; i<this.centers.length; i++){
			if(this.centers[i][0].toFixed(2) === x.toFixed(2) && this.centers[i][1].toFixed(2) === y.toFixed(2) && this.centers[i][2].toFixed(2) === r.toFixed(2)){
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