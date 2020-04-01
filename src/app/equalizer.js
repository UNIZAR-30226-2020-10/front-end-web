var context, source, equalizeVal = [0, 0, 0, 0, 0], equalize = [0, 0, 0, 0, 0];

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

  equalize[0].type = "peaking";
  equalize[0].frequency.value = 60;
  equalize[0].gain.value = equalizeVal[0];

  equalize[1].type = "peaking";
  equalize[1].frequency.value = 230;
  equalize[1].gain.value = equalizeVal[1];

  equalize[2].type = "peaking";
  equalize[2].frequency.value = 910;
  equalize[2].gain.value = equalizeVal[2];

  equalize[3].type = "peaking";
  equalize[3].frequency.value = 3600;
  equalize[3].gain.value = equalizeVal[3];

  equalize[4].type = "peaking";
  equalize[4].frequency.value = 14000;
  equalize[4].gain.value = equalizeVal[4];
}

function equalizer(value, index) {
  equalizeVal[index] = value;
  equalize[index].gain.value = value;
}

function valEqualizer(index) {
  return equalizeVal[index];
}
