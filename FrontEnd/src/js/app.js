function initMap() {
    // my location
    const loc = { lat: 31.4504, lng: 73.1350 };
    // centered map on location
    const map = new google.maps.Map(document.querySelector('.map'), {
        zoom: 14,
        center: loc
    });
    // marker position at location
    const marker = new google.maps.Marker({ position: loc, map: map });
}
// Sticky menu background
window.addEventListener('scroll', function() {
    if (window.scrollY > 150) {
        document.querySelector('#home').style.opacity = 0.8;
    } else {
        document.querySelector('#home').style.opacity = 1;
    }
});


// Smooth Scrolling
$('#home ul li a, .btn').on('click', function(event) {
    if (this.hash !== '') {
        event.preventDefault();

        const hash = this.hash;

        $('html, body').animate({
                scrollTop: $(hash).offset().top - 50
            },
            800
        );
    }
});