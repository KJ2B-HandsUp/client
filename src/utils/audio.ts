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
    const tempAudio = new Audio(
      `/dpmaudio/dubstep_club_${mp3List2[rowIndex][colIndex]}.wav`,
    );
    tempAudio.preload = "auto";
    tempList.push(tempAudio);
  }
  audioList.push([...tempList]);
}

const btnAudio = new Audio("/mp3/warp1.mp3");
btnAudio.preload = "auto";

export function playBtnAudio() {
  btnAudio.currentTime = 0;
  btnAudio.play();
}

export function pauseBtnAudio() {
  btnAudio.pause();
}

export const GameStartAudio = new Audio("/mp3/gamestart.mp3");
GameStartAudio.preload = "auto";
export const GameOverAudio = new Audio("/mp3/gameover.mp3");
GameOverAudio.preload = "auto";

const GameBGMAudio = new Audio("/mp3/dubstep_drum_trap_loop.mp3");
GameBGMAudio.preload = "auto";

export function playBGMAudio() {
  GameBGMAudio.currentTime = 0;
  GameBGMAudio.loop = true;
  GameBGMAudio.play();
}

export function pauseBGMAudio() {
  GameBGMAudio.pause();
}

const HoverBtnAudio = new Audio("/mp3/jump02.mp3");
HoverBtnAudio.preload = "auto";
HoverBtnAudio.volume = 0.5;

export function playHoverBtnAudio() {
  HoverBtnAudio.currentTime = 0;
  HoverBtnAudio.play();
}
