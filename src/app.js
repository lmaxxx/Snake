document.addEventListener('swiped', function(e) {
  console.log(e.target); // element that was swiped
  console.log(e.detail.dir); // swipe direction
});