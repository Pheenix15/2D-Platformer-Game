const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')


canvas.height = 576
canvas.width = 1024
const scaledCanvas = {
    width: canvas.width / 2,
    height: canvas.height /2
}

const floorCollision2D = []
for (let i =0; i < floorCollision.length; i +=70) {
    floorCollision2D.push(floorCollision.slice(i, i + 70))
}


const collisionBlock = []
floorCollision2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 7184) {
            collisionBlock.push(new CollisionBlock({position: {
                x: x * 16,
                y: y * 16,
            }}))
        }
    })
})

const platformCollision2D = []
for (let i =0; i < platformCollision.length; i +=70) {
    platformCollision2D.push(platformCollision.slice(i, i + 70))
}

const platformCollisionBlock = []
platformCollision2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 7184) {
            platformCollisionBlock.push(new CollisionBlock({position: {
                x: x * 16,
                y: y * 16,
            },
            height: 4,
        }))
        }
    })
})
console.log(platformCollision2D)

const gravity = 0.2


const player = new Player({
    position : {
        x: 20,
        y: 0,
    },
    collisionBlock: collisionBlock,
    platformCollisionBlock: platformCollisionBlock,
    imageSrc: './GameAssets/Player/Idle.png',
    frameRate: 4,

    //MOVEMENT ANIMATIONS
    animations: {
        Idle: {
            imageSrc:'./GameAssets/Player/Idle.png',
            frameRate: 4,
            frameBuffer:5,
        },
        Running: {
            imageSrc:'./GameAssets/Player/Run.png',
            frameRate: 8,
            frameBuffer: 6,
        },
        Jumping: {
            imageSrc:'./GameAssets/Player/Jump-Start.png',
            frameRate: 4,
            frameBuffer: 0.4,
        },
        Landing: {
            imageSrc:'./GameAssets/Player/Jump-End.png',
            frameRate: 3,
            frameBuffer: 0,
        },
        IdleLeft: {
            imageSrc:'./GameAssets/Player/Idle-left.png',
            frameRate: 4,
            frameBuffer:5,
        },
        RunningLeft: {
            imageSrc:'./GameAssets/Player/Run-left.png',
            frameRate: 8,
            frameBuffer: 6,
        },
        JumpingLeft: {
            imageSrc:'./GameAssets/Player/Jump-Start-left.png',
            frameRate: 4,
            frameBuffer: 0.4,
        },
        LandingLeft: {
            imageSrc:'./GameAssets/Player/Jump-End-left.png',
            frameRate: 3,
            frameBuffer: 0,
        }
    }
})

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}

const background = new Sprite({
    position: {
        x:0,
        y:0,
    },
    imageSrc: './GameAssets/Oakbkg.png',
})

const backgroundImageHeight = 640

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
//BACKGROUND SCALING/PLACMENT
    c.save()
    c.scale(2,2)
    c.translate(camera.position.x, camera.position.y)
    background.update()
    // collisionBlock.forEach((collisionBlock) => {
    //     collisionBlock.update()
    // })
    // platformCollisionBlock.forEach((block) => {
    //     block.update()
    // })

    player.checkForHorizontalCanvasCollision()
    player.update()
    
    //PLAYER SPEED
    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Running')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.cameraPanLeft({canvas, camera})
    }
    else if (keys.a.pressed) {
        player.switchSprite('RunningLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.cameraPanRight({canvas, camera})
    }
    else if (player.velocity.y === 0) {
        if(player.lastDirection === 'right') player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }
    
    if (player.velocity.y < 0) {
        player.cameraPanDown({canvas, camera})
        if (player.lastDirection === 'right') player.switchSprite('Jumping')
            else player.switchSprite('JumpingLeft')
    }
    else if (player.velocity.y > 0) {
        player.cameraPanUp({camera, canvas})
        if (player.lastDirection === 'right')  player.switchSprite('Landing')  
        else player.switchSprite('LandingLeft')
    }

    c.restore()

    

    
}

animate()
// KEY MAPPING
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        
        case 'a':
            keys.a.pressed = true
            break
        
        case 'w':
            player.velocity.y = -6
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        
        case 'a':
            keys.a.pressed = false
            break
        
    }
})