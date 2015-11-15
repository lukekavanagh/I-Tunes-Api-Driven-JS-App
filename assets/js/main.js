var Gimme = {
	$content: $('.content'),
	$form: $('form'),
	userInput: '',
	userInputisValid: false,
	appId: '',
    validate: function() {
        //use regex to test if input is valid. It's valid if :
        // 1. It begins with 'http://itunes'
        // 2. It has '/id' followed by digits in the string somewhere
        var regUrl = /^(http|https):\/\/itunes/;
        var regId = /\/id()(\d+)/i;
        if ( regUrl.test(this.userInput) && regId.test(this.userInput) ) {
            this.userInputIsValid = true;
            var id = regId.exec(this.userInput);
            this.appId = id[1];
        } else {
            this.userInputIsValid = false;
            this.appId = '';
        }
    }

throwError: function(header, text){
    //Remove animation class
    this.$content.removeClass('content--error-pop');

    // Trigger reflow
    //https://csstricks.com/restart-css-animation/
    this.$content[0].offsetWidth = this.$content[0].offsetWidth;

    this.$content
        .html('<p><strong>' + header + '</strong> ' + text + '</p>' )
        .addClass('content--error');

        this.toggleLoading();
    }
}

    toggleLoading: function(){
        // Toggle loading indicator
        this.$content.toggleClass('content--loading');
         
        // Toggle the submit button so we don't get double submissions
        // http://stackoverflow.com/questions/4702000/toggle-input-disabled-attribute-using-jquery
        this.$form.find('button').prop('disabled', function(i, v) { return !v; });
    },
}



$(document).ready(function(){
    Gimmie.$form.on('submit', function(e){
        e.preventDefault();
        Gimmie.toggleLoading(); 
        Gimme.userInput = $(this).find('input').val();
        Gimme.validate();
        if ( Gimmie.userInputIsValid ) {
        //make API request
        } else {
            Gimme.throwError(
                'Invalid Link'
                'You must submit a standard ITunes Store Link with an ID, i.e <br> <a href="https://itunes.apple.com/us/app/twitter/id333903271?mt=8">https://itunes.apple.com/us/app/twitter/<em>id333903271</em>?mt=8</a>'
                );
        // throw an error
    	}
    });
});