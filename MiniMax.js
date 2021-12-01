class MiniMax {
    constructor() {
        this.board_state = '-----I-----I-----I-----I-----'
    }

    reset = _ => {
        this.board_state = '-----I-----I-----I-----I-----'
    }

    // I - new line, O - player 1, X - player 2, U - impossible player 2 moves, Y - impossible player 1 moves
    makeMove = (ind, sign) => {
        this.board_state = this.board_state.substring(0, ind) + (sign === 1 ? 'O' : 'X') + this.board_state.substring(ind + 1)
    }

    getVal = ind => this.board_state[ind]

    getChange = other_state => {
        let i = 0
        let j = 0
        let result = ''

        while (j < this.board_state.length) {
            if (other_state[i] != this.board_state[j] || i == other_state.length) return { x: Math.floor(j / 6), y: j % 6 }
            else i++
            j++
        }
        return null
    }

    static getChange = (other_state, current_state) => {
        let i = 0
        let j = 0
        let result = ''

        while (j < current_state.length) {
            if (other_state[i] != current_state[j] || i == other_state.length) return { x: Math.floor(j / 6), y: j % 6 }
            else i++
            j++
        }
        return null
    }

    getMove = (depth, sign) => {
        let is_circle = sign === 1
        console.log('searching for ', is_circle ? 'O' : 'X')
        let children = MiniMax.getChildNodes(this.board_state, is_circle)
        let chosen = children.pop()
        let score = MiniMax.minimax(chosen, depth - 1, -Infinity, Infinity, false, !is_circle, MiniMax.getChange(this.board_state, chosen))

        for (const childNode of children) {
            let changed = MiniMax.getChange(this.board_state, childNode)
            let childEval = MiniMax.minimax(childNode, depth - 1, -Infinity, Infinity, false, !is_circle, changed) + MiniMax.placement[changed.x][changed.y]
            if (childEval > score) {
                score = childEval
                chosen = childNode
                if (score === Infinity) {
                    console.log('found win')
                    break
                }
            }
        }
        console.log(score)
        return this.getChange(chosen)
    }

    static minimax = (board_state, depth, alpha, beta, maximizingPlayer, circle_has_move, change) => {
        let ending_check = MiniMax.checkIfGameEnded(board_state, !circle_has_move)
        if (ending_check !== null) return ((ending_check ^ maximizingPlayer) * 2 - 1) * Infinity

        if (depth === 0) return MiniMax.heuristic(board_state, maximizingPlayer, !circle_has_move, change)

        if (maximizingPlayer) {
            let maxEval = -Infinity
            for (const childNode of MiniMax.getChildNodes(board_state, circle_has_move)) {
                let childEval = MiniMax.minimax(childNode, depth - 1, alpha, beta, false, !circle_has_move, MiniMax.getChange(board_state, childNode))
                maxEval = Math.max(maxEval, childEval)
                alpha = Math.max(alpha, childEval)
                if (beta <= alpha) break
            }
            return maxEval
        } else {
            let minEval = Infinity
            for (const childNode of MiniMax.getChildNodes(board_state, circle_has_move)) {
                let childEval = MiniMax.minimax(childNode, depth - 1, alpha, beta, true, !circle_has_move, MiniMax.getChange(board_state, childNode))
                minEval = Math.min(minEval, childEval)
                beta = Math.min(beta, childEval)
                if (beta <= alpha) break
            }
            return minEval
        }
    }

    static heuristic = (board_string, maximizingPlayer, circle_has_move, change) => {
        board_string = MiniMax.prepareBoard(board_string, circle_has_move)

        let ending_check = MiniMax.checkIfGameEnded(board_string, circle_has_move)
        if (ending_check !== null) return ((ending_check ^ maximizingPlayer) * 2 - 1) * Infinity

        let wins = MiniMax.countPossibleWins(board_string, circle_has_move)
        let opponent = MiniMax.countPossibleWins(board_string, !circle_has_move)

        let three = MiniMax.countThree(board_string, circle_has_move)
        let placement = MiniMax.placement[change.x][change.y]

        return wins - opponent + three + placement
    }

    static cross_unplayable = /-(?<=XX)(?!-X)|-(?=XX)(?<!X-)|-(?<=X.....X.....)(?!-.....X)|-(?=.....X.....X)(?<!X.....-)|-(?<=X....X....)(?!-....X)|-(?=....X....X)(?<!X....-)|-(?<=X......X......)(?!-......X)|-(?=......X......X)(?<!X......-)/g
    static circle_unplayable = /-(?<=OO)(?!-O)|-(?=OO)(?<!O-)|-(?<=O.....O.....)(?!-.....O)|-(?=.....O.....O)(?<!O.....-)|-(?<=O....O....)(?!-....O)|-(?=....O....O)(?<!O....-)|-(?<=O......O......)(?!-......O)|-(?=......O......O)(?<!O......-)/g
    static prepareBoard = (board_string, circle_has_move) => {
        if (circle_has_move) return board_string.replace(MiniMax.cross_unplayable, 'O')
        return board_string.replace(MiniMax.circle_unplayable, 'X')
    }

    static countPossibleWins = (board_string, circle_has_move) => {
        board_string = board_string.replace(/-/g, circle_has_move ? 'O' : 'X')
        if (circle_has_move) return MiniMax.matchOverlap(board_string, MiniMax.circle_win).length
        else return MiniMax.matchOverlap(board_string, MiniMax.cross_win).length
    }
    static cross_three = /XX|X-X-|-X-X|X--X|X.....X|X.....-.....X.....-|-.....X.....-.....X|X.....-.....-.....X|X......X|X......-......X......-|-......X......-......X|X......-......-......X|X....X|X....-....X....-|-....X....-....X|X....-....-....X/g
    static circle_three = /OO|O-O-|-O-O|O--O|O.....O|O.....-.....O.....-|-.....O.....-.....O|O.....-.....-.....O|O......O|O......-......O......-|-......O......-......O|O......-......-......O|O....O|O....-....O....-|-....O....-....O|O....-....-....O/g
    static countThree = (board_string, circle_has_move) => {
        if (circle_has_move) return MiniMax.matchOverlap(board_string, MiniMax.circle_three).length
        else return MiniMax.matchOverlap(board_string, MiniMax.cross_three).length
    }
    static placement = [
        [2, 10, 5, 5, 1, 0],
        [6, 9, 12, 8, 9, 0],
        [6, 11, 100, 11, 4, 0],
        [7, 10, 12, 7, 4, 0],
        [1, 3, 3, 8, 2, 0]
    ]

    static circle_win = /OOOO|O(?:.....O){3}|O(?:......O){3}|O(?:....O){3}/
    static circle_lost = /OOO|O(?:.....O){2}|O(?:......O){2}|O(?:....O){2}/
    static cross_win = /XXXX|X(?:.....X){3}|X(?:......X){3}|X(?:....X){3}/
    static cross_lost = /XXX|X(?:.....X){2}|X(?:......X){2}|X(?:....X){2}/
    static checkIfGameEnded = (board_string, circle_moved) => {
        if (circle_moved) {
            if (MiniMax.circle_win.test(board_string)) return true
            if (MiniMax.circle_lost.test(board_string)) return false
        } else {
            if (MiniMax.cross_win.test(board_string)) return true
            if (MiniMax.cross_lost.test(board_string)) return false
        }
        return null
    }

    static getChildNodes = (board_string, circle_has_move) =>
        [...board_string]
            .map((val, ind) => {
                if (val === '-') {
                    return board_string.substring(0, ind) + (circle_has_move ? 'O' : 'X') + board_string.substring(ind + 1)
                }
                return null
            })
            .filter(val => val !== null)

    static matchOverlap = (input, re) => {
        var r = [],
            m
        if (!re.global) re = new RegExp(re.source, (re + '').split('/').pop() + 'g')
        while ((m = re.exec(input))) {
            re.lastIndex -= m[0].length - 1
            r.push(m[0])
        }
        return r
    }
}

if (typeof window === 'undefined') module.exports = MiniMax
