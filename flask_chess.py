from flask import Flask, render_template

app = Flask(__name__)
app.config["DEBUG"] = True

colors = ['black', 'white']
rows = [0, 7]

figures = []

for c in range(2):
    for i in range(8):
        figures.append(
            {"name": 'pawn', "text": '♟' if c == 1 else '♙', "color": colors[c], "row": 1 if c == 0 else 6,
             "col": i})

        figures += [
            {"name": 'rook', "text": '♜' if c == 1 else '♖', "color": colors[c], "row": rows[c], "col": 0},
            {"name": 'knight', "text": '♞' if c == 1 else '♘', "color": colors[c], "row": rows[c], "col": 1},
            {"name": 'bishop', "text": '♝' if c == 1 else '♗', "color": colors[c], "row": rows[c], "col": 2},
            {"name": 'rook', "text": '♜' if c == 1 else '♖', "color": colors[c], "row": rows[c], "col": 7},
            {"name": 'knight', "text": '♞' if c == 1 else '♘', "color": colors[c], "row": rows[c], "col": 6},
            {"name": 'bishop', "text": '♝' if c == 1 else '♗', "color": colors[c], "row": rows[c], "col": 5},
            {"name": 'king', "text": '♚' if c == 1 else '♔', "color": colors[c], "row": rows[c], "col": 3},
            {"name": 'queen', "text": '♛' if c == 1 else '♕', "color": colors[c], "row": rows[c], "col": 4},
        ]


def find_figure(i, j):
    try:
        return [f for f in figures if f["row"] == i and f["col"] == j][0]
    except IndexError:
        return None


board = [[find_figure(i, j) for j in range(8)] for i in range(8)]


@app.route('/board')
def board1():
    return render_template("board.html", **{"rows": range(8), "cols": range(8), "board": board})

@app.route('/board/<start>')
def turn1(start):
    return render_template("board.html", **{"rows": range(8), "cols": range(8), "board": board, "start": start})

if __name__ == '__main__':
    app.run()
