class startScene extends Phaser.Scene {
    constructor(){
        super({ key: 'startScene', active: true });

    }
//this is the start scene
//preload loads all the game assets
    preload(){
        this.load.image('titleScreen', 'titleScreen.png');
        this.load.audio('titleSong', 'titleSong.mp3');
    }
    create(){
        this.cursors=this.input.keyboard.createCursorKeys();
        //creates keyboard input
        this.add.image(600, 300, 'titleScreen').setScale(0.9);
        this.text= this.add.text(300, 400, 'HIT SPACE TO START!', { fill: '#B5E61D' }).setScale(2);
        this.text= this.add.text(300, 500, 'USE LEFT, RIGHT AND DOWN TO MOVE!', { fill: '#B5E61D' }).setScale(2);
        this.text= this.add.text(300, 550, 'GRAVITY WILL DO THE REST!', { fill: '#B5E61D' }).setScale(2);
        this.titleSong = this.sound.add('titleSong');
        this.titleSong.play();
        this,this.titleSong.loop = true;
        
//loops the title music 

    }
    update(){
        if (this.cursors.space.isDown){
            this.level1();
            //switches scenes when space is pressed
        }
    }
    level1(GameScene){
        //this.scene.get('GameScene').scene.start();
        this.scene.start('GameScene');
       // this.scene.stop('startScene');
        this.titleSong.pause();
        this,this.titleSong.loop = false;
        //pauses the start scene song
        //this.scene.switch('GameScene');
        
    };

}

class GamesDevCW2 extends Phaser.Scene{
    constructor(){
        super({ key: 'GameScene' });
        //class variables go here
        var player= player;
        var text=text;
        var anims=anims;
        this.score = 0;
        this.lives = 1;
        this.bullets=0;

        this.cometConfig;
        this.cometEmitter;
        this.count;

        this.cometConfig={
            speed:500,
            lifespan:600,
            angle: {min: 0, max: 360 },
            scale:{start:0.3,end:0.8},
            blendMode:'ADD', 
            frequency:12,
            setScale:2,
            tint: [ 0xfff000, 0xfff00f, 0xfff0f0, 0xfff0ff ],

            emitZone:{
                type:'random',
                source:new Phaser.Geom.Line(0,0,1800,600),
            }
        };
//sets variables
    }
//game config

preload (){
    //this.load.image('<KEY>', '<path to image>');
// this.load.spritesheet('<KEY>', '<path to spritesheet>', {frameWidth: <WIDTH>, frameHeight: <HEIGHT>});
//preload assets
    this.load.spritesheet('orion', 'orion.png', {frameWidth: 32, frameHeight:33});
    this.load.image('background', 'space.png');
    this.load.image('keycard', 'key.png');
    this.load.image('pipeSmallSide', 'rippedPipeSide.png');
    this.load.image('pipeBigSide', 'bigPipeSide.png');
    this.load.image('pipeSmallUp', 'rippedPipeUp.png');
    this.load.image('pipeBigUp', 'bigPipeUp.png');
    this.load.audio('levelStart', 'levelStart.mp3');
    this.load.audio('levelLoop', 'levelLoop.mp3');
    this.load.image('sheild', 'sheild.png');
    this.load.image('raygun', 'raygun.png');
    this.load.image('floor', 'floor.png');
    this.load.image('shipSide', 'shipSide.png');
    this.load.image('door', 'door.png');
    this.load.image('laser', 'laser.png');
    this.load.image('alien1', 'alien1.png');
    this.load.image('alien2', 'alien2.png');
    this.load.image('alien3', 'alien3.png');
    this.load.image('dead1', 'gameOver.png');
    this.load.image('ray', 'ray.png');
    this.load.image('comet', 'comet_particle.png');
}


create() {

    this.scene.get('UIScene').events.emit('resetLife');
    this.add.image(50, 60, 'background').setScale(2);
    this.shipSide = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 415, stepX: 300 },
    });
    this.shipSide2 = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 215, stepX: 300 },
    });
    //this.add.image(1780, 60, 'background').setScale(2);
    this.cometEmitter=this.add.particles('comet').createEmitter(this.cometConfig).start();
    this.keycard=this.physics.add.sprite(535, 375, 'keycard').setScale(2);
    this.sheild=this.physics.add.sprite(1250, 275, 'sheild').setScale(2);
    this.raygun=this.physics.add.sprite(1450, 500, 'raygun').setScale(1.5);
    this.alien1=this.physics.add.staticSprite(1000, 400, 'alien1').setScale(2);
    this.alien2=this.physics.add.staticSprite(520, 240, 'alien2').setScale(2);
    this.alien3=this.physics.add.staticSprite(1400, 200, 'alien3').setScale(2);
    this.laser = this.physics.add.staticSprite(1610, 312, 'laser');
    this.laser1 = this.physics.add.staticSprite(0, 312, 'laser');

    this.scene.get('UIScene').events.emit('resetLife');
    this.player=this.physics.add.sprite(100,450, 'orion').setScale(2);
    this.player.setCollideWorldBounds(true);
    this.text= this.add.text(200, 570, 'I need to collect the keycards to open the door...', {fill:'#ffffff'});

    this.player.setGravityY(400);

//audio
this.levelStart = this.sound.add('levelStart');
this.levelStart.play();

