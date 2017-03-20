from flask import Flask, render_template, redirect, url_for, jsonify

from alchemy import db

from models.chess import *

app = Flask(__name__)
app.config["DEBUG"] = True

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://chess1:qwerty@localhost:5432/chess1'
app.config['SQLALCHEMY_ECHO'] = True

db.init_app(app)


@app.route('/<int:id>')
@app.route('/board/<int:id>')
def board(id):
    game = db.session.query(Game).get(id)

    if (not game):
        game = Game(id=id)
        db.session.add(game)
        db.session.commit()

    return render_template("board.html", id=id)


@app.route('/board/<int:id>/figures')
def board1(id):
    game = db.session.query(Game).get(id)

    moves = [[m.uci()[0:2], m.uci()[2:]] for m in chess.Board(game.fen).legal_moves]

    return jsonify({
        "board": game.board(),
        "moves": moves
    })

@app.route('/board/<int:id>/<start>/<end>', methods=['POST'])
def turn(id, start, end):
    game = db.session.query(Game).get(id)

    game.move(start, end)

    return redirect(url_for("board1", id=id))

if __name__ == '__main__':
    app.run()
