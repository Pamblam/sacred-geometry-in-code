class TreeOfLife{
	
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
	
	drawPath(start, end){
		this.ctx.save();
		var path_width = this.diam / 5 / 2;
		this.ctx.lineWidth = path_width;
		this.ctx.beginPath();
		this.ctx.moveTo(...start);
		this.ctx.lineTo(...end);
		this.ctx.stroke();
		this.ctx.restore();
		this.ctx.save();
		this.ctx.globalCompositeOperation = "destination-out";
		this.ctx.lineWidth = path_width - 6;
		this.ctx.beginPath();
		this.ctx.moveTo(...start);
		this.ctx.lineTo(...end);
		this.ctx.stroke();
		this.ctx.restore();
	}
	
	drawTree(){
		const sefirot_diam = this.diam / 5;
		this.ctx.strokeStyle = "blue";
		this.ctx.lineWidth = 3;
		const sefirah = this.calculateSefirah();
		this.getPaths().forEach(path=>{
			var start = sefirah[path.from];
			var end = sefirah[path.to];
			this.drawPath(start, end);
		});
		Object.keys(sefirah).forEach(sefirot=>{
			var [x, y] = sefirah[sefirot];
			this.drawFullCircle(x, y, sefirot_diam/2);
			this.ctx.save();
			this.ctx.globalCompositeOperation = "destination-out";
			this.drawFullCircle(x, y, sefirot_diam/2-3);
			this.ctx.fill();
			this.ctx.restore();
		});
	}
	
	getPaths(){
		return [
			{from: 'tiferet', to: 'keter'},
			{from: 'tiferet', to: 'hokhmah'},
			{from: 'tiferet', to: 'hesed'},
			{from: 'tiferet', to: 'netzah'},
			{from: 'tiferet', to: 'yesod'},
			{from: 'tiferet', to: 'hod'},
			{from: 'tiferet', to: 'gevurah'},
			{from: 'tiferet', to: 'binah'},
			{from: 'yesod', to: 'malkhut'},
			{from: 'yesod', to: 'hod'},
			{from: 'yesod', to: 'netzah'},
			{from: 'hod', to: 'netzah'},
			{from: 'gevurah', to: 'hod'},
			{from: 'hesed', to: 'netzah'},
			{from: 'gevurah', to: 'hesed'},
			{from: 'binah', to: 'hesed'},
			{from: 'gevurah', to: 'hokhmah'},
			{from: 'gevurah', to: 'keter'},
			{from: 'hesed', to: 'keter'},
			{from: 'binah', to: 'gevurah'},
			{from: 'hesed', to: 'hokhmah'},
			{from: 'binah', to: 'hokhmah'},
			{from: 'binah', to: 'keter'},
			{from: 'keter', to: 'hokhmah'},
		];
	}
	
	calculateSefirah(){
		const canvas_center_x = this.canvas.width / 2;
		const canvas_center_y = this.canvas.height / 2;
		// Tif'eret is in the center
		var tiferet = [canvas_center_x, canvas_center_y];
		// Yesod is a half circle below Tif'eret
		var yesod = [canvas_center_x, canvas_center_y+(this.diam/2)];
		// Malkhut is a full circle below Tif'eret
		var malkhut = [canvas_center_x, canvas_center_y+this.diam];
		// Keter is a full circle above Tif'eret
		var keter = [canvas_center_x, canvas_center_y-this.diam];
		// Hesed is East north-east of Tif'eret
		var hesed = this.getNewPosition(tiferet[0], tiferet[1], this.diam/2, 90+(360/6*4));
		// Netzah is East south-east of Tif'eret
		var netzah = this.getNewPosition(tiferet[0], tiferet[1], this.diam/2, 90+(360/6*5));
		// Hod is West south-west of Tif'eret
		var hod = this.getNewPosition(tiferet[0], tiferet[1], this.diam/2, 90+(360/6*1));
		// Gevurah is West north-ewst of Tif'eret
		var gevurah = this.getNewPosition(tiferet[0], tiferet[1], this.diam/2, 90+(360/6*2));
		// Binah is half a circle above Gevurah
		var binah = [gevurah[0], gevurah[1]-(this.diam/2)];
		// Hokhmah is a half circle above Hesed
		var hokhmah = [hesed[0], hesed[1]-(this.diam/2)];
		return {
			tiferet,
			yesod,
			malkhut,
			keter,
			hesed,
			netzah,
			hod,
			gevurah,
			binah,
			hokhmah
		};
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
		this.ctx.strokeStyle = "blue";
		this.drawFullCircle(canvas_center_x, canvas_center_y, outer_radius);
		this.drawFullCircle(canvas_center_x, canvas_center_y, outer_radius+this.padding/2);
		this.drawTree();
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