from flask import Blueprint, current_app, session, request, render_template, redirect, url_for, jsonify
from utils import hoc_vien_helper



hoc_vien = Blueprint('hoc_vien', __name__)



@hoc_vien.route('/dang-ky-lop-moi', methods = ['POST'])
def dang_ky_lop_moi():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    data = request.get_json()
    user_id = session.get('user')
    users_ref = current_app.config['firebase'].firestore_db.collection('users')
    classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

    results = hoc_vien_helper.dang_ky_lop_moi(data=data, user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

    return jsonify(results)


@hoc_vien.route('/tra-cuu-tien-trinh-hoc-tap', methods = ['POST', 'GET'])
def tra_cuu_tien_trinh_hoc_tap():
    if request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        user_id = session.get('user')
        data = request.get_json()

        results = hoc_vien_helper.post_tra_cuu_tien_trinh_hoc_tap(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

        return jsonify(results)
    
    elif request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        

        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        
        results = hoc_vien_helper.get_tra_cuu_tien_trinh_hoc_tap(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        

        template = 'hoc-vien/tra-cuu-tien-trinh-hoc-tap'

        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'classes_name': results['classes_name'],
                                   'cac_ten_hieu_hv': results['cac_ten_hieu_hv'],
                                   'months_years': results['months_years']
                               })
    

@hoc_vien.route('/on-bai', methods = ['GET', 'POST'])
def on_bai():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        

        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        
        results = hoc_vien_helper.get_on_bai(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        

        template = 'hoc-vien/on-bai'

        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'classes_name': results['classes_name'],
                                   'cac_ten_hieu_hv': results['cac_ten_hieu_hv'],
                                   'months_years': results['months_years']
                               })
    
    if request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        user_id = session.get('user')
        data = request.get_json()

        results = hoc_vien_helper.post_on_bai(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

        return jsonify(results)
    

@hoc_vien.route('/homework', methods = ['GET', 'POST'])
def homework():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        

        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        
        results = hoc_vien_helper.get_on_bai(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        

        template = 'hoc-vien/homework'

        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'classes_name': results['classes_name'],
                                   'cac_ten_hieu_hv': results['cac_ten_hieu_hv'],
                                   'months_years': results['months_years']
                               })
    

    if request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        user_id = session.get('user')
        data = request.get_json()

        results = hoc_vien_helper.post_homework(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

        return jsonify(results)
    

@hoc_vien.route('/homework/submit', methods = ['GET', 'POST'])
def submit_homework():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        
        template = 'hoc-vien/homework/submit'

        return render_template(f'{template}/index.html', 
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}')
                               })
    

    if request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        data = request.get_json()
        user_id = session.get('user')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')

        results = hoc_vien_helper.post_submit_homework(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

        return jsonify(results)