from flask import Blueprint, session, current_app, render_template, redirect, url_for, jsonify, request
from utils import auth_helper
from utils.auth_helper import GoogleLoginHandler
import requests
import google.auth.transport.requests
from google.oauth2 import id_token
from pip._vendor import cachecontrol
import re


auth = Blueprint('auth', __name__)


@auth.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        redirect_url = request.args.get('next', '')
        template = 'auth'
        return render_template(f'{template}/index.html', 
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'next': redirect_url,
                                   'action': 'login'
                               })
    
    elif request.method == 'POST':
        # Login with username-passowrd
        data = request.get_json()
        users_ref = current_app.config['firebase'].firestore_db.collection('users')

        results = auth_helper.login(users_ref=users_ref, data=data)

        if results['status'] == 1:
            session['user'] = results['user_id']
            session['login'] = True

        return jsonify(results)
    

@auth.route('/login/facebook', methods = ['GET'])
def facebook_login():
    return render_template('others/feature_coming_soon.html')

@auth.route('/login/apple', methods = ['GET'])
def apple_login():
    return render_template('others/feature_coming_soon.html')


@auth.route('/sign-up', methods = ['POST', 'GET'])
def sign_up():
    if request.method == 'POST':
        data = request.get_json()
        users_ref = current_app.config['firebase'].firestore_db.collection('users')

        results = auth_helper.sign_up(data=data, users_ref=users_ref)

        if results['status'] == 1:
            session['login'] = True
            session['user'] = results['user_id']

        return jsonify(results)
    
    elif request.method == 'GET':
        redirect_url = request.args.get('next', '')
        template = 'auth'

        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'next': redirect_url,
                                   'action': 'sign_up'
                               })



@auth.route('/sign-up/complete-info', methods = ['GET', 'POST'])
def complete_setup():
    if request.method == 'GET':
        redirect_url = request.args.get('next', '')

        if not session.get('login'):
            return redirect(url_for('auth.sign_up', next = redirect_url))
        
        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')

        results = auth_helper.get_complete_setup(user_id=user_id, users_ref=users_ref)

        if results['status'] == 0:
            return redirect(url_for('auth.login', next = redirect_url))
        
        if results['status'] == 2:
            return redirect(redirect_url)
        
        
        template = 'auth/complete-signup-info'

        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'user': results['user'],
                                   'next': redirect_url
                               })
    

    elif request.method == 'POST':
        data = request.get_json()

        if not session.get('login'):
            return {
                'status': 0,
                'message': 'Login required.'
            }
        
        user_id = session.get('user')
        firestore_db = current_app.config['firebase'].firestore_db

        results = auth_helper.post_complete_setup(data=data, user_id=user_id, firestore_db=firestore_db)

        return jsonify(results)
    


@auth.route('/login/google', methods = ['GET'])
def google_login():
    flow = current_app.config['flow_google_login']
    redirect_url = request.args.get('next', '/')
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    session['redirect_url'] = redirect_url
    return redirect(authorization_url)


@auth.route('/login/google/callback', methods = ['GET'])
def callback_google_login():
    flow = current_app.config['flow_google_login']
    redirect_url = session.get('redirect_url', '/')
    session.pop('redirect_url', None)
    flow.fetch_token(authorization_response = request.url)
    GOOGLE_CLIENT_ID = current_app.config['configs']['google_login']['GOOGLE_CLIENT_ID']
    
    if not ('state' in session and session['state'] == request.args['state']):
        return redirect(url_for('auth.login', next = redirect_url))
    
    session.pop('state', None)
    
    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)
    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    users_ref = current_app.config['firebase'].firestore_db.collection('users')

    results = GoogleLoginHandler.sign_up(id_info=id_info, users_ref=users_ref)

    session['login'] = True
    session['user'] = results['user_id']

    if results['status'] == 0:
        return redirect(redirect_url)
    

    return redirect(url_for('auth.complete_setup', next = redirect_url))



@auth.route('/log-out', methods = ['GET'])
def log_out():
    session.pop('login', None)
    session.pop('user', None)

    return redirect('/')