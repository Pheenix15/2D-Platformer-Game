class Player extends Sprite{
    constructor({position, collisionBlock, platformCollisionBlock, imageSrc, frameRate, scale = 0.8, animations}) {
        super({ imageSrc, frameRate, scale })
        this.position = position
        this.velocity = {
            x:0,
            y:1
        }
        
        this.collisionBlock = collisionBlock
        this.platformCollisionBlock = platformCollisionBlock
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10
        } 
        //PLAYER SPRITE ANIMATIONS
        this.animations = animations
        this.lastDirection = 'right'

        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc

            this.animations[key].image = image
        }

        this.camerabox = {
           position: {
            x: this.position.x,
            y: this.position.y,
           },
           width: 200,
           height: 80,
        }
        console.log(this.camerabox)
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return

        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    updateCameraBox() {
        this.camerabox = {
            position: {
             x: this.position.x - 50,
             y: this.position.y,
            },
            width: 200,
            height: 80,
         }
    }

    //CAMERA MOVEMENT

     checkForHorizontalCanvasCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 1120 || this.hitbox.position.x + this.velocity.x <= 0) {
            this.velocity.x = 0
        }
     }

    cameraPanLeft({canvas, camera}) {
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width

        const scaledDownCanvasWidth = canvas.width / 4

        if (cameraboxRightSide >= 860/**BACKGROUND IMAGE WIDTH(BKG WIDTH = 1120px BUT CAUSES WHITE BKG OVERFLOW SO USE 860px)***/) return

        if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    cameraPanRight({canvas, camera}) {
        if (this.camerabox.position.x <= 0) return

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    cameraPanDown({canvas, camera}) {
        if (this.camerabox.position.y + this.velocity.y <= 0) return

        if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
        }
    }

    cameraPanUp({canvas, camera}) {
        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 500 /**BACKGROUND IMAGE HEIGHT(BKG HEIGHT = 640px BUT CAUSES WHITE BKG OVERFLOW SO USED 500px)***/) return

        const scaledCanvasHeight = canvas.height / 4
        if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
            camera.position.y -= this.velocity.y
        }
    }

    update() {
        this.updateFrame()
        this.updateHitbox()
        this.updateCameraBox()

        //DRAWS IMAGES

        /****CAMERA BOX******/
        // c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        // c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)

        /****PLAYER HITBOX RECT****/
        // c.fillStyle = 'rgba(0, 0, 255, 0.5)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // c.fillStyle = 'rgba(24, 146, 250, 0.5)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
        /****PLAYER HITBOX RECT END****/
        
        this.draw()
        
        this.position.x += this.velocity.x
        this.checkForHorizontalCollision()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollision()
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 20,
                y: this.position.y + 12,
            },
            width: 15,
            height: 39,
        } 
    }

    checkForHorizontalCollision() {
        for (let i = 0; i <this.collisionBlock.length; i++) {
            const collisionBlock = this.collisionBlock[i]

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = collisionBlock.position.x - this.width - offset - 0.01
                    break
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
                
            }
        }
    }

    applyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }
    
    checkForVerticalCollision() {
        for (let i = 0; i <this.collisionBlock.length; i++) {
            const collisionBlock = this.collisionBlock[i]

            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0

                    //SETS COLLISION TO THE HITBOX NOT PLAYER SPRITE IMAGE HEIGHT
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y

                    this.position.y = collisionBlock.position.y + collisionBlock.height -offset + 0.01
                    break
                }
                
            }
        }
        //PLATFORM COLLISION
        for (let i = 0; i <this.platformCollisionBlock.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlock[i]

            if (
                platformCollisions({
                    object1: this.hitbox,
                    object2: platformCollisionBlock,
                })
            ) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0

                    //SETS COLLISION TO THE HITBOX NOT PLAYER SPRITE IMAGE HEIGHT
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = platformCollisionBlock.position.y - offset - 0.01
                    break
                }
                
            }
        }
    }

}