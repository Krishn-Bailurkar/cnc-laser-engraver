// CNC Laser Engraver Machine - Interactive Page Logic

// --- STATE MANAGEMENT ---
const state = {
    workspace: {
        x: 700, // mm
        y: 700, // mm
        z: 50   // mm
    },
    machine: {
        x: 0,
        y: 0,
        laserOn: false,
        laserPower: 0, // 0 - 255
        feedRate: 1500,
        homed: false,
        status: "IDLE", // IDLE, RUNNING, HOMING, ALARM
        buffer: []
    },
    sound: {
        ctx: null,
        osc: null,
        gain: null,
        active: false
    }
};

// --- DATA: PRINTED PARTS DETAILS ---
const partsData = {
    core: {
        name: "Core",
        tag: "structure",
        infill: "70% (Crucial)",
        qty: 1,
        color: "Class B (Accent Color)",
        material: "PETG/PLA (approx. 450g)",
        hardware: ["4x M8x40mm Bolts", "4x M8 Locknuts", "16x 608RS Bearings"],
        desc: "The central carriage block holding the Z-axis assembly and the laser head. Subject to high mechanical loads.",
        draw: (ctx, t) => {
            // Draw a rotating 3D core wireframe
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 1.5;
            const cos = Math.cos(t), sin = Math.sin(t);
            const size = 35;
            const points = [
                {x: -size, y: -size, z: -size}, {x: size, y: -size, z: -size},
                {x: size, y: size, z: -size}, {x: -size, y: size, z: -size},
                {x: -size, y: -size, z: size}, {x: size, y: -size, z: size},
                {x: size, y: size, z: size}, {x: -size, y: size, z: size}
            ];
            const proj = points.map(p => {
                const rx = p.x * cos - p.z * sin;
                const rz = p.x * sin + p.z * cos;
                const ry = p.y * cos - rz * sin;
                const scale = 120 / (120 + ry);
                return { x: rx * scale + 60, y: p.y * scale + 60 };
            });
            const drawLine = (i, j) => {
                ctx.beginPath();
                ctx.moveTo(proj[i].x, proj[i].y);
                ctx.lineTo(proj[j].x, proj[j].y);
                ctx.stroke();
            };
            // Cube edges
            drawLine(0, 1); drawLine(1, 2); drawLine(2, 3); drawLine(3, 0);
            drawLine(4, 5); drawLine(5, 6); drawLine(6, 7); drawLine(7, 4);
            drawLine(0, 4); drawLine(1, 5); drawLine(2, 6); drawLine(3, 7);
            
            // Draw center cylinder bore (Core tube path)
            ctx.beginPath();
            ctx.arc(60, 60, 15 * (120/(120+size*cos)), 0, Math.PI*2);
            ctx.strokeStyle = '#ff0844';
            ctx.stroke();
        }
    },
    cornerBottom: {
        name: "Corner Bottom",
        tag: "structure",
        infill: "45%",
        qty: 2,
        color: "Class B (Black/Secondary)",
        material: "PLA (approx. 220g each)",
        hardware: ["4x M5x30mm Screws", "4x M5 Locknuts"],
        desc: "Main corner anchors screwed down to the table. Holds the outer framework rails rigidly square.",
        draw: (ctx, t) => {
            ctx.strokeStyle = '#4facfe';
            ctx.lineWidth = 1.5;
            const cos = Math.cos(t), sin = Math.sin(t);
            const size = 30;
            ctx.beginPath();
            // Draw a pyramidal base
            for(let a=0; a<Math.PI*2; a+=Math.PI/2) {
                const px1 = Math.cos(a + t) * size + 60;
                const py1 = Math.sin(a + t) * size * 0.5 + 80;
                ctx.moveTo(60, 30);
                ctx.lineTo(px1, py1);
                
                const nextA = a + Math.PI/2;
                const px2 = Math.cos(nextA + t) * size + 60;
                const py2 = Math.sin(nextA + t) * size * 0.5 + 80;
                ctx.moveTo(px1, py1);
                ctx.lineTo(px2, py2);
            }
            ctx.stroke();
        }
    },
    truck: {
        name: "Truck",
        tag: "motion",
        infill: "45%",
        qty: 2,
        color: "Class A (Primary/Cyan)",
        material: "PLA (approx. 150g each)",
        hardware: ["5x M8x40mm Bolts", "5x M8 Locknuts", "10x 608RS Bearings"],
        desc: "Linear carriage blocks riding along X and Y outer rails. Connects pulleys to gantry tubes.",
        draw: (ctx, t) => {
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 1.5;
            const cos = Math.cos(t), sin = Math.sin(t);
            ctx.beginPath();
            // Draw a rolling block with dynamic circles for bearings
            const cx = 60 + Math.sin(t * 2) * 15;
            ctx.rect(cx - 20, 45, 40, 30);
            ctx.arc(cx - 10, 85, 6, 0, Math.PI*2);
            ctx.arc(cx + 10, 85, 6, 0, Math.PI*2);
            ctx.stroke();
        }
    },
    feet: {
        name: "Feet",
        tag: "structure",
        infill: "45%",
        qty: 4,
        color: "Class A (Primary/Cyan)",
        material: "PLA (approx. 90g each)",
        hardware: ["Screws for table mounting"],
        desc: "Anchors the entire metal frame to your workbench base plate.",
        draw: (ctx, t) => {
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 1.5;
            const cos = Math.cos(t);
            ctx.beginPath();
            ctx.moveTo(35, 90);
            ctx.lineTo(85, 90);
            ctx.lineTo(75, 40);
            ctx.lineTo(45, 40);
            ctx.closePath();
            ctx.stroke();
        }
    },
    wireDarryl: {
        name: "Wire Darryl (Pulley Spacer)",
        tag: "tool",
        infill: "45%",
        qty: 2,
        color: "Class A (Primary/Cyan)",
        material: "PLA (approx. 10g)",
        hardware: ["None"],
        desc: "Handy spacer block used to set the precise pulley height on the motor shafts during assembly.",
        draw: (ctx, t) => {
            ctx.strokeStyle = '#00e676';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            // Simple flat shape with holes
            ctx.roundRect(40, 50, 40, 20, 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(50, 60, 4, 0, Math.PI*2);
            ctx.arc(70, 60, 4, 0, Math.PI*2);
            ctx.stroke();
        }
    },
    nutTrap: {
        name: "Nut Trap",
        tag: "motion",
        infill: "45%",
        qty: 1,
        color: "Class B (Accent Color)",
        material: "PLA/PETG (approx. 40g)",
        hardware: ["1x T8 Leadscrew Copper Nut"],
        desc: "Traps the copper leadscrew nut to convert Z-motor rotation into vertical translation.",
        draw: (ctx, t) => {
            ctx.strokeStyle = '#ff0844';
            ctx.lineWidth = 1.5;
            const size = 20;
            ctx.beginPath();
            ctx.arc(60, 60, size, 0, Math.PI*2);
            ctx.rect(60 - size/2, 60 - size/2, size, size);
            ctx.stroke();
        }
    }
};

// --- INITIALIZE SOUND SYNTHESIZER ---
function initSynth() {
    if (state.sound.ctx) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.sound.ctx = new AudioContext();
        
        state.sound.osc = state.sound.ctx.createOscillator();
        state.sound.gain = state.sound.ctx.createGain();
        
        state.sound.osc.type = "sawtooth";
        state.sound.osc.frequency.setValueAtTime(80, state.sound.ctx.currentTime);
        
        // Lowpass filter for electric hum
        const filter = state.sound.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, state.sound.ctx.currentTime);
        
        state.sound.osc.connect(filter);
        filter.connect(state.sound.gain);
        state.sound.gain.connect(state.sound.ctx.destination);
        
        state.sound.gain.gain.setValueAtTime(0, state.sound.ctx.currentTime);
        state.sound.osc.start();
        state.sound.active = true;
    } catch (e) {
        console.error("Audio Context failed to initialize", e);
    }
}

