import { Howl } from "howler";

class Sounds {

    constructor() {

        this.SoundArray = ["ia1", "ia2"];

        this.SoundSwirp = new Howl({
            src: ["./assets/sound/effekt_swish.mp3"],
            volume: 0.2,
        });

        this.hitSound = new Howl({
            src: ['./assets/sound/effekt_hit.mp3'],
            volume: 0.2
        });

        this.getFromSoundArray = this.SoundArray
            [Math.floor(Math.random() * this.SoundArray.length)];
        this.ia = new Howl({
            src: ['./assets/sound/' + this.getFromSoundArray + '.mp3'],
            volume: 0.8
        });
    }

    myplay() {
        this.SoundSwirp.play();
    }

    hit() {
        this.hitSound.play();
    }

    deathSound() {
        this.ia.play();
    }
}

export default Sounds;