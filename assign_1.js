// setup() is called once at page-load
function setup() {
    lastSecond = -1; // To track when a new second ticks over
    createCanvas(800,600); // make an HTML canvas element width x height pixels
    //array of length 36000 (60 seconds, 60 times a second)
    path = [];
              angleMode(DEGREES);
}

// draw() is called 60 times per second
function draw() {
    const now = new Date();
    let hr = now.getHours();
    let mins = now.getMinutes();
    let sec = now.getSeconds();
    let ms = now.getMilliseconds();
    translate(width/2, height/2);
    background(26, 26, 26);
    drawGrid();
    beginShape();
    noFill();
    stroke(100,255,218);
    strokeWeight(2);
            for (let i = 1; i < path.length; i++) {
                const currentPoint = path[i];
                const prevPoint = path[i-1];
                
                // Map the point's index to an opacity value.
                // Old points (low index) will be nearly transparent.
                // New points (high index) will be the most visible.
                const maxOpacity = 50;
                const alpha = map(i, 0, path.length, 0, maxOpacity);
                
                stroke(255, 109, 99, alpha);
                line(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
            }
  endShape();

    const minuteCycle = map(mins + sec/60, 0, 60, 0, 360);
    const swingWidth = abs(sin(minuteCycle * 2));
            const maxAngle = map(swingWidth, 0, 1, 0, 85);     
  
    const totalms = (sec * 1000 + ms) % 2000;
    const swing = map(totalms, 0, 2000, 0, 360);
    const oscillator = cos(swing);
            // 3. The center of the swing is 90 degrees     (vertical).
            // The range of the swing is how far it deviates from the center.
            const swingRange = 90 - maxAngle;
            const displayAngle = 90 + oscillator * swingRange;
              // --- Magnitude Calculation (Based on Minute) ---
            let maxMag= height * 0.5;
            let minMag = height * 0.01;
            let magn = -1 * map(hr + mins/60, 0, 24, minMag, maxMag);
     const endX = magn * cos(displayAngle);
     const endY = magn * sin(displayAngle);
      // rotate(displayAngle);
      stroke(100,255,218);
      strokeWeight(3);
      line(0,0,endX, endY);
                // The tip's absolute position is the canvas center plus the calculated endpoint
                path.push(createVector(endX, endY));
                // Keep the path to roughly the last hour (3600 seconds)
                if (path.length > 3600) {
                    path.shift(); // Remove the oldest point
                }
}

function drawGrid() {
            let spacing = 20;
            stroke(60, 60, 60);
            strokeWeight(1);
            // Draw vertical lines
            for (let x = -width / 2; x < width / 2; x += spacing) {
                line(x, -height / 2, x, height / 2);
            }
            // Draw horizontal lines
            for (let y = -height / 2; y < height / 2; y += spacing) {
                line(-width / 2, y, width / 2, y);
            }
            // Draw thicker center axes
            stroke(90, 90, 90);
            strokeWeight(1.5);
            line(0, -height / 2, 0, height / 2); // Y-axis
            line(-width / 2, 0, width / 2, 0);   // X-axis
        }

