export const mp3List = [
  ["a_arp_01", "a_bass_01", "b_stab_01", "a_vox_01"],
  ["b_arp_01", "a_bass_02", "b_stab_02", "a_kick_01"],
  ["a_bassfill_01", "a_bass_03", "a_piano_01", "a_snare_01"],
  ["b_bassfill_01", "a_bass_04", "b_lead_01", "b_snare_01"],
];

export const mp3List2 = [
  ["a_bass_03", "a_bass_04", "a_bassfill_01"],
  ["a_bass_01", "a_bass_02", "a_stab_01"],
  ["a_arp_01", "a_piano_01", "a_vox_01"],
  ["a_kick_01", "a_hat_01", "a_snare_01"],
];

export const audioList: HTMLAudioElement[][] = [];
for (let rowIndex = 0; rowIndex < mp3List2.length; rowIndex++) {
  const tempList: HTMLAudioElement[] = [];
  for (let colIndex = 0; colIndex < mp3List2[0].length; colIndex++) {
    tempList.push(
      new Audio(`/dpmaudio/dubstep_club_${mp3List2[rowIndex][colIndex]}.wav`),
    );
  }
  audioList.push([...tempList]);
}

export const bgmAudio = new Audio("/mp3/dubstep_drum_trap_loop.mp3");

const btnAudio = new Audio("/mp3/warp1.mp3");

export function playBtnAudio() {
  btnAudio.currentTime = 0;
  btnAudio.play();
}

export function pauseBtnAudio() {
  btnAudio.pause();
}
