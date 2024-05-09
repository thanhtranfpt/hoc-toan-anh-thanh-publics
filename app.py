from flask import Flask, session, render_template, redirect, url_for, send_from_directory
from flask_cors import CORS
import os

from config.loader import cfg
from utils.logging_utils import Logger
from utils.common_utils import Firebase, Gemini
from utils.auth_helper import GoogleLoginHandler

from blueprints.auth import auth
from blueprints.home import home
from blueprints.uploads import uploads
from blueprints.giang_vien import giang_vien
from blueprints.phu_huynh import phu_huynh
from blueprints.hoc_vien import hoc_vien
from blueprints.classes import classes
from blueprints.account import account
from blueprints.tro_ly_hoc_tap import tro_ly_hoc_tap



app = Flask(__name__, template_folder='./static/templates')
CORS(app=app)



#-----------====================== Confingure the app ==================--------------------
configs = cfg.configs

app.config['logger'] = Logger(logs_file_path=configs['app']['logs_file']['path'],
                              max_logged_size=configs['app']['logs_file']['max_logged_size'],
                              max_kept_size=configs['app']['logs_file']['max_kept_size'])

app.secret_key = configs['app']['secret_key']

if configs['envs']['configs'].get("OAUTHLIB_INSECURE_TRANSPORT", '') == "1":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app_folders = ['UPLOAD_FOLDER', 'RESULT_FOLDER', 'DOWNLOAD_FOLDER']
for folder in app_folders:
    app.config[folder] = configs['app'][folder]
    if not os.path.isdir(app.config[folder]):
        os.mkdir(app.config[folder])


app.config['firebase'] = Firebase(service_account_keys_file=configs['firebase']['service_account_keys_file'],
                                  firebase_configs=configs['firebase']['configs'])

app.config['gemini'] = Gemini(GOOGLE_API_KEY=configs['gemini']['GOOGLE_API_KEY'])

app.config['flow_google_login'] = GoogleLoginHandler.get_flow(client_secrets_file=configs['google_cloud']['client_secrets_file'],
                                                              scopes=configs['google_login']['scopes'],
                                                              redirect_uri=configs['envs']['configs']['google_login']['redirect_uri'])



app.config['configs'] = configs



#--------------==================== Register blueprints ===================-------------------

app.register_blueprint(home, url_prefix = '/')

app.register_blueprint(auth, url_prefix = '/')

app.register_blueprint(uploads, url_prefix = '/uploads')

app.register_blueprint(giang_vien, url_prefix = '/teaching')

app.register_blueprint(phu_huynh, url_prefix = '/phu-huynh')

app.register_blueprint(hoc_vien, url_prefix = '/')

app.register_blueprint(classes, url_prefix = '/classes')

app.register_blueprint(account, url_prefix = '/my-account')

app.register_blueprint(tro_ly_hoc_tap, url_prefix = '/tro-ly-hoc-tap')






if __name__ == '__main__':
    app.run(debug=True)