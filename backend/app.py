from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)  

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

@app.route('/todos', methods=['GET'])
def get_todos():
    """Get all todos"""
    todos = Todo.query.all()
    return jsonify([{"id": t.id, "title": t.title, "completed": t.completed} for t in todos])

@app.route('/todos', methods=['POST'])
def add_todo():
    """Add a new todo"""
    data = request.json
    if not data or 'title' not in data:
        return jsonify({"error": "Title is required"}), 400
    new_todo = Todo(title=data['title'], completed=False)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"id": new_todo.id, "title": new_todo.title, "completed": new_todo.completed}), 201

@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    """Update a todo"""
    data = request.json
    todo = Todo.query.get_or_404(id)
    if 'completed' in data:
        todo.completed = data['completed']
    if 'title' in data:
        todo.title = data['title']
    db.session.commit()
    return jsonify({"id": todo.id, "title": todo.title, "completed": todo.completed})

@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    """Delete a todo"""
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(host='0.0.0.0', port=5000)
