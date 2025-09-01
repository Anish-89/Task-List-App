from flask import Flask, render_template, request, jsonify
from models import db, Task
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create DB tables if not exist
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    if request.method == 'POST':
        data = request.json
        new_task = Task(
            entity_name=data['entity_name'],
            task_type=data['task_type'],
            task_time=datetime.fromisoformat(data['task_time']),
            contact_person=data['contact_person'],
            note=data.get('note')
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Task created', 'id': new_task.id}), 201

    # GET: Fetch tasks with filters/sorts
    filters = request.args
    query = Task.query

    # Filters
    if 'team_member' in filters:  # Alias for contact_person
        query = query.filter(Task.contact_person.ilike(f'%{filters["team_member"]}%'))
    if 'task_type' in filters:
        query = query.filter(Task.task_type.ilike(f'%{filters["task_type"]}%'))
    if 'status' in filters:
        query = query.filter(Task.status == filters['status'])
    if 'date' in filters:
        try:
            date = datetime.fromisoformat(filters['date']).date()
            query = query.filter(db.func.date(Task.creation_date) == date)
        except:
            pass
    if 'entity_name' in filters:
        query = query.filter(Task.entity_name.ilike(f'%{filters["entity_name"]}%'))
    if 'contact_person' in filters:
        query = query.filter(Task.contact_person.ilike(f'%{filters["contact_person"]}%'))

    # Sorts (e.g., ?sort=creation_date:desc)
    if 'sort' in filters:
        field, direction = filters['sort'].split(':')
        sort_field = getattr(Task, field, None)
        if sort_field:
            query = query.order_by(sort_field.desc() if direction == 'desc' else sort_field.asc())

    tasks = query.all()
    return jsonify([{
        'id': t.id,
        'creation_date': t.creation_date.isoformat(),
        'entity_name': t.entity_name,
        'task_type': t.task_type,
        'task_time': t.task_time.isoformat(),
        'contact_person': t.contact_person,
        'note': t.note,
        'status': t.status
    } for t in tasks])

@app.route('/tasks/<int:task_id>', methods=['PUT', 'DELETE'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    if request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted'}), 200

    # PUT: Full edit
    data = request.json
    task.entity_name = data.get('entity_name', task.entity_name)
    task.task_type = data.get('task_type', task.task_type)
    task.task_time = datetime.fromisoformat(data['task_time']) if 'task_time' in data else task.task_time
    task.contact_person = data.get('contact_person', task.contact_person)
    task.note = data.get('note', task.note)
    task.status = data.get('status', task.status)
    db.session.commit()
    return jsonify({'message': 'Task updated'}), 200

@app.route('/tasks/<int:task_id>/status', methods=['PATCH'])
def toggle_status(task_id):
    task = Task.query.get_or_404(task_id)
    task.status = 'closed' if task.status == 'open' else 'open'
    db.session.commit()
    return jsonify({'message': 'Status updated', 'new_status': task.status}), 200

if __name__ == '__main__':
    app.run(debug=True)