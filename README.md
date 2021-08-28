# LURKER : A Social Media Optimizer

With the advent of social media, it has become more important than ever to have a social media presence. 
Social media is a useful tool to keep up with your friends and with what’s going on around the world. 
However, with the increase of popularity of social media, it is easy to drown in a live feed that updates every second. <br/>

We propose a solution to categorise, summarise and group duplicates in one’s feed from accounts on multiple social media platforms. 
Categorisation would help the user choose the topic of interest to explore posts at any given time. 
All the posts under a topic, including images and video, would then be grouped and summarised. 
In this process, duplicate posts will also be detected and displayed together.

## Requirements

- Postgres
- React js
- Node js
- Python

## Setup 

- Installing dependencies
``` bash
npm install --prefix ./backend/ #To load node modules for backe
npm install --prefix ./frontend/ #To load node modules for frontend
pip install -r nlp_server/requirements.txt #To install python requirements
```

- Create a dev.env file in /backend/config/ using the dev.env.sample file.

- Running the server
Installing dependencies
``` bash
npm start --prefix ./backend/ #To start backend on localhost:8080
npm start --prefix ./frontend/ #To start frontend on localhost:3000
cd nlp_server
python3 main.py #To start the python server
```


## Screenshots

![signup_page](https://user-images.githubusercontent.com/42616710/131213832-58e1190b-26f5-4712-bc0d-ce132c1bc2f0.png)

![about_page](https://user-images.githubusercontent.com/42616710/131213825-6ef1716f-3bb0-48df-9e89-836b1ed467df.png)

![category_select](https://user-images.githubusercontent.com/42616710/131213828-35a003b6-b752-48c6-a325-b0cc6ef7de1a.jpeg)

![link_social_media](https://user-images.githubusercontent.com/42616710/131213834-cf1e7c76-37f4-44eb-8caa-e99c5fe9d24c.png)

![category_results](https://user-images.githubusercontent.com/42616710/131213826-72bee98c-b4e1-4b14-b545-b06decc48016.png)

![duplicate_results](https://user-images.githubusercontent.com/42616710/131213829-369d1f93-706b-4b88-b3fb-48a08358c3d3.png)

