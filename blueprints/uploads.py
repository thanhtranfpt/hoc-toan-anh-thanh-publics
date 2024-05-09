from flask import Blueprint, current_app, render_template, session, jsonify, request
from utils.common_utils import FilesHandler
import base64



uploads = Blueprint('uploads', __name__)




@uploads.route('/', methods = ['GET'])
def index():
    pass


@uploads.route('/image', methods = ['POST'])
def upload_image():
    if not session.get('login'):
        return jsonify({
            'status': 0,
            'message': 'Login required.'
        })
    
    if 'image' not in request.files:
        return jsonify({
            'status': 2,
            'message': 'No file part.'
        })
    
    file = request.files['image']

    if file.filename == '':
        return jsonify({
            'status': 3,
            'message': 'No selected file.'
        })
    

    # Read the contents of the file
    file_contents = file.read()

    # Encode the file contents to base64
    base64_encoded = base64.b64encode(file_contents).decode(encoding='utf-8')

    results = FilesHandler.upload_image(image_source=base64_encoded)

    return jsonify(results)