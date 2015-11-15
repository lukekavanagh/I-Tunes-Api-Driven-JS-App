var Gimmie = {
    $content: $('.content'),
    $form: $('form'),
    userInput: '',
    userInputIsValid: false,
    appId: '',

    toggleLoading: function(){
        // Toggle loading indicator
        this.$content.toggleClass('content--loading');

        // Toggle the submit button so we don't get double submissions
        // http://stackoverflow.com/questions/4702000/toggle-input-disabled-attribute-using-jquery
        this.$form.find('button').prop('disabled', function(i, v) { return !v; });
    },

    throwError: function(header, body){
        // Remove animation class
        this.$content.removeClass('content--error-pop');

        // Trigger reflow
        // https://css-tricks.com/restart-css-animation/
        this.$content[0].offsetWidth = this.$content[0].offsetWidth;

        // Add classes and content
        this.$content
            .html('<p><strong>' + header + '</strong> ' + body + '</p>')
            .addClass('content--error content--error-pop');

        this.toggleLoading();
    },

    validate: function() {
        // Use regex to test if input is valid. It's valid if:
        //  1. It begins with 'http://itunes'
        //  2. It has '/id' followed by digits in the string somewhere
        var regUrl = /^(http|https):\/\/itunes/,
            regId = /\/id(\d+)/i;
        if ( regUrl.test(this.userInput) && regId.test(this.userInput) ) {
            this.userInputIsValid = true;
            var id = regId.exec(this.userInput);
            this.appId = id[1];
        } else {
            this.userInputIsValid = false;
            this.appId = '';
        }
    },

    render: function(response){
        var icon = new Image();
        icon.src = response.artworkUrl512;
        icon.onload = function() {
            Gimmie.$content
                .html(this)
                .append('<p><strong>' + response.trackName + '</strong> Actual icon dimensions: ' + this.naturalWidth + '×' + this.naturalHeight + '</p>')
                .removeClass('content--error');
            Gimmie.toggleLoading();

            // If it's an iOS icon, load the mask too
            if(response.kind != 'mac-software') {
                var mask = new Image();
                mask.src = 'assets/img/icon-mask.png';
                mask.onload = function() {
                    Gimmie.$content.prepend(this);
                }
            }
        }
    }
};

$(document).ready(function(){
    Gimmie.$form.on('submit', function(e){
        e.preventDefault();
        Gimmie.toggleLoading(); 
        Gimme.userInput = $(this).find('input').val();
        Gimme.validate();


        if ( Gimmie.userInputIsValid ) {
            $.ajax({
                url: "https://itunes.apple.com/lookup?id=" + Gimme.appId,
                dataType: 'JSONP'
            })
            .done(function(response) {
                var response = response.results[0];
                console.log(response);
            })
            .fail(function (data){
                Gimme.throwError(
                    'iTunes API Error',
                    'There was an error retrieving the info. Check the iTunes URL or try again later.'
                    );
            });
          } else {
            /* our other code here */
          }  
    })
});