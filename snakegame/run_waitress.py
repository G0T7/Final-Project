from waitress import serve
from backend.wsgi import application  # Ensure this matches your wsgi.py module

if __name__ == '__main__':
    serve(application, host='0.0.0.0', port=8000)
