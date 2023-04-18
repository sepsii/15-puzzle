
class Puzzle {

    constructor(rows, cols, id) {
        this.id = `game-board-${id}`
        this.rows = rows;
        this.cols = cols;
        this.emptyRow = rows - 1;
        this.emptyCol = cols - 1;
        this.createGameBoard()
        this.cells = this.fillGameBoard();
        this.values = this.createInitValues()
        this.values = this.shuffleBoard(this.values)
        this.setEmptyCell()
        this.addListeners()
        this.draw()
    }


    createGameBoard() {
        const container = document.getElementById('puzzle-container')
        const table = document.createElement('table')
        table.setAttribute('id', this.id)
        container.appendChild(table)
        console.log(container);
    }


    fillGameBoard() {
        let gameBoard = document.getElementById(this.id);
        gameBoard.innerHTML = ''
        let cells = [];
        for (let row = 0; row < this.rows; row++) {
            let tr = document.createElement('tr');
            gameBoard.appendChild(tr);
            let rowCells = [];
            cells.push(rowCells);
            for (let col = 0; col < this.cols; col++) {
                let td = document.createElement('td');
                td.setAttribute('class', 'cell');
                tr.appendChild(td);
                rowCells.push(td);
            }
        }
        return cells;
    }


    createInitValues() {
        let board = [];
        for (let row = 0; row < this.rows; row++) {
            board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                if (row === this.emptyRow && col === this.emptyCol) {
                    board[row][col] = 0;
                    board
                } else {
                    board[row][col] = row * this.cols + col + 1;
                    board[row][col]
                    board
                }
            }
        }

        return board;
    }


    shuffleBoard(board) {
        let flatBoard = board.flat();
        for (let i = flatBoard.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flatBoard[i], flatBoard[j]] = [flatBoard[j], flatBoard[i]];
        }

        let shuffledBoard = [];
        for (let row = 0; row < board.length; row++) {
            shuffledBoard[row] = [];
            for (let col = 0; col < board[row].length; col++) {
                shuffledBoard[row][col] = flatBoard[row * board[row].length + col];
            }
        }
        if (this.isSolvable(shuffledBoard)) {

            return shuffledBoard;
        }
        else {
            return this.shuffleBoard(board);
        }
    }



    isSolvable(board) {
        let flatBoard = board.flat();
        let inversions = 0;
        for (let i = 0; i < flatBoard.length; i++) {
            for (let j = i + 1; j < flatBoard.length; j++) {
                if (flatBoard[i] > flatBoard[j] && flatBoard[i] !== 0 && flatBoard[j] !== 0) {
                    inversions++;
                }
            }
        }
        let emptyTileRow = board.findIndex(row => row.includes(0));
        if (board.length % 2 === 1) {
            return inversions % 2 === 0;
        } else {
            return (emptyTileRow + inversions) % 2 === 1;
        }
    }

    setEmptyCell() {
        this.emptyRow = this.values.findIndex(col => col.includes(0))
        this.emptyCol = this.values[this.emptyRow].findIndex(row => row == 0);
    }


    canMoveTile(row, col) {
        return (
            (row === this.emptyRow && Math.abs(col - this.emptyCol) === 1) ||
            (col === this.emptyCol && Math.abs(row - this.emptyRow) === 1)
        );
    }

    
    moveTile(clickedRow, clickedColumn) {
        if ((clickedRow == this.emptyRow) && (clickedColumn - this.emptyCol == 1)) {
            this.emptyCol++
            const value = this.values[clickedRow][clickedColumn]
            this.values[clickedRow][clickedColumn] = 0
            this.values[clickedRow][clickedColumn - 1] = value
        }

        else if ((clickedRow == this.emptyRow) && (clickedColumn - this.emptyCol == -1)) {
            this.emptyCol--
            const value = this.values[clickedRow][clickedColumn]
            this.values[clickedRow][clickedColumn] = 0
            this.values[clickedRow][clickedColumn + 1] = value
        }

        else if ((clickedRow - this.emptyRow == 1) && (clickedColumn == this.emptyCol)) {
            this.emptyRow++
            const value = this.values[clickedRow][clickedColumn]
            this.values[clickedRow][clickedColumn] = 0
            this.values[clickedRow - 1][clickedColumn] = value
        }

        else if ((clickedRow - this.emptyRow == -1) && (clickedColumn == this.emptyCol)) {
            this.emptyRow--
            const value = this.values[clickedRow][clickedColumn]
            this.values[clickedRow][clickedColumn] = 0
            this.values[clickedRow + 1][clickedColumn] = value
        }

    }


    isPuzzleSolved() {
        let expectedValue = 1;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.values[row][col] === expectedValue) {
                    expectedValue++;
                } else if (this.values[row][col] === 0 && row === this.emptyRow && col === this.emptyCol) {
                    // Skip the empty tile
                } else {
                    return false;
                }
            }
        }
        alert('you solved it!')
        return true;
    }


    draw() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                let v = this.values[row][col];
                let td = this.cells[row][col];
                td.innerHTML = v == 0 ? '' : String(v);
            }
        }
    }


    addListeners() {
        const table = document.getElementById(this.id);
        table.addEventListener('click', (event) => {
            const td = event.target.closest('td');
            if (td) {
                const cellIndex = td.cellIndex;
                const rowIndex = td.parentNode.rowIndex;
                this.handleClick(rowIndex, cellIndex)
            }
        })
    }


    handleClick(rowIndex, cellIndex) {
        if (this.canMoveTile(rowIndex, cellIndex)) {
            this.moveTile(rowIndex, cellIndex)
            this.draw()
            this.isPuzzleSolved()
        }
    }


}




function init() {
    let numRows = document.getElementById('numRows').value
    let numCols = document.getElementById('numCols').value
    const game = new Puzzle(numRows, numCols, id)
    id++
}

let id = 1
init()