var CANVAS = document.getElementById("canvas");
var CTX = CANVAS.getContext("2d");
CANVAS.width = 300;
CANVAS.height = 300;
var CANVAS2 = document.getElementById("canvas2");
var CTX2 = CANVAS2.getContext("2d");
CANVAS2.width = 300;
CANVAS2.height = 300;
var DIFF_THRESHOLD = 50;


class Button {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        CTX.fillStyle = "green";
        CTX.fillRect(this.x - 4, this.y - 4, this.w + 8, this.h + 8);
        CTX.fillStyle = "white";
        CTX.textAlign = 'center';
        CTX.font = "12px bold Times"
        CTX.fillText("Hover Over Me", this.x + this.w/2, this.y + this.h/2);
    }

    update() {
        this.draw();
    }
}

var btn = new Button(20, 20, 100, 35);

var video = document.createElement("video");
video.setAttribute("autoplay", true);

const useCamera = function () {
    navigator.mediaDevices.getUserMedia({ video: true }).then((videoStream) => {
        video.srcObject = videoStream;
    });
}
useCamera();

animate();
function animate() {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    CTX2.clearRect(0, 0, CANVAS.width, CANVAS.height);

    handleCtx2();
    
    requestAnimationFrame(animate);
}

function handleCtx2() {
    CTX2.drawImage(video, 0, 0, CANVAS.width, CANVAS.height);
    var IMAGE_DATA = CTX2.getImageData(0, 0, CANVAS.width, CANVAS.height);
    for (var height = 0; height < IMAGE_DATA.height; height++) {
        for (var width = 0; width < IMAGE_DATA.width; width++) {
            var r = IMAGE_DATA.data[(height * IMAGE_DATA.width + width) * 4];
            var g = IMAGE_DATA.data[(height * IMAGE_DATA.width + width) * 4 + 1];
            var b = IMAGE_DATA.data[(height * IMAGE_DATA.width + width) * 4 + 2];
            var a = IMAGE_DATA.data[(height * IMAGE_DATA.width + width) * 4 + 3];

            if (
                !((r > 95
                    && g > 40
                    && b > 20
                    && Math.max(r, g, b) - Math.min(r, g, b) > 15
                    && Math.abs(r - g) > 15
                    && r > g
                    && r > b) ||
                    (r > 220
                        && g > 210
                        && b > 170
                        && Math.abs(r - g) <= 15
                        && r > b
                        && g > b
                    ))
            ) {
                IMAGE_DATA.data[(height * IMAGE_DATA.height + width) * 4 + 3] = 0;
            }
        }
    }
    btn.update();
    CTX.putImageData(IMAGE_DATA, 0, 0);
}

function check(min, max, ex) {
    return ex >= min && ex <= max;
}


function getDifference(aImgData, bImgData) {
    for (var y = 0; y < aImgData.height; y++) {
        for (var x = 0; x < aImgData.width; x++) {
            var aPx = getPixelValue(aImgData.data, x, y);
            var bPx = getPixelValue(bImgData.data, x, y);
            if (euclDistance(aPx, bPx) < DIFF_THRESHOLD) {
                bImgData.data[(y * aImgData.width + x) * 4 + 3] = 0
            }
        }
    }
    return bImgData;
}

function getPixelValue(data, x, y) {
    return [
        data[(y * SIZE + x) * 4 + 0],
        data[(y * SIZE + x) * 4 + 1],
        data[(y * SIZE + x) * 4 + 2],
        data[(y * SIZE + x) * 4 + 3],
    ]
}

function euclDistance(A, B) {
    var dist = 0;
    for (var i = 0; i < A.length; i++) {
        dist += (A[i] - B[i]) * (A[i] - B[i]);
    }
    return Math.sqrt(dist);
}


/*

    R = 80 > 89 > 161 > 197 > 209 > 236
    G = 47 > 51 > 102 > 140 > 163 > 188
    B = 42 > 53 > 94 > 133 > 164 > 180
    A = 150 > 255

*/