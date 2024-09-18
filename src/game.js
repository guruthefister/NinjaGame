import * as PIXI from "pixi.js"
import { Sprite, AnimatedSprite, Texture } from "pixi.js"
import gsap from "gsap";
import Stage from "./stage"
import Enemy from "./enemy";
import Hittest from "./hittest";
import Sounds from "./sound";
import { Howl } from "howler";

class Game {

  constructor(assets) {

    this.ht = new Hittest();

    this.enemy;

    this.soundEffects = new Sounds();

    let myStage = new Stage();
    this.scene = myStage.scene;
    this.scene.sortableChildren = true;
    let background = myStage.bg;
    this.si = myStage.stageInfo;

    const bg = Sprite.from(assets.background);
    background.addChild(bg);

    const ninja = new AnimatedSprite(assets.ninja.animations["alien"]);
      ninja.anchor.set(0.5);
      ninja.x = 512;
      ninja.y = 768 - 150;
      ninja.buttonMode = true;
      ninja.zIndex = 2;
      ninja.animationSpeed = 0.5;
      ninja.play();
        this.scene.addChild(ninja);

    this.hitareaNinja = new PIXI.Graphics();
    this.hitareaNinja.beginFill(0xDE3249);
    this.hitareaNinja.drawRect(500-150, 550, 300, 200);
    this.hitareaNinja.alpha = 0.5;
    this.hitareaNinja.endFill();
    this.scene.addChild(this.hitareaNinja);

      this.si.app.stage.eventMode = 'static';

      const play = Sprite.from(assets.play);
      play.anchor.set(0.5);
      play.x = 512;
      play.y = 210;
      play.eventMode = "static";
      play.buttonMode = true;
  
      this.scene.addChild(play);

      play.on("pointerdown", (event) => {

        event.stopPropagation();
  
        this.si.app.stage.eventMode = "static";
  
        gsap.to(event.currentTarget, {
          duration: 0.5,
          delay: 0.2,
          y: play.y - 350,
          ease: "Elastic.easeInOut",
        });
        
        let timerid = setTimeout(() => {
          this.soundEffects.myplay();
        }, 500);

        this.enemy = new Enemy(assets, this.scene);

        this.si.app.stage.on("pointerdown", (event) => {
          ninja.stop();
          ninja.texture = Texture.from("../assets/images/ninja-jump.png")
    
          let newPosition = event.getLocalPosition(background);
            gsap.to(ninja, {
              duration: 0.2,
              x: newPosition.x -300,
              y: newPosition.y,
              ease: "Circ.easeOut",
              onComplete: () => {
                gsap.to(ninja, {
                  duration: 0.2,
                  x: 500,
                  y: 768 - 150,
                  ease: "Circ.easeOut",
                });
                ninja.play();
              }, //END onComplete
            });
                let mXPos = event.global.x;
                  mXPos > this.si.appWidth / 2 ? (ninja.scale.x = -1) : (ninja.scale.x = 1);
      
                this.soundEffects.hit();

        });//End eventlistener
    });//End eventlistener
    let ticker = PIXI.Ticker.shared;
      ticker.add((delta) => {
        console.log('ticker');

        if (this.enemy != undefined) {
          this.enemy.enemies.forEach((_enemy) => {
            
            if(this.ht.checkme(ninja, _enemy.getChildAt(1)) && _enemy.alive == true) {
              const currentEnemySpriteSheet = _enemy.getChildAt(0);
              currentEnemySpriteSheet.state.setAnimation(0, "die", true);

            if (this.ht.checkme(this.hitareaNinja, _enemy.getChildAt(1)) && _enemy.attack == true) {
              console.log("ninja hit");
              const currentEnemySpriteSheetAttack = _enemy.getChildAt(0);
              currentEnemySpriteSheetAttack.state.setAnimation(0, 'attack', true)

              let timeToNinjaIsHurt = setTimeout(() => {
                
                ninja.stop();

                ninja.texture = PIXI.Texture.from(
                  "../assets/images/ninja-hurt.png"
                );

                gsap.to(ninja, {
                  duration: 0.7,
                  y: 550,
                  ease: "Circ.easeOut",
                  onComplete: () => {
                    ninja.play();
                    gsap.to(ninja, {
                      duration: 0.4,
                      y: 768 - 150,
                    });//gsap
                  },//oncomplete
                });//gsap
              }, 300);//setTimeOut

              _enemy.alive = false;
              _enemy.attack = false;

              gsap.to(_enemy, {
                duration: 0.7,
                y: 550,
                ease: "Circ.easeOut",
                onComplete: () => {
                  gsap.to(_enemy, {
                    duration: 0.5,
                    y: 768 - 50,
                    ease: "Circ.easeOut"
                  });
              currentEnemySpriteSheetAttack.state.setAnimation(0, "walk", true)
                }
              });//END gsap
            }
            
            let enemyDieTimeline = gsap.timeline({
              onComplete: () => {
                this.scene.removeChild(_enemy);
              }
            });
            enemyDieTimeline.to(_enemy, {
              y: 300,
              duration: 0.7,
              ease: "Circ.easeOut"
            });
            enemyDieTimeline.to(_enemy, {
              y: 1200,
              duration: 0.5,
              ease: "Circ.easeIn"
            });

            _enemy.alive = false;

            if (_enemy.alive) {
                this.soundEffects.hit();
            }

            this.soundEffects.deathSound();

          }//END if
          

          });//END forEach
        }//END if
      });//END ticker
  } // END constructor
} // END class

export default Game;