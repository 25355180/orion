
class bossFight extends Phaser.Scene{
    constructor(){
        super({ key: 'bossFight' });
        //class variables go here
        var player= player;
        var text=text;
        var anims=anims;
        this.score = 0;
        this.lives = 1;

    }
    //add functions here
//game config

preload (){
    //this.load.image('<KEY>', '<path to image>');
// this.load.spritesheet('<KEY>', '<path to spritesheet>', {frameWidth: <WIDTH>, frameHeight: <HEIGHT>});
    this.load.spritesheet('orion', 'orion.png', {frameWidth: 32, frameHeight:33});
    this.load.spritesheet('andromeda', 'Andromeda.png', {frameWidth: 32, frameHeight:33});
    this.load.image('background', 'space.png');
    this.load.image('keycard', 'key.png');
    this.load.image('ray', 'ray.png');
    this.load.audio('levelMusic', 'level_music.mp3');
    this.load.image('sheild', 'sheild.png');
    this.load.image('floor', 'floor.png');
    this.load.image('shipSide', 'shipSide.png');
    this.load.image('door', 'door.png');
    this.load.image('laser', 'laser.png');
    this.load.image('dead1', 'gameOver.png');

}


create() {
    //this.text= this.add.text(100, 300, 'Why are you attacking me!?', {fill:'#ffffff'});
    this.text= this.add.text(400, 300, '...', {fill:'#ffffff'});
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
    this.sheild=this.physics.add.sprite(1250, 275, 'sheild').setScale(2);
    this.raygun=this.physics.add.sprite(1450, 500, 'raygun').setScale(1.5);
    this.alien1=this.physics.add.staticSprite(1000, 400, 'alien1').setScale(2);

    this.laser = this.physics.add.staticSprite(1610, 312, 'laser');
    this.laser1 = this.physics.add.staticSprite(0, 312, 'laser');

    this.player=this.physics.add.sprite(100,450, 'orion').setScale(2);
    this.player.setCollideWorldBounds(true);
    this.andromeda=this.physics.add.sprite(300,450, 'andromeda').setScale(2);
    this.andromeda.setCollideWorldBounds(true);
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
    this.door = this.physics.add.staticGroup();
    

    //door
    this.door=this.physics.add.sprite(1700, 320, 'door').setScale(2);


    this.cursors=this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(this.player, this.keycard,  this.collectkeycard, null, this);
    this.physics.add.overlap(this.player, this.sheild,  this.collectSheild, null, this);
    this.physics.add.overlap(this.player, this.raygun,  this.collectRaygun, null, this);
    this.physics.add.overlap(this.player, this.andromeda,  this.ouch, null, this);
    this.physics.add.overlap(this.player, this.laser,  this.ouch, null, this);
    // Camera
    this.cam = this.cameras.main.setSize(800, 600);
    this.cam.setZoom(1);
    this.cameras.main.setBounds(0, 0, 1780,600);
    this.cam.startFollow(this.player, false, 50, 50);

    this.physics.add.overlap(this.player, this.door, this.done, null, this);


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

    this.anims.create({
        key:'righta',
        frames: this.anims.generateFrameNumbers('andromeda',{start:0, end:11}),
        frameRate:10,
        repeat:-1
    });

    this.anims.create({
        key:'jumpa',
        frames: this.anims.generateFrameNumbers('andromeda',{start:8, end:8}),
        frameRate:20,
        repeat:-1
    });

    this.anims.create({
        key:'lefta',
        frames: this.anims.generateFrameNumbers('andromeda',{start:13, end:21}),
        frameRate:10,
        repeat:-1
    });
    this.anims.create({
        key:'idlea',
        frames: this.anims.generateFrameNumbers('andromeda',{start:12, end:12}),
        frameRate:10,
        repeat:-1
    });

}
update(){
    this.physics.add.collider(this.player, this.keycard);
    this.physics.add.collider(this.player, this.sheild);

    this.physics.add.collider(this.player, this.pipeUp);
    this.physics.add.collider(this.player, this.pipeSide);
    this.physics.add.collider(this.player, this.pipeSmallUp);
    this.physics.add.collider(this.player, this.pipeSmallSide);
    this.physics.add.collider(this.player, this.floor);
    this.physics.add.collider(this.player, this.door);
    this.physics.add.collider(this.player, this.floorBottom);
    this.physics.add.collider(this.player, this.laser);
    this.physics.add.collider(this.andromeda, this.floorBottom);
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
    if(this.cursors.space.isDown){

    }



    this.andromeda.x += 2; this.andromeda.anims.play('righta', true); 

    if (this.andromeda.x > 750)
        {
            this.andromeda.x = -150;
            this.andromeda.anims.play('lefta', true); 
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
    this.scene.get('UIScene').events.emit('addScore');
    this.scene.get('UIScene').events.emit('addLife');

};

ouch(player, andromeda)
{
    this.text= this.add.text(750, 30, 'Ouch!', {fill:'#ffffff'});
    this.scene.get('UIScene').events.emit('takeLife');

};
done(){
    this.scene.switch('finished');

};

};