function updateSynth(power, speedRatio) {
    if (!state.sound.active || !state.sound.ctx) return;
    
    // Safety check to resume AudioContext (browsers suspend it initially)
    if (state.sound.ctx.state === "suspended") {
        state.sound.ctx.resume();
    }
    
    const time = state.sound.ctx.currentTime;
    
    if (power > 0) {
        // High buzzing laser frequency
        const freq = 440 + power * 1.5 + (speedRatio * 150);
        state.sound.osc.frequency.setTargetAtTime(freq, time, 0.05);
        state.sound.gain.gain.setTargetAtTime(0.04 + (power/255)*0.08, time, 0.05);
    } else {
        // Lower stepper motor moving hum
        if (speedRatio > 0.05) {
            const freq = 120 + speedRatio * 80;
            state.sound.osc.frequency.setTargetAtTime(freq, time, 0.05);
            state.sound.gain.gain.setTargetAtTime(0.02, time, 0.05);
        } else {
            // Idle hum
            state.sound.gain.gain.setTargetAtTime(0.0, time, 0.1);
        }
    }
}

function stopSynth() {
    if (state.sound.gain && state.sound.ctx) {
        state.sound.gain.gain.setTargetAtTime(0, state.sound.ctx.currentTime, 0.1);
    }
}

