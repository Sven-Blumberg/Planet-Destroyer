PD.Engine = (function() {
    let canvas, ctx;
    let width, height;
    let stars = [];
    let particles = [];
    let projectiles = [];
    let shakeAmount = 0;
    let planetTextureCache = {};
    let frameCount = 0;

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        resize();
        generateStars(600);
        window.addEventListener('resize', resize);
    }

    function resize() {
        const wrapper = canvas.parentElement;
        width = wrapper.clientWidth;
        height = wrapper.clientHeight;
        canvas.width = width;
        canvas.height = height;
        planetTextureCache = {};
    }

    function generateStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 2.5 + 0.3,
                brightness: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
                color: pickStarColor()
            });
        }
    }

    function pickStarColor() {
        const colors = [
            '#ffffff', '#ffffff', '#ffffff', '#ffe8d0',
            '#ffd4a8', '#d0e8ff', '#a8c8ff', '#ffe4e4',
            '#fff8e0', '#e0f0ff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function drawStarfield() {
        ctx.fillStyle = '#000008';
        ctx.fillRect(0, 0, width, height);

        const nebulaGrad = ctx.createRadialGradient(
            width * 0.3, height * 0.4, 0,
            width * 0.3, height * 0.4, width * 0.5
        );
        nebulaGrad.addColorStop(0, 'rgba(30, 10, 60, 0.15)');
        nebulaGrad.addColorStop(0.5, 'rgba(15, 5, 40, 0.08)');
        nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGrad;
        ctx.fillRect(0, 0, width, height);

        const nebulaGrad2 = ctx.createRadialGradient(
            width * 0.75, height * 0.7, 0,
            width * 0.75, height * 0.7, width * 0.4
        );
        nebulaGrad2.addColorStop(0, 'rgba(10, 20, 50, 0.12)');
        nebulaGrad2.addColorStop(0.5, 'rgba(5, 10, 30, 0.06)');
        nebulaGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebulaGrad2;
        ctx.fillRect(0, 0, width, height);

        for (let s of stars) {
            const twinkle = Math.sin(frameCount * s.twinkleSpeed + s.twinkleOffset);
            const alpha = s.brightness * (0.7 + twinkle * 0.3);
            if (alpha < 0.05) continue;

            const sx = s.x * width;
            const sy = s.y * height;

            ctx.globalAlpha = alpha;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
            ctx.fill();

            if (s.size > 1.8) {
                ctx.globalAlpha = alpha * 0.15;
                ctx.beginPath();
                ctx.arc(sx, sy, s.size * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    function generatePlanetTexture(planetData) {
        if (planetTextureCache[planetData.id]) return planetTextureCache[planetData.id];

        const size = planetData.radius * 4;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = size;
        offCanvas.height = size;
        const oc = offCanvas.getContext('2d');
        const cx = size / 2;
        const cy = size / 2;
        const r = planetData.radius * 1.8;

        oc.save();
        oc.beginPath();
        oc.arc(cx, cy, r, 0, Math.PI * 2);
        oc.clip();

        const baseGrad = oc.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
        baseGrad.addColorStop(0, lightenColor(planetData.colors.base, 40));
        baseGrad.addColorStop(0.5, planetData.colors.base);
        baseGrad.addColorStop(1, darkenColor(planetData.colors.base, 60));
        oc.fillStyle = baseGrad;
        oc.fillRect(0, 0, size, size);

        const rng = seedRNG(hashStr(planetData.id));
        const detail = planetData.surfaceDetail;

        if (detail === 'earth' || detail === 'paradise') {
            drawContinents(oc, cx, cy, r, planetData.colors, rng);
        } else if (detail === 'volcanic') {
            drawLavaFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'ice') {
            drawIceFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'gas' || detail === 'storm') {
            drawGasBands(oc, cx, cy, r, planetData.colors, rng);
        } else if (detail === 'crystal') {
            drawCrystalFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'desert') {
            drawDesertFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'ocean') {
            drawOceanFeatures(oc, cx, cy, r, planetData.colors, rng);
        } else if (detail === 'toxic') {
            drawToxicFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'electric') {
            drawElectricFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'dark') {
            drawDarkFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'energy') {
            drawEnergyFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'organic') {
            drawOrganicFeatures(oc, cx, cy, r, planetData.colors, rng);
        } else if (detail === 'machine') {
            drawMachineFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'phantom') {
            drawPhantomFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'star') {
            drawStarFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'void') {
            drawVoidFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'temporal') {
            drawTemporalFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'gold') {
            drawGoldFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'apocalypse') {
            drawApocalypseFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'cosmic') {
            drawCosmicFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'singularity') {
            drawSingularityFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'prismatic') {
            drawPrismaticFeatures(oc, cx, cy, r, rng);
        } else if (detail === 'living') {
            drawLivingFeatures(oc, cx, cy, r, planetData.colors, rng);
        } else {
            drawGenericFeatures(oc, cx, cy, r, planetData.colors, rng);
        }

        oc.restore();

        const shadowGrad = oc.createRadialGradient(cx + r * 0.4, cy + r * 0.2, r * 0.2, cx + r * 0.3, cy + r * 0.1, r * 1.1);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0)');
        shadowGrad.addColorStop(0.6, 'rgba(0,0,0,0.3)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
        oc.beginPath();
        oc.arc(cx, cy, r, 0, Math.PI * 2);
        oc.fillStyle = shadowGrad;
        oc.fill();

        planetTextureCache[planetData.id] = offCanvas;
        return offCanvas;
    }

    function drawContinents(oc, cx, cy, r, colors, rng) {
        for (let i = 0; i < 8; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.7;
            const size = r * (0.2 + rng() * 0.4);
            const px = cx + Math.cos(angle) * dist;
            const py = cy + Math.sin(angle) * dist;

            oc.fillStyle = i % 3 === 0 ? colors.land2 : colors.base;
            oc.beginPath();
            drawBlobShape(oc, px, py, size, rng);
            oc.fill();
        }
        oc.fillStyle = colors.ocean;
        oc.globalAlpha = 0.3;
        for (let i = 0; i < 5; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.6;
            oc.beginPath();
            oc.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, r * (0.15 + rng() * 0.25), 0, Math.PI * 2);
            oc.fill();
        }
        oc.globalAlpha = 1;
        oc.fillStyle = 'rgba(255,255,255,0.12)';
        for (let i = 0; i < 4; i++) {
            const px = cx - r * 0.5 + rng() * r;
            const py = cy - r * 0.3 + rng() * r * 0.6;
            oc.beginPath();
            drawBlobShape(oc, px, py, r * (0.15 + rng() * 0.2), rng);
            oc.fill();
        }
    }

    function drawLavaFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 15; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.8;
            oc.strokeStyle = `rgba(255, ${50 + rng() * 100}, 0, ${0.4 + rng() * 0.4})`;
            oc.lineWidth = 1 + rng() * 3;
            oc.beginPath();
            const sx = cx + Math.cos(angle) * dist;
            const sy = cy + Math.sin(angle) * dist;
            oc.moveTo(sx, sy);
            for (let j = 0; j < 4; j++) {
                oc.lineTo(sx + (rng() - 0.5) * r * 0.4, sy + (rng() - 0.5) * r * 0.4);
            }
            oc.stroke();
        }
        for (let i = 0; i < 8; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.7;
            oc.fillStyle = `rgba(${30 + rng() * 30}, ${10 + rng() * 15}, 5, 0.6)`;
            oc.beginPath();
            oc.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, rng() * r * 0.15, 0, Math.PI * 2);
            oc.fill();
        }
    }

    function drawIceFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 12; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.8;
            oc.strokeStyle = `rgba(200,230,255,${0.2 + rng() * 0.3})`;
            oc.lineWidth = 0.5 + rng() * 2;
            oc.beginPath();
            const sx = cx + Math.cos(angle) * dist;
            const sy = cy + Math.sin(angle) * dist;
            oc.moveTo(sx, sy);
            const len = r * (0.1 + rng() * 0.3);
            const a2 = rng() * Math.PI * 2;
            oc.lineTo(sx + Math.cos(a2) * len, sy + Math.sin(a2) * len);
            oc.stroke();
        }
        oc.fillStyle = 'rgba(220,240,255,0.15)';
        for (let i = 0; i < 6; i++) {
            oc.beginPath();
            const px = cx + (rng() - 0.5) * r * 1.4;
            const py = cy + (rng() - 0.5) * r * 1.4;
            drawBlobShape(oc, px, py, r * (0.1 + rng() * 0.2), rng);
            oc.fill();
        }
    }

    function drawGasBands(oc, cx, cy, r, colors, rng) {
        for (let i = 0; i < 10; i++) {
            const y = cy - r + (i / 10) * r * 2;
            const bandH = r * (0.1 + rng() * 0.15);
            const alpha = 0.15 + rng() * 0.25;
            oc.fillStyle = i % 2 === 0 ?
                `rgba(${hexToR(colors.ocean)},${hexToG(colors.ocean)},${hexToB(colors.ocean)},${alpha})` :
                `rgba(${hexToR(colors.land2)},${hexToG(colors.land2)},${hexToB(colors.land2)},${alpha})`;
            oc.fillRect(cx - r, y + rng() * 10 - 5, r * 2, bandH);
        }
        for (let i = 0; i < 3; i++) {
            const sx = cx + (rng() - 0.5) * r;
            const sy = cy + (rng() - 0.5) * r;
            const sr = r * (0.08 + rng() * 0.15);
            oc.fillStyle = `rgba(255,255,255,${0.08 + rng() * 0.08})`;
            oc.beginPath();
            oc.ellipse(sx, sy, sr * 1.5, sr, rng() * Math.PI, 0, Math.PI * 2);
            oc.fill();
        }
    }

    function drawCrystalFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 20; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.85;
            const px = cx + Math.cos(angle) * dist;
            const py = cy + Math.sin(angle) * dist;
            const size = 3 + rng() * 12;
            oc.fillStyle = `rgba(${100 + rng() * 155},${200 + rng() * 55},255,${0.3 + rng() * 0.5})`;
            oc.beginPath();
            drawDiamond(oc, px, py, size, rng);
            oc.fill();
        }
    }

    function drawDesertFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 8; i++) {
            const y = cy - r * 0.8 + i * r * 0.2;
            oc.fillStyle = `rgba(${160 + rng() * 40},${120 + rng() * 30},${40 + rng() * 20},0.2)`;
            oc.beginPath();
            oc.moveTo(cx - r, y);
            for (let x = -r; x <= r; x += 10) {
                oc.lineTo(cx + x, y + Math.sin(x * 0.05 + rng() * 5) * r * 0.05);
            }
            oc.lineTo(cx + r, y + r * 0.2);
            oc.lineTo(cx - r, y + r * 0.2);
            oc.fill();
        }
    }

    function drawOceanFeatures(oc, cx, cy, r, colors, rng) {
        for (let i = 0; i < 10; i++) {
            const y = cy - r + i * r * 0.2;
            oc.strokeStyle = `rgba(${hexToR(colors.ocean) + 40},${hexToG(colors.ocean) + 40},${hexToB(colors.ocean) + 40},0.2)`;
            oc.lineWidth = 1;
            oc.beginPath();
            oc.moveTo(cx - r, y);
            for (let x = -r; x <= r; x += 8) {
                oc.lineTo(cx + x, y + Math.sin(x * 0.08 + rng() * 10) * 5);
            }
            oc.stroke();
        }
    }

    function drawToxicFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 12; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.7;
            oc.fillStyle = `rgba(${50 + rng() * 100},${150 + rng() * 100},${20 + rng() * 30},${0.2 + rng() * 0.3})`;
            oc.beginPath();
            oc.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 5 + rng() * 15, 0, Math.PI * 2);
            oc.fill();
        }
    }

    function drawElectricFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 8; i++) {
            oc.strokeStyle = `rgba(100,100,255,${0.4 + rng() * 0.4})`;
            oc.lineWidth = 1 + rng() * 2;
            oc.beginPath();
            let px = cx + (rng() - 0.5) * r;
            let py = cy + (rng() - 0.5) * r;
            oc.moveTo(px, py);
            for (let j = 0; j < 5; j++) {
                px += (rng() - 0.5) * r * 0.3;
                py += (rng() - 0.5) * r * 0.3;
                oc.lineTo(px, py);
            }
            oc.stroke();
        }
    }

    function drawDarkFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 10; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.8;
            oc.fillStyle = `rgba(40,40,40,${0.3 + rng() * 0.4})`;
            oc.beginPath();
            oc.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 5 + rng() * 20, 0, Math.PI * 2);
            oc.fill();
        }
    }

    function drawEnergyFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 15; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.6;
            const bright = 180 + rng() * 75;
            oc.fillStyle = `rgba(${bright},${bright},${50 + rng() * 50},${0.3 + rng() * 0.4})`;
            oc.beginPath();
            oc.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 3 + rng() * 10, 0, Math.PI * 2);
            oc.fill();
        }
    }

    function drawOrganicFeatures(oc, cx, cy, r, colors, rng) {
        for (let i = 0; i < 10; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.7;
            oc.fillStyle = `rgba(${hexToR(colors.ocean)},${hexToG(colors.ocean)},${hexToB(colors.ocean)},${0.3 + rng() * 0.3})`;
            oc.beginPath();
            drawBlobShape(oc, cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 5 + rng() * 20, rng);
            oc.fill();
        }
    }

    function drawMachineFeatures(oc, cx, cy, r, rng) {
        oc.strokeStyle = 'rgba(150,150,170,0.25)';
        oc.lineWidth = 1;
        for (let i = 0; i < 12; i++) {
            const x = cx - r + rng() * r * 2;
            const y = cy - r + rng() * r * 2;
            const s = 8 + rng() * 20;
            oc.strokeRect(x, y, s, s);
        }
        for (let i = 0; i < 5; i++) {
            oc.fillStyle = `rgba(200,200,255,${0.15 + rng() * 0.15})`;
            oc.beginPath();
            oc.arc(cx + (rng() - 0.5) * r, cy + (rng() - 0.5) * r, 2 + rng() * 4, 0, Math.PI * 2);
            oc.fill();
        }
    }

    function drawPhantomFeatures(oc, cx, cy, r, rng) {
        oc.globalAlpha = 0.15;
        for (let i = 0; i < 8; i++) {
            const grad = oc.createRadialGradient(
                cx + (rng() - 0.5) * r, cy + (rng() - 0.5) * r, 0,
                cx + (rng() - 0.5) * r, cy + (rng() - 0.5) * r, r * 0.3
            );
            grad.addColorStop(0, 'rgba(100,180,220,0.4)');
            grad.addColorStop(1, 'rgba(100,180,220,0)');
            oc.fillStyle = grad;
            oc.fillRect(0, 0, cx * 2, cy * 2);
        }
        oc.globalAlpha = 1;
    }

    function drawStarFeatures(oc, cx, cy, r, rng) {
        const grad = oc.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, 'rgba(255,255,200,0.6)');
        grad.addColorStop(0.3, 'rgba(255,200,50,0.3)');
        grad.addColorStop(0.7, 'rgba(255,130,0,0.15)');
        grad.addColorStop(1, 'rgba(200,60,0,0.1)');
        oc.fillStyle = grad;
        oc.fillRect(0, 0, cx * 2, cy * 2);

        for (let i = 0; i < 6; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = r * (0.5 + rng() * 0.4);
            oc.fillStyle = `rgba(255,${80 + rng() * 80},0,0.3)`;
            oc.beginPath();
            drawBlobShape(oc, cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, r * 0.1, rng);
            oc.fill();
        }
    }

    function drawVoidFeatures(oc, cx, cy, r, rng) {
        const grad = oc.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, 'rgba(30,20,80,0.4)');
        grad.addColorStop(0.5, 'rgba(10,5,30,0.2)');
        grad.addColorStop(1, 'rgba(0,0,0,0.1)');
        oc.fillStyle = grad;
        oc.fillRect(0, 0, cx * 2, cy * 2);
    }

    function drawTemporalFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 3; i++) {
            oc.strokeStyle = `rgba(200,180,80,${0.15 + rng() * 0.15})`;
            oc.lineWidth = 1;
            oc.beginPath();
            oc.arc(cx, cy, r * (0.3 + i * 0.2), 0, Math.PI * 2);
            oc.stroke();
        }
    }

    function drawGoldFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 12; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.8;
            oc.fillStyle = `rgba(${200 + rng() * 55},${170 + rng() * 50},${rng() * 50},${0.2 + rng() * 0.4})`;
            oc.beginPath();
            drawDiamond(oc, cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 4 + rng() * 8, rng);
            oc.fill();
        }
    }

    function drawApocalypseFeatures(oc, cx, cy, r, rng) {
        for (let i = 0; i < 15; i++) {
            oc.strokeStyle = `rgba(255,${rng() * 80},0,${0.3 + rng() * 0.5})`;
            oc.lineWidth = 1 + rng() * 3;
            oc.beginPath();
            const sx = cx + (rng() - 0.5) * r * 1.6;
            const sy = cy + (rng() - 0.5) * r * 1.6;
            oc.moveTo(sx, sy);
            for (let j = 0; j < 3; j++) {
                oc.lineTo(sx + (rng() - 0.5) * r * 0.5, sy + (rng() - 0.5) * r * 0.5);
            }
            oc.stroke();
        }
    }

    function drawCosmicFeatures(oc, cx, cy, r, rng) {
        const grad = oc.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, 'rgba(150,80,255,0.3)');
        grad.addColorStop(0.5, 'rgba(80,30,180,0.15)');
        grad.addColorStop(1, 'rgba(30,10,80,0.05)');
        oc.fillStyle = grad;
        oc.fillRect(0, 0, cx * 2, cy * 2);
        for (let i = 0; i < 20; i++) {
            oc.fillStyle = `rgba(255,255,255,${0.2 + rng() * 0.5})`;
            oc.beginPath();
            oc.arc(cx + (rng() - 0.5) * r * 1.5, cy + (rng() - 0.5) * r * 1.5, 1 + rng() * 3, 0, Math.PI * 2);
            oc.fill();
        }
    }

    function drawSingularityFeatures(oc, cx, cy, r, rng) {
        const grad = oc.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, 'rgba(255,255,255,0.1)');
        grad.addColorStop(0.3, 'rgba(0,0,0,0.8)');
        grad.addColorStop(1, 'rgba(0,0,0,0.95)');
        oc.fillStyle = grad;
        oc.fillRect(0, 0, cx * 2, cy * 2);
    }

    function drawPrismaticFeatures(oc, cx, cy, r, rng) {
        const hueColors = ['#ff0000','#ff8800','#ffff00','#00ff00','#0088ff','#8800ff','#ff00ff'];
        for (let i = 0; i < 14; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.8;
            oc.fillStyle = hueColors[i % hueColors.length];
            oc.globalAlpha = 0.15 + rng() * 0.2;
            oc.beginPath();
            drawBlobShape(oc, cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, r * (0.1 + rng() * 0.2), rng);
            oc.fill();
        }
        oc.globalAlpha = 1;
    }

    function drawLivingFeatures(oc, cx, cy, r, colors, rng) {
        oc.fillStyle = `rgba(${hexToR(colors.ocean)},${hexToG(colors.ocean)},${hexToB(colors.ocean)},0.3)`;
        for (let i = 0; i < 8; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.6;
            oc.beginPath();
            drawBlobShape(oc, cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 10 + rng() * 25, rng);
            oc.fill();
        }
        oc.fillStyle = 'rgba(200,150,50,0.2)';
        oc.beginPath();
        oc.arc(cx + r * 0.3, cy - r * 0.2, 6, 0, Math.PI * 2);
        oc.fill();
        oc.beginPath();
        oc.arc(cx - r * 0.2, cy - r * 0.1, 5, 0, Math.PI * 2);
        oc.fill();
    }

    function drawGenericFeatures(oc, cx, cy, r, colors, rng) {
        for (let i = 0; i < 6; i++) {
            const angle = rng() * Math.PI * 2;
            const dist = rng() * r * 0.7;
            oc.fillStyle = colors.ocean || colors.land2;
            oc.globalAlpha = 0.2 + rng() * 0.2;
            oc.beginPath();
            oc.arc(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, 5 + rng() * 15, 0, Math.PI * 2);
            oc.fill();
        }
        oc.globalAlpha = 1;
    }

    function drawBlobShape(oc, px, py, size, rng) {
        const points = 8;
        for (let i = 0; i <= points; i++) {
            const a = (i / points) * Math.PI * 2;
            const r = size * (0.7 + rng() * 0.6);
            const x = px + Math.cos(a) * r;
            const y = py + Math.sin(a) * r;
            if (i === 0) oc.moveTo(x, y);
            else oc.lineTo(x, y);
        }
        oc.closePath();
    }

    function drawDiamond(oc, px, py, size, rng) {
        const stretch = 0.5 + rng() * 1;
        oc.moveTo(px, py - size * stretch);
        oc.lineTo(px + size * 0.5, py);
        oc.lineTo(px, py + size * stretch);
        oc.lineTo(px - size * 0.5, py);
        oc.closePath();
    }

    function drawPlanet(planetData, hp, maxHP, shieldActive, shieldHP) {
        const cx = width / 2;
        const cy = height / 2;
        const r = planetData.radius;
        const dmgRatio = hp / maxHP;

        if (planetData.colors.atmosphere) {
            const atmosR = r + 15;
            const atmosGrad = ctx.createRadialGradient(cx, cy, r - 5, cx, cy, atmosR);
            atmosGrad.addColorStop(0, planetData.colors.atmosphere);
            atmosGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = atmosGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, atmosR, 0, Math.PI * 2);
            ctx.fill();
        }

        if (planetData.colors.glow) {
            ctx.shadowColor = planetData.colors.glow;
            ctx.shadowBlur = 30 + Math.sin(frameCount * 0.02) * 10;
        }

        const texture = generatePlanetTexture(planetData);
        const texSize = texture.width;
        ctx.drawImage(texture, cx - texSize / 4, cy - texSize / 4, texSize / 2, texSize / 2);

        ctx.shadowBlur = 0;

        if (planetData.features.includes('rings')) {
            drawRings(cx, cy, r, planetData.colors.glow || '#888888');
        }

        if (dmgRatio < 0.8) {
            drawDamageOverlay(cx, cy, r, dmgRatio);
        }

        if (shieldActive && shieldHP > 0) {
            drawShield(cx, cy, r, shieldHP);
        }
    }

    function drawRings(cx, cy, r, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.8, r * 0.35, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 2.1, r * 0.4, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 2.4, r * 0.45, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    function drawDamageOverlay(cx, cy, r, dmgRatio) {
        const severity = 1 - dmgRatio;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
        ctx.clip();

        if (severity > 0.3) {
            const crackCount = Math.floor(severity * 15);
            for (let i = 0; i < crackCount; i++) {
                const angle = (i / crackCount) * Math.PI * 2 + Math.sin(frameCount * 0.01) * 0.1;
                ctx.strokeStyle = `rgba(255,${100 - severity * 80},0,${severity * 0.6})`;
                ctx.lineWidth = 1 + severity * 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                let px = cx, py = cy;
                for (let j = 0; j < 5; j++) {
                    px += Math.cos(angle + (Math.random() - 0.5) * 0.8) * r * 0.2;
                    py += Math.sin(angle + (Math.random() - 0.5) * 0.8) * r * 0.2;
                    ctx.lineTo(px, py);
                }
                ctx.stroke();
            }
        }

        if (severity > 0.5) {
            ctx.fillStyle = `rgba(255,60,0,${(severity - 0.5) * 0.3})`;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
            ctx.fill();
        }

        if (severity > 0.8) {
            const pulseAlpha = Math.sin(frameCount * 0.1) * 0.15 + 0.15;
            ctx.fillStyle = `rgba(255,255,200,${pulseAlpha})`;
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawShield(cx, cy, r, shieldHP) {
        const shieldR = r + 25;
        const pulse = Math.sin(frameCount * 0.05) * 0.1 + 0.3;
        ctx.save();
        ctx.strokeStyle = `rgba(68,136,255,${pulse + 0.2})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, shieldR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        const shieldGrad = ctx.createRadialGradient(cx, cy, r, cx, cy, shieldR);
        shieldGrad.addColorStop(0, 'rgba(68,136,255,0)');
        shieldGrad.addColorStop(0.7, `rgba(68,136,255,${pulse * 0.3})`);
        shieldGrad.addColorStop(1, `rgba(68,136,255,${pulse * 0.5})`);
        ctx.fillStyle = shieldGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, shieldR, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 6; i++) {
            const hexAngle = (i / 6) * Math.PI * 2 + frameCount * 0.005;
            const hx = cx + Math.cos(hexAngle) * shieldR * 0.85;
            const hy = cy + Math.sin(hexAngle) * shieldR * 0.85;
            ctx.strokeStyle = `rgba(100,180,255,${pulse})`;
            ctx.lineWidth = 1;
            drawHexagon(ctx, hx, hy, 12);
        }
        ctx.restore();
    }

    function drawHexagon(c, x, y, size) {
        c.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const px = x + Math.cos(a) * size;
            const py = y + Math.sin(a) * size;
            if (i === 0) c.moveTo(px, py);
            else c.lineTo(px, py);
        }
        c.closePath();
        c.stroke();
    }

    function addParticle(x, y, opts) {
        particles.push({
            x, y,
            vx: opts.vx || (Math.random() - 0.5) * 4,
            vy: opts.vy || (Math.random() - 0.5) * 4,
            life: opts.life || 60,
            maxLife: opts.life || 60,
            size: opts.size || 3,
            color: opts.color || '#ff4444',
            type: opts.type || 'circle',
            gravity: opts.gravity || 0,
            shrink: opts.shrink !== undefined ? opts.shrink : true
        });
    }

    function createExplosion(x, y, radius, color, count) {
        count = count || 40;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 2 + Math.random() * (radius / 20);
            addParticle(x, y, {
                vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
                vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
                life: 30 + Math.random() * 40,
                size: 2 + Math.random() * 5,
                color: color,
                type: Math.random() > 0.3 ? 'circle' : 'spark'
            });
        }
        shakeAmount = Math.min(radius / 10, 15);
    }

    function createMegaExplosion(x, y) {
        const colors = ['#ff4444', '#ff8800', '#ffcc00', '#ffffff', '#ff2200'];
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 80; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 3 + Math.random() * 8;
                    addParticle(x, y, {
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 40 + Math.random() * 60,
                        size: 2 + Math.random() * 8,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        type: Math.random() > 0.5 ? 'circle' : 'spark'
                    });
                }
            }, wave * 100);
        }
        shakeAmount = 20;
    }

    function addProjectile(from, to, opts) {
        projectiles.push({
            x: from.x, y: from.y,
            tx: to.x, ty: to.y,
            speed: opts.speed || 8,
            color: opts.color || '#ff4444',
            size: opts.size || 4,
            trail: opts.trail !== false,
            onHit: opts.onHit || null,
            explosionRadius: opts.explosionRadius || 40
        });
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life--;
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    function updateProjectiles(planetCX, planetCY, planetR, onHitCallback) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            const dx = p.tx - p.x;
            const dy = p.ty - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < planetR) {
                createExplosion(p.x, p.y, p.explosionRadius, p.color, 30);
                if (PD.Audio) PD.Audio.playExplosion();
                if (onHitCallback) onHitCallback(p);
                if (p.onHit) p.onHit();
                projectiles.splice(i, 1);
                continue;
            }

            const speed = Math.min(p.speed, dist);
            p.x += (dx / dist) * speed;
            p.y += (dy / dist) * speed;

            if (p.trail) {
                addParticle(p.x, p.y, {
                    vx: (Math.random() - 0.5) * 1,
                    vy: (Math.random() - 0.5) * 1,
                    life: 15,
                    size: p.size * 0.6,
                    color: p.color,
                    type: 'circle'
                });
            }
        }
    }

    function drawParticles() {
        for (const p of particles) {
            const alpha = p.life / p.maxLife;
            const size = p.shrink ? p.size * alpha : p.size;
            ctx.globalAlpha = alpha;

            if (p.type === 'spark') {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = Math.max(1, size * 0.5);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
                ctx.stroke();
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.5, size), 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    function drawProjectiles() {
        for (const p of projectiles) {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function drawBeam(from, to, color, beamWidth, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha || 0.8;
        ctx.strokeStyle = color;
        ctx.lineWidth = beamWidth || 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = (beamWidth || 3) * 0.3;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    function drawRocket(rocket) {
        if (!rocket || !rocket.active) return;
        ctx.save();
        ctx.translate(rocket.x, rocket.y);
        ctx.rotate(rocket.angle);

        ctx.fillStyle = '#cccccc';
        ctx.beginPath();
        ctx.moveTo(15, 0);
        ctx.lineTo(-10, -6);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-10, 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.moveTo(-8, -3);
        ctx.lineTo(-15 - Math.random() * 8, 0);
        ctx.lineTo(-8, 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(-8, -1.5);
        ctx.lineTo(-12 - Math.random() * 5, 0);
        ctx.lineTo(-8, 1.5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    function applyScreenShake() {
        if (shakeAmount > 0.5) {
            const sx = (Math.random() - 0.5) * shakeAmount * 2;
            const sy = (Math.random() - 0.5) * shakeAmount * 2;
            ctx.translate(sx, sy);
            shakeAmount *= 0.9;
        } else {
            shakeAmount = 0;
        }
    }

    function drawDebugInfo(fps, particleCount, state) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(5, 5, 200, 80);
        ctx.fillStyle = '#00ff00';
        ctx.font = '12px monospace';
        ctx.fillText(`FPS: ${fps}`, 10, 20);
        ctx.fillText(`Particles: ${particleCount}`, 10, 35);
        ctx.fillText(`Projectiles: ${projectiles.length}`, 10, 50);
        ctx.fillText(`State: ${state}`, 10, 65);
        ctx.fillText(`Canvas: ${width}x${height}`, 10, 80);
    }

    function clearPlanetCache() {
        planetTextureCache = {};
    }

    function tick() {
        frameCount++;
    }

    function getCanvasCenter() {
        return { x: width / 2, y: height / 2 };
    }

    function getCanvasSize() {
        return { width, height };
    }

    function getCtx() { return ctx; }
    function getFrameCount() { return frameCount; }

    function hashStr(s) {
        let h = 0;
        for (let i = 0; i < s.length; i++) {
            h = ((h << 5) - h) + s.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    }

    function seedRNG(seed) {
        let s = seed;
        return function() {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }

    function lightenColor(hex, amount) {
        const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
        const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
        const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
        return `rgb(${r},${g},${b})`;
    }

    function darkenColor(hex, amount) {
        const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
        const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
        const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
        return `rgb(${r},${g},${b})`;
    }

    function hexToR(hex) { return parseInt(hex.slice(1, 3), 16); }
    function hexToG(hex) { return parseInt(hex.slice(3, 5), 16); }
    function hexToB(hex) { return parseInt(hex.slice(5, 7), 16); }

    return {
        init, resize, drawStarfield, drawPlanet, drawParticles, drawProjectiles,
        drawBeam, drawRocket, drawDebugInfo, addParticle, createExplosion,
        createMegaExplosion, addProjectile, updateParticles, updateProjectiles,
        applyScreenShake, clearPlanetCache, tick, getCanvasCenter, getCanvasSize,
        getCtx, getFrameCount, generatePlanetTexture, drawShield
    };
})();
