from flask import Flask, render_template, request, redirect, url_for
import requests
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html') #Index, página principal de la aplicación. 

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return "No se encontró el archivo", 400 
    
    file = request.files['image']
    
    if file.filename == '':
        return "Archivo no seleccionado", 400

    # Convertir el archivo a un objeto BytesIO para manejarlo en memoria
    file_bytes = io.BytesIO(file.read())

    # Enviar la imagen a la API, mas adelante modificar los parametros para poder seleccionar desde la interfase de usuario
    mask_data = request.form.get('mask', '')
    url = f"http://127.0.0.1:8000/procesar-imagen/?escala=1&sigma=3&mascara={mask_data}"
    files = {'file': (file.filename, file_bytes, file.content_type)}
    headers = {'accept': 'application/json'}

    response = requests.post(url, headers=headers, files=files)

    if response.headers.get('content-type') == 'image/png':
        image_path = f"static/uploads/resultado.png"
        with open(image_path, "wb") as f:
            f.write(response.content)
        return render_template("resultado.html", imagen_resultado=url_for('static', filename='uploads/resultado.png'))
    else:
        return f"Error en la respuesta de la API: {response.text}", 500

if __name__ == '__main__':
    app.run(debug=True)