// --- CORE CALCULATION ENGINE ---
function runCalculations() {
    const W_X = state.workspace.x;
    const W_Y = state.workspace.y;
    const W_Z = state.workspace.z;

    // Table Dimensions
    const tableX = W_X + 270;
    const tableY = W_Y + 279;

    // Tube Lengths
    const tubeOuterX = W_X + 304;
    const tubeGantryX = W_X + 249;
    const tubeOuterY = W_Y + 313;
    const tubeGantryY = W_Y + 258;
    const tubeZ = W_Z + 290;
    const tubeLegs = 129;
    
    const totalTubeLength = (tubeOuterX * 2) + tubeGantryX + (tubeOuterY * 2) + tubeGantryY + (tubeZ * 2) + (tubeLegs * 4);

    // Lead Screw & Belts
    const leadscrew = W_Z + 150;
    const beltX = (W_X * 2) + 354;
    const beltY = (W_Y * 2) + 363;
    const totalBelts = (beltX * 2) + (beltY * 2);

    // Estimate Cost (approximated from capstone breakdown)
    const baseCost = 28000; // base electronics & laser
    const tubeCost = (totalTubeLength / 1000) * 350; // Rs 350 per meter
    const filamentCost = 2 * 800; // 2kg filament
    const estimatedCost = Math.round(baseCost + tubeCost + filamentCost);

    // Update DOM
    document.getElementById('tableSizeX').innerText = tableX;
    document.getElementById('tableSizeY').innerText = tableY;
    
    document.getElementById('outerXLen').innerText = tubeOuterX;
    document.getElementById('gantryXLen').innerText = tubeGantryX;
    document.getElementById('outerYLen').innerText = tubeOuterY;
    document.getElementById('gantryYLen').innerText = tubeGantryY;
    document.getElementById('zRailsLen').innerText = tubeZ;
    document.getElementById('legsLen').innerText = tubeLegs;
    
    document.getElementById('leadscrewLen').innerText = leadscrew;
    document.getElementById('beltXLen').innerText = Math.round(beltX);
    document.getElementById('beltYLen').innerText = Math.round(beltY);
    
    // Summary Blocks
    document.getElementById('summaryTotalTube').innerText = (totalTubeLength / 1000).toFixed(2) + " m";
    document.getElementById('summaryTotalBelts').innerText = (totalBelts / 1000).toFixed(2) + " m";
    document.getElementById('summaryEstimatedCost').innerText = "₹" + estimatedCost.toLocaleString('en-IN');
}

