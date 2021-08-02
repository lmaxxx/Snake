import { SwipeEventListener } from 'swipe-event-listener'

const { swipeArea, updateOptions } = SwipeEventListener({
  swipeArea: document.querySelector('body'),
});

swipeArea.addEventListener('swipeDown', () => {
  alert('swipe down');
});
swipeArea.addEventListener('swipeUp', () => {
  alert('swipe up');
});

swipeArea.addEventListener('swipeLeft', () => {
  alert('swipe left');
});

swipeArea.addEventListener('swipeRight', () => {
  alert('swipe right');
});