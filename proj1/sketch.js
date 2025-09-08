// setup() is called once at page-load
        function setup() {
            createCanvas(windowWidth, windowHeight);
            angleMode(DEGREES);
            colorMode(HSL, 360, 100, 100, 1); // Hue, Saturation, Lightness, Alpha
        }

        function draw() {
            background(20);
            // --- Draw the Legend onto the Canvas ---
            drawLegend();
            
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const s = now.getSeconds();
            const ms = now.getMilliseconds();
          
            const currentHue = map(h + m/60, 0, 24, 0, 360);
            let start_height = height / 3;
            let start_width = width / 2;
            translate(start_width, start_height);            
            drawGrid(h, start_width, start_height);
                      
            
            // --- Max Angle (Minute) & Magnitude (Hour) ---
            let maxAngle;
            // The swing width now operates on a 2-hour cycle
            if (h % 2 === 0) { // On even hours (0, 2, 4...), the swing increases from 0° to 90°
                maxAngle = map(m + s/60, 0, 60, 0, 90);
            } else { // On odd hours (1, 3, 5...), the swing decreases from 90° to 0°
                maxAngle = map(m + s/60, 0, 60, 90, 0);
            }

            let maxMagnitude = min(width - start_width, height - start_height);
            let minMagnitude = min(width - start_width, height - start_height) * 0.1; 
            let magnitude = map(h + m/60, 0, 23, minMagnitude, maxMagnitude);

            // --- Pendulum Swing (Milliseconds) ---
            const totalMilliseconds = (s * 1000 + ms) % 2000;
            const swingCycle = map(totalMilliseconds, 0, 2000, 0, 360);
            const oscillator = cos(swingCycle);
            const displayAngle = 90 + oscillator * maxAngle;
            
            // --- Drawing Pendulum (Trigonometry) ---
            const endX = magnitude * cos(displayAngle);
            const endY = magnitude * sin(displayAngle);
            
            stroke(currentHue, 90, 65); // Set the color for the pendulum
            strokeWeight(4);
            strokeCap(ROUND);
            line(0, 0, endX, endY);
        }
        /** Draws the color legend for the hours directly on the canvas. */
        function drawLegend() {
            // Position and dimensions for the legend
            const legendY = 0.05 * height;
            const legendHeight = 0.02 * height;
            const legendWidth = width * 0.8;
            const legendX = (width - legendWidth) / 2;

            // Draw the color bar ticks
            const tickWidth = legendWidth / 24;
            for (let i = 0; i < 24; i++) {
                const hue = map(i, 0, 24, 0, 360);
                fill(hue, 90, 65);
                noStroke();
                rect(legendX + i * tickWidth, legendY, tickWidth, legendHeight, 2);
            }
            
            // Draw the text labels
            fill(240, 5, 70); // Light gray for text
            noStroke();
            textSize(12);
            textAlign(CENTER, TOP);

            const labelY = legendY + legendHeight + 5;
            const numLabels = 5;
            for (let i = 0; i < numLabels; i++) {
                const textX = legendX + (i / (numLabels - 1)) * legendWidth;
                const hourText = (i * 6) + 'h';
                // Adjust alignment for edge labels for a cleaner look
                if (i === 0) textAlign(LEFT, TOP);
                else if (i === numLabels - 1) textAlign(RIGHT, TOP);
                else textAlign(CENTER, TOP);
                
                text(hourText, textX, labelY);
            }
        }

        /** Draws the axes and angle reference lines. */
        function drawGrid(h, sw, sh) {
            push(); // Isolate styles and transformations for the grid
            // --- Draw Angle Reference Lines & Labels ---
            const lineLength = min(height- sh, width - sw);
            const labelRadius = min(height- sh, width - sw);
            const isEvenHour = h % 2 === 0;
            stroke(240, 5, 25); // Faint gray for lines
            strokeWeight(1);
            fill(240, 5, 50); // Faint gray for text
            textSize(10);
            textAlign(CENTER, CENTER);            
        
            const anglesAndLabels = [
                { angle: 22.5, evenLabel: '15', oddLabel: '45' },
                { angle: 45,   evenLabel: '30', oddLabel: '30' },
                { angle: 67.5, evenLabel: '45', oddLabel: '15' },
            ];

            for (const item of anglesAndLabels) {
                // Draw lines on both sides of the vertical axis
                const rightAngle = 90 + item.angle;
                const leftAngle = 90 - item.angle;
                
                const x2_right = lineLength * cos(rightAngle);
                const y2_right = lineLength * sin(rightAngle);
                line(0, 0, x2_right, y2_right);

                const x2_left = lineLength * cos(leftAngle);
                const y2_left = lineLength * sin(leftAngle);
                line(0, 0, x2_left, y2_left);

                // Choose the correct label based on the hour
                const labelText = isEvenHour ? item.evenLabel : item.oddLabel;

                // Add labels
                const labelX_right = labelRadius * cos(rightAngle);
                const labelY_right = labelRadius * sin(rightAngle);
                text(labelText, labelX_right, labelY_right);

                const labelX_left = labelRadius * cos(leftAngle);
                const labelY_left = labelRadius * sin(leftAngle);
                text(labelText, labelX_left, labelY_left);
            }
            
            textAlign(CENTER, BOTTOM);
            text('Hours', 0, -labelRadius);

            // --- Draw Main Axes ---
            stroke(240, 5, 30); // Slightly brighter gray for axes
            strokeWeight(1.5);
            line(0, 0, 0, height - sh); // Y-axis
            line(-(width - sw), 0, width / 2, 0);   // X-axis
            pop(); // Restore original styles
        }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
