from flask import Blueprint, current_app, session, render_template, redirect, url_for, jsonify, request
from utils import account_helper


account = Blueprint('account', __name__)


@account.route('/', methods = ['GET'])
def index():
    return redirect(url_for('account.update_info'))

@account.route('/update-info', methods = ['GET', 'POST'])
def update_info():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login'), next = request.url)
        
        redirect_url = request.args.get('next', '')

        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')

        results = account_helper.get_update_info(user_id=user_id, users_ref=users_ref)

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = request.url))
        
        if results['status'] == 2:
            return redirect(url_for('auth.complete_setup', next = request.url))
        
        template = 'account/update-info'

        return render_template(f'{template}/index.html', 
                            **{
                                'template_folder': url_for('static', filename = f'templates/{template}'),
                                'next': redirect_url,
                                'user': results['user']
                            })
    
    elif request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        data = request.get_json()
        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')

        results = account_helper.post_update_info(user_id=user_id, users_ref=users_ref, data=data)

        return jsonify(results)
    

@account.route('/update/password', methods = ['POST'])
def change_password():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    data = request.get_json()
    user_id = session.get('user')
    users_ref = current_app.config['firebase'].firestore_db.collection('users')

    results = account_helper.change_password(data=data, user_id=user_id, users_ref=users_ref)

    return jsonify(results)