$(function() {
    //$("*").fadeIn(1200)
    screen = {
        width: window.outerWidth,
        height: window.outerHeight,
    }
    console.log(screen)
    $("#container").animate({
        marginLeft: '0px',
        opacity: 1,
    }, 1200);
    $("#container").animate({
        // marginLeft: '0px',
        opacity: 1,
    }, 1500);
    $("#moreProjects").click(function() {
        $('html, body').animate({
            scrollTop: $("#moreProjects").offset().top + 300
        }, 1000);
    });



    if (screen.width < 600) {

        style = $("#mobile-sheet")
            // $(style).attr("href", "https://eatmybytes.github.io/mobile-style.css")
        $(style).attr("href", "mobile-style.css")

        setInterval(function() {
            $("#profilePicture").css(
                "height", $("#profilePicture").css("width")
            )
        }, 1000 / 60)
    }
})