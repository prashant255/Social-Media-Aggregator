# NLP Server
## Install
`pip install -r requirements.txt`

## Usage
### Step 1: Run the server
`python main.py`

### Step 2: Endpoints
* **POST /catnwe**
    * Request body
    ```javascript
    {
        "text": "<text for categorisation>"
    }
    ```
    * Response
    ```javascript
    {
        "category": "<category from the model>",
        "embedding": [<array of floats for duplicate detection>]
    }
    ```
* **POST /group**
    * Request body
    ```javascript
    {
        "postEmbedding": [<array of floats for duplicate detection>],
        "otherEmbedding": [
            {
                "id": <integer>,
                "embedding": [<array of floats for duplicate detection>]
            },
            ...
        ]
    }
    ```
    * Response
    ```javascript
    {
        "groupId": <integer>
    }
    ```