// Once levelStart finishes, start playing levelLoop
this.levelStart.once('complete', () => {
    this.levelLoop = this.sound.add('levelLoop');
    this.levelLoop.loop = true;
    this.levelLoop.play();
});


    this.pipeUp = this.physics.add.staticGroup();
    this.pipeSmallUp = this.physics.add.staticGroup();
    this.pipeSmallSide = this.physics.add.staticGroup();
    this.pipeSide = this.physics.add.staticGroup();

    
    //big up pipes
    this.pipeUp.create(500, 350, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(700, 340, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(700, 240, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(700, 160, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(1200, 260, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(1200, 160, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(900, 460, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(900, 160, 'pipeBigUp').setScale(2).refreshBody();
    //big side pipes
    this.pipeSide.create(700, 380, 'pipeBigSide').setScale(2).refreshBody();
    this.pipeSide.create(500, 300, 'pipeBigSide').setScale(2).refreshBody();
    this.pipeSide.create(1200, 300, 'pipeBigSide').setScale(2).refreshBody();
    this.pipeSide.create(500, 400, 'pipeBigSide').setScale(2).refreshBody();
    //small up pipes
    this.pipeSmallUp.create(200,475,'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(200,150,'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(200, 400, 'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(1500, 410, 'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(1500, 480, 'pipeSmallUp').setScale(2).refreshBody();
    //small side pipes
    this.pipeSmallSide.create(1300, 300, 'pipeSmallSide').setScale(2).refreshBody();
    this.pipeSmallSide.create(1450, 400, 'pipeSmallSide').setScale(2).refreshBody();
    //door
    this.door=this.physics.add.sprite(1700, 320, 'door').setScale(2);


    this.cursors=this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.keycard,  this.collectkeycard, null, this);
    this.physics.add.overlap(this.player, this.sheild,  this.collectSheild, null, this);
    this.physics.add.overlap(this.player, this.raygun,  this.collectRaygun, null, this);
    this.physics.add.overlap(this.player, this.alien1,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien2,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien3,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.laser,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.door, this.level2, null, this);
    // Camera
    this.cam = this.cameras.main.setSize(800, 600);
    this.cam.setZoom(1);
    this.cameras.main.setBounds(0, 0, 1780,600);
    this.cam.startFollow(this.player, false, 50, 50);
//sets game camera


    this.floor = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 100, stepX: 244 },
    });
    //group
    this.floorBottom = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 530, stepX: 244 },
    });


    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('orion',{start:0, end:11}),
        frameRate:10,
        repeat:-1
    });

    this.anims.create({
        key:'jump',
        frames: this.anims.generateFrameNumbers('orion',{start:8, end:8}),
        frameRate:20,
        repeat:-1
    });

    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('orion',{start:13, end:21}),
        frameRate:10,
        repeat:-1
    });
    this.anims.create({
        key:'idle',
        frames: this.anims.generateFrameNumbers('orion',{start:12, end:12}),
        frameRate:10,
        repeat:-1
    });

}
update(){
    this.physics.add.collider(this.player, this.keycard);
    this.physics.add.collider(this.player, this.sheild);
    this.physics.add.collider(this.player, this.raygun);
    this.physics.add.collider(this.player, this.pipeUp);
    this.physics.add.collider(this.player, this.pipeSide);
    this.physics.add.collider(this.player, this.pipeSmallUp);
    this.physics.add.collider(this.player, this.pipeSmallSide);
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.overlap(this.player, this.door);
    this.physics.add.collider(this.player, this.floorBottom);
    this.physics.add.collider(this.player, this.laser);
    this.physics.add.collider(this.player, this.alien1);
    this.physics.add.collider(this.player, this.alien2);
    this.physics.add.collider(this.player, this.alien3);
    this.physics.add.collider(this.player, this.laser1);

    if (this.cursors.left.isDown){
        this.player.setVelocityX(-160);
        this.player.anims.play('left',true);
    }
    else if (this.cursors.right.isDown){
        this.player.setVelocityX(160);
        this.player.anims.play('right',true);

    }
    else if (this.cursors.down.isDown){
        this.player.setVelocityY(260);
        this.player.anims.play('jump',true);

    }
    else{
        this.player.setVelocityX(0);
        this.player.setVelocityY(-400);
        this.player.anims.play('idle');
    };

}


