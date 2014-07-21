var Remote = Class.extend({
	init: function($el) {	
		this.ballDown = false;
		
		this.$oldButton = null;				
		this.$currentButton = null;		
		
		this.$volumeButton = $el.find('#volume-button');
		this.$muteButton = $el.find('#mute-button');	
		this.$seekBackwardButton = $el.find('#seek-backward-button');	
		this.$seekForwardButton = $el.find('#seek-forward-button');	
				
		this.$playButton = $el.find('#play-button');		
		
		this.bindButtons();
		this.bindMouseEvents();
	},
	
	bindMouseEvents: function(){
		var self = this;	
		//take currently highlighted action, if there is one
		this.$playButton.mouseup(function(e){
			self.ballDown = false;
			if (self.$currentButton && self.$currentButton.length > 0) {
				self.removeButtonHighlight(self.$currentButton);
				self.$currentButton.click();
			}
		});
			
		this.$playButton.mousedown(function(e){			
			self.ballDown = true;
		});
			
		this.$playButton.mouseout(function(e){
			self.ballDown = false;		
			if (self.$currentButton && self.$currentButton.length > 0) {		
				self.removeButtonHighlight(self.$currentButton);		
			}
		});
			
		//as mouse moves around the ball,
		//highlight targeted control buttons as needed
		this.$playButton.mousemove(function(e){			
			var $el = $(this);
			if (!self.ballDown) { return; }
			//for Firefox
			var xCoord = e.offsetX || (e.pageX - $el.offset().left);
			var yCoord = e.offsetY || (e.pageY - $el.offset().top);

			self.$currentButton = self.determineButton(xCoord, yCoord);
			
			if (self.$currentButton != self.$oldButton) { 
				if (self.$oldButton) { self.removeButtonHighlight(self.$oldButton); }
				if (self.$currentButton) { self.highlightButton(self.$currentButton); }
				self.$oldButton = self.$currentButton;
			}			
		});	
	},
	
	bindButtons: function() {
		this.$volumeButton.click(function(){
			alert('Volume');
		});
		this.$muteButton.click(function(){
			alert('Mute');
		});	
		this.$seekBackwardButton.click(function(){
			alert('Previous');		
		});
		this.$seekForwardButton.click(function(){
			alert('Next');		
		});
	},
	
	determineButton: function(x, y) {
		var width = this.$playButton.width();
		var height = this.$playButton.height();
		//will be one of four buttons
		//depending on "quadrant" of mouse
		if (x >= width / 4 && x <= 3 * width / 4) {
			if (y < height / 4) {
				return this.$volumeButton;
			}
			else if (y >  3 * height / 4) {
				return this.$muteButton;
			}
		}
		
		if (y > height / 4 && y < 3 * height / 4) {
			if (x < width / 4) {
				return this.$seekBackwardButton;
			}
			else if (x > 3 * width / 4) {
				return this.$seekForwardButton;
			}
		}	
		
		return null;
	},
	
	highlightButton: function($el) {
		//don't bother doing this if already glowing
		if ($el.data('pressed')) { return; }
		
		var $img = $el.find('img');
		var src = $img.data('src');
		$img.attr('src', src + '_press.png');	
		//store button state in memory
		$el.data('pressed', true);		
	},
	
	removeButtonHighlight: function($el) {
		if (!$el.data('pressed')) { return; }
		
		var $img = $el.find('img');
		var src = $img.data('src');
		$img.attr('src', src + '.png');	
		$el.data('pressed', false);		
	}
});