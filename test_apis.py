import urllib.request
import urllib.parse
import json

def test_search(query):
    url = 'http://localhost:8000/api/search'
    data = json.dumps({'query': query}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"Query: {query}\nType: {result.get('type')}\nStatus: OK\nLength: {len(str(result))}\n")
    except Exception as e:
        print(f"Query: {query}\nError: {e}\n")

if __name__ == '__main__':
    test_search('best laptop under 50000')
    test_search('home setup under 200000')
