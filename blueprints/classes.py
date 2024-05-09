from flask import Blueprint, current_app, session, render_template, url_for, redirect, jsonify, request
from utils import classes_helper


classes = Blueprint('classes', __name__)


@classes.route('/get-syllabus', methods = ['POST'])
def get_syllabus():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    data = request.get_json()
    user_id = session.get('user')
    users_ref = current_app.config['firebase'].firestore_db.collection('users')
    classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

    results = classes_helper.get_syllabus(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

    return jsonify(results)