collectkeycard(player, keycard, laser, score)
{
    keycard.disableBody(true, true);
    keycard.destroy();
    this.collect=true;
    this.text= this.add.text(30, 30, 'Keycard collected!', {fill:'#ffffff'});
    this. laser. setPosition (0, 312); 
    this.laser.refreshBody();
    this.scene.get('UIScene').events.emit('addScore');

};
collectSheild(player, sheild)
{
    sheild.disableBody(true, true);
    sheild.destroy();
    this.text= this.add.text(250, 30, 'Sheild collected!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('addLife');
    this.scene.get('UIScene').events.emit('addScore');

};
collectRaygun(player, raygun)
{
    raygun.disableBody(true, true);
    raygun.destroy();
    this.text= this.add.text(450, 30, 'Raygun collected!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('addScore');
    this.scene.get('UIScene').events.emit('addBullet');

};
ouch(player, alien1,alien2,alien3)
{
    this.text= this.add.text(750, 30, 'Ouch!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('takeLife');
    this.disableBody;

};

level2(){
    this.scene.start('level2');
};
};

class level2 extends Phaser.Scene{
    constructor(){
        super({ key: 'level2' });
        //class variables go here
        var player= player;
        var text=text;
        var anims=anims;
        this.score = 0;
        this.lives = 1;
        this.bullets=0;
        this.cometConfig;
        this.cometEmitter;
        this.count;

        this.cometConfig={
            speed: 250,
            tint: [ 0xff000f, 0xff0000, 0xff00f0, 0xfff000 ],
            lifespan: 2000,
            frequency: 1,
            blendMode: 'ADD',

            emitZone:{
                type:'random',
                source:new Phaser.Geom.Line(400,500,400,500),
            }
        };
    }

preload (){
    this.load.spritesheet('orion', 'orion.png', {frameWidth: 32, frameHeight:33});
    this.load.image('background', 'space.png');
    this.load.image('keycard', 'key.png');
    this.load.image('pipeSmallSide', 'rippedPipeSide.png');
    this.load.image('pipeBigSide', 'bigPipeSide.png');
    this.load.image('pipeSmallUp', 'rippedPipeUp.png');
    this.load.image('pipeBigUp', 'bigPipeUp.png');
    this.load.audio('levelStart', 'levelStart.mp3');
    this.load.audio('levelLoop', 'levelLoop.mp3');
    this.load.image('sheild', 'sheild.png');
    this.load.image('raygun', 'raygun.png');
    this.load.image('floor', 'floor.png');
    this.load.image('shipSide', 'shipSide.png');
    this.load.image('door', 'door.png');
    this.load.image('laser', 'laser.png');
    this.load.image('alien1', 'alien1.png');
    this.load.image('alien2', 'alien2.png');
    this.load.image('alien3', 'alien3.png');
    this.load.image('ray', 'ray.png');
    this.load.image('dead1', 'gameOver.png');
    this.load.image('comet2', 'comet_particle2.png');
}


create() {

    this.add.image(50, 60, 'background').setScale(2);
    this.shipSide = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 415, stepX: 300 },
    });
    this.shipSide2 = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 215, stepX: 300 },
    });
    //this.add.image(1780, 60, 'background').setScale(2);
    this.cometEmitter=this.add.particles('comet2').createEmitter(this.cometConfig).start();
    this.keycard=this.physics.add.sprite(535, 375, 'keycard').setScale(2);
    this.sheild=this.physics.add.sprite(1250, 275, 'sheild').setScale(2);
    this.raygun=this.physics.add.sprite(1450, 500, 'raygun').setScale(1.5);
    this.alien1=this.physics.add.staticSprite(1000, 400, 'alien1').setScale(2);
    this.alien2=this.physics.add.staticSprite(520, 240, 'alien2').setScale(2);
    this.alien3=this.physics.add.staticSprite(1400, 200, 'alien3').setScale(2);
    this.alien4=this.physics.add.staticSprite(1100, 250, 'alien1').setScale(2);
    this.alien5=this.physics.add.staticSprite(650, 440, 'alien2').setScale(2);
    this.alien6=this.physics.add.staticSprite(400, 200, 'alien3').setScale(2);
    this.laser = this.physics.add.staticSprite(1610, 312, 'laser');
    this.laser1 = this.physics.add.staticSprite(0, 312, 'laser');

    this.player=this.physics.add.sprite(100,450, 'orion').setScale(2);
    this.player.setCollideWorldBounds(true);


    this.player.setGravityY(400);

//audio
this.levelStart = this.sound.add('levelStart');
this.levelStart.play();

// Once levelStart finishes, start playing levelLoop
this.levelStart.once('complete', () => {
    this.levelLoop = this.sound.add('levelLoop');
    this.levelLoop.loop = true;
    this.levelLoop.play();
});

    this.pipeUp = this.physics.add.staticGroup();
    this.pipeSmallUp = this.physics.add.staticGroup();
    this.pipeSmallSide = this.physics.add.staticGroup();
    this.pipeSide = this.physics.add.staticGroup();

    
    //big up pipes
    this.pipeUp.create(500, 350, 'pipeBigUp').setScale(2).refreshBody();

    //big side pipes
    this.pipeSide.create(700, 380, 'pipeBigSide').setScale(2).refreshBody();

    //small up pipes
    this.pipeSmallUp.create(200,475,'pipeSmallUp').setScale(2).refreshBody();

    //small side pipes
    this.pipeSmallSide.create(1300, 300, 'pipeSmallSide').setScale(2).refreshBody();

    //door
    this.door=this.physics.add.sprite(1700, 320, 'door').setScale(2);


    this.cursors=this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.keycard,  this.collectkeycard, null, this);
    this.physics.add.overlap(this.player, this.sheild,  this.collectSheild, null, this);
    this.physics.add.overlap(this.player, this.raygun,  this.collectRaygun, null, this);
    this.physics.add.overlap(this.player, this.alien1,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien2,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien3,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien4,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien5,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien6,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.laser,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.door, this.level3, null, this);
    // Camera
    this.cam = this.cameras.main.setSize(800, 600);
    this.cam.setZoom(1);
    this.cameras.main.setBounds(0, 0, 1780,600);
    this.cam.startFollow(this.player, false, 50, 50);
