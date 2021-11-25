const MiniMax = require('./MiniMax.js')

let testEnding = (board_state, ended, whoWon, name) => {
    test(name, () => {
        let result = MiniMax.checkIfGameEnded(BigInt(parseInt(board_state, 4)))
        expect(result).toEqual({ isEnded: ended, whoWon: whoWon })
    })
}
describe('testCheckIfGameEnded', () => {
    testEnding('0001111000000000000000000', false, false, '4 in row wrong')
    testEnding('1111000000000000000000000', true, true, '4 in row')
    testEnding('0000100001000010000100000', true, true, '4 in column')
    testEnding('0000100010001000100000000', true, true, '4 in diagonal desc')
    testEnding('0100000100000100000100000', true, true, '4 in diagonal asc')

    testEnding('0001110000000000000000000', false, false, '3 in row wrong')
    testEnding('0111000000000000000000000', true, false, '3 in row')
    testEnding('0000000001000010000100000', true, false, '3 in column')
    testEnding('0000100010001000000000000', true, false, '3 in diagonal desc')
    testEnding('0000000100000100000100000', true, false, '3 in diagonal asc')
})

let testChild = (board_state, name) => {
    test(name, () => {
        let result = MiniMax.getChildNodes(BigInt(parseInt(board_state, 4)), true)
        expect([...result]
            .map(val => ('0'.repeat(25) + val.toString(4)).slice(-25)))
            .toEqual([...board_state]
                .map((val, ind) => val === '0' ? (board_state.substring(0,ind) + '1' + board_state.substring(ind+1)) : '')
                .filter(val => val !== ''))
    })
}
describe('testGetChildNodes', () => {
    testChild('0001111000000000000000000',  '21 children')
    testChild('0001101000000001100011110',  '16 children')
    testChild('0001111000111001111100000',  '13 children')
    testChild('0001111011011111110011111',  '7 children')
})