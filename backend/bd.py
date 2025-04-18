from flask import Flask, jsonify, request
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM


from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 👈 This enables CORS for all routes


# Load the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("gaussalgo/T5-LM-Large-text2sql-spider")
model = AutoModelForSeq2SeqLM.from_pretrained("gaussalgo/T5-LM-Large-text2sql-spider")

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask API!"})

@app.route('/api/example', methods=['GET'])
def example_endpoint():
    return jsonify({"data": "This is an example endpoint"})

@app.route('/api/generate_sql', methods=['POST'])
def generate_sql():
    print("Calleddddddddd")
    try:
        # Get the input data from the request
        data = request.get_json()
        print(data)
        question = data.get("question")
        schema = data.get("schema")

        if not question or not schema:
            return jsonify({"error": "Both 'question' and 'schema' are required"}), 400

        # Prepare the input for the model
        input_text = " ".join(["Question: ", question, "Schema:", schema])
        model_inputs = tokenizer(input_text, return_tensors="pt")
        
        # Generate the SQL query
        outputs = model.generate(**model_inputs, max_length=512)
        output_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)

        # Return the generated SQL query
        print(output_text[0])
        return jsonify({"sql_query": output_text[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("hii")
    app.run(debug=True)