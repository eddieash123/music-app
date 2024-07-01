import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.css']
})
export class PianoComponent {
  sustain = false;
  activeNotes: { [key: string]: HTMLAudioElement } = {}; //list of the notes that are currently active
  pressedKeys: Set<string> = new Set(); //set of kets that are currently being pressed
  numbers: number[] =  [0,1,2,3,4,5,6,7]
  num = 4;

  noteMap: { [key: string]: string } = { //map of notes to keys on keyboard
    'a': 'C',
    'w': 'Cs',
    's': 'D',
    'e': 'Ds',
    'd': 'E',
    'f': 'F',
    't': 'Fs',
    'g': 'G',
    'y': 'Gs',
    'h': 'A',
    'u': 'As',
    'j': 'B',
    ' ': 'sustain' //spacebar = sustain
  };

  toggleSustain() {
    this.sustain = !this.sustain;
  }

  playSound(note: string) {
    const audio = new Audio(`assets/sounds/${note}.wav`);
    audio.play();
    this.activeNotes[note] = audio; //stores audio into the activeNotes map
  }

  stopSound(note: string) {
    if (this.activeNotes[note] && !this.sustain) {
      this.activeNotes[note].pause();
      this.activeNotes[note].currentTime = 0;
      delete this.activeNotes[note];
    }
  }

  changeOctave(direction: string) {
    if(direction == "down" && this.num !== 0) {
      this.num--;
    }
    else if(direction == "up" && this.num !== 6) {
      this.num++;
    }
  }

  @HostListener('window:keydown', ['$event']) //constantly runs until keyup
  handleKeyDown(event: KeyboardEvent) {
    const note = this.noteMap[event.key.toLowerCase()]; //get the note from the map
    const button = document.getElementById(`${note}but-${this.num}`) //get which button is pressed
    if (note && !this.pressedKeys.has(event.key.toLowerCase())) { //if there is a note and it is not already pressed
      if(note == 'sustain'){ 
        this.sustain = true;
      }
      else{
        this.pressedKeys.add(event.key.toLowerCase()); //if its not the sustain, add it to the pressed keys list
        button?.classList.add('active') //add the active class
        this.playSound(note+this.num);
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    const note = this.noteMap[event.key.toLowerCase()]; //^^
    const button = document.getElementById(`${note}but-${this.num}`) //^^
    if (note) {
      if(note == 'sustain'){
        this.sustain = false;
      }
      else{
        this.pressedKeys.delete(event.key.toLowerCase()); //^^
        button?.classList.remove('active') //^^
        this.stopSound(note+this.num);
      }
    }
  }
}
