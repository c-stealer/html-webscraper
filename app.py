from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    try:
        url = request.json.get('url')
        if not url:
            return jsonify({'error': 'No URL provided'}), 400
        
        # Fetch the webpage
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract basic information
        title = soup.title.string if soup.title else 'No Title'
        paragraphs = [p.get_text().strip() for p in soup.find_all('p') if p.get_text().strip()]
        links = [{'text': a.get_text().strip(), 'href': a.get('href')} 
                 for a in soup.find_all('a') 
                 if a.get_text().strip()]
        
        return jsonify({
            'title': title,
            'paragraphs': paragraphs[:5],  # Limit to first 5 paragraphs
            'links': links[:10]  # Limit to first 10 links
        })
    
    except requests.RequestException as e:
        return jsonify({'error': f'Error fetching URL: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