//sets game camera

    this.floor = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 100, stepX: 244 },
    });
    this.floorBottom = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 530, stepX: 244 },
    });


    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('orion',{start:0, end:11}),
        frameRate:10,
        repeat:-1
    });

    this.anims.create({
        key:'jump',
        frames: this.anims.generateFrameNumbers('orion',{start:8, end:8}),
        frameRate:20,
        repeat:-1
    });

    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('orion',{start:13, end:21}),
        frameRate:10,
        repeat:-1
    });
    this.anims.create({
        key:'idle',
        frames: this.anims.generateFrameNumbers('orion',{start:12, end:12}),
        frameRate:10,
        repeat:-1
    });

}
update(){
    this.physics.add.collider(this.player, this.keycard);
    this.physics.add.collider(this.player, this.sheild);
    this.physics.add.collider(this.player, this.raygun);
    this.physics.add.collider(this.player, this.pipeUp);
    this.physics.add.collider(this.player, this.pipeSide);
    this.physics.add.collider(this.player, this.pipeSmallUp);
    this.physics.add.collider(this.player, this.pipeSmallSide);
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.overlap(this.player, this.door);
    this.physics.add.collider(this.player, this.floorBottom);
    this.physics.add.collider(this.player, this.laser);
    this.physics.add.collider(this.player, this.alien1);
    this.physics.add.collider(this.player, this.alien2);
    this.physics.add.collider(this.player, this.alien3);
    this.physics.add.collider(this.player, this.alien4);
    this.physics.add.collider(this.player, this.alien5);
    this.physics.add.collider(this.player, this.alien6);
    this.physics.add.collider(this.player, this.laser1);

    if (this.cursors.left.isDown){
        this.player.setVelocityX(-160);
        this.player.anims.play('left',true);
    }
    else if (this.cursors.right.isDown){
        this.player.setVelocityX(160);
        this.player.anims.play('right',true);

    }
    else if (this.cursors.down.isDown){
        this.player.setVelocityY(260);
        this.player.anims.play('jump',true);

    }
    else{
        this.player.setVelocityX(0);
        this.player.setVelocityY(-400);
        this.player.anims.play('idle');
    }



    this.alien1.x += 2;
    this.alien1.refreshBody();

    if (this.alien1.x > 1650)
        {
            this.alien1.x = -50;
            this.alien1.refreshBody();
        }
        this.alien2.x += 2;
        this.alien2.refreshBody();

    if (this.alien2.x > 1550)
        {
            this.alien2.x = -30;
            this.alien2.refreshBody();
        }
        this.alien3.y += 2;
        this.alien3.refreshBody();

        if (this.alien3.y > 500)
            {
                this.alien3.y = -50;
                this.alien3.refreshBody();
            }
        this.alien4.y += 2;
        this.alien4.refreshBody();

        if (this.alien4.y > 550)
            {
                this.alien4.y = -50;
                this.alien4.refreshBody();
            }
        this.alien5.y += 2;
        this.alien5.refreshBody();

        if (this.alien5.y > 300)
            {
                this.alien5.y = -30;
                this.alien5.refreshBody();
            }
        this.alien6.x += 2;
        this.alien6.refreshBody();

        if (this.alien6.x > 350)
            {
                this.alien6.x = -350;
                this.alien6.refreshBody();
            }
                
//makes aliens move around

}

collectkeycard(player, keycard, laser, score)
{
    keycard.disableBody(true, true);
    keycard.destroy();
    this.collect=true;
    this.text= this.add.text(30, 30, 'Keycard collected!', {fill:'#ffffff'});
    this. laser. setPosition (0, 312); 
    this.laser.refreshBody();
    this.events.emit('addScore');

};
collectSheild(player, sheild)
{
    sheild.disableBody(true, true);
    sheild.destroy();
    this.text= this.add.text(250, 30, 'Sheild collected!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('addLife');
    this.scene.get('UIScene').events.emit('addScore');

};
collectRaygun(player, raygun)
{
    raygun.disableBody(true, true);
    raygun.destroy();
    this.text= this.add.text(450, 30, 'Raygun collected!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('addBullet');
    this.scene.get('UIScene').events.emit('addScore');

};
ouch(player, alien1,alien2,alien3)
{
    this.text= this.add.text(750, 30, 'Ouch!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('takeLife');
};
level3(){
    this.scene.start('level3');
};
};

class level3 extends Phaser.Scene{
    constructor(){
        super({ key: 'level3' });
        //class variables go here
        var player= player;
        var text=text;
        var anims=anims;
        this.score = 0;
        this.lives = 1;
        this.bullets=0;

    }
    //add functions here
//game config

preload (){
    this.load.spritesheet('orion', 'orion.png', {frameWidth: 32, frameHeight:33});
    this.load.image('background', 'space.png');
    this.load.image('keycard', 'key.png');
    this.load.image('pipeSmallSide', 'rippedPipeSide.png');
    this.load.image('pipeBigSide', 'bigPipeSide.png');
    this.load.image('pipeSmallUp', 'rippedPipeUp.png');
    this.load.image('pipeBigUp', 'bigPipeUp.png');
    this.load.audio('levelStart', 'levelStart.mp3');
    this.load.audio('levelLoop', 'levelLoop.mp3');
    this.load.image('sheild', 'sheild.png');
    this.load.image('raygun', 'raygun.png');
    this.load.image('floor', 'floor.png');
    this.load.image('shipSide', 'shipSide.png');
    this.load.image('door', 'door.png');
    this.load.image('laser', 'laser.png');
    this.load.image('alien1', 'alien1.png');
    this.load.image('alien2', 'alien2.png');
    this.load.image('alien3', 'alien3.png');
    this.load.image('ray', 'ray.png');
    this.load.image('dead1', 'gameOver.png');
}


create() {
    this.add.image(50, 60, 'background').setScale(2);
    this.shipSide = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 415, stepX: 300 },
    });
    this.shipSide2 = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 215, stepX: 300 },
    });
    //this.add.image(1780, 60, 'background').setScale(2);
    //this.text= this.add.text(100, 300, 'How much oxygen do I have left?...', {fill:'#ffffff'});
    this.keycard=this.physics.add.sprite(535, 375, 'keycard').setScale(2);
    this.sheild=this.physics.add.sprite(1150, 275, 'sheild').setScale(2);
    this.raygun=this.physics.add.sprite(1450, 500, 'raygun').setScale(1.5);
    this.alien1=this.physics.add.staticSprite(1000, 400, 'alien1').setScale(2);
    this.alien2=this.physics.add.staticSprite(520, 240, 'alien2').setScale(2);
    this.alien3=this.physics.add.staticSprite(1400, 200, 'alien3').setScale(2);
    this.alien4=this.physics.add.staticSprite(1400, 500, 'alien1').setScale(2);
    this.alien5=this.physics.add.staticSprite(1100, 300, 'alien2').setScale(2);
    this.alien6=this.physics.add.staticSprite(1000, 200, 'alien3').setScale(2);
    this.laser = this.physics.add.staticSprite(1610, 312, 'laser');
    this.laser1 = this.physics.add.staticSprite(0, 312, 'laser');

    this.player=this.physics.add.sprite(100,450, 'orion').setScale(2);
    this.player.setCollideWorldBounds(true);


    this.player.setGravityY(400);

