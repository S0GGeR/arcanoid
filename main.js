
var arcanoid = {
    running: true,
    width: 1920,
    height: 1080,
    ctx: undefined,
    platform: undefined,
    rows:4,
    cols:10,
    score: 0,
    level: 1,
    PlatformSpeed: 7,
    BallSpeed: 5,
    blocks:[],
    sprites: {
        background: undefined,
        platform: undefined,
        ball: undefined,
        blocks: undefined,
    },
    pause: false,
    start: function(){
    this.init();
    this.load();
    this.create();
    this.run();


    },
    create: function(){
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    x: 183 * col,
                    y: 57 * row ,
                    width: 168,
                    height: 47,
                    isAlive: true,
                })
            }
        }

    },
    init: function(){
        var canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext("2d");


        window.addEventListener("keydown", function(event) {
            if (event.code === "Escape") {

                arcanoid.running = !arcanoid.running;
                if(arcanoid.running === true){
                    arcanoid.run();
                }

            }

            if ( event.code === 'ArrowLeft' ){
                arcanoid.platform.Vx =  -arcanoid.PlatformSpeed;

            }
            else if( event.code ===  'ArrowRight'){
                arcanoid.platform.Vx = arcanoid.PlatformSpeed;
            }
            else if( event.code === 'Space'){
                arcanoid.platform.releaseBall();
            }
        });
        window.addEventListener("keyup", function(event) {

           arcanoid.platform.stop();
        });
    },
    render: function(){
        this.ctx.clearRect(0,0,this.width,this.height)
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
        this.blocks.forEach(function(block){
            if (block.isAlive) {
                this.ctx.drawImage(this.sprites.blocks, 50 + block.x, block.y + 10);
            }
        },this);
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(" Your score: " + this.score, 15, this.height-200);
    },
    load: function(){
        for(let key in this.sprites){
            this.sprites[key] = new Image();
            this.sprites[key].src = 'images/'+ key +'.png';
        }
        },
    update: function(){

        if (arcanoid.ball.checkHitBox(this.platform)) {

            arcanoid.ball.PlatformPush();
        }

        if (this.platform.Vx !== 0){
            this.platform.move();
        }
        if (this.ball.Vx !== 0 || this.ball.Vy !== 0){
            this.ball.checkBorders();
            this.ball.move();
        }
        this.blocks.forEach(function(block){
            if (block.isAlive) {
                if (arcanoid.ball.checkHitBox(block)) {
                    arcanoid.ball.pushBack(block);
                }
            }
        },this);
    },
    run: function(){

        this.update();
        this.render();

        if (this.running && !this.pause) {

            window.requestAnimationFrame(function () {
                arcanoid.run();
            });
        }
    },
    gameOver: function(message){
        alert(message);
        this.running = false;
        window.location.reload();
    }
};
arcanoid.ball = {
    width: 49,
    height: 47,
    x: 880,
    y: 753,
    Vx: 0,
    Vy: 0,
    checkHitBox: function(block){
        let x = this.x + this.Vx;
        let y = this.y + this.Vy;


        if (x + this.width > block.x &&
            x < block.x + block.width &&
            y + this.height > block.y &&
            y < block.y + block.height){
            return true;
        }
        return false;


    },
    IsLeftSideOfPlatform: function(platform){
        console.log(platform);
        if (this.x + this.width/2 < (platform.x + platform.width/2)) {
            return true;
        }
        else {
            return false;
        }
    },
    PlatformPush: function(){
      this.Vy = -arcanoid.BallSpeed;
        if (this.IsLeftSideOfPlatform(arcanoid.platform)){
            this.Vx = -arcanoid.BallSpeed;
        }
        else {
            this.Vx = arcanoid.BallSpeed;
        }
    },
    pushBack: function(block){
        this.Vy *= -1;
        block.isAlive = false;
        ++arcanoid.score;

        if( arcanoid.score >= arcanoid.blocks.length ){
            arcanoid.gameOver('You Win!')
        }

    },
    move: function(){
        this.x += this.Vx;
        this.y += this.Vy;
    },
    jump: function(){
        this.Vx = -arcanoid.BallSpeed;
        this.Vy = -arcanoid.BallSpeed;
    },
    checkBorders: function(){

        let x = this.x + this.Vx;
        let y = this.y + this.Vy;



        if ( x < 0 ){
            this.x = 0;
            this.Vx = arcanoid.BallSpeed;

        }else if (x+this.width >arcanoid.width){
            this.x = arcanoid.width - this.width;
            this.Vx = -arcanoid.BallSpeed;

        }else if (y < 0){
            this.y = 0;

            this.Vy = arcanoid.BallSpeed;

        }else if (y + this.height >arcanoid.height){
            arcanoid.gameOver('You lose!');


        }
    }
};
arcanoid.platform = {
    x: 800,
    y: 800,
    Vx: 0,
    Vy: 0,
    ball: arcanoid.ball,
    width: 216,
    height: 33,
    releaseBall: function(){
        if (this.ball){
            this.ball.jump();
            this.ball = false;
        }

    },
    move: function(){
        this.x +=this.Vx;
        if  ( this.ball ) {
            this.ball.x += this.Vx;
        }
    },
    stop: function(){
        this.Vx = 0;
        if (this.ball) {
            this.ball.Vx = 0;

        }
    },
};


window.addEventListener("load", function(){
    arcanoid.start();
});
