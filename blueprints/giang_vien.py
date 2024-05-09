from flask import Blueprint, current_app, session, render_template, redirect, url_for, request, jsonify
from utils import giang_vien_helper


giang_vien = Blueprint('giang_vien', __name__)




@giang_vien.route('/create-new-class', methods = ['POST', 'GET'])
def create_new_class():
    if request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        data = request.get_json()
        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

        results = giang_vien_helper.create_new_class(data=data, user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

        return jsonify(results)
    
    elif request.method == 'GET':
        template = 'giang-vien/tao-lop-hoc-moi'
        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}')
                               })
    

@giang_vien.route('/add-class', methods = ['POST'])
def add_class():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    user_id = session.get('user')
    users_ref = current_app.config['firebase'].firestore_db.collection('users')
    classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

    data = request.get_json()

    results = giang_vien_helper.add_class(data=data, user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

    return jsonify(results)


@giang_vien.route('/classes/all', methods = ['POST'])
def all_classes():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    user_id = session.get('user')
    users_ref = current_app.config['firebase'].firestore_db.collection('users')
    classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

    results = giang_vien_helper.post_all_classes(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

    return jsonify(results)


@giang_vien.route('/classes/get-info', methods = ['POST'])
def get_class_info():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    user_id = session.get('user')
    data = request.get_json()
    users_ref = current_app.config['firebase'].firestore_db.collection('users')
    classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

    results = giang_vien_helper.get_class_info(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

    return jsonify(results)


@giang_vien.route('/classes/update-info', methods = ['POST'])
def update_class_info():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    user_id = session.get('user')
    data = request.get_json()
    users_ref = current_app.config['firebase'].firestore_db.collection('users')
    classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

    results = giang_vien_helper.update_class_info(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

    return jsonify(results)


@giang_vien.route('/homework/check', methods = ['GET', 'POST'])
def check_homework():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        
        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

        results = giang_vien_helper.get_check_homework(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        

        template = 'giang-vien/check-homework'

        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'months_years': results['months_years'],
                                   'classes_name': results['classes_name']
                               })
    

    if request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

        data = request.get_json()

        results = giang_vien_helper.post_check_homework(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)


        return jsonify(results)