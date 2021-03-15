# NLP Server
## Install
`pip install -r requirements.txt`

## Usage
### Step 1: Run the server
`python main.py`

### Step 2: Endpoints
* **POST /categorise**
    * Request body
    ```javascript
    {
        "text": "<text for categorisation>"
    }
    ```
    * Response
    ```javascript
    {
        "category": "<category from the model>"
    }
    ```
* **POST /duplicate**
    * Request body
    ```javascript
    {
        "questions": [
            "<question1>", 
            "<question2>", 
            ...
        ]
    }
    ```
    * Response
    ```javascript
    {
        "groups": [
            [
                "<question1 of group1>", 
                "<question2 of group1>", 
                ...
            ], 
            ...
        ]
    }
    ```