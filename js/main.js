
(function() {
    let lastTime = 0;
    let fps = 0;
    let fpsFrames = 0;
    let fpsTime = 0;
    let lastDestroyedState = false;
    let destroyOverlayShown = false;

    function boot() {
        const canvas = document.getElementById('game-canvas');
        PD.Audio.init();
        PD.Engine.init(canvas);
        PD.Game.init();
        PD.UI.init();
        PD.UI.updatePlanetInfo();
        PD.UI.updateSelectedWeaponInfo();
        document.addEventListener('click', () => PD.Audio.resume(), { once: true });
        requestAnimationFrame(gameLoop);
    }

    function gameLoop(timestamp) {
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;

        fpsFrames++;
        fpsTime += dt;
        if (fpsTime >= 1) {
            fps = fpsFrames;
            fpsFrames = 0;
            fpsTime = 0;
        }

        const state = PD.Game.getState();
        if (!state.gameStarted) {
            renderStartScreen();
            requestAnimationFrame(gameLoop);
            return;
        }

        update(dt);
        render();

        requestAnimationFrame(gameLoop);
    }

    function update(dt) {
        const state = PD.Game.getState();
        PD.Engine.tick();

        if (state.mouseDown && state.selectedWeapon && !state.planetDestroyed) {
            const w = state.selectedWeapon;
            if (w.type === 'continuous' || w.type === 'beam' || w.type === 'sweep' || w.type === 'swarm') {
                PD.Game.fireWeapon(w, state.mouseX, state.mouseY);
            }
        }

        if (state.autoclickerEnabled && !state.planetDestroyed && state.selectedWeapon) {
            state.autoclickerTimer += dt;
            const interval = 1 / state.autoclickerSpeed;
            while (state.autoclickerTimer >= interval) {
                state.autoclickerTimer -= interval;
                const center = PD.Engine.getCanvasCenter();
                const planet = PD.Game.getCurrentPlanet();
                const mx = center.x + (Math.random() - 0.5) * planet.radius;
                const my = center.y + (Math.random() - 0.5) * planet.radius;
                PD.Game.fireWeapon(state.selectedWeapon, mx, my);
            }
        }

        if (state.rocket.active) {
            PD.Game.updateRocket();
            PD.UI.updateRocketUI();
        }

        PD.Game.updateAutoSystems(dt);
        PD.Game.updateSatellites();

        const center = PD.Engine.getCanvasCenter();
        const planet = PD.Game.getCurrentPlanet();
        PD.Engine.updateParticles();
        PD.Engine.updateProjectiles(center.x, center.y, planet.radius * 0.9, (p) => {});

        if (state.planetDestroyed && !destroyOverlayShown) {
            destroyOverlayShown = true;
            setTimeout(() => {
                PD.UI.showDestroyOverlay();
            }, 1500);
        }
        if (!state.planetDestroyed) {
            destroyOverlayShown = false;
        }

        PD.UI.updateHUD();
    }

    function render() {
        const state = PD.Game.getState();
        const planet = PD.Game.getCurrentPlanet();
        const ctx = PD.Engine.getCtx();

        ctx.save();
        PD.Engine.applyScreenShake();
        PD.Engine.drawStarfield();

        if (!state.planetDestroyed) {
            PD.Engine.drawPlanet(
                planet,
                state.planetHP,
                state.planetMaxHP,
                state.planetShieldActive,
                state.planetShieldHP
            );
            PD.Game.drawSatellites();
        }

        if (state.mouseDown && state.selectedWeapon && !state.planetDestroyed) {
            const w = state.selectedWeapon;
            if (w.type === 'continuous' || w.type === 'beam') {
                const center = PD.Engine.getCanvasCenter();
                const canvasSize = PD.Engine.getCanvasSize();
                const mx = state.mouseX;
                const my = state.mouseY;
                const dx = center.x - mx;
                const dy = center.y - my;
                const angle = Math.atan2(dy, dx);
                const dist = Math.max(canvasSize.width, canvasSize.height);
                const fromX = center.x - Math.cos(angle) * dist;
                const fromY = center.y - Math.sin(angle) * dist;
                PD.Engine.drawBeam({ x: fromX, y: fromY }, center, w.color, w.width || 3);
            } else if (w.type === 'sweep') {
                const center = PD.Engine.getCanvasCenter();
                const canvasSize = PD.Engine.getCanvasSize();
                const angle = PD.Engine.getFrameCount() * 0.03;
                const fromX = center.x + Math.cos(angle) * canvasSize.width;
                const fromY = center.y + Math.sin(angle) * canvasSize.height;
                PD.Engine.drawBeam({ x: fromX, y: fromY }, center, w.color, w.width || 10, 0.6);
            }
        }

        PD.Engine.drawProjectiles();
        PD.Engine.drawParticles();

        if (state.rocket.active) {
            PD.Engine.drawRocket(state.rocket);
        }

        if (state.hacks.debugMode) {
            PD.Engine.drawDebugInfo(fps, 0, state.planetDestroyed ? 'DESTROYED' : 'ALIVE');
            const center = PD.Engine.getCanvasCenter();
            ctx.strokeStyle = 'rgba(0,255,0,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(center.x, center.y, planet.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(center.x, center.y, planet.radius * 0.9, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (state.hacks.rainbowMode && !state.planetDestroyed) {
            const center = PD.Engine.getCanvasCenter();
            const hue = (PD.Engine.getFrameCount() * 2) % 360;
            ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.3)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(center.x, center.y, planet.radius + 20 + Math.sin(PD.Engine.getFrameCount() * 0.05) * 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    function renderStartScreen() {
        const canvas = document.getElementById('game-canvas');
        const ctx = PD.Engine.getCtx();
        PD.Engine.tick();
        PD.Engine.drawStarfield();

        const center = PD.Engine.getCanvasCenter();
        const time = PD.Engine.getFrameCount() * 0.01;
        ctx.save();
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur = 30 + Math.sin(time) * 15;
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.arc(center.x, center.y, 60 + Math.sin(time * 2) * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        const innerGrad = ctx.createRadialGradient(center.x - 15, center.y - 15, 0, center.x, center.y, 55);
        innerGrad.addColorStop(0, '#ffcc44');
        innerGrad.addColorStop(0.4, '#ff6600');
        innerGrad.addColorStop(1, '#881100');
        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 55, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 3; i++) {
            const angle = time * 2 + i * 2.1;
            const flareLen = 20 + Math.sin(time * 3 + i) * 10;
            ctx.strokeStyle = `rgba(255, ${150 + i * 30}, 0, 0.4)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(center.x + Math.cos(angle) * 55, center.y + Math.sin(angle) * 55);
            ctx.lineTo(center.x + Math.cos(angle) * (55 + flareLen), center.y + Math.sin(angle) * (55 + flareLen));
            ctx.stroke();
        }
        ctx.restore();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
