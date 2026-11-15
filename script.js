// vars

let WisCrossing = false
let BisCrossing = false

let numWKnights = 0
let numBKnights = 0
let numWRooks = 0
let numBRooks = 0
let numWBishops = 0
let numBBishops = 0

let recruitmentSquaresW = {
    knightL: true,
    knightR: true,
    bishopL: true,
    bishopR: true,
    rookL: true,
    rookR: true
}

let recruitmentSquaresB = {
    knightL: true,
    knightR: true,
    bishopL: true,
    bishopR: true,
    rookL: true,
    rookR: true
}

let pendingSpawn = null // { side + piece }
let popupOpen = false
let pendingNotation = null

let bReached = false
let wReached = false

//inserting the images
function insertImage() {
    document.querySelectorAll('.box').forEach(image => {
        if (image.innerText.length !== 0) {
            if (image.innerText == 'Wpawn' || image.innerText == 'Bpawn') {
                image.innerHTML = `${image.innerText} <img class='all-img all-pawn' src="images/${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            } else {
                image.innerHTML = `${image.innerText} <img class='all-img' src="images/${image.innerText}.png" alt="">`
                image.style.cursor = 'pointer'
            }
        }
    })
}

//Coloring the board

function coloring() {
    const color = document.querySelectorAll('.box')

    color.forEach(color => {
        getId = color.id
        arr = Array.from(getId)
        arr.shift()
        aside = eval(arr.pop())
        aup = eval(arr.shift())
        a = aside + aup

        if (a % 2 == 0) {
            color.style.backgroundColor = 'rgb(232 235 239)'
        }
        if (a % 2 !== 0) {
            color.style.backgroundColor = 'rgb(125 135 150)'
        }
    })
}

insertImage()
coloring()

//function to not remove the same team element

function reddish() {
    document.querySelectorAll('.box').forEach(i1 => {
        if (i1.style.backgroundColor == 'blue') {

            document.querySelectorAll('.box').forEach(i2 => {

                if (i2.style.backgroundColor == 'greenyellow' && i2.innerText.length !== 0) {


                    greenyellowText = i2.innerText

                    blueText = i1.innerText

                    blueColor = ((Array.from(blueText)).shift()).toString()
                    greenyellowColor = ((Array.from(greenyellowText)).shift()).toString()

                    getId = i2.id
                    arr = Array.from(getId)
                    arr.shift()
                    aside = eval(arr.pop())
                    aup = eval(arr.shift())
                    a = aside + aup

                    if (a % 2 == 0 && blueColor == greenyellowColor) {
                        i2.style.backgroundColor = 'rgb(232 235 239)'
                    }
                    if (a % 2 !== 0 && blueColor == greenyellowColor) {
                        i2.style.backgroundColor = 'rgb(125 135 150)'
                    }

                }
            })
        }
    })
}

//reset button
document.getElementById("reset-btn").addEventListener("click", function() {
    location.reload()
})

tog = 1
updateTurnText()
evaluatePositionAfterMove()

document.querySelectorAll('.box').forEach(item => {
    item.addEventListener('click', function() {

        // block wrong-side selection ONLY when selecting a piece
        if (
            item.style.backgroundColor !== 'greenyellow' &&
            (
                (tog % 2 !== 0 && !item.innerText.startsWith('W')) ||
                (tog % 2 == 0 && !item.innerText.startsWith('B'))
            )
        ) return

        if (popupOpen) return

        getId = item.id
        arr = Array.from(getId)
        arr.shift()
        aside = eval(arr.pop())
        arr.push('0')
        aup = eval(arr.join(''))
        a = aside + aup

        //function to display the available paths for all pieces

        function whosTurn(toggle) {
            // PAWN

            if (item.innerText == `${toggle}pawn`) {
                item.style.backgroundColor = 'blue'

                if (tog % 2 !== 0 && aup < 800) {
                    // First move for white pawns
                    if (document.getElementById(`b${a + 100}`).innerText.length == 0) {
                        document.getElementById(`b${a + 100}`).style.backgroundColor = 'greenyellow'
                        if (document.getElementById(`b${a + 200}`).innerText.length == 0 && aup < 300) {
                            document.getElementById(`b${a + 200}`).style.backgroundColor = 'greenyellow'
                        }
                    }
                    if (aside < 8 && document.getElementById(`b${a + 100 + 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a + 100 + 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside > 1 && document.getElementById(`b${a + 100 - 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a + 100 - 1}`).style.backgroundColor = 'greenyellow'
                    }
                }

                if (tog % 2 == 0 && aup > 100) {
                    // First move for black pawns
                    if (document.getElementById(`b${a - 100}`).innerText.length == 0) {
                        document.getElementById(`b${a - 100}`).style.backgroundColor = 'greenyellow'
                        if (document.getElementById(`b${a - 200}`).innerText.length == 0 && aup > 600) {
                            document.getElementById(`b${a - 200}`).style.backgroundColor = 'greenyellow'
                        }
                    }
                    if (aside < 8 && document.getElementById(`b${a - 100 + 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a - 100 + 1}`).style.backgroundColor = 'greenyellow'
                    }
                    if (aside > 1 && document.getElementById(`b${a - 100 - 1}`).innerText.length !== 0) {
                        document.getElementById(`b${a - 100 - 1}`).style.backgroundColor = 'greenyellow'
                    }
                }
            }

            // KING
            if (item.innerText === `${toggle}king`) {
                const kingSquare = item

                function allowKingMove(targetId) {
                    const target = document.getElementById(targetId)

                    // Cannot land on own pieces or capture the enemy king
                    if (target.innerText && (
                            target.innerText.startsWith(toggle) ||
                            target.innerText.endsWith('king')
                        )) return

                    const illegal = simulateMove(
                        kingSquare,
                        target,
                        () => squareIsAttacked(targetId, toggle)
                    )

                    if (illegal) return

                    target.style.backgroundColor = 'greenyellow'
                }

                if (aside < 8) allowKingMove(`b${a + 1}`)
                if (aside > 1) allowKingMove(`b${a - 1}`)
                if (aup < 800) allowKingMove(`b${a + 100}`)
                if (aup > 100) allowKingMove(`b${a - 100}`)

                if (aup > 100 && aside < 8) allowKingMove(`b${a - 100 + 1}`)
                if (aup > 100 && aside > 1) allowKingMove(`b${a - 100 - 1}`)
                if (aup < 800 && aside < 8) allowKingMove(`b${a + 100 + 1}`)
                if (aup < 800 && aside > 1) allowKingMove(`b${a + 100 - 1}`)

                item.style.backgroundColor = 'blue'
            }


            // KNIGHT

            if (item.innerText == `${toggle}knight`) {


                if (aside < 7 && aup < 800) {
                    document.getElementById(`b${a + 100 + 2}`).style.backgroundColor = 'greenyellow'
                }
                if (aside < 7 && aup > 200) {
                    document.getElementById(`b${a - 100 + 2}`).style.backgroundColor = 'greenyellow'
                }
                if (aside < 8 && aup < 700) {
                    document.getElementById(`b${a + 200 + 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 1 && aup < 700) {
                    document.getElementById(`b${a + 200 - 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 2 && aup < 800) {
                    document.getElementById(`b${a - 2 + 100}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 2 && aup > 100) {
                    document.getElementById(`b${a - 2 - 100}`).style.backgroundColor = 'greenyellow'
                }
                if (aside < 8 && aup > 200) {
                    document.getElementById(`b${a - 200 + 1}`).style.backgroundColor = 'greenyellow'
                }
                if (aside > 1 && aup > 200) {
                    document.getElementById(`b${a - 200 - 1}`).style.backgroundColor = 'greenyellow'
                }

                item.style.backgroundColor = 'blue'

            }

            // QUEEN

            if (item.innerText == `${toggle}queen`) {


                for (let i = 1; i < 9; i++) {
                    if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText.length === 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                    } else if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText.length === 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                    } else if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText.length === 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                    } else if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText.length === 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                    } else if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }



                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }

                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }



                item.style.backgroundColor = 'blue'

            }

            // BISHOP

            if (item.innerText == `${toggle}bishop`) {


                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < (900 - aup) / 100 && i < 9 - aside && document.getElementById(`b${a + i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < aup / 100 && i < 9 - aside && document.getElementById(`b${a - i * 100 + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }


                for (let i = 1; i < 9; i++) {
                    if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < (900 - aup) / 100 && i < aside && document.getElementById(`b${a + i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }

                }


                for (let i = 1; i < 9; i++) {
                    if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length == 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                    } else if (i < aup / 100 && i < aside && document.getElementById(`b${a - i * 100 - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100 - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }



                item.style.backgroundColor = 'blue'

            }

            // ROOK

            if (item.innerText == `${toggle}rook`) {

                for (let i = 1; i < 9; i++) {

                    if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText.length === 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                    } else if ((a + i * 100) < 900 && document.getElementById(`b${a + i * 100}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText.length === 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                    } else if ((a - i * 100) > 100 && document.getElementById(`b${a - i * 100}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i * 100}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText.length === 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                    } else if ((a + i) < (aup + 9) && document.getElementById(`b${a + i}`).innerText.length !== 0) {
                        document.getElementById(`b${a + i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                for (let i = 1; i < 9; i++) {

                    if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText.length === 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                    } else if ((a - i) > (aup) && document.getElementById(`b${a - i}`).innerText.length !== 0) {
                        document.getElementById(`b${a - i}`).style.backgroundColor = 'greenyellow'
                        break
                    }
                }

                item.style.backgroundColor = 'blue'
            }

        }

        // Toggling the turn
        if (tog % 2 !== 0) {
            whosTurn('W')
        } else {
            whosTurn('B')
        }

        reddish()
        filterLegalMoves(item, tog % 2 !== 0 ? 'W' : 'B')
    })
})

// Moving the element + Recrutiment of pieces
document.querySelectorAll('.box').forEach(hathiTest => {

    hathiTest.addEventListener('click', function() {

        if (hathiTest.style.backgroundColor == 'blue') {

            blueId = hathiTest.id
            blueText = hathiTest.innerText

            document.querySelectorAll('.box').forEach(hathiTest2 => {

                hathiTest2.addEventListener('click', function() {
                    if (hathiTest2.style.backgroundColor == 'greenyellow') {

                        const fromId = blueId
                        const toId = hathiTest2.id
                        const movedPiece = blueText

                        // Move the piece
                        document.getElementById(fromId).innerText = ''
                        hathiTest2.innerText = movedPiece

                        // Getting pawns
                        // If king is initially in row4
                        if (movedPiece === 'Wking' && hathiTest2.parentElement.id == "row4") {
                            WisCrossing = true
                        }

                        if (movedPiece === 'Bking' && hathiTest2.parentElement.id == "row5") {
                            BisCrossing = true
                        }

                        // When Wking crosses
                        if (movedPiece === 'Wking' && hathiTest2.parentElement.id == "row5" && WisCrossing) {
                            const kingsRow = hathiTest2.id.charAt(3)
                            const spawnSquare = document.getElementById('b20' + kingsRow)
                            if (spawnSquare.innerText === '') {
                                spawnSquare.innerText = 'Wpawn'
                            }
                            WisCrossing = false
                        }

                        // When Bking crosses
                        if (movedPiece === 'Bking' && hathiTest2.parentElement.id == "row4" && BisCrossing) {
                            const kingsRow = hathiTest2.id.charAt(3)
                            const spawnSquare = document.getElementById('b70' + kingsRow)
                            if (spawnSquare.innerText === '') {
                                spawnSquare.innerText = 'Bpawn'
                            }
                            BisCrossing = false
                        }

                        // Getting knights

                        // White
                        if (movedPiece === 'Wking' && (
                                (hathiTest2.id == "b701" && recruitmentSquaresW.knightL == true) ||
                                (hathiTest2.id == "b708" && recruitmentSquaresW.knightR == true)
                            ) &&
                            numWKnights < 2
                        ) {
                            pendingSpawn = {
                                side: "W",
                                piece: "knight"
                            }
                            popupOpen = true
                            showPopup()
                            if (hathiTest2.id == "b701") {
                                recruitmentSquaresW.knightL = false
                            }
                            if (hathiTest2.id == "b708") {
                                recruitmentSquaresW.knightR = false
                            }
                        }

                        // Black
                        if (movedPiece === 'Bking' && (
                                (hathiTest2.id == "b201" && recruitmentSquaresB.knightL == true) ||
                                (hathiTest2.id == "b208" && recruitmentSquaresB.knightR == true)
                            ) &&
                            numBKnights < 2
                        ) {
                            pendingSpawn = {
                                side: "B",
                                piece: "knight"
                            }
                            popupOpen = true
                            showPopup()
                            if (hathiTest2.id == "b201") {
                                recruitmentSquaresB.knightL = false
                            }
                            if (hathiTest2.id == "b208") {
                                recruitmentSquaresB.knightR = false
                            }
                        }

                        // Getting bishops

                        // White
                        if (movedPiece === 'Wking' && (
                                (hathiTest2.id == "b801" && recruitmentSquaresW.bishopL == true) ||
                                (hathiTest2.id == "b808" && recruitmentSquaresW.bishopR == true)
                            ) &&
                            numWBishops < 2
                        ) {
                            pendingSpawn = {
                                side: "W",
                                piece: "bishop"
                            }
                            popupOpen = true
                            showPopup()
                            if (hathiTest2.id == "b801") {
                                recruitmentSquaresW.bishopL = false
                            }
                            if (hathiTest2.id == "b808") {
                                recruitmentSquaresW.bishopR = false
                            }
                        }

                        // Black
                        if (movedPiece === 'Bking' && (
                                (hathiTest2.id == "b101" && recruitmentSquaresB.bishopL == true) ||
                                (hathiTest2.id == "b108" && recruitmentSquaresB.bishopR == true)
                            ) &&
                            numBBishops < 2
                        ) {
                            pendingSpawn = {
                                side: "B",
                                piece: "bishop"
                            }
                            popupOpen = true
                            showPopup()
                            if (hathiTest2.id == "b101") {
                                recruitmentSquaresB.bishopL = false
                            }
                            if (hathiTest2.id == "b108") {
                                recruitmentSquaresB.bishopR = false
                            }
                        }

                        // Getting rooks

                        // White
                        if (movedPiece === 'Wking' && (
                                (hathiTest2.id == "b804" && recruitmentSquaresW.rookL == true) ||
                                (hathiTest2.id == "b805" && recruitmentSquaresW.rookR == true)
                            ) &&
                            numWRooks < 2
                        ) {
                            pendingSpawn = {
                                side: "W",
                                piece: "rook"
                            }
                            popupOpen = true
                            showPopup()
                            if (hathiTest2.id == "b804") {
                                recruitmentSquaresW.rookL = false
                            }
                            if (hathiTest2.id == "b805") {
                                recruitmentSquaresW.rookR = false
                            }
                        }

                        // Black
                        if (movedPiece === 'Bking' && (
                                (hathiTest2.id == "b104" && recruitmentSquaresB.rookL == true) ||
                                (hathiTest2.id == "b105" && recruitmentSquaresB.rookR == true)
                            ) &&
                            numBRooks < 2
                        ) {
                            pendingSpawn = {
                                side: "B",
                                piece: "rook"
                            }
                            popupOpen = true
                            showPopup()
                            if (hathiTest2.id == "b104") {
                                recruitmentSquaresB.rookL = false
                            }
                            if (hathiTest2.id == "b105") {
                                recruitmentSquaresB.rookR = false
                            }
                        }

                        // Getting queens
                        // If king is initially in enemy row
                        if (movedPiece === 'Wking' && hathiTest2.parentElement.id == "row8") {
                            wReached = true
                        }

                        if (movedPiece === 'Bking' && hathiTest2.parentElement.id == "row1") {
                            bReached = true
                        }

                        // When Wking reaches
                        if (movedPiece === 'Wking' && hathiTest2.parentElement.id == "row1" && document.getElementById("b104").innerText == "" && wReached) {
                            document.getElementById("b104").innerText = "Wqueen"
                        }

                        // When Bking reaches
                        if (movedPiece === 'Bking' && hathiTest2.parentElement.id == "row8" && document.getElementById("b804").innerText == "" && bReached) {
                            document.getElementById("b804").innerText = "Bqueen"
                        }

                        pendingNotation = getNotation(movedPiece, hathiTest2.id)

                        // check for check
                        if (!popupOpen) {
                            commitMove()
                            if (isKingInCheck(currentSideToCheck())) {
                                document.getElementById("text").innerText = "CHECK!"
                                document.body.style.background = "#8B0000"
                            } else {
                                document.getElementById("text").innerText = "Move Tracker"
                                document.body.style.background = "#5a5a5a"
                            }

                            if (isCheckmate(currentSideToCheck())) {
                                console.log((currentSideToCheck()) + ' is CHECKMATED')
                                document.getElementById("text").innerText = 'CHECKMATE'
                                document.body.style.background = "#8B0000"
                                win()
                            }
                        }

                        coloring()
                        insertImage()
                    }


                })
            })

        }

    })

})




// Prevents from selecting multiple elements
z = 0
document.querySelectorAll('.box').forEach(ee => {
    ee.addEventListener('click', function() {
        z = z + 1
        if (z % 2 == 0 && ee.style.backgroundColor !== 'greenyellow') {
            coloring()
        }
    })
})

// Show left-right popup at cursor
let mouseX = 0
let mouseY = 0

document.addEventListener('mousemove', e => {
    mouseX = e.clientX
    mouseY = e.clientY
})

function showPopup() {
    const popup = document.getElementById("left-right")
    const OFFSET = 8

    let x = mouseX + OFFSET
    let y = mouseY + OFFSET

    const rect = popup.getBoundingClientRect()

    if (x + rect.width > window.innerWidth) {
        x = mouseX - rect.width - OFFSET
    }
    if (y + rect.height > window.innerHeight) {
        y = mouseY - rect.height - OFFSET
    }

    popup.style.left = x + 'px'
    popup.style.top = y + 'px'
    popup.style.display = 'grid'
}

// For determining spawnSquare
function spawnPiece(side, piece, direction) {
    const spawnRow = side === "W" ? 1 : 8

    if (direction === "left") {
        if (piece === "bishop") return "b" + spawnRow + "03"
        if (piece === "knight") return "b" + spawnRow + "02"
        if (piece === "rook") return "b" + spawnRow + "01"
    }

    if (direction === "right") {
        if (piece === "bishop") return "b" + spawnRow + "06"
        if (piece === "knight") return "b" + spawnRow + "07"
        if (piece === "rook") return "b" + spawnRow + "08"
    }
}

// left-right click logic
document.querySelectorAll('#left-right button').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!pendingSpawn) return

        const squareId = spawnPiece(
            pendingSpawn.side,
            pendingSpawn.piece,
            btn.id
        )

        const square = document.getElementById(squareId)

        if (square && square.innerText === '') {
            square.innerText = pendingSpawn.side + pendingSpawn.piece
        }

        pendingSpawn = null
        popupOpen = false
        document.getElementById('left-right').style.display = 'none'

        insertImage()
        coloring()

        tog++
        updateTurnText()
        evaluatePositionAfterMove()
    })
})

function updateTurnText() {
    document.getElementById("tog").innerText =
        tog % 2 !== 0 ? "White's Turn" : "Black's Turn"
}

function updateRecruitmentSquares(side) {
    document.querySelectorAll('.box').forEach(square => {


        if (side == "W") {
            // updating counter
            if (square.innerText == side + "knight") {
                numWKnights++
            }
            if (square.innerText == side + "bishop") {
                numWBishops++
            }
            if (square.innerText == side + "rook") {
                numWRooks++
            }
            // reopening squares based on counter
            switch (numWKnights) {
                case 0:
                    recruitmentSquaresW.knightL = true
                    recruitmentSquaresW.knightR = true
                    break;
                case 1:
                    recruitmentSquaresW.knightL = true
                    recruitmentSquaresW.knightR = false
                    break;
                case 2:
                    recruitmentSquaresW.knightL = false
                    recruitmentSquaresW.knightR = false
                    break;
            }
            switch (numWBishops) {
                case 0:
                    recruitmentSquaresW.bishopL = true
                    recruitmentSquaresW.bishopR = true
                    break;
                case 1:
                    recruitmentSquaresW.bishopL = true
                    recruitmentSquaresW.bishopR = false
                    break;
                case 2:
                    recruitmentSquaresW.bishopL = false
                    recruitmentSquaresW.bishopR = false
                    break;
            }
            switch (numWRooks) {
                case 0:
                    recruitmentSquaresW.rookL = true
                    recruitmentSquaresW.rookR = true
                    break;
                case 1:
                    recruitmentSquaresW.rookL = true
                    recruitmentSquaresW.rookR = false
                    break;
                case 2:
                    recruitmentSquaresW.rookL = false
                    recruitmentSquaresW.rookR = false
                    break;
            }

        } else {
            // updating counter
            if (square.innerText == side + "knight") {
                numBKnights++
            }
            if (square.innerText == side + "bishop") {
                numBBishops++
            }
            if (square.innerText == side + "rook") {
                numBRooks++
            }

            // reopening squares based on counter
            switch (numBKnights) {
                case 0:
                    recruitmentSquaresB.knightL = true
                    recruitmentSquaresB.knightR = true
                    break;
                case 1:
                    recruitmentSquaresB.knightL = true
                    recruitmentSquaresB.knightR = false
                    break;
                case 2:
                    recruitmentSquaresB.knightL = false
                    recruitmentSquaresB.knightR = false
                    break;
            }
            switch (numBBishops) {
                case 0:
                    recruitmentSquaresB.bishopL = true
                    recruitmentSquaresB.bishopR = true
                    break;
                case 1:
                    recruitmentSquaresB.bishopL = true
                    recruitmentSquaresB.bishopR = false
                    break;
                case 2:
                    recruitmentSquaresB.bishopL = false
                    recruitmentSquaresB.bishopR = false
                    break;
            }
            switch (numBRooks) {
                case 0:
                    recruitmentSquaresB.rookL = true
                    recruitmentSquaresB.rookR = true
                    break;
                case 1:
                    recruitmentSquaresB.rookL = true
                    recruitmentSquaresB.rookR = false
                    break;
                case 2:
                    recruitmentSquaresB.rookL = false
                    recruitmentSquaresB.rookR = false
                    break;
            }
        }
    })
}

function commitMove() {
    const listId = tog % 2 !== 0 ? 'white' : 'black'

    const attackedSide = tog % 2 !== 0 ? 'B' : 'W'
    let suffix = ""

    if (isCheckmate(attackedSide)) suffix = "#"
    else if (isKingInCheck(attackedSide)) suffix = "+"

    document.getElementById(listId).innerHTML +=
        `<li>${pendingNotation}${suffix}</li>`

    pendingNotation = null

    tog++
    updateTurnText()
    evaluatePositionAfterMove()

    if (suffix) {
        document.getElementById("text").innerText =
            suffix === "#" ? attackedSide + " — CHECKMATE" : "CHECK!"
        document.body.style.background = "#8B0000"
    } else {
        document.getElementById("text").innerText = "Move Tracker"
        document.body.style.background = "#5a5a5a"
    }

    if (suffix === "#") win()
}

// Check and checkmate detection

function getAllSquares() {
    return Array.from(document.querySelectorAll('.box'))
}

function getKingSquare(side) {
    return getAllSquares().find(
        sq => sq.innerText === side + 'king'
    )
}

function getSide(pieceText) {
    return pieceText.startsWith('W') ? 'W' : 'B'
}

function canPieceAttackSquare(fromSq, toSq) {
    const piece = fromSq.innerText
    if (!piece) return false

    const side = getSide(piece)

    const fromId = fromSq.id
    const toId = toSq.id

    const f = parseInt(fromId.slice(1))
    const t = parseInt(toId.slice(1))

    const fRow = Math.floor(f / 100)
    const fCol = f % 10
    const tRow = Math.floor(t / 100)
    const tCol = t % 10

    const dRow = tRow - fRow
    const dCol = tCol - fCol

    // PAWN
    if (piece.endsWith('pawn')) {
        const dir = side === 'W' ? 1 : -1
        return dRow === dir && Math.abs(dCol) === 1
    }

    // KING
    if (piece.endsWith('king')) {
        return Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1
    }

    // KNIGHT
    if (piece.endsWith('knight')) {
        return (
            Math.abs(dRow) === 2 && Math.abs(dCol) === 1 ||
            Math.abs(dRow) === 1 && Math.abs(dCol) === 2
        )
    }

    // ROOK / BISHOP / QUEEN
    const isStraight = dRow === 0 || dCol === 0
    const isDiagonal = Math.abs(dRow) === Math.abs(dCol)

    if (
        piece.endsWith('rook') && isStraight ||
        piece.endsWith('bishop') && isDiagonal ||
        piece.endsWith('queen') && (isStraight || isDiagonal)
    ) {
        const stepRow = Math.sign(dRow)
        const stepCol = Math.sign(dCol)

        let r = fRow + stepRow
        let c = fCol + stepCol

        while (r !== tRow || c !== tCol) {
            const mid = document.getElementById(`b${r * 100 + c}`)
            if (!mid) return false
            if (mid.innerText !== '' && mid !== toSq) return false

            r += stepRow
            c += stepCol
        }

        return true
    }

    return false
}

function squareIsAttacked(squareId, kingSide) {
    const enemySide = kingSide === 'W' ? 'B' : 'W'
    const targetSq = document.getElementById(squareId)

    for (let sq of document.querySelectorAll('.box')) {
        if (!sq.innerText) continue
        if (!sq.innerText.startsWith(enemySide)) continue

        if (canPieceAttackSquare(sq, targetSq)) {
            return true
        }
    }
    return false
}



function isKingInCheck(side) {
    const kingSq = getKingSquare(side)
    if (!kingSq) return false

    const enemySide = side === 'W' ? 'B' : 'W'

    return getAllSquares().some(sq => {
        if (!sq.innerText) return false
        if (getSide(sq.innerText) !== enemySide) return false
        return canPieceAttackSquare(sq, kingSq)
    })
}

function filterLegalMoves(selectedSquare, side) {
    if (!selectedSquare.innerText.startsWith(side)) return

    document.querySelectorAll('.box').forEach(target => {
        if (target.style.backgroundColor !== 'greenyellow') return

        // Kings cannot be captured
        if (target.innerText.endsWith('king')) {
            coloringSquare(target)
            return
        }

        // Remove moves that leave our own king in check
        const illegal = simulateMove(
            selectedSquare,
            target,
            () => isKingInCheck(side)
        )

        if (illegal) {
            coloringSquare(target)
        }
    })
}

function coloringSquare(square) {
    const row = Number(square.id.charAt(1))
    const col = Number(square.id.charAt(3))

    square.style.backgroundColor =
        (row + col) % 2 === 0 ?
        'rgb(232 235 239)' :
        'rgb(125 135 150)'
}

function canPieceMoveToSquare(fromSq, toSq) {
    const piece = fromSq.innerText
    if (!piece || fromSq === toSq) return false

    const side = getSide(piece)
    const targetPiece = toSq.innerText

    // Never allow capturing a king
    if (targetPiece.endsWith('king')) return false

    // Never move onto a friendly piece
    if (targetPiece && getSide(targetPiece) === side) return false

    const from = Number(fromSq.id.slice(1))
    const to = Number(toSq.id.slice(1))

    const fromRow = Math.floor(from / 100)
    const fromCol = from % 10
    const toRow = Math.floor(to / 100)
    const toCol = to % 10

    const dRow = toRow - fromRow
    const dCol = toCol - fromCol

    // PAWN
    if (piece.endsWith('pawn')) {
        const direction = side === 'W' ? 1 : -1

        // Forward movement
        if (dCol === 0 && !targetPiece) {
            if (dRow === direction) return true

            // Double move from starting row
            const startingRow = side === 'W' ? 2 : 7

            if (fromRow === startingRow && dRow === direction * 2) {
                const middle = document.getElementById(
                    `b${(fromRow + direction) * 100 + fromCol}`
                )

                return middle && middle.innerText === ''
            }
        }

        // Diagonal capture
        return (
            dRow === direction &&
            Math.abs(dCol) === 1 &&
            targetPiece !== '' &&
            getSide(targetPiece) !== side
        )
    }

    // All other pieces
    return canPieceAttackSquare(fromSq, toSq)
}

function isCheckmate(side) {
    if (!isKingInCheck(side)) return false

    const allSquares = getAllSquares()

    for (let from of allSquares) {
        if (!from.innerText) continue
        if (getSide(from.innerText) !== side) continue

        for (let to of allSquares) {
            if (!canPieceMoveToSquare(from, to)) continue

            const stillInCheck = simulateMove(
                from,
                to,
                () => isKingInCheck(side)
            )

            // At least one legal escape exists
            if (!stillInCheck) return false
        }
    }

    return true
}

function simulateMove(from, to, fn) {
    const originalFrom = from.innerHTML
    const originalTo = to.innerHTML

    const f = from.innerText
    const t = to.innerText

    from.innerText = ''
    to.innerText = f

    let result

    try {
        result = fn()
    } finally {
        from.innerHTML = originalFrom
        to.innerHTML = originalTo
    }

    return result
}

function evaluatePositionAfterMove() {
    const attackedSide = currentSideToCheck()

    if (isCheckmate(attackedSide)) {
        document.getElementById("text").innerText =
            (attackedSide === 'W' ? "White" : "Black") + " — CHECKMATE"
        document.body.style.background = "#8B0000"
        win()
        return
    }

    if (isKingInCheck(attackedSide)) {
        document.getElementById("text").innerText = "CHECK!"
        document.body.style.background = "#8B0000"
    } else {
        document.getElementById("text").innerText = "Move Tracker"
        document.body.style.background = "#5a5a5a"
    }
}

function currentSideToCheck() {
    return tog % 2 !== 0 ? 'W' : 'B'
}

function win() {
    document.getElementById("win-screen").style.display = "flex"
    document.querySelector("#win-screen h3").innerText =
        (tog % 2 !== 0 ? 'Black' : 'White') + " Wins"

    document.getElementById("ok-btn").addEventListener("click", close => {
        location.reload()
        document.getElementById("win-screen").style.display = "none"
    })
}

// move tracker and resignation

function getNotation(piece, box) {
    pieceSymbol = ""
    column = ""
    columns = ["a", "b", "c", "d", "e", "f", "g", "h"]

    if (piece.endsWith("king")) {
        pieceSymbol = "K"
    } else if (piece.endsWith("queen")) {
        pieceSymbol = "Q"
    } else if (piece.endsWith("bishop")) {
        pieceSymbol = "B"
    } else if (piece.endsWith("knight")) {
        pieceSymbol = "N"
    } else if (piece.endsWith("rook")) {
        pieceSymbol = "R"
    } else if (piece.endsWith("pawn")) {
        pieceSymbol = ""
    }

    column = columns[box.charAt(3) - 1]
    return pieceSymbol + column + box.charAt(1)
}

document.getElementById("resign-btn").addEventListener("click", function() {
    win()
})