//audio
this.levelStart = this.sound.add('levelStart');
this.levelStart.play();

// Once levelStart finishes, start playing levelLoop
this.levelStart.once('complete', () => {
    this.levelLoop = this.sound.add('levelLoop');
    this.levelLoop.loop = true;
    this.levelLoop.play();
});

    this.pipeUp = this.physics.add.staticGroup();
    this.pipeSmallUp = this.physics.add.staticGroup();
    this.pipeSmallSide = this.physics.add.staticGroup();
    this.pipeSide = this.physics.add.staticGroup();

    
    //big up pipes
    this.pipeUp.create(500, 350, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(700, 190, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(500, 240, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(700, 260, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(1250, 260, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(1200, 460, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(800, 260, 'pipeBigUp').setScale(2).refreshBody();
    this.pipeUp.create(900, 160, 'pipeBigUp').setScale(2).refreshBody();
    //big side pipes
    this.pipeSide.create(800, 380, 'pipeBigSide').setScale(2).refreshBody();
    this.pipeSide.create(200, 300, 'pipeBigSide').setScale(2).refreshBody();
    this.pipeSide.create(1300, 300, 'pipeBigSide').setScale(2).refreshBody();
    this.pipeSide.create(500, 400, 'pipeBigSide').setScale(2).refreshBody();
    //small up pipes
    this.pipeSmallUp.create(200,475,'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(300,150,'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(200, 400, 'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(1500, 310, 'pipeSmallUp').setScale(2).refreshBody();
    this.pipeSmallUp.create(1100, 480, 'pipeSmallUp').setScale(2).refreshBody();
    //small side pipes
    this.pipeSmallSide.create(1350, 350, 'pipeSmallSide').setScale(2).refreshBody();
    this.pipeSmallSide.create(1350, 450, 'pipeSmallSide').setScale(2).refreshBody();
    //door
    this.door=this.physics.add.sprite(1700, 320, 'door').setScale(2);


    this.cursors=this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.keycard,  this.collectkeycard, null, this);
    this.physics.add.overlap(this.player, this.sheild,  this.collectSheild, null, this);
    this.physics.add.overlap(this.player, this.raygun,  this.collectRaygun, null, this);
    this.physics.add.overlap(this.player, this.alien1,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien2,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien3,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien4,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien5,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien6,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.laser,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.door, this.level4, null, this);
    // Camera
    this.cam = this.cameras.main.setSize(800, 600);
    this.cam.setZoom(1);
    this.cameras.main.setBounds(0, 0, 1780,600);
    this.cam.startFollow(this.player, false, 50, 50);




    this.floor = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 100, stepX: 244 },
    });
    this.floorBottom = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 530, stepX: 244 },
    });


    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('orion',{start:0, end:11}),
        frameRate:10,
        repeat:-1
    });

    this.anims.create({
        key:'jump',
        frames: this.anims.generateFrameNumbers('orion',{start:8, end:8}),
        frameRate:20,
        repeat:-1
    });

    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('orion',{start:13, end:21}),
        frameRate:10,
        repeat:-1
    });
    this.anims.create({
        key:'idle',
        frames: this.anims.generateFrameNumbers('orion',{start:12, end:12}),
        frameRate:10,
        repeat:-1
    });

}
update(){
    this.physics.add.collider(this.player, this.keycard);
    this.physics.add.collider(this.player, this.sheild);
    this.physics.add.collider(this.player, this.raygun);
    this.physics.add.collider(this.player, this.pipeUp);
    this.physics.add.collider(this.player, this.pipeSide);
    this.physics.add.collider(this.player, this.pipeSmallUp);
    this.physics.add.collider(this.player, this.pipeSmallSide);
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.overlap(this.player, this.door);
    this.physics.add.collider(this.player, this.floorBottom);
    this.physics.add.collider(this.player, this.laser);
    this.physics.add.collider(this.player, this.alien1);
    this.physics.add.collider(this.player, this.alien2);
    this.physics.add.collider(this.player, this.alien3);
    this.physics.add.collider(this.player, this.alien4);
    this.physics.add.collider(this.player, this.alien5);
    this.physics.add.collider(this.player, this.alien6);
    this.physics.add.collider(this.player, this.laser1);

    if (this.cursors.left.isDown){
        this.player.setVelocityX(-160);
        this.player.anims.play('left',true);
    }
    else if (this.cursors.right.isDown){
        this.player.setVelocityX(160);
        this.player.anims.play('right',true);

    }
    else if (this.cursors.down.isDown){
        this.player.setVelocityY(260);
        this.player.anims.play('jump',true);

    }
    else{
        this.player.setVelocityX(0);
        this.player.setVelocityY(-400);
        this.player.anims.play('idle');
    }

    //alien movements
    this.alien1.x += 2;
    this.alien1.refreshBody();

    if (this.alien1.x > 1650)
        {
            this.alien1.x = -50;
            this.alien1.refreshBody();
        }
        this.alien2.x += 2;
        this.alien2.refreshBody();

    if (this.alien2.x > 1550)
        {
            this.alien2.x = -30;
            this.alien2.refreshBody();
        }
        this.alien3.y += 2;
        this.alien3.refreshBody();

    if (this.alien3.y > 500)
        {
            this.alien3.y = -50;
            this.alien3.refreshBody();
        }
    this.alien4.y += 2;
    this.alien4.refreshBody();

    if (this.alien4.y > 550)
        {
            this.alien4.y = -50;
            this.alien4.refreshBody();
        }
    this.alien5.y += 2;
    this.alien5.refreshBody();

    if (this.alien5.y > 300)
        {
            this.alien5.y = -30;
            this.alien5.refreshBody();
        }
    this.alien6.x += 2;
    this.alien6.refreshBody();

    if (this.alien6.x > 350)
        {
            this.alien6.x = -350;
            this.alien6.refreshBody();
        }

}

