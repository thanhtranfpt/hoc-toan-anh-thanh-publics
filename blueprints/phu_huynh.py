from flask import Blueprint, current_app, session, render_template, redirect, url_for, jsonify, request
from utils import phu_huynh_helper



phu_huynh = Blueprint('phu_huynh', __name__)



@phu_huynh.route('/add-children', methods = ['POST'])
def add_children():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Quý phụ huynh vui lòng đăng nhập!'
        })
    
    data = request.get_json()
    user_id = session.get('user')
    users_ref = current_app.config['firebase'].firestore_db.collection('users')

    results = phu_huynh_helper.add_children(user_id=user_id, users_ref=users_ref, data=data)

    return jsonify(results)


@phu_huynh.route('/theo-doi-tinh-hinh-hoc-tap', methods = ['POST', 'GET'])
def theo_doi_tinh_hinh_hoc_tap():
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

        results = phu_huynh_helper.post_theo_doi_tinh_hinh_hoc_tap(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref, data=data)

        return jsonify(results)
    

    elif request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        
        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

        results = phu_huynh_helper.get_theo_doi_tinh_hinh_hoc_tap(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        

        template = 'phu-huynh/theo-doi-tinh-hinh-hoc-tap'

        return render_template(f'{template}/index.html', 
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'children_name': results['children_name'],
                                   'classes_name': results['classes_name'],
                                   'cac_ten_hieu_hv': results['cac_ten_hieu_hv'],
                                   'months_years': results['months_years']
                               })