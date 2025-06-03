# Interfaz Web para API de Restauración de Imágenes

Este proyecto es una aplicación web basada en Flask que proporciona una interfaz para la API de restauración de imágenes. Los usuarios pueden cargar una imagen, dibujar una máscara sobre las áreas dañadas utilizando un lienzo interactivo y enviarla la API backend para su procesamiento. La imagen restaurada se muestra luego al usuario.

Ver: https://github.com/chelofabian/Procesamiento-de-imagenes

## Descripción General

La aplicación facilita el proceso de restauración de imágenes al:

1.  Permitir a los usuarios cargar una imagen directamente desde su máquina local. [templates/index.html]
2.  Proporcionar un lienzo interactivo donde los usuarios pueden dibujar una máscara sobre las áreas de la imagen que desean restaurar o rellenar. [templates/index.html]
3.  Enviar la imagen original y la máscara dibujada por el usuario a una API de procesamiento de imágenes backend separada. [app.py]
4.  Recibir la imagen procesada de la API y mostrarla en una página de resultados. [app.py, templates/resultado.html]

## Características

* **Carga de Imágenes**: Admite la carga de formatos de imagen comunes. [templates/index.html]
* **Enmascaramiento Interactivo**: Los usuarios pueden dibujar directamente sobre la imagen cargada para crear una máscara. El lienzo admite entradas de ratón y táctiles. [templates/index.html]
* **Control del Tamaño del Pincel**: Tamaño de pincel ajustable para dibujar la máscara. [templates/index.html]
* **Integración con API**: Se comunica con una API de procesamiento de imágenes backend para realizar la restauración. [app.py]
* **Visualización de Resultados**: Muestra la imagen procesada devuelta por la API. [templates/resultado.html]

---

## Prerrequisitos

* Python 3.x
* Dependencias listadas en `requirements.txt` (Flask, Requests, Pillow, Numpy).
* Una instancia en ejecución de la API **Restauración de Imágenes con Scikit-image y FastAPI**. Esta aplicación web **no funcionará** sin la API backend. Se espera que la API esté ejecutándose en `http://127.0.0.1:8000`. Por favor, consulta el README de la API para sus instrucciones de configuración.

---

## Configuración y Ejecución

1.  **Clona el repositorio (o asegúrate de que todos los archivos del proyecto estén en un directorio local).**
2.  **Instala las dependencias de Python:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Asegúrate de que la API de Procesamiento de Imágenes backend esté en ejecución.**
    Según la documentación de la API, normalmente se ejecuta en `http://127.0.0.1:8000`.
4.  **Ejecuta la aplicación web Flask:**
    ```bash
    python app.py
    ```
5.  **Accede a la aplicación:**
    Abre tu navegador web y ve a `http://127.0.0.1:5000` (o la dirección que se muestre en tu terminal si es diferente).

---

## Estructura del Proyecto

* `app.py`: El archivo principal de la aplicación Flask. Maneja el enrutamiento, la carga de imágenes, la comunicación con la API backend y la renderización de plantillas. [app.py]
* `requirements.txt`: Una lista de los paquetes de Python necesarios para el proyecto.
* `templates/`: Contiene las plantillas HTML para las páginas web.
    * `index.html`: La página principal para la carga de imágenes y el dibujo de máscaras. Incluye JavaScript para la interacción con el lienzo y el envío del formulario. [templates/index.html]
    * `resultado.html`: La página utilizada para mostrar la imagen procesada. [templates/resultado.html]
* `static/`: Contiene los activos estáticos.
    * `css/style.css`: Estilos CSS básicos (aunque `index.html` utiliza principalmente Tailwind CSS a través de CDN). [static/css/style.css]
    * `uploads/`: Este directorio es utilizado por `app.py` para almacenar temporalmente la imagen procesada (`resultado.png`) recibida de la API antes de mostrarla. [app.py]
    * `js/main.js`: *Nota: La lógica principal de JavaScript para la interacción del frontend está actualmente incrustada dentro de las etiquetas `<script>` en `templates/index.html`, no en este archivo separado según el contenido de `index.html` proporcionado.* [templates/index.html]

---

## Cómo Funciona

1.  El usuario navega a la página principal (`index.html`). [app.py]
2.  El usuario selecciona un archivo de imagen utilizando la entrada "Subir Imagen". [templates/index.html]
3.  El JavaScript en `index.html` carga esta imagen en un elemento canvas de HTML5. El marcador de posición del lienzo se oculta y se muestra el lienzo con la imagen. [templates/index.html]
4.  El usuario puede entonces dibujar en el lienzo usando su ratón o pantalla táctil. El código JavaScript captura estas acciones de dibujo, aplica un color rojo semitransparente para visualizar la máscara y actualiza una `maskMatrix` interna (un array 2D que representa la máscara). [templates/index.html] El tamaño del pincel se puede ajustar usando un control deslizante. [templates/index.html]
5.  Cuando el usuario hace clic en el botón "Enviar Máscara", la `maskMatrix` se convierte en una cadena JSON y se coloca en un campo de entrada oculto (`mask-data`). [templates/index.html]
6.  El formulario se envía al endpoint `/upload` en `app.py` mediante una solicitud POST, enviando el archivo de imagen y los datos de la máscara. [app.py, chelofabian/web-flask/Web-flask-7e24fbf8dcce61bf6ab817863d60b272bc548e22/templates/index.html]
7.  El backend de Flask (`app.py`) recibe la imagen y los datos de la máscara. Luego realiza una solicitud POST a la API externa de procesamiento de imágenes en `http://127.0.0.1:8000/procesar-imagen/`. [app.py]
    * La solicitud a la API incluye el archivo de imagen y los datos de la máscara (`mask_data` del formulario). Los parámetros `escala` y `sigma` están actualmente codificados en `app.py` a `1` y `3` respectivamente. [app.py]
8.  Si la API procesa con éxito la imagen y devuelve una imagen (se espera que sea `image/png`), `app.py` guarda este contenido de respuesta como `static/uploads/resultado.png`. [app.py]
9.  Luego, se redirige al usuario a la página `resultado.html`, que muestra la imagen procesada (`resultado.png`). [app.py, templates/resultado.html]
10. Si ocurre algún error durante el proceso (por ejemplo, error de la API, archivo no encontrado), se devuelve un mensaje de error. [app.py]

---

## Dependencia de la API Backend

Esta aplicación web es un **cliente frontend** y **depende críticamente** de la API backend "Restauración de Imágenes con Scikit-image y FastAPI".

* **Endpoint de la API Utilizado**: `POST http://127.0.0.1:8000/procesar-imagen/` [app.py]
* **Datos Enviados a la API**:
    * `file`: La imagen cargada.
    * `mascara`: Una cadena JSON que representa la máscara dibujada por el usuario.
    * `escala`: Actualmente codificado a `1`. [app.py]
    * `sigma`: Actualmente codificado a `3`. [app.py]
* **Respuesta Esperada de la API**: Una imagen en formato PNG (`image/png`). [app.py]

Para obtener información detallada sobre la funcionalidad de la API, cómo procesa las imágenes, sus propios requisitos y cómo ejecutarla, por favor **consulta el documento README proporcionado en el proyecto de la API**. Esta aplicación `web-flask` no funcionará correctamente a menos que la API esté operativa y accesible en la URL especificada.

---
