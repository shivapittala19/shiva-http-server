from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import uuid
import time

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Set response headers
        self.send_response(200)
        self.send_header('Content-type', 'text/html' if self.path == '/html' else 'application/json')
        self.end_headers()

        # Handle different routes
        if self.path == '/html':
            self.wfile.write(bytes(self.read_file_content('index.html'), 'utf-8'))
        elif self.path == '/json':
            self.wfile.write(bytes(self.read_file_content('data.json'), 'utf-8'))
        elif self.path == '/uuid':
            self.wfile.write(bytes(self.get_uuid_response(), 'utf-8'))
        elif self.path.startswith('/status/'):
            status_code = int(self.path.split('/')[-1])
            self.send_response(status_code)
            self.wfile.write(bytes(f'Response with status code {status_code}', 'utf-8'))
        elif self.path.startswith('/delay/'):
            delay_seconds = int(self.path.split('/')[-1])
            time.sleep(delay_seconds)
            self.send_response(200)
            self.wfile.write(bytes(f'Successful response after {delay_seconds} seconds ', 'utf-8'))
            
    def read_file_content(self, filename):
        with open(filename, 'r', encoding='utf-8') as file:
            return file.read()

    def get_uuid_response(self):
        return json.dumps({"uuid": str(uuid.uuid4())})


def run():
    port = 3000
    server_address = ('', port)
    httpd = HTTPServer(server_address, MyHandler)
    print(f'Starting server on port {port}')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
