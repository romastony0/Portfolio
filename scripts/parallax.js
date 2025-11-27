export function initParallax() {
    document.addEventListener("mousemove", parallax);

    function parallax(e) {
        document.querySelectorAll(".parallax-layer").forEach(function(move){
            var moving_value = move.getAttribute("data-value");
            var x = (e.clientX * moving_value) / 250;
            var y = (e.clientY * moving_value) / 250;

            move.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
        });
    }
}