collectkeycard(player, keycard, laser, score)
{
    keycard.disableBody(true, true);
    keycard.destroy();
    this.collect=true;
    this.text= this.add.text(30, 30, 'Keycard collected!', {fill:'#ffffff'});
    this. laser. setPosition (0, 312); 
    this.laser.refreshBody();
    this.scene.get('UIScene').events.emit('addScore');

};
collectSheild(player, sheild)
{
    sheild.disableBody(true, true);
    sheild.destroy();
    this.text= this.add.text(250, 30, 'Sheild collected!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('addLife');
    this.scene.get('UIScene').events.emit('addScore');

};
collectRaygun(player, raygun)
{
    raygun.disableBody(true, true);
    raygun.destroy();
    this.text= this.add.text(450, 30, 'Raygun collected!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('addScore');
    this.scene.get('UIScene').events.emit('addBullet');

};
ouch(player, alien1,alien2,alien3,alien4,alien5,alien6)
{
    this.text= this.add.text(750, 30, 'Ouch!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('takeLife');

};
level4(){
    this.scene.switch('finished');
    this.scene.stop('level3');

};
}



class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true });
        this.score = 0;
        this.lives = 1;
        this.bullets=0;
    }

    create() {
        const info = this.add.text(10, 10, `Score: ${this.score}`, { fill: '#ffffff' });
        const livesText = this.add.text(150, 10, `Lives: ${this.lives}`, { fill: '#ffffff' });
        const bulletsText = this.add.text(330, 10, `Bullets: ${this.bullets}`, { fill: '#ffffff' });
        const ourGame = this.scene.get('UIScene');
    
        ourGame.events.on('addScore', function () {
            this.score += 100;
            info.setText(`Score: ${this.score}`);
        }, this);

        ourGame.events.on('addBullet', function () {
            this.bullets += 10;
            bulletsText.setText(`Bullets: ${this.bullets}`);
        }, this);
    
        ourGame.events.on('addLife', function () {
            this.lives += 1;
            livesText.setText(`Lives: ${this.lives}`);
            this.add.text(100, 20, 'Life collected');
        }, this);

        ourGame.events.on('takeLife', function () {
            if (this.lives > 0) {
                this.lives -= 1;
                livesText.setText(`Lives: ${this.lives}`);
                this.add.text(200, 20, 'OUCH!');
            }
        }, this);

        ourGame.events.on('resetLife', function () {
            this.lives = 1;
            livesText.setText(`Lives: ${this.lives}`);
        }, this);

        ourGame.events.on('resetBullets', function () {
            this.bullets = 0;
            bulletsText.setText(`Bullets: ${this.bullets}`);
        }, this);

        this.startTimer();

    }

    startTimer() {
        this.startTime = new Date();
        this.totalTime = 0; 
        this.timeElapsed = 0;

        this.timerText = this.add.text(this.game.config.width / 2, 100, "00:00", { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
//timer tutorial from here: https://www.joshmorony.com/how-to-create-an-accurate-timer-for-phaser-games/
    updateTimer() {
        this.timeElapsed++;
        const remainingTime = this.totalTime + this.timeElapsed;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = Math.floor(remainingTime % 60);

        const result = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        this.timerText.setText(result);

        if (remainingTime <= 0) {
            this.gameTimer.remove(false);
            this.scene.switch('gameOver');
        };
    }

    update() {
        if (this.lives <= 0) {
            this.gameTimer.remove(true);
            this.timerText.destroy();
            this.scene.switch('gameOver');
        }
    }

}

class gameOver extends Phaser.Scene {
    constructor(){
        super({ key: 'gameOver' });
        this.lives = 1;
    }

    preload(){
        this.load.image('dead1', 'gameOver.png');
    }
    create(){
        this.cursors=this.input.keyboard.createCursorKeys();
        this.add.image(600, 300, 'dead1').setScale(0.9);
        this.text= this.add.text(300, 400, 'YOU DIED! HIT SPACE TO RETRY!', { fill: '#B5E61D' }).setScale(2);



    }
    update(){
        if (this.cursors.space.isDown){
            this.scene.get('UIScene').events.emit('resetLife');
            this.scene.get('UIScene').events.emit('resetBullets');
            this.restart();
        }
    }
    restart(GameScene){

        this.scene.start('GameScene');
        this.scene.start('UIScene');
        this.scene.stop('gameOver');
        //this.scene.switch('GameScene');
        
    };
    

};
class finished extends Phaser.Scene {
    constructor(){
        super({ key: 'finished' });
        this.lives = 1;
    }

    preload(){
        this.load.image('end', 'endScreen.png');
    }
    create(){
        this.cursors=this.input.keyboard.createCursorKeys();
        this.add.image(600, 300, 'end').setScale(1.5);
        this.text= this.add.text(100, 400, 'YOU ESCAPED! WELL DONE!', { fill: '#B5E61D' }).setScale(2);
        this.text= this.add.text(100, 500, 'PRESS SPACE TO PLAY AGAIN!', { fill: '#B5E61D' }).setScale(2);




    }
    update(){
        if (this.cursors.space.isDown){
            this.scene.get('UIScene').events.emit('resetLife');
            this.restart();
        }
    }
    restart(GameScene){

        this.scene.start('hard1');
        this.scene.start('UIScene');
        this.scene.stop('finished');
        //this.scene.switch('GameScene');
        
    };
}

class hard1 extends Phaser.Scene{
    constructor(){
        super({ key: 'hard1' });
        //class variables go here
        var player= player;
        var text=text;
        var anims=anims;
        this.score = 0;
        this.lives = 1;
        this.bullets=0;
    }

preload (){
    this.load.spritesheet('orion', 'orion.png', {frameWidth: 32, frameHeight:33});
    this.load.image('background', 'space.png');
    this.load.image('keycard', 'key.png');
    this.load.image('pipeSmallSide', 'rippedPipeSide.png');
    this.load.image('pipeBigSide', 'bigPipeSide.png');
    this.load.image('pipeSmallUp', 'rippedPipeUp.png');
    this.load.image('pipeBigUp', 'bigPipeUp.png');
    this.load.audio('levelStart', 'levelStart.mp3');
    this.load.audio('levelLoop', 'levelLoop.mp3');
    this.load.image('floor', 'floor.png');
    this.load.image('shipSide', 'shipSide.png');
    this.load.image('door', 'door.png');
    this.load.image('laser', 'laser.png');
    this.load.image('alien1', 'alien1.png');
    this.load.image('alien2', 'alien2.png');
    this.load.image('alien3', 'alien3.png');
    this.load.image('ray', 'ray.png');
    this.load.image('dead1', 'gameOver.png');
}


create() {
    this.add.image(50, 60, 'background').setScale(2);
    this.shipSide = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 415, stepX: 300 },
    });
    this.shipSide2 = this.physics.add.staticGroup({
        key: 'shipSide',
        setScale:{x:2,y:2},
        repeat: 10,
        setXY: { x: 50, y: 215, stepX: 300 },
    });
    //this.add.image(1780, 60, 'background').setScale(2);

    this.keycard=this.physics.add.sprite(535, 375, 'keycard').setScale(2);

    this.alien1=this.physics.add.staticSprite(1000, 400, 'alien1').setScale(2);
    this.alien2=this.physics.add.staticSprite(520, 240, 'alien2').setScale(2);
    this.alien3=this.physics.add.staticSprite(1400, 200, 'alien3').setScale(2);
    this.alien4=this.physics.add.staticSprite(1100, 250, 'alien1').setScale(2);
    this.alien5=this.physics.add.staticSprite(650, 440, 'alien2').setScale(2);
    this.alien6=this.physics.add.staticSprite(400, 200, 'alien3').setScale(2);
    this.laser = this.physics.add.staticSprite(1610, 312, 'laser');
    this.laser1 = this.physics.add.staticSprite(0, 312, 'laser');

    this.player=this.physics.add.sprite(100,450, 'orion').setScale(2);
    this.player.setCollideWorldBounds(true);


    this.player.setGravityY(400);

//audio
this.levelStart = this.sound.add('levelStart');
this.levelStart.play();

// Once levelStart finishes, start playing levelLoop
this.levelStart.once('complete', () => {
    this.levelLoop = this.sound.add('levelLoop');
    this.levelLoop.loop = true;
    this.levelLoop.play();
});

    this.pipeUp = this.physics.add.staticGroup();
    this.pipeSmallUp = this.physics.add.staticGroup();
    this.pipeSmallSide = this.physics.add.staticGroup();
    this.pipeSide = this.physics.add.staticGroup();

    
    //big up pipes
    this.pipeUp.create(500, 350, 'pipeBigUp').setScale(2).refreshBody();

    //big side pipes
    this.pipeSide.create(700, 380, 'pipeBigSide').setScale(2).refreshBody();

    //small up pipes
    this.pipeSmallUp.create(200,475,'pipeSmallUp').setScale(2).refreshBody();

    //small side pipes
    this.pipeSmallSide.create(1300, 300, 'pipeSmallSide').setScale(2).refreshBody();

    //door
    this.door=this.physics.add.sprite(1700, 320, 'door').setScale(2);


    this.cursors=this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.keycard,  this.collectkeycard, null, this);
    this.physics.add.overlap(this.player, this.sheild,  this.collectSheild, null, this);
    this.physics.add.overlap(this.player, this.raygun,  this.collectRaygun, null, this);
    this.physics.add.overlap(this.player, this.alien1,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien2,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien3,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien4,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien5,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.alien6,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.laser,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.door, this.level3, null, this);
    // Camera
    this.cam = this.cameras.main.setSize(800, 600);
    this.cam.setZoom(1);
    this.cameras.main.setBounds(0, 0, 1780,600);
    this.cam.startFollow(this.player, false, 50, 50);
