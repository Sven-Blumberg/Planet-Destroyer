PD.Game = (function() {
    let state = {
        level: 1,
        score: 0,
        credits: 500,
        xp: 0,
        xpToNext: 100,
        totalDestroyed: 0,

        currentPlanetIndex: 0,
        planetHP: 0,
        planetMaxHP: 0,
        planetShieldHP: 0,
        planetShieldActive: false,
        planetInvincible: false,
        planetArmorReduction: 0,
        planetDestroyed: false,

        selectedWeapon: null,
        selectedCategory: 'destroyer',
        unlockedWeapons: new Set(),
        weaponCooldowns: {},

        rocketActive: false,
        rocket: { x: 0, y: 0, angle: 0, vx: 0, vy: 0, speed: 5, active: false },
        rocketKeys: { w: false, a: false, s: false, d: false, space: false },

        mouseDown: false,
        mouseX: 0,
        mouseY: 0,

        autoclickerEnabled: false,
        autoclickerSpeed: 5,
        autoclickerTimer: 0,

        autoSystems: {
            autoRepair: false,
            autoShield: false,
            chain: false,
            harvest: false,
            autoAttack: false,
            autoNuke: false
        },
        autoTimers: {},

        hacks: {
            oneHit: false,
            godMode: false,
            infiniteAmmo: false,
            noCooldown: false,
            debugMode: false,
            autoDestroy: false,
            megaExplosions: false,
            rainbowMode: false
        },
        dmgMultiplier: 1,
        speedMultiplier: 1,
        healMultiplier: 1,

        satellites: [],
        gameStarted: false,
        paused: false
    };

    function init() {
        state.unlockedWeapons.add('laser');
        selectWeapon('destroyer', 'laser');
        loadPlanet(0);
    }

    function loadPlanet(index) {
        if (index < 0 || index >= PD.PLANETS.length) return;
        state.currentPlanetIndex = index;
        const p = PD.PLANETS[index];
        state.planetHP = p.maxHP;
        state.planetMaxHP = p.maxHP;
        state.planetDestroyed = false;
        state.planetShieldHP = 0;
        state.planetShieldActive = false;
        state.planetInvincible = false;
        state.planetArmorReduction = 0;
        state.satellites = [];
        state.rocketActive = false;
        state.rocket.active = false;
        PD.Engine.clearPlanetCache();
    }

    function getCurrentPlanet() {
        return PD.PLANETS[state.currentPlanetIndex];
    }

    function selectWeapon(category, weaponId) {
        state.selectedCategory = category;
        const weapons = PD.WEAPONS[category];
        if (!weapons) return;
        const weapon = weapons.find(w => w.id === weaponId);
        if (!weapon) return;
        state.selectedWeapon = weapon;

        if (weapon.type === 'rocket') {
            state.rocketActive = true;
        } else {
            state.rocketActive = false;
            state.rocket.active = false;
        }
    }

    function isWeaponUnlocked(weaponId) {
        return state.unlockedWeapons.has(weaponId) || state.hacks.infiniteAmmo;
    }

    function unlockWeapon(weaponId) {
        state.unlockedWeapons.add(weaponId);
    }

    function unlockWeaponsForLevel(level) {
        const newUnlocks = [];
        for (const cat of Object.keys(PD.WEAPONS)) {
            for (const w of PD.WEAPONS[cat]) {
                if (w.unlockLevel <= level && !state.unlockedWeapons.has(w.id)) {
                    state.unlockedWeapons.add(w.id);
                    newUnlocks.push(w);
                }
            }
        }
        return newUnlocks;
    }

    function unlockAllWeapons() {
        for (const cat of Object.keys(PD.WEAPONS)) {
            for (const w of PD.WEAPONS[cat]) {
                state.unlockedWeapons.add(w.id);
            }
        }
    }

    function canUseWeapon(weapon) {
        if (!weapon) return false;
        if (!isWeaponUnlocked(weapon.id)) return false;
        if (state.hacks.noCooldown) return true;
        const cd = state.weaponCooldowns[weapon.id];
        if (cd && cd > Date.now()) return false;
        return true;
    }

    function setWeaponCooldown(weapon) {
        if (state.hacks.noCooldown) return;
        if (weapon.cooldown) {
            state.weaponCooldowns[weapon.id] = Date.now() + weapon.cooldown * 1000;
        }
    }

    function applyDamage(baseDmg) {
        if (state.planetDestroyed) return 0;
        if (state.hacks.godMode) return 0;

        let dmg = baseDmg * state.dmgMultiplier;
        if (state.hacks.oneHit) dmg = state.planetMaxHP * 2;

        if (state.planetInvincible) {
            dmg = 0;
        }

        if (state.planetShieldActive && state.planetShieldHP > 0) {
            const shieldAbsorb = Math.min(dmg, state.planetShieldHP);
            state.planetShieldHP -= shieldAbsorb;
            dmg -= shieldAbsorb;
            if (state.planetShieldHP <= 0) {
                state.planetShieldActive = false;
            }
        }

        if (state.planetArmorReduction > 0) {
            dmg *= (1 - state.planetArmorReduction);
        }

        dmg = Math.max(0, dmg);
        state.planetHP = Math.max(0, state.planetHP - dmg);

        if (state.planetHP <= 0 && !state.planetDestroyed) {
            destroyPlanet();
        }

        return dmg;
    }

    function applyHeal(baseHeal) {
        if (state.planetDestroyed) return 0;
        let heal = baseHeal * state.healMultiplier;
        const before = state.planetHP;
        state.planetHP = Math.min(state.planetMaxHP, state.planetHP + heal);
        return state.planetHP - before;
    }

    function destroyPlanet() {
        state.planetDestroyed = true;
        state.totalDestroyed++;
        const planet = getCurrentPlanet();
        const reward = planet.reward;

        state.credits += reward.credits;
        state.xp += reward.xp;
        state.score += reward.credits * 2;

        const center = PD.Engine.getCanvasCenter();
        PD.Audio.playBigExplosion();
        if (state.hacks.megaExplosions) {
            PD.Engine.createMegaExplosion(center.x, center.y);
            setTimeout(() => PD.Engine.createMegaExplosion(center.x, center.y), 200);
            setTimeout(() => PD.Engine.createMegaExplosion(center.x, center.y), 400);
        } else {
            PD.Engine.createMegaExplosion(center.x, center.y);
        }

        checkLevelUp();
    }

    function checkLevelUp() {
        while (state.xp >= state.xpToNext) {
            state.xp -= state.xpToNext;
            state.level++;
            state.xpToNext = state.level * 100 + Math.floor(state.level * state.level * 10);
            unlockWeaponsForLevel(state.level);
        }
    }

    function nextPlanet() {
        const nextIdx = state.currentPlanetIndex + 1;
        if (nextIdx < PD.PLANETS.length) {
            loadPlanet(nextIdx);
            return true;
        }
        return false;
    }

    function resetPlanet() {
        const p = getCurrentPlanet();
        state.planetHP = p.maxHP;
        state.planetMaxHP = p.maxHP;
        state.planetDestroyed = false;
        state.planetShieldHP = 0;
        state.planetShieldActive = false;
        state.planetInvincible = false;
        state.planetArmorReduction = 0;
        state.satellites = [];
        PD.Engine.clearPlanetCache();
    }

    function fireWeapon(weapon, mx, my) {
        if (!weapon || !canUseWeapon(weapon)) return;
        if (state.planetDestroyed && weapon.dps) return;

        const center = PD.Engine.getCanvasCenter();
        const planet = getCurrentPlanet();
        const cat = state.selectedCategory;

        if (cat === 'destroyer') {
            fireDestroyerWeapon(weapon, mx, my, center, planet);
        } else if (cat === 'protector') {
            fireProtectorWeapon(weapon, center, planet);
        } else if (cat === 'healer') {
            fireHealerWeapon(weapon, mx, my, center, planet);
        } else if (cat === 'auto') {
            activateAutoSystem(weapon);
        }

        setWeaponCooldown(weapon);
    }

    function fireDestroyerWeapon(weapon, mx, my, center, planet) {
        const type = weapon.type;

        if (type === 'continuous' || type === 'beam') {
            PD.Engine.drawBeam(
                { x: mx < center.x ? 0 : PD.Engine.getCanvasSize().width, y: my < center.y ? 0 : my },
                center,
                weapon.color, weapon.width || 3
            );
            const dmg = applyDamage(weapon.dps / 60);
            if (dmg > 0) showDamageNumber(center.x + (Math.random() - 0.5) * 60, center.y - planet.radius - 20, dmg);
            for (let i = 0; i < 3; i++) {
                PD.Engine.addParticle(center.x + (Math.random() - 0.5) * 20, center.y + (Math.random() - 0.5) * 20, {
                    vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
                    life: 10 + Math.random() * 10, size: 2 + Math.random() * 3,
                    color: weapon.color
                });
            }
        } else if (type === 'projectile') {
            const edge = getRandomEdge();
            PD.Engine.addProjectile(edge, center, {
                speed: 10, color: weapon.color, size: 6,
                explosionRadius: weapon.explosionRadius || 50,
                onHit: () => {
                    const dmg = applyDamage(weapon.dps);
                    if (dmg > 0) showDamageNumber(center.x, center.y - planet.radius - 20, dmg);
                }
            });
        } else if (type === 'rain') {
            const count = weapon.particleCount || 5;
            const canvasSize = PD.Engine.getCanvasSize();
            for (let i = 0; i < count; i++) {
                const sx = center.x + (Math.random() - 0.5) * canvasSize.width * 0.6;
                const sy = -20;
                PD.Engine.addProjectile({ x: sx, y: sy }, {
                    x: center.x + (Math.random() - 0.5) * planet.radius,
                    y: center.y + (Math.random() - 0.5) * planet.radius
                }, {
                    speed: 6 + Math.random() * 4, color: weapon.color, size: 4,
                    explosionRadius: 30,
                    onHit: () => {
                        const dmg = applyDamage(weapon.dps / count);
                        if (dmg > 0) showDamageNumber(center.x + (Math.random() - 0.5) * 80, center.y - planet.radius, dmg);
                    }
                });
            }
        } else if (type === 'burst') {
            const count = weapon.burstCount || 3;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const edge = getRandomEdge();
                    PD.Engine.addProjectile(edge, center, {
                        speed: 12, color: weapon.color, size: 5,
                        explosionRadius: 40,
                        onHit: () => {
                            const dmg = applyDamage(weapon.dps / count);
                            if (dmg > 0) showDamageNumber(center.x + (Math.random() - 0.5) * 60, center.y - planet.radius - 10, dmg);
                        }
                    });
                }, i * 150);
            }
        } else if (type === 'area') {
            PD.Engine.createExplosion(center.x, center.y, weapon.radius || 80, weapon.color, 50);
            const dmg = applyDamage(weapon.dps);
            if (dmg > 0) showDamageNumber(center.x, center.y - planet.radius - 30, dmg);
        } else if (type === 'sweep') {
            const angle = PD.Engine.getFrameCount() * 0.03;
            const canvasSize = PD.Engine.getCanvasSize();
            const fromX = center.x + Math.cos(angle) * canvasSize.width;
            const fromY = center.y + Math.sin(angle) * canvasSize.height;
            PD.Engine.drawBeam({ x: fromX, y: fromY }, center, weapon.color, weapon.width || 10, 0.6);
            const dmg = applyDamage(weapon.dps / 60);
            if (dmg > 0) showDamageNumber(center.x + (Math.random() - 0.5) * 40, center.y - planet.radius - 20, dmg);
        } else if (type === 'swarm') {
            for (let i = 0; i < (weapon.particleCount || 10); i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = planet.radius + 50 + Math.random() * 80;
                PD.Engine.addParticle(
                    center.x + Math.cos(angle) * dist,
                    center.y + Math.sin(angle) * dist,
                    {
                        vx: -Math.cos(angle) * 2, vy: -Math.sin(angle) * 2,
                        life: 30, size: 2, color: weapon.color
                    }
                );
            }
            const dmg = applyDamage(weapon.dps / 60);
            if (dmg > 0 && PD.Engine.getFrameCount() % 15 === 0) {
                showDamageNumber(center.x + (Math.random() - 0.5) * 60, center.y - planet.radius - 20, dmg * 15);
            }
        } else if (type === 'rocket') {
            handleRocketMode(center, planet);
        }
    }

    function fireProtectorWeapon(weapon, center, planet) {
        if (weapon.type === 'shield') {
            state.planetShieldActive = true;
            state.planetShieldHP = weapon.shieldHP || 500;
            showHealNumber(center.x, center.y - planet.radius - 20, 'SHIELD');
        } else if (weapon.type === 'invincible') {
            state.planetInvincible = true;
            showHealNumber(center.x, center.y - planet.radius - 20, 'INVINCIBLE');
            setTimeout(() => { state.planetInvincible = false; }, (weapon.duration || 10) * 1000);
        } else if (weapon.type === 'armor') {
            state.planetArmorReduction = weapon.damageReduction || 0.5;
            showHealNumber(center.x, center.y - planet.radius - 20, 'ARMOR');
        } else if (weapon.type === 'orbital') {
            const count = weapon.count || 3;
            state.satellites = [];
            for (let i = 0; i < count; i++) {
                state.satellites.push({
                    angle: (i / count) * Math.PI * 2,
                    speed: 0.02,
                    dist: planet.radius + 40
                });
            }
            showHealNumber(center.x, center.y - planet.radius - 20, 'SATELLITES');
        } else if (weapon.type === 'deflect') {
            state.planetShieldActive = true;
            state.planetShieldHP = 300;
            showHealNumber(center.x, center.y - planet.radius - 20, 'DEFLECT');
        } else {
            showHealNumber(center.x, center.y - planet.radius - 20, weapon.name);
        }
    }

    function fireHealerWeapon(weapon, mx, my, center, planet) {
        if (weapon.type === 'continuous') {
            const heal = applyHeal(weapon.hps / 60);
            if (heal > 0) {
                for (let i = 0; i < 2; i++) {
                    PD.Engine.addParticle(center.x + (Math.random() - 0.5) * planet.radius, center.y + (Math.random() - 0.5) * planet.radius, {
                        vx: (Math.random() - 0.5), vy: -1 - Math.random() * 2,
                        life: 20, size: 3, color: weapon.color
                    });
                }
                if (PD.Engine.getFrameCount() % 30 === 0) {
                    showHealNumber(center.x + (Math.random() - 0.5) * 60, center.y - planet.radius - 20, Math.round(heal * 30));
                }
            }
        } else if (weapon.type === 'burst') {
            const heal = applyHeal(weapon.hps);
            if (heal > 0) showHealNumber(center.x, center.y - planet.radius - 20, Math.round(heal));
            for (let i = 0; i < 20; i++) {
                PD.Engine.addParticle(center.x, center.y, {
                    vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                    life: 30, size: 3, color: weapon.color
                });
            }
        } else if (weapon.type === 'area') {
            const heal = applyHeal(weapon.hps / 60);
            if (heal > 0 && PD.Engine.getFrameCount() % 30 === 0) {
                showHealNumber(center.x, center.y - planet.radius - 20, Math.round(heal * 30));
            }
            const rng = Math.random;
            PD.Engine.addParticle(center.x + (rng() - 0.5) * (weapon.radius || 100) * 2, center.y + (rng() - 0.5) * (weapon.radius || 100) * 2, {
                vx: 0, vy: -1, life: 25, size: 2, color: weapon.color
            });
        } else if (weapon.type === 'resurrect') {
            if (state.planetDestroyed) {
                state.planetDestroyed = false;
                state.planetHP = state.planetMaxHP * 0.5;
                showHealNumber(center.x, center.y - planet.radius - 20, 'RESURRECTED!');
                PD.Engine.clearPlanetCache();
            }
        }
    }

    function activateAutoSystem(weapon) {
        const center = PD.Engine.getCanvasCenter();
        if (weapon.type === 'autoclicker') {
            state.autoclickerEnabled = !state.autoclickerEnabled;
            showHealNumber(center.x, center.y - 40, state.autoclickerEnabled ? 'AUTO ON' : 'AUTO OFF');
        } else if (weapon.type === 'autoRepair') {
            state.autoSystems.autoRepair = !state.autoSystems.autoRepair;
            showHealNumber(center.x, center.y - 40, state.autoSystems.autoRepair ? 'REPAIR ON' : 'REPAIR OFF');
        } else if (weapon.type === 'autoShield') {
            state.autoSystems.autoShield = !state.autoSystems.autoShield;
            showHealNumber(center.x, center.y - 40, state.autoSystems.autoShield ? 'SHIELD ON' : 'SHIELD OFF');
        } else if (weapon.type === 'chain') {
            state.autoSystems.chain = !state.autoSystems.chain;
            showHealNumber(center.x, center.y - 40, state.autoSystems.chain ? 'CHAIN ON' : 'CHAIN OFF');
        } else if (weapon.type === 'harvest') {
            state.autoSystems.harvest = !state.autoSystems.harvest;
            showHealNumber(center.x, center.y - 40, state.autoSystems.harvest ? 'HARVEST ON' : 'HARVEST OFF');
        } else if (weapon.type === 'autoAttack') {
            state.autoSystems.autoAttack = !state.autoSystems.autoAttack;
            showHealNumber(center.x, center.y - 40, state.autoSystems.autoAttack ? 'ORBITAL ON' : 'ORBITAL OFF');
        } else if (weapon.type === 'autoNuke') {
            state.autoSystems.autoNuke = !state.autoSystems.autoNuke;
            showHealNumber(center.x, center.y - 40, state.autoSystems.autoNuke ? 'AUTONUKE ON' : 'AUTONUKE OFF');
        }
    }

    function handleRocketMode(center, planet) {
        if (!state.rocket.active) {
            const canvasSize = PD.Engine.getCanvasSize();
            state.rocket.active = true;
            state.rocket.x = 50;
            state.rocket.y = canvasSize.height / 2;
            state.rocket.angle = 0;
            state.rocket.vx = 0;
            state.rocket.vy = 0;
        }
    }

    function updateRocket() {
        if (!state.rocket.active) return;
        const r = state.rocket;
        const turnSpeed = 0.06;
        const accel = 0.3;
        const maxSpeed = 8;
        const friction = 0.98;

        if (state.rocketKeys.a) r.angle -= turnSpeed;
        if (state.rocketKeys.d) r.angle += turnSpeed;
        if (state.rocketKeys.w) {
            r.vx += Math.cos(r.angle) * accel;
            r.vy += Math.sin(r.angle) * accel;
        }
        if (state.rocketKeys.s) {
            r.vx -= Math.cos(r.angle) * accel * 0.5;
            r.vy -= Math.sin(r.angle) * accel * 0.5;
        }

        const speed = Math.sqrt(r.vx * r.vx + r.vy * r.vy);
        if (speed > maxSpeed) {
            r.vx = (r.vx / speed) * maxSpeed;
            r.vy = (r.vy / speed) * maxSpeed;
        }

        r.vx *= friction;
        r.vy *= friction;
        r.x += r.vx;
        r.y += r.vy;

        const canvasSize = PD.Engine.getCanvasSize();
        if (r.x < 0) r.x = canvasSize.width;
        if (r.x > canvasSize.width) r.x = 0;
        if (r.y < 0) r.y = canvasSize.height;
        if (r.y > canvasSize.height) r.y = 0;

        PD.Engine.addParticle(r.x - Math.cos(r.angle) * 10, r.y - Math.sin(r.angle) * 10, {
            vx: -Math.cos(r.angle) * 2 + (Math.random() - 0.5), vy: -Math.sin(r.angle) * 2 + (Math.random() - 0.5),
            life: 15, size: 2 + Math.random() * 2, color: '#ff6600'
        });

        const center = PD.Engine.getCanvasCenter();
        const planet = getCurrentPlanet();
        const dx = r.x - center.x;
        const dy = r.y - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < planet.radius * 0.9) {
            const weapon = state.selectedWeapon;
            PD.Engine.createExplosion(r.x, r.y, weapon ? weapon.explosionRadius || 60 : 60, '#ff4400', 40);
            const dmg = applyDamage(weapon ? weapon.dps : 180);
            if (dmg > 0) showDamageNumber(r.x, r.y - 30, dmg);

            r.active = false;
            state.rocketActive = false;

            setTimeout(() => {
                if (state.selectedWeapon && state.selectedWeapon.type === 'rocket') {
                    handleRocketMode(center, planet);
                }
            }, 1500);
        }

        if (state.rocketKeys.space) {
            if (PD.Engine.getFrameCount() % 5 === 0) {
                PD.Engine.addProjectile(
                    { x: r.x + Math.cos(r.angle) * 15, y: r.y + Math.sin(r.angle) * 15 },
                    { x: center.x, y: center.y },
                    { speed: 12, color: '#ff4444', size: 3, explosionRadius: 20,
                      onHit: () => {
                          const dmg = applyDamage(15 * state.dmgMultiplier);
                          if (dmg > 0) showDamageNumber(center.x + (Math.random() - 0.5) * 40, center.y - planet.radius - 10, dmg);
                      }
                    }
                );
            }
        }
    }

    function updateAutoSystems(dt) {
        const center = PD.Engine.getCanvasCenter();
        const planet = getCurrentPlanet();

        if (state.autoSystems.autoRepair && !state.planetDestroyed) {
            const heal = applyHeal(5 * dt * state.healMultiplier);
            if (heal > 0 && PD.Engine.getFrameCount() % 60 === 0) {
                PD.Engine.addParticle(center.x + (Math.random() - 0.5) * planet.radius, center.y, {
                    vy: -2, life: 20, size: 2, color: '#44ff88'
                });
            }
        }

        if (state.autoSystems.autoShield && !state.planetShieldActive && !state.planetDestroyed) {
            if (!state.autoTimers.shield || Date.now() > state.autoTimers.shield) {
                state.planetShieldActive = true;
                state.planetShieldHP = 300;
                state.autoTimers.shield = Date.now() + 20000;
            }
        }

        if (state.autoSystems.harvest) {
            state.credits += 10 * dt;
        }

        if (state.autoSystems.autoAttack && !state.planetDestroyed) {
            if (PD.Engine.getFrameCount() % 30 === 0) {
                const edge = getRandomEdge();
                PD.Engine.addProjectile(edge, center, {
                    speed: 8, color: '#ff2244', size: 4, explosionRadius: 30,
                    onHit: () => {
                        const dmg = applyDamage(50);
                        if (dmg > 0) showDamageNumber(center.x + (Math.random() - 0.5) * 60, center.y - planet.radius - 10, dmg);
                    }
                });
            }
        }

        if (state.autoSystems.autoNuke && !state.planetDestroyed) {
            if (!state.autoTimers.nuke || Date.now() > state.autoTimers.nuke) {
                const edge = getRandomEdge();
                PD.Engine.addProjectile(edge, center, {
                    speed: 6, color: '#ffcc00', size: 8, explosionRadius: 100,
                    onHit: () => {
                        const dmg = applyDamage(200);
                        if (dmg > 0) showDamageNumber(center.x, center.y - planet.radius - 20, dmg);
                    }
                });
                state.autoTimers.nuke = Date.now() + 5000;
            }
        }

        if (state.hacks.autoDestroy && !state.planetDestroyed) {
            applyDamage(state.planetMaxHP * 0.01);
        }
    }

    function updateSatellites() {
        const center = PD.Engine.getCanvasCenter();
        for (const sat of state.satellites) {
            sat.angle += sat.speed;
        }
    }

    function drawSatellites() {
        const center = PD.Engine.getCanvasCenter();
        const ctx = PD.Engine.getCtx();
        for (const sat of state.satellites) {
            const sx = center.x + Math.cos(sat.angle) * sat.dist;
            const sy = center.y + Math.sin(sat.angle) * sat.dist;
            ctx.fillStyle = '#aaaacc';
            ctx.fillRect(sx - 4, sy - 2, 8, 4);
            ctx.fillStyle = '#4488ff';
            ctx.fillRect(sx - 8, sy - 1, 4, 2);
            ctx.fillRect(sx + 4, sy - 1, 4, 2);
        }
    }

    function showDamageNumber(x, y, dmg) {
        const container = document.getElementById('damage-numbers');
        const el = document.createElement('div');
        el.className = 'dmg-number';
        el.textContent = '-' + (typeof dmg === 'number' ? Math.round(dmg) : dmg);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    function showHealNumber(x, y, val) {
        const container = document.getElementById('damage-numbers');
        const el = document.createElement('div');
        el.className = 'dmg-number heal';
        el.textContent = '+' + (typeof val === 'number' ? Math.round(val) : val);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        container.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }

    function getRandomEdge() {
        const canvasSize = PD.Engine.getCanvasSize();
        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: return { x: Math.random() * canvasSize.width, y: -20 };
            case 1: return { x: canvasSize.width + 20, y: Math.random() * canvasSize.height };
            case 2: return { x: Math.random() * canvasSize.width, y: canvasSize.height + 20 };
            case 3: return { x: -20, y: Math.random() * canvasSize.height };
        }
    }

    function addCredits(amount) { state.credits += amount; }
    function addXP(amount) {
        state.xp += amount;
        checkLevelUp();
    }
    function setLevel(level) {
        state.level = level;
        state.xpToNext = level * 100 + Math.floor(level * level * 10);
        unlockWeaponsForLevel(level);
    }

    function getState() { return state; }

    return {
        init, getState, getCurrentPlanet, loadPlanet, selectWeapon,
        isWeaponUnlocked, unlockWeapon, unlockWeaponsForLevel, unlockAllWeapons,
        canUseWeapon, fireWeapon, applyDamage, applyHeal, destroyPlanet,
        resetPlanet, nextPlanet, updateRocket, updateAutoSystems, updateSatellites,
        drawSatellites, addCredits, addXP, setLevel, handleRocketMode,
        showDamageNumber, showHealNumber, checkLevelUp, setWeaponCooldown
    };
})();