// --- PART CAROUSEL RENDERING ---
function setupPartsVisuals() {
    const canvases = document.querySelectorAll('.part-view-box canvas');
    let angle = 0;

    function renderLoop() {
        angle += 0.015;
        canvases.forEach(canvas => {
            const partId = canvas.dataset.part;
            const part = partsData[partId];
            if (!part) return;

            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            
            // Adjust canvas size for high-DPI displays
            if (canvas.width !== canvas.clientWidth * dpr || canvas.height !== canvas.clientHeight * dpr) {
                canvas.width = canvas.clientWidth * dpr;
                canvas.height = canvas.clientHeight * dpr;
                ctx.scale(dpr * (canvas.clientWidth / 120), dpr * (canvas.clientHeight / 120));
            }

            ctx.clearRect(0, 0, 120, 120);
            part.draw(ctx, angle);
        });
        requestAnimationFrame(renderLoop);
    }
    renderLoop();
}

// --- G-CODE SIMULATOR & CANVAS DRAW ---
const SimCanvas = {
    el: null,
    ctx: null,
    gcodeLines: [],
    currentLineIndex: 0,
    drawHistory: [], // elements: {x1, y1, x2, y2, power}
    lastX: 0,
    lastY: 0,
    laserIntensity: 0,
    speed: 1500,

    init() {
        this.el = document.getElementById('laserCanvas');
        this.ctx = this.el.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.drawGrid();
        this.animate();
    },

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const size = this.el.parentElement.clientWidth;
        this.el.width = size * dpr;
        this.el.height = size * dpr;
        this.ctx.scale(dpr * (size / 700), dpr * (size / 700));
        this.drawGrid();
    },

    drawGrid() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, 700, 700);
        
        // Dark grid bed
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 700; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0); ctx.lineTo(i, 700);
            ctx.moveTo(0, i); ctx.lineTo(700, i);
            ctx.stroke();
        }
        
        // 100mm main grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= 700; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i, 0); ctx.lineTo(i, 700);
            ctx.moveTo(0, i); ctx.lineTo(700, i);
            ctx.stroke();
            
            // Grid texts
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.font = '12px monospace';
            ctx.fillText(i, i + 5, 690);
            ctx.fillText(700 - i, 10, i - 5);
        }

        // Draw static history
        this.drawHistory.forEach(line => {
            ctx.strokeStyle = `rgba(255, 8, 68, ${0.1 + (line.power / 255) * 0.8})`;
            ctx.lineWidth = 1.5 + (line.power / 255) * 1.5;
            ctx.beginPath();
            ctx.moveTo(line.x1, 700 - line.y1);
            ctx.lineTo(line.x2, 700 - line.y2);
            ctx.stroke();
        });
    },

    animate() {
        if (state.machine.status === "RUNNING" && state.machine.buffer.length > 0) {
            const nextCmd = state.machine.buffer[0];
            
            // Lerp moving simulation
            let dx = nextCmd.x - state.machine.x;
            let dy = nextCmd.y - state.machine.y;
            let dist = Math.hypot(dx, dy);
            
            // Moving speed simulation steps
            let step = (state.machine.feedRate / 60) * 0.5; // step length per frame
            
            if (dist <= step) {
                // Arrived at target
                const x1 = state.machine.x;
                const y1 = state.machine.y;
                const x2 = nextCmd.x;
                const y2 = nextCmd.y;
                
                state.machine.x = x2;
                state.machine.y = y2;
                state.machine.laserOn = nextCmd.laserOn;
                state.machine.laserPower = nextCmd.power;

                if (nextCmd.laserOn) {
                    this.drawHistory.push({ x1, y1, x2, y2, power: nextCmd.power });
                }
                
                state.machine.buffer.shift();
                
                // Add console line for debugging
                addTerminalLine(`X${x2.toFixed(1)} Y${y2.toFixed(1)} P${nextCmd.power}`, "output");
                
                if (state.machine.buffer.length === 0) {
                    state.machine.status = "IDLE";
                    stopSynth();
                    addTerminalLine("G-Code Execution Completed.", "success");
                }
            } else {
                // Moving towards target
                const x1 = state.machine.x;
                const y1 = state.machine.y;
                const x2 = x1 + (dx / dist) * step;
                const y2 = y1 + (dy / dist) * step;
                
                state.machine.x = x2;
                state.machine.y = y2;
                
                if (nextCmd.laserOn) {
                    this.drawHistory.push({ x1, y1, x2, y2, power: nextCmd.power });
                }
                
                // Active audio synth
                updateSynth(nextCmd.laserOn ? nextCmd.power : 0, step / 10);
            }
            
            // Update Canvas
            this.drawGrid();
            
            // Draw crosshair/laser dot
            this.ctx.beginPath();
            this.ctx.arc(state.machine.x, 700 - state.machine.y, 4, 0, Math.PI*2);
            this.ctx.fillStyle = state.machine.laserOn ? `rgba(255, 8, 68, 0.9)` : '#00f2fe';
            this.ctx.fill();
            if (state.machine.laserOn) {
                // Laser glow dot
                this.ctx.beginPath();
                this.ctx.arc(state.machine.x, 700 - state.machine.y, 12, 0, Math.PI*2);
                this.ctx.fillStyle = `rgba(255, 8, 68, 0.4)`;
                this.ctx.fill();
            }

            // Update UI HUD
            document.getElementById('hudX').innerText = state.machine.x.toFixed(1);
            document.getElementById('hudY').innerText = state.machine.y.toFixed(1);
            document.getElementById('hudLaser').innerText = state.machine.laserOn ? `ON (${state.machine.laserPower})` : "OFF";
            document.getElementById('hudStatus').innerText = state.machine.status;
            
            // Adjust visual crosshair dot
            const ch = document.getElementById('canvasCrosshair');
            const box = this.el.getBoundingClientRect();
            ch.style.left = `${(state.machine.x / 700) * box.width}px`;
            ch.style.top = `${((700 - state.machine.y) / 700) * box.height}px`;
        }
        
        requestAnimationFrame(() => this.animate());
    },

    clearBed() {
        this.drawHistory = [];
        this.drawGrid();
        addTerminalLine("Canvas cleared.", "output");
    },

    parseAndRunGcode(text) {
        initSynth();
        const lines = text.split('\n');
        let currentPower = state.machine.laserPower;
        let isLaserOn = state.machine.laserOn;
        let curX = state.machine.x;
        let curY = state.machine.y;
        
        state.machine.status = "RUNNING";
        
        lines.forEach(line => {
            line = line.trim().toUpperCase();
            if (!line || line.startsWith(';')) return;
            
            const parts = line.split(/\s+/);
            const cmd = parts[0];
            
            let targetX = curX;
            let targetY = curY;
            
            parts.forEach(p => {
                if (p.startsWith('X')) targetX = parseFloat(p.substring(1));
                if (p.startsWith('Y')) targetY = parseFloat(p.substring(1));
                if (p.startsWith('S')) currentPower = parseInt(p.substring(1));
                if (p.startsWith('F')) state.machine.feedRate = parseFloat(p.substring(1));
            });

            if (cmd === 'G0' || cmd === 'G00') {
                isLaserOn = false;
                state.machine.buffer.push({ x: targetX, y: targetY, laserOn: false, power: 0 });
                curX = targetX; curY = targetY;
            } else if (cmd === 'G1' || cmd === 'G01') {
                isLaserOn = currentPower > 0;
                state.machine.buffer.push({ x: targetX, y: targetY, laserOn: isLaserOn, power: currentPower });
                curX = targetX; curY = targetY;
            } else if (cmd === 'M3') {
                isLaserOn = true;
                if (parts.length > 1 && parts[1].startsWith('S')) {
                    currentPower = parseInt(parts[1].substring(1));
                }
            } else if (cmd === 'M5') {
                isLaserOn = false;
                currentPower = 0;
            } else if (cmd === 'G28' || cmd === '$H') {
                state.machine.buffer.push({ x: 0, y: 0, laserOn: false, power: 0 });
                curX = 0; curY = 0;
            }
        });
    }
};