//sets game camera

    this.floor = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 100, stepX: 244 },
    });
    this.floorBottom = this.physics.add.staticGroup({
        collideWorldBounds: true,
        key: 'floor',
        repeat: 10,
        setScale:{x:2,y:2},
        setXY: { x: 0, y: 530, stepX: 244 },
    });


    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('orion',{start:0, end:11}),
        frameRate:10,
        repeat:-1
    });

    this.anims.create({
        key:'jump',
        frames: this.anims.generateFrameNumbers('orion',{start:8, end:8}),
        frameRate:20,
        repeat:-1
    });

    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('orion',{start:13, end:21}),
        frameRate:10,
        repeat:-1
    });
    this.anims.create({
        key:'idle',
        frames: this.anims.generateFrameNumbers('orion',{start:12, end:12}),
        frameRate:10,
        repeat:-1
    });

}
update(){
    this.physics.add.collider(this.player, this.keycard);
    this.physics.add.collider(this.player, this.sheild);
    this.physics.add.collider(this.player, this.raygun);
    this.physics.add.collider(this.player, this.pipeUp);
    this.physics.add.collider(this.player, this.pipeSide);
    this.physics.add.collider(this.player, this.pipeSmallUp);
    this.physics.add.collider(this.player, this.pipeSmallSide);
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.overlap(this.player, this.door);
    this.physics.add.collider(this.player, this.floorBottom);
    this.physics.add.collider(this.player, this.laser);
    this.physics.add.collider(this.player, this.alien1);
    this.physics.add.collider(this.player, this.alien2);
    this.physics.add.collider(this.player, this.alien3);
    this.physics.add.collider(this.player, this.alien4);
    this.physics.add.collider(this.player, this.alien5);
    this.physics.add.collider(this.player, this.alien6);
    this.physics.add.collider(this.player, this.laser1);

    if (this.cursors.left.isDown){
        this.player.setVelocityX(-160);
        this.player.anims.play('left',true);
    }
    else if (this.cursors.right.isDown){
        this.player.setVelocityX(160);
        this.player.anims.play('right',true);

    }
    else if (this.cursors.down.isDown){
        this.player.setVelocityY(260);
        this.player.anims.play('jump',true);

    }
    else{
        this.player.setVelocityX(0);
        this.player.setVelocityY(-400);
        this.player.anims.play('idle');
    }



    this.alien1.x += 3;
    this.alien1.refreshBody();

    if (this.alien1.x > 1650)
        {
            this.alien1.x = -50;
            this.alien1.refreshBody();
        }
        this.alien2.x += 3;
        this.alien2.refreshBody();

    if (this.alien2.x > 1550)
        {
            this.alien2.x = -30;
            this.alien2.refreshBody();
        }
        this.alien3.y += 3;
        this.alien3.refreshBody();

        if (this.alien3.y > 500)
            {
                this.alien3.y = -50;
                this.alien3.refreshBody();
            }
        this.alien4.y += 3;
        this.alien4.refreshBody();

        if (this.alien4.y > 550)
            {
                this.alien4.y = -50;
                this.alien4.refreshBody();
            }
        this.alien5.y += 3;
        this.alien5.refreshBody();

        if (this.alien5.y > 300)
            {
                this.alien5.y = -30;
                this.alien5.refreshBody();
            }
        this.alien6.x += 3;
        this.alien6.refreshBody();

        if (this.alien6.x > 350)
            {
                this.alien6.x = -350;
                this.alien6.refreshBody();
            }
                
//makes aliens move around

}

collectkeycard(player, keycard, laser, score)
{
    keycard.disableBody(true, true);
    keycard.destroy();
    this.collect=true;
    this.text= this.add.text(30, 30, 'Keycard collected!', {fill:'#ffffff'});
    this. laser. setPosition (0, 312); 
    this.laser.refreshBody();
    this.events.emit('addScore');

};

ouch(player, alien1,alien2,alien3)
{
    this.text= this.add.text(750, 30, 'Ouch!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('takeLife');
};
level3(){
    this.scene.start('finished');
};
};


const config = {
    type:Phaser.AUTO,
    width:1800,
    parent: "game-container",
    height:600,
    transparency: true,
    scene: [startScene,GamesDevCW2, level2, UIScene,level3,gameOver,finished,hard1],
    physics:{
        default: 'arcade',
        arcade:{
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
