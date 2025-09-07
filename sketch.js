// setup() is called once at page-load
function setup() {
    createCanvas(800,600); // make an HTML canvas element width x height pixels
    //array of length 36000 (60 seconds, 60 times a second)
    path = [];
    angleMode(DEGREES);
}

        function draw() {
            background(26, 26, 26);
            
            // --- Time Calculation ---
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const s = now.getSeconds();
            const ms = now.getMilliseconds();

            // Map the current hour to a hue value for color
            const currentHue = map(h + m/60, 0, 24, 0, 360);
            
            // --- Draw the fading path ---
            noFill();
            strokeWeight(1.5);
            for (let i = 1; i < path.length; i++) {
                const currentPoint = path[i];
                const prevPoint = path[i-1];
                const maxOpacity = 0.2; // Opacity is now 0-1 in HSL mode
                const alpha = map(i, 0, path.length, 0, maxOpacity);
                
                stroke(currentHue, 90, 65, alpha);
                line(prevPoint.x, prevPoint.y, currentPoint.x, currentPoint.y);
            }

            // Translate to the center for the main pendulum and grid
            translate(width / 2, height / 2);
            
            drawGrid();
            
            // --- Max Angle (Minute) & Magnitude (Hour) ---
            const minuteCycle = map(m + s/60, 0, 60, 0, 360);
            const swingWidth = abs(sin(minuteCycle * 2));
            const maxAngle = map(swingWidth, 0, 1, 0, 85);

            let maxMagnitude = width * 0.48;
            let minMagnitude = width * 0.1; 
            let magnitude = map(h + m/60, 0, 23, minMagnitude, maxMagnitude);

            // --- Pendulum Swing (Milliseconds) ---
            const totalMilliseconds = (s * 1000 + ms) % 2000;
            const swingCycle = map(totalMilliseconds, 0, 2000, 0, 360);
            const oscillator = cos(swingCycle);
            const displayAngle = 90 + oscillator * maxAngle;
            console.log(maxAngle);
            
            // --- Drawing Pendulum (Trigonometry) ---
            const endX = magnitude * cos(displayAngle);
            const endY = magnitude * sin(displayAngle);
            
            
            strokeWeight(4);
            strokeCap(ROUND);
            line(0, 0, endX, endY);

            // --- Path Tracing Logic ---
                let tipX = width / 2 + endX;
                let tipY = height / 2 + endY;
                path.push(createVector(tipX, tipY));

                if (path.length > 3600) {
                    path.shift();
                }
          createLegend();
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

function legend() {
  const bar = createElement('div');
              bar.className = 'legend-bar';
            const labels = document.createElement('div');
            labels.className = 'legend-labels';

            for (let i = 0; i < 24; i++) {
                const tick = document.createElement('div');
                tick.className = 'legend-tick';
                const hue = map(i, 0, 24, 0, 360);
                tick.style.backgroundColor = `hsl(${hue}, 90%, 65%)`;
                bar.appendChild(tick);
            }
            
            ['0h', '6h', '12h', '18h', '24h'].forEach(text => {
                const label = document.createElement('span');
                label.textContent = text;
                labels.appendChild(label);
            });

            legendContainer.appendChild(bar);
            legendContainer.appendChild(labels);  

}
