var context = new (window.AudioContext || window.webkitAudioContext)();
var source, highShelf, val1 = 0, val2 = 1;

function equalizerLoad(mediaElement) {
  highShelf = context.createBiquadFilter();
  source = context.createMediaElementSource(mediaElement);

  //highShelf.Q.value = 1;

  source.connect(highShelf);
  highShelf.connect(context.destination);

  highShelf.type = "peaking";
  highShelf.frequency.value = 1000;
  highShelf.gain.value = val1;
}

function equalizer(value) {
  val1 = value;
  highShelf.gain.value = value;
}

function equalizer2(value) {
  val2 = value;
  highShelf.Q.value = value;
}

function valEqualizer() {
  return val1;
}

function val2Equalizer() {
  return val2;
}
