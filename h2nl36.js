function h2nl36(playerName, posX, posY, mapId) {
	
	/**
	 * 0 - fel
	 * 1 - balra
	 * 2 - le
	 * 3 - jobbra
	 * */
	function isPoint(v) {
		if(0 < v.x && 0 < v.y) {
				if($("#m"+v.x+"_"+v.y).text() == 1) {
					return true;
				}
			}
		
		return false;
	}
	
	var traveledPoints = [];
	
	function isTraveledPoint(v) {
		var result = $.grep(traveledPoints, function(elem){
			return elem.x == v.x && elem.y == v.y;
		});
		
		if(result.length == 0) {
			traveledPoints.push({"x":v.x,"y":v.y});
		}
		
		return result.length > 0;
	}
		
	
	function LehetsegesLepes(x,y) {
		var ret = new Array();
		
		for(i = 1; i < 2; i++) {
			ret.push({"x" : x, "y" : y-i, "step" : i});
			ret.push({"x" : x,"y" : y+i,"step" : i});
			ret.push({"x" : x-i,"y" : y, "step" : i});
			ret.push({"x" : x+i, "y" : y, "step" : i});
			
		}
		
		return ret;
	}
	function Ut(x,y){
		var startPos = {"x":x,"y":y,"step":1};
		if(isPoint(startPos)){
			return startPos;
		}
		if(!validLepes(startPos)){
			return false;
		}
		
		traveledPoints = [];
			
		var queue = [startPos];
		
		while(queue.length > 0) {
			var actual = queue[0];
			queue = queue.slice(1);
			
			var possibleMovesArr = LehetsegesLepes(actual.x,actual.y);
			
			for(i = 0; i < possibleMovesArr.length; i++) {
				var v = possibleMovesArr[i];
				
				if(isPoint(v)) {
					v.step = (actual.step + 1);
					return v;
				}
				
				if(validLepes(v) && !isTraveledPoint(v)) {
					v.step = (actual.step + 1);
					queue.push(v);
				}
			}
		}
	}
	
	
	function validLepes(v) {
		if(0 < v.x && 0 < v.y) {
			var $actDom = $("#m"+v.x+"_"+v.y);
			if($actDom.text() == 1) {
				return true;
			}
			
			if($actDom.text().trim() == "") {
				return true;
			}
			
			if($actDom.hasClass("m0") || $actDom.hasClass("m1") || $actDom.hasClass("m2") || $actDom.hasClass("m3") || $actDom.hasClass("m4")) {
				return false;
			}
		}
		
		return false;
	}
	
	function getSzellemTav(direction) {
		var factor = 1;
		var sDirX;
		var sDirY;
		
		if(direction.x < posX) {
			sDirX = -1;
			sDirY = -1;
		} else if(direction.x > posX) {
			sDirX = 1;
			sDirY = 1;
		} else if(direction.y < posY) {
			sDirX = -1;
			sDirY = -1;
		} else if(direction.y > posY) {
			sDirX = 1;
			sDirY = 1;
		}
		
		var fields = $(".map1, .map9");
		var dimension = Math.sqrt(fields.length);
		var actX = posX;
		var actY = posY;
		
		
		do {
			actY = posY;
			do {
				var $actDom = $("#m"+actX+"_"+actY);
				if($actDom.hasClass("m0") || $actDom.hasClass("m1") || $actDom.hasClass("m2") || $actDom.hasClass("m3") || $actDom.hasClass("m4")) {
					var distance = Math.sqrt(Math.pow(posX - actX, 2) + Math.pow(posY - actY, 2));
					
					if(distance <= 6) {
						factor /= 1/distance;
					}
					
					break;
				}
				actY += sDirY;
			} while(0 < actY && actY < dimension)
			actX += sDirX;
		} while(0 < actX && actX < dimension)
		
		return factor;
	}
	
	var walk = 0;
	
	if(posX == 1 && posY == 1) {
		walk = Math.floor(Math.random()*4)
	} else {
		var directions = [];
		directions.push({"x" : posX-1, "y": posY});
		directions.push({"x" : posX+1, "y": posY});
		directions.push({"x" : posX, "y": posY-1});
		directions.push({"x" : posX, "y": posY+1});
		
		var min = {"x":posX,"y":posY,"step":99999999};
		var minDir = {};
		
		$.each(directions, function(i,dir){
			var act = Ut(dir.x,dir.y);
			
			act.step = act.step * getSzellemTav(dir);
			
			if(act) {
				if(act.step < min.step) {
					min = act
					minDir = dir
				}
			}
		});
		
		console.info("min",min);
		
		if(posX < minDir.x) {
			walk = 3;
		} else if(posX > minDir.x) {
			walk = 1;
		} else if(posY < minDir.y) {
			walk = 2;
		} else if(posY > minDir.y) {
			walk = 0;
		}
	}
	
	$("body").trigger({
		type: "refreshmap",
		name: playerName,
		walk: walk
	});
	
	console.info("---------------------------------------------------------------------------");
}
