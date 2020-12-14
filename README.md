# live-recognition
A basic web application that identifies objects through your webcam. My goal is to familiarize myself with Tensorflow's Object Detection API.

## Tech Stacks
This code loads the required libraries from Content Delivery Networks, so you need not install them on your local machine.

## How to run
1. git clone this repository: `git clone https://github.com/sarahdahippo/live-recognition.git`
2. `cd` to the `live-recognition` directory
3. run `python -m http.server`
4. navigate to http://localhost:8000/ in your web browser
5. allow webcam access when prompted
6. there might be some delay time before the model starts detecting objects

### What is Tensorflow.js?
Tensorflow.js is a library for developing Machine Learning models in JavaScript, and use it in Node.js or directly in our browsers. (https://www.tensorflow.org/js) With this, I can utilize pre-existing models and retrain them with my own data.

### What is COCO-SSD?
COCO-SSD (Common Objects in Context-Single Shot Detector) is an object detection model that detects and localizes one or more objects in a picture. (https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) COCO encompasses all the data (images) that trained the model. Currently, there are 80 different classes (https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/src/classes.ts) that the model can detect.