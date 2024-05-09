from flask import Blueprint, current_app, session, render_template, redirect, url_for, jsonify, request
from utils import tro_ly_hoc_tap_helper
from datetime import datetime
import time
import markdown
import mdtex2html


tro_ly_hoc_tap = Blueprint('tro_ly_hoc_tap', __name__)


# -----------=============== Initialize variables ============----------------
TEMPORARY_STORAGE = {
    'chat_gemini': {
        # 'user_id': {
        #     'chat': 'chat',
        #     'start_time': 'time.time()'
        # }
    }
}
# --------------------------============================------------------------------


@tro_ly_hoc_tap.route('/', methods = ['GET'])
def index():
    return redirect(url_for('tro_ly_hoc_tap.chat'))



@tro_ly_hoc_tap.route('/chat', methods = ['GET', 'POST'])
def chat():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        

        template = 'tro-ly-hoc-tap/chat'

        return render_template(f'{template}/index.html',
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}')
                               })
    

    if request.method == 'POST':
        if not session.get('login'):
            return 'Bạn vui lòng Đăng nhập để tiếp tục chat với tớ nhé...'
        
        data = request.get_json()
        input_text = data['input_text']
        get_html = data['get_html']
        user_id = session.get('user')

        if input_text.strip() == '':
            return ''
        
        current_time = time.time()
        if (user_id not in TEMPORARY_STORAGE['chat_gemini']) or (current_time - TEMPORARY_STORAGE['chat_gemini'][user_id]['start_time'] > 24*60*60):
            try:
                TEMPORARY_STORAGE['chat_gemini'][user_id] = {
                    'chat': current_app.config['gemini'].model.start_chat(history=[]),
                    'start_time': current_time
                }

                instruction = ''

                response = TEMPORARY_STORAGE['chat_gemini'][user_id]['chat'].send_message(instruction, stream = True)
                response.resolve()
                results = response.text

            except:
                return ''
            
        
        chat_gemini = TEMPORARY_STORAGE['chat_gemini'][user_id]['chat']

        try:
            response = chat_gemini.send_message(input_text, stream = True)
            response.resolve()
            results = response.text

        except:
            return ''
        

        if get_html:
            results = mdtex2html.convert(results)
        

        return results
    


@tro_ly_hoc_tap.route('/chat/setup', methods = ['GET'])
def chat_setup():
    current_time = time.time()
    for user_id in list(TEMPORARY_STORAGE['chat_gemini'].keys()):
        if current_time - TEMPORARY_STORAGE['chat_gemini'][user_id]['start_time'] > 24*60*60:
            TEMPORARY_STORAGE['chat_gemini'].pop(user_id)

    if not session.get('login'):
        return 'Login required.'
    

    user_id = session.get('user')

    if (user_id not in TEMPORARY_STORAGE['chat_gemini']) or (current_time - TEMPORARY_STORAGE['chat_gemini'][user_id]['start_time'] > 24*60*60):
        try:
            TEMPORARY_STORAGE['chat_gemini'][user_id] = {
                'chat': current_app.config['gemini'].model.start_chat(history=[]),
                'start_time': current_time
            }

            instruction = ''

            response = TEMPORARY_STORAGE['chat_gemini'][user_id]['chat'].send_message(instruction, stream = True)
            response.resolve()
            results = response.text

        except:
            return 'Error.'
        
    
    return 'OK.'


@tro_ly_hoc_tap.route('/len-ke-hoach/on-thi', methods = ['GET', 'POST'])
def len_ke_hoach_on_thi():
    if request.method == 'GET':
        if not session.get('login'):
            return redirect(url_for('auth.login', next = request.url))
        
        user_id = session.get('user')
        users_ref = current_app.config['firebase'].firestore_db.collection('users')
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')

        results = tro_ly_hoc_tap_helper.get_len_ke_hoach_on_thi(user_id=user_id, users_ref=users_ref, classes_ref=classes_ref)

        template = 'hoc-vien/len-ke-hoach-on-thi'

        return render_template(f'{template}/index.html', 
                               **{
                                   'template_folder': url_for('static', filename = f'templates/{template}'),
                                   'classes_name': results['classes_name'],
                                   'cac_ten_hieu_hv': results['cac_ten_hieu_hv']
                               })
    

    if request.method == 'POST':
        if not session.get('login'):
            return jsonify({
                'status': 0,
                'message': 'Login required.'
            })
        
        data = request.get_json()
        classes_ref = current_app.config['firebase'].firestore_db.collection('classes')
        gemini_model = current_app.config['gemini'].model

        results = tro_ly_hoc_tap_helper.post_len_ke_hoach_on_thi(classes_ref=classes_ref, data=data, gemini=gemini_model)

        return jsonify(results)