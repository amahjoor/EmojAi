#from openai import OpenAI
from openai import AzureOpenAI #
from config import OPENAI_API_KEY, ENDPOINT

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
API_VERSION = "2024-02-01" # 
MODEL_NAME = "gpt-4" # 

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)


def generate_emoji(description):
#def generate_emoji(description, num_emojis):
    client = AzureOpenAI(
        api_key=OPENAI_API_KEY,
        azure_endpoint=ENDPOINT, #
        api_version=API_VERSION, #
    )

    prompts = [
        f"generate a unique kawaii text-based emoji for: {description}. only include the emoji, i.e. don't include any text besides the emoji",
        f"create a unique and creative text-based emoji for: {description}.  only include the emoji, i.e. don't include any text besides the emoji",
        f"provide a unique text-based emoji for: {description}, ensure it is kawaii and creative.  only include the emoji, i.e. don't include any text besides the emoji"

    ]

    ems = set()
    
    #n = num_emojis if num_emojis < 3 else int(num_emojis * 0.75)


    while(len(ems) < 10):
        for prompt in prompts:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    #{"role": "system", "content": "You are a helpful assistant that generates text-based emojis."},
                    {"role": "user", "content": prompt}],
                max_tokens=50,
                temperature=1.0,
                top_p=0.9,
                n=10,
                stop=None,
            )
            #print(response)
            for choice in response.choices:
                emoji = choice.message.content.strip()
                if emoji not in ems:
                    if len(emoji) < 175 and "unique kawaii" not in emoji.lower():
                        #if len(ems) >= num_emojis:  # only until specified amt of emojis
                        if len(ems) >= 10:
                            break
                        ems.add(emoji)
            #if len(ems) >= num_emojis:
            if len(ems) >= 10:
                break
        #print(len(ems))
        return list(ems)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    description = data.get('description')
    #num_emojis = data.get('num_emojis', 10)  # Default to 10 if not provided
    if not description:
        return jsonify({'error': 'Description is required'}), 400
    #emojis = generate_emoji(description, num_emojis)
    emojis = generate_emoji(description)
    return jsonify({'emojis': emojis})

if __name__ == '__main__':
    app.run(debug=True)
