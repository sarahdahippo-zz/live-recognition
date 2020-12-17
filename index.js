class App extends React.Component {
    // create references for webcam feed and canvas
    cam = React.createRef();
    canvas = React.createRef();
    
    state = {
        // 80 detectable classes, but 90 total
        // 0: background; 12,26,29,30,45,66,68,69,71,83: unknown
        classes: ["person", "bicycle", "car", "motorcycle", "airplane",
            "bus", "train", "truck", "boat", "traffic light", "fire hydrant",
            "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse",
            "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
            "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard",
            "sports ball", "kite", "baseball bat", "baseball glove", "skateboard",
            "surfboard", "tennis racket", "bottle", "wine glass", "cup", "fork", "knife",
            "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog",
            "pizza", "donut", "cake", "chair", "couch", "potted plant", "bed", "dining table",
            "toilet", "tv", "laptop", "mouse", "remote", "keyboard", "cell phone",
            "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock",
            "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
        ],
        isVideo: false
    }

    componentDidMount() {
        // request permission to use webcam
        if (navigator.mediaDevices.webkitGetUserMedia
            || navigator.mediaDevices.getUserMedia) {
            var allowWebcam = navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            }).then((stream) => {
                // stream is passed to the cam reference
                window.stream = stream;
                this.cam.current.srcObject = stream;
                this.setState({ isVideo: true });

                return new Promise(resolve => {
                    this.cam.current.onloadedmetadata = () => resolve();
                });
            }, err => { // Promise fails
                console.log("Error loading webcam feed.", err);
            });
        }
        
        var loadModel = cocoSsd.load(); // load COCO-SSD model
        Promise.all([loadModel, allowWebcam])
        // call getWebcam and pass in current video frame and model
        .then(data => this.getWebcam(this.cam.current, data[0]))
        .catch(err => { // Promise fails
            console.log("Error loading webcam feed.", err);
        });
    }

    getWebcam = (vidFrame, model) => {
        // use Promise to give time for model to process
        model.detect(vidFrame).then(result => {
            // Promise succeeds
            this.detectObjects(result); // pass in the model's detections
            
            // update animation onscreen
            requestAnimationFrame(() => {
                this.getWebcam(vidFrame, model);
            });
        }, err => { // Promise fails
            console.log("Error loading webcam feed.", err);
        });
    };

    detectObjects = (detections) => {
        var canvas = document.getElementsByTagName('canvas')[0];
        canvas.width  = 640;
        canvas.height = 480; // same as video
        
        var context = this.canvas.current.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.font = "24px Georgia";

        // iterate through each possible detection
        /* example schema of detections == [
            {
                bbox: [x, y, width, height],
                class: "person",
                score: 0.8233535
            }, ...
        ]*/
        detections.forEach((detection) => {
            var x = detection.bbox[0];
            var y = detection.bbox[1];
            var width = detection.bbox[2];
            var height = detection.bbox[3];

            var score = (detection.score * 100).toFixed(5); // percent, 5dp
            var accuracyColor = "#00E000";
            if (score < 85) accuracyColor = "#FFD700";
            else if (score < 75) accuracyColor = "#FFD700";
            else if (score < 60) accuracyColor = "#FF0000";

            // display box around object
            context.strokeStyle = accuracyColor;
            context.lineWidth = 5;
            context.strokeRect(x, y, width, height);

            // display label
            var label = `${detection.class}: ${score}%`;
            context.fillStyle = accuracyColor; // label's background
            var labelLength = context.measureText(label).width;
            context.fillRect(x, y - 25, labelLength, 25);
            context.fillStyle = "#000000"; // label's text
            context.fillText(label, x, y - 3); // top left hand
        });
    };

    render() {
        const {classes, isVideo} = this.state;
        const elements = [];
        for (let [i, elem] of classes.entries()) {
            elements.push(
                <tr>
                    <td>{i+1}</td>
                    <td>{elem}</td>
                </tr>
            );
        }

        return(
            <div className="root">
                <div className="classes">
                    <table>
                        <tr>
                            <th></th>
                            <th>Detectable Classes</th>
                        </tr>
                        {elements}
                    </table>
                </div>
                <div className="vidFrame">
                    {!isVideo && <p className="loading">Loading...</p>}
                    <video className="video" ref={this.cam} 
                        autoPlay muted/>
                    <canvas className="canvas" ref={this.canvas}
                        />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    React.createElement(App),
    document.querySelector("#main")
);