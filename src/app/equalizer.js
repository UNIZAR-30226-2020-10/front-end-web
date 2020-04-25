var context, source, freq = [60, 230, 910, 3600, 14000], original = [0, 0, 0, 0, 0],
    equalize = [0, 0, 0, 0, 0], actual = [0, 0, 0, 0, 0], inUse = false;

function equalizerLoad(mediaElement) {
  mediaElement.crossOrigin = "anonymous";
  context = new (window.AudioContext || window.webkitAudioContext)();
  equalize[0] = context.createBiquadFilter();
  equalize[1] = context.createBiquadFilter();
  equalize[2] = context.createBiquadFilter();
  equalize[3] = context.createBiquadFilter();
  equalize[4] = context.createBiquadFilter();
  source = context.createMediaElementSource(mediaElement);

  source.connect(equalize[0]);
  equalize[0].connect(equalize[1]);
  equalize[1].connect(equalize[2]);
  equalize[2].connect(equalize[3]);
  equalize[3].connect(equalize[4]);
  equalize[4].connect(context.destination);

  for(let i = 0; i < 5; ++i) {
    equalize[i].type = "peaking";
    equalize[i].frequency.value = freq[i];
    if(inUse) {
      equalize[i].Q.value = actual[i];
    } else {
      original[i] = equalize[i].Q.value;
      actual[i] = original[i];
    }
  }
  inUse = true;
}

function equalizer(value, index) {
  actual[index] = value;
  equalize[index].Q.value = value;
}

function valEqualizer(index) {
  return actual[index];
}

function quitEqualizer() {
  for(let i = 0; i < 5; ++i) {
    equalize[i].Q.value = original[i];
  }
  inUse = false;
}
