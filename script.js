const Sign = {
    EMPTY: 0,
    CIRCLE: 1,
    CROSS: 2,
    opposite: sign => {
        if (sign === Sign.CIRCLE) return Sign.CROSS
        if (sign === Sign.CROSS) return Sign.CIRCLE
        return null
    },
    string: sign => {
        if (sign === Sign.CIRCLE) return 'O'
        if (sign === Sign.CROSS) return 'X'
        if (sign === Sign.EMPTY) return ''
        return '?'
    }
}

let ai_sign = Sign.CROSS
let first_move = true,
    computer_turn = false,
    ended = false
let best_move_x = null,
    best_move_y = null
let moves_made = 0
let minimax = new MiniMax(ai_sign)

let setSign = (x, y, sign) => {
    document.getElementById(`${x}-${y}`).innerText = Sign.string(sign)
    minimax.setTile(x, y, sign)

    let result = MiniMax.checkIfGameEnded(minimax.board_state)
    if (result.isEnded) {
        document.getElementById('result').innerText = 2 >> result.whoWon === ai_sign ? 'AI WILL REPLACE YOU SOON ;)' : 'AI IS NOT READY\nTO CONQUER EARTH (yet)'
        ended = true
    }
}

const best_x_obj = document.getElementById('best_move_x')
const best_y_obj = document.getElementById('best_move_y')
let getMinMaxMove = sign => {
    let depth = document.getElementById('depth').value
    if (!depth) depth = document.getElementById('depth').placeholder

    best_x_obj.innerText = '_'
    best_y_obj.innerText = '_'

    let result = minimax.getMove(depth, sign)

    best_x_obj.innerText = result.x.toString()
    best_y_obj.innerText = result.y.toString()
    best_move_x = result.x
    best_move_y = result.y
}

let makeAImove = _ => {
    if (ended) return
    if (first_move) {
        ai_sign = Sign.CIRCLE
        circle_btn.disabled = true
        cross_btn.disabled = true
        first_move = false
        getMinMaxMove(ai_sign)
    } else if (!computer_turn) return
    best_x_obj.innerText = '_'
    best_y_obj.innerText = '_'

    setSign(best_move_x, best_move_y, ai_sign)
    getMinMaxMove(Sign.opposite(ai_sign))
    computer_turn = false
    if (moves_made++ > 25) {
        document.getElementById('result').innerText = 'EPIC BATTLE BETWEEN HUMANITY AND AI\nIS YET TO BE RESOLVED'
        ended = true
    }
}

window.makePlayerMove = (x, y) => {
    if (ended) return
    if (first_move) {
        circle_btn.disabled = true
        cross_btn.disabled = true
        first_move = false
    }
    if (computer_turn) return
    if (minimax.getTile(x, y)) return

    setSign(x, y, Sign.opposite(ai_sign))
    if (ended) return
    getMinMaxMove(ai_sign)
    computer_turn = true
    if (moves_made++ > 25) {
        document.getElementById('result').innerText = 'EPIC BATTLE BETWEEN HUMANITY AND AI\nIS YET TO BE RESOLVED'
        ended = true
        return
    }

    if (document.getElementById('auto_move').checked) makeAImove()
}

document.getElementById('depth').onchange = _ => getMinMaxMove(ai_sign)
const circle_btn = document.getElementById('circle')
const cross_btn = document.getElementById('cross')
circle_btn.onclick = _ => {
    ai_sign = Sign.CIRCLE
    circle_btn.classList.add('chosen')
    cross_btn.classList.remove('chosen')
}
cross_btn.onclick = _ => {
    ai_sign = Sign.CROSS
    cross_btn.classList.add('chosen')
    circle_btn.classList.remove('chosen')
}
document.getElementById('make_move').onclick = _ => makeAImove()
document.getElementById('restart').onclick = _ => {
    circle_btn.disabled = false
    cross_btn.disabled = false
    for (let i = 0; i < 5; ++i) {
        for (let j = 0; j < 5; ++j) {
            setSign(i, j, Sign.EMPTY)
        }
    }
    first_move = true
    computer_turn = false
    ended = false
    moves_made = 0
    minimax = new MiniMax()
}

window.onload = _ => {
    let board_obj = document.getElementById('board')
    board_obj.innerHTML = ''
    for (let i = 0; i < 5; ++i) {
        for (let j = 0; j < 5; ++j) {
            board_obj.innerHTML += `<button id='${i}-${j}' onclick='makePlayerMove(${i}, ${j})'></button>`
        }
    }
}