// --- TERMINAL LOGGER ---
function addTerminalLine(text, type = "input") {
    const term = document.getElementById('terminalLog');
    const line = document.createElement('div');
    line.className = `terminal-line line-${type}`;
    line.innerHTML = `<span>&gt;</span><span>${text}</span>`;
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
}

// --- INTERACTIVE PRESET BUILDERS ---
function loadPreset(presetName) {
    let gcode = "";
    SimCanvas.clearBed();

    if (presetName === 'circle') {
        gcode = "G0 X350 Y350\nM3 S255 F1200\n";
        const cx = 350, cy = 350, r = 120;
        for (let i = 0; i <= 360; i += 10) {
            const rad = (i * Math.PI) / 180;
            const x = cx + Math.cos(rad) * r;
            const y = cy + Math.sin(rad) * r;
            gcode += `G1 X${x.toFixed(1)} Y${y.toFixed(1)}\n`;
        }
        gcode += "M5\nG0 X0 Y0";
        addTerminalLine("Preset loaded: Circle Engraving Pattern", "success");
    } else if (presetName === 'star') {
        gcode = "G0 X350 Y480\nM3 S200 F1500\n";
        // Calculate points of 5 point star
        const cx = 350, cy = 350, r = 130;
        const pts = [];
        for (let i = 0; i < 5; i++) {
            const angle1 = (i * 4 * Math.PI) / 5 - Math.PI/2;
            const x = cx + Math.cos(angle1) * r;
            const y = cy + Math.sin(angle1) * r;
            pts.push({ x, y });
        }
        // Connect points
        gcode += `G1 X${pts[2].x.toFixed(1)} Y${pts[2].y.toFixed(1)}\n`;
        gcode += `G1 X${pts[4].x.toFixed(1)} Y${pts[4].y.toFixed(1)}\n`;
        gcode += `G1 X${pts[1].x.toFixed(1)} Y${pts[1].y.toFixed(1)}\n`;
        gcode += `G1 X${pts[3].x.toFixed(1)} Y${pts[3].y.toFixed(1)}\n`;
        gcode += `G1 X${pts[0].x.toFixed(1)} Y${pts[0].y.toFixed(1)}\n`;
        gcode += "M5\nG0 X0 Y0";
        addTerminalLine("Preset loaded: 5-Point Star", "success");
    } else if (presetName === 'ducati') {
        // Ducati Shield schematic shape from Page 51 G-Code preview!
        gcode = `G0 X350 Y500
M3 S255 F1600
G1 X230 Y450
G1 X230 Y270
G1 X350 Y180
G1 X470 Y270
G1 X470 Y450
G1 X350 Y500
M5
G0 X280 Y380
M3 S180
G1 X420 Y380
M5
G0 X0 Y0`;
        addTerminalLine("Preset loaded: Ducati Mechatronics Shield Outline", "success");
    } else if (presetName === 'grid') {
        gcode = "G0 X200 Y200\n";
        for (let y = 200; y <= 500; y += 40) {
            gcode += `M3 S220 F2000\nG1 X500 Y${y}\nM5\n`;
            if (y < 500) {
                gcode += `G0 X200 Y${y + 40}\n`;
            }
        }
        gcode += "G0 X0 Y0";
        addTerminalLine("Preset loaded: Grid Hatch Lines", "success");
    }

    document.getElementById('gcodeInput').value = gcode;
}

// --- MODAL UTILITIES ---
function openPartModal(partId) {
    const part = partsData[partId];
    if (!part) return;

    document.getElementById('modalPartName').innerText = part.name;
    document.getElementById('modalDesc').innerText = part.desc;
    document.getElementById('modalInfill').innerText = part.infill;
    document.getElementById('modalQty').innerText = part.qty;
    document.getElementById('modalColor').innerText = part.color;
    document.getElementById('modalMaterial').innerText = part.material;

    // Hardware list
    const hwList = document.getElementById('modalHardware');
    hwList.innerHTML = "";
    part.hardware.forEach(hw => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${hw}</span>`;
        hwList.appendChild(li);
    });

    // Setup rotating render canvas in modal
    const canvas = document.getElementById('modalPartCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    let angle = 0;
    if (window.modalInterval) clearInterval(window.modalInterval);
    
    window.modalInterval = setInterval(() => {
        angle += 0.02;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // High quality scale render
        ctx.save();
        ctx.translate(canvas.width / 2 - 60, canvas.height / 2 - 60);
        part.draw(ctx, angle);
        ctx.restore();
    }, 30);

    document.getElementById('partModal').classList.add('open');
}

function closePartModal() {
    document.getElementById('partModal').classList.remove('open');
    if (window.modalInterval) clearInterval(window.modalInterval);
}

// --- TAB SWITCHER ASSEMBLY ASSISTANT ---
function switchAssemblyStep(stepIndex) {
    document.querySelectorAll('.assembly-nav-item').forEach((item, idx) => {
        if (idx === stepIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    document.querySelectorAll('.assembly-pane').forEach((pane, idx) => {
        if (idx === stepIndex) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

// --- EVENT BINDINGS & SETUP ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Hook Calculators Sliders
    const bindSlider = (id, stateKey) => {
        const slider = document.getElementById(id);
        const valBox = document.getElementById(id + 'Val');
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            valBox.value = val;
            state.workspace[stateKey] = val;
            runCalculations();
        });
        valBox.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            if (isNaN(val)) val = min;
            if (val < min) val = min;
            if (val > max) val = max;
            slider.value = val;
            valBox.value = val;
            state.workspace[stateKey] = val;
            runCalculations();
        });
    };
    bindSlider('slideX', 'x');
    bindSlider('slideY', 'y');
    bindSlider('slideZ', 'z');

    // 2. Load presets binding
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.preset;
            loadPreset(type);
        });
    });

    // 3. G-code Run Trigger
    document.getElementById('btnRunGcode').addEventListener('click', () => {
        const text = document.getElementById('gcodeInput').value;
        if (!text.trim()) {
            addTerminalLine("Error: No G-code input found.", "error");
            return;
        }
        addTerminalLine("Executing G-Code Stream...", "input");
        SimCanvas.parseAndRunGcode(text);
    });

    document.getElementById('btnClearCanvas').addEventListener('click', () => {
        SimCanvas.clearBed();
    });

    // 4. Modal Bindings
    document.querySelectorAll('.part-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const partId = e.currentTarget.dataset.partId;
            openPartModal(partId);
        });
    });
    document.getElementById('closeModal').addEventListener('click', closePartModal);
    document.getElementById('partModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('partModal')) closePartModal();
    });

    // 5. Assembly Tabs Bindings
    document.querySelectorAll('.assembly-nav-item').forEach((item, idx) => {
        item.addEventListener('click', () => {
            switchAssemblyStep(idx);
        });
    });

    // 6. Navigation Scroll
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active-nav'));
            e.currentTarget.classList.add('active-nav');
            const targetId = e.currentTarget.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- EXECUTE INITIALIZERS ---
    runCalculations();
    setupPartsVisuals();
    SimCanvas.init();
    loadPreset('ducati'); // Default load
});
