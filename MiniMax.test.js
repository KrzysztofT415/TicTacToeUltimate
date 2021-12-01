const MiniMax = require('./MiniMax')

describe('testCheckIfGameEnded', () => {
    let testEnding = (board_string, expected, name) => {
        test(name, () => {
            let result = MiniMax.checkIfGameEnded(board_string, 'O')
            expect(result).toEqual(expected)
        })
    }

    testEnding('---OOIOO---I-----I-----I-----', null, '4 in row wrong')
    testEnding('OOOO-I-----I-----I-----I-----', true, '4 in row')
    testEnding('----OI----OI----OI----OI-----', true, '4 in column')
    testEnding('----OI---O-I--O--I-O---I-----', true, '4 in diagonal asci')
    testEnding('-O---I--O--I---O-I----OI-----', true, '4 in diagonal desc')
    testEnding('---OOIO----I-----I-----I-----', null, '3 in row wrong')
    testEnding('-OOO-I-----I-----I-----I-----', false, '3 in row')
    testEnding('-----I----OI----OI----OI-----', false, '3 in column')
    testEnding('----OI---O-I--O--I-----I-----', false, '3 in diagonal asc')
    testEnding('-----I--O--I---O-I----OI-----', false, '3 in diagonal desc')
})

// describe('testPossibleWins', () => {
//     let testWinsCount = (board_string, name) => {
//         test(name, () => expect(MiniMax.countPossibleWins(board_string)).toEqual(parseInt(name.slice(-1))))
//     }

//     testWinsCount('O----I-----I-----I-----I-----', 'left corner - 3')
// })

// describe('testPrepareBoard', () => {
//     let testWinsCount = (board_string, expected_string, name) => {
//         test(name, () => expect(MiniMax.prepareBoard(board_string)).toEqual(expected_string))
//     }

//     testWinsCount('-OO-I-----I-XX-XI-----I-----', 'O----I-----I-----I-----I-----', 'test1')
// })

describe('testGetChildNodes', () => {
    let testChild = (board_string, name) => {
        test(name, () => {
            let sign = name.slice(-1)
            let result = MiniMax.getChildNodes(board_string, sign === 'O')
            expect(result.length).toEqual(parseInt(name.slice(0, 2)))
            for (const vals of result) {
                expect([...vals].every((val, ind) => val === board_string[ind] || (val === sign && board_string[ind] === '-'))).toBeTruthy()
            }
        })
    }

    testChild('---OXIO----I-----I-----I-----', '22 children as X')
    testChild('---XOI-O---I-----IXX---IOOXO-', '16 children as X')
    testChild('---OOIXX---IXOX--IOOXOXI-----', '13 children as O')
    testChild('---OXIXO-OOI-OXXXIOOX--IXOXOX', '07 children as O')
})
