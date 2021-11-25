class MiniMax {
    board_state

    constructor() {
        this.board_state = BigInt(0)
    }

    getTile = (x, y) => this.board_state >> (24n - BigInt(x * 5 + y)) * 2n & 3n

    setTile = (x, y, number) => {
        let shift = (24n - BigInt(x * 5 + y)) * 2n
        this.board_state &= ~(3n << shift)
        this.board_state = this.board_state |= BigInt(number) << shift
    }

    static getTile = (board_state, x, y) => board_state >> (24n - BigInt(x * 5 + y)) * 2n & 3n
    static setTile = (board_state, x, y, number) => {
        let shift = (24n - BigInt(x * 5 + y)) * 2n
        board_state &= ~(3n << shift)
        board_state |= BigInt(number) << shift
        return board_state
    }

    getChangedTile = new_state => {
        let xor = this.board_state ^ new_state
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (MiniMax.getTile(xor, i ,j) !== 0n)
                    return { x: i, y: j }
            }
        }
    }



    getMove = (depth, sign) => {
        let score = -Infinity
        let chosen = null
        for (const childNode of MiniMax.getChildNodes(this.board_state, sign === 1)) {
            let childEval = MiniMax.minimax(childNode, depth - 1, -Infinity, Infinity, true, sign === 1)
            if (childEval > score) {
                score = childEval
                chosen = childNode
                if (score === Infinity) break
            }
            console.log(childNode.toString(4), childEval)
        }
        return this.getChangedTile(chosen)
    }

    static minimax = (board_state, depth, alpha, beta, maximizingPlayer, is_circle) => {
        let ending_check = MiniMax.checkIfGameEnded(board_state)
        if (ending_check.isEnded) console.log(depth, 2 >> maximizingPlayer, 2 >> ending_check.whoWon, ((ending_check.whoWon === maximizingPlayer) * 2 - 1) * Infinity, board_state.toString(4))
        if (ending_check.isEnded) return ((ending_check.whoWon === maximizingPlayer) * 2 - 1) * Infinity

        if (depth === 0)
            return MiniMax.heuristic(board_state, maximizingPlayer)

        if (maximizingPlayer) {
            let maxEval = -Infinity
            for (const childNode of MiniMax.getChildNodes(board_state, is_circle)) {
                let childEval = MiniMax.minimax(childNode, depth - 1, alpha, beta, false, !is_circle)
                maxEval = Math.max(maxEval, childEval)
                alpha = Math.max(alpha, childEval)
                if (beta <= alpha) break
            }
            return maxEval
        } else {
            let minEval = Infinity
            for (const childNode of MiniMax.getChildNodes(board_state, is_circle)) {
                let childEval = MiniMax.minimax(childNode, depth - 1, alpha, beta, true, !is_circle)
                minEval = Math.min(minEval, childEval)
                beta = Math.min(beta, childEval)
                if (beta <= alpha) break
            }
            return minEval
        }
    }


    static tiles_points = [[2, 10, 5, 5, 1], [6, 9, 12, 8, 9], [6, 11, 100, 11, 4], [7, 10, 12, 7, 4], [1, 3, 3, 8, 2]]
    static possible_wins = [/^.?(?:[2.]){4}|^(?:.....)?.?.?.?.?[2.](?:....[2.]){3}|^(?:.....)?.?[2.](?:.....[2.]){3}|^(?:.....)?.?(?:...[2.]){4}/g,
                            /^.?(?:[1.]){4}|^(?:.....)?.?.?.?.?[1.](?:....[1.]){3}|^(?:.....)?.?[1.](?:.....[1.]){3}|^(?:.....)?.?(?:...[1.]){4}/g]
    static heuristic = (board_state, sign) => {
        // TODO: Properly assign score to boards
        // let board_string = ('0'.repeat(25) + board_state.toString(4)).slice(-25)
        // let points = 0
        // for (let i = 0; i < 5; ++i) {
        //     points += board_string.slice(i * 5).match(MiniMax.possible_wins[sign * 1])
        // }
        return 5
    }

    static checkIfGameEnded = board_state => {
        let board_string = [...('0'.repeat(25) + board_state.toString(4)).slice(-25)].reduce((sum, val) => sum + val)
        let circle_win = /^(?:.....)*.?1111|^(?:.....)?.?.?.?.?1(?:....1){3}|^(?:.....)?.?1(?:.....1){3}|^(?:.....)?.?(?:...1){4}/
        let cross_win = /^(?:.....)*.?2222|^(?:.....)?.?.?.?.?2(?:....2){3}|^(?:.....)?.?2(?:.....2){3}|^(?:.....)?.?(?:...2){4}/
        let circle_lost = /^(?:.....)*.?.?111|^(?:.....)?.?.?.?.?1(?:....1){2}|^(?:.....)*.?.?1(?:.....1){2}|^(?:.....)*.?.?..1(?:...1){2}/
        let cross_lost = /^(?:.....)*.?.?222|^(?:.....)?.?.?.?.?2(?:....2){2}|^(?:.....)*.?.?2(?:.....2){2}|^(?:.....)*.?.?..2(?:...2){2}/

        if (circle_win.test(board_string)) return { isEnded: true, whoWon: true }
        if (cross_win.test(board_string)) return { isEnded: true, whoWon: false }
        if (circle_lost.test(board_string)) return { isEnded: true, whoWon: false }
        if (cross_lost.test(board_string)) return { isEnded: true, whoWon: true }
        return { isEnded: false, whoWon: false }
    }

    static getChildNodes = (board_state, is_circle) => {
        let children = []
        for (let i = 0; i < 5; ++i) {
            for (let j = 0; j < 5; ++j) {
                if (MiniMax.getTile(board_state, i ,j) === 0n)
                    children = [...children, { x: i, y: j }]
            }
        }
        return children.map(child => MiniMax.setTile(board_state, child.x, child.y, 2 >> is_circle))
    }
}

// console.log(MiniMax.heuristic(BigInt(parseInt('1000000000000000000000000', 4)), true))
// console.log(MiniMax.heuristic(BigInt(parseInt('0100000000000000000000000', 4)), true))
// console.log('a', '0000000000001000000000000'.match(/^(?:.....)*.?1+(?:[1|0]){3}|^(?:.....)?.?.?.?.?[1|0](?:....[1|0]){3}|^(?:.....)?.?[1|0](?:.....[1|0]){3}|^(?:.....)?.?(?:...[1|0]){4}/g))
if (typeof window === 'undefined') module.exports = MiniMax