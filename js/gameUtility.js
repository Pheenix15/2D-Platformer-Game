
// OBJECT1 REPLACES 'THIS' AND REPRESENTS THE PLAYERS HITBOX & OBJECT2 REPLACES 'COLLISIONBLOCK'
function collision({
    object1,
    object2
}) {
    return (
        object1.position.y + object1.height >= object2.position.y && object1.position.y <= object2.position.y + object2.height && object1.position.x <= object2.position.x + object2.width && object1.position.x + object1.width >= object2.position.x
    )
}

//PLATFORM COLLISION
function platformCollisions({
    object1,
    object2
}) {
    return (
        object1.position.y + object1.height >= object2.position.y && 
        object1.position.y + object1.height <= object2.position.y + object2.height && 
        object1.position.x <= object2.position.x + object2.width && 
        object1.position.x + object1.width >= object2.position.x
    )
}