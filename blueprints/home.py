from flask import Blueprint, current_app, session, render_template, jsonify, url_for, redirect
from utils import home_helper


home = Blueprint('home', __name__)


@home.route('/', methods = ['GET'])
def index():
    template = 'Mentor'

    if not session.get('login'):
        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'login': False,
                                   'user': {}
                               })
    
    user_id = session.get('user')
    users_ref = current_app.config['firebase'].firestore_db.collection('users')

    results = home_helper.index(user_id=user_id, users_ref=users_ref)

    if results['status'] != 1:
        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'login': True,
                                   'user': {}
                               })
    

    return render_template(f'{template}/index.html',
                           **{
                               'template_folder': url_for('static', filename = f'templates/{template}'),
                               'login': True,
                               'user': results['user']
                           })