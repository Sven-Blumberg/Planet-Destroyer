PD.UI = (function() {
    let elements = {};

    function init() {
        elements = {
            levelValue: document.getElementById('level-value'),
            scoreValue: document.getElementById('score-value'),
            creditsValue: document.getElementById('credits-value'),
            xpBar: document.getElementById('xp-bar'),
            xpText: document.getElementById('xp-text'),
            weaponList: document.getElementById('weapon-list'),
            planetName: document.getElementById('planet-name'),
            planetDesc: document.getElementById('planet-desc'),
            hpText: document.getElementById('hp-text'),
            hpBar: document.getElementById('hp-bar'),
            planetPop: document.getElementById('planet-pop'),
            planetSize: document.getElementById('planet-size'),
            planetType: document.getElementById('planet-type'),
            planetDefense: document.getElementById('planet-defense'),
            planetPreview: document.getElementById('planet-preview'),
            planetSelectList: document.getElementById('planet-select-list'),
            selectedWeaponIcon: document.getElementById('selected-weapon-icon'),
            selectedWeaponName: document.getElementById('selected-weapon-name'),
            selectedWeaponStat: document.getElementById('selected-weapon-stat'),
            gameOverlay: document.getElementById('game-overlay'),
            overlayTitle: document.getElementById('overlay-title'),
            overlayText: document.getElementById('overlay-text'),
            overlayBtn: document.getElementById('overlay-btn'),
            rocketControls: document.getElementById('rocket-controls'),
            adminOverlay: document.getElementById('admin-overlay'),
            levelCompleteOverlay: document.getElementById('level-complete-overlay'),
            startScreen: document.getElementById('start-screen'),
            autoclickerToggle: document.getElementById('autoclicker-toggle'),
            autoclickerSpeed: document.getElementById('autoclicker-speed'),
            autoclickerSpeedVal: document.getElementById('autoclicker-speed-val'),
            spawnPlanetSelect: document.getElementById('spawn-planet-select'),
            dmgMultiplier: document.getElementById('dmg-multiplier'),
            dmgMultVal: document.getElementById('dmg-mult-val'),
            speedMultiplier: document.getElementById('speed-multiplier'),
            speedMultVal: document.getElementById('speed-mult-val'),
            healMultiplier: document.getElementById('heal-multiplier'),
            healMultVal: document.getElementById('heal-mult-val'),
            lcCredits: document.getElementById('lc-credits'),
            lcXP: document.getElementById('lc-xp'),
            lcDestroyed: document.getElementById('lc-destroyed'),
            lcUnlocks: document.getElementById('lc-unlocks'),
            lcContinue: document.getElementById('lc-continue')
        };

        setupEventListeners();
        populateSpawnSelect();
        buildWeaponList('destroyer');
        buildPlanetList();
    }

    function setupEventListeners() {
        document.querySelectorAll('.cat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const cat = tab.dataset.category;
                PD.Game.getState().selectedCategory = cat;
                buildWeaponList(cat);
            });
        });

        document.getElementById('btn-start').addEventListener('click', () => {
            elements.startScreen.classList.add('hidden');
            PD.Game.getState().gameStarted = true;
        });

        document.getElementById('btn-admin').addEventListener('click', () => {
            elements.adminOverlay.classList.toggle('hidden');
        });

        document.getElementById('admin-close').addEventListener('click', () => {
            elements.adminOverlay.classList.add('hidden');
        });

        document.getElementById('btn-sound').addEventListener('click', () => {
            const on = PD.Audio.toggle();
            document.getElementById('btn-sound').textContent = on ? '🔊' : '🔇';
        });

        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });

        document.getElementById('btn-reset-planet').addEventListener('click', () => {
            PD.Game.resetPlanet();
            updatePlanetInfo();
        });

        document.getElementById('btn-next-planet').addEventListener('click', () => {
            if (PD.Game.nextPlanet()) {
                updatePlanetInfo();
                buildPlanetList();
            }
        });

        elements.overlayBtn.addEventListener('click', () => {
            elements.gameOverlay.classList.add('hidden');
            if (PD.Game.nextPlanet()) {
                updatePlanetInfo();
                buildPlanetList();
            }
        });

        elements.lcContinue.addEventListener('click', () => {
            elements.levelCompleteOverlay.classList.add('hidden');
            if (PD.Game.nextPlanet()) {
                updatePlanetInfo();
                buildPlanetList();
            }
        });

        elements.autoclickerToggle.addEventListener('change', (e) => {
            PD.Game.getState().autoclickerEnabled = e.target.checked;
        });

        elements.autoclickerSpeed.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            PD.Game.getState().autoclickerSpeed = val;
            elements.autoclickerSpeedVal.textContent = val + '/s';
        });

        setupAdminListeners();
        setupCanvasListeners();
        setupKeyboardListeners();

        elements.dmgMultiplier.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            PD.Game.getState().dmgMultiplier = val;
            elements.dmgMultVal.textContent = val + 'x';
        });
        elements.speedMultiplier.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            PD.Game.getState().speedMultiplier = val;
            elements.speedMultVal.textContent = val + 'x';
        });
        elements.healMultiplier.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            PD.Game.getState().healMultiplier = val;
            elements.healMultVal.textContent = val + 'x';
        });
    }

    function setupCanvasListeners() {
        const canvas = document.getElementById('game-canvas');

        function handlePointerDown(clientX, clientY) {
            const state = PD.Game.getState();
            state.mouseDown = true;
            const rect = canvas.getBoundingClientRect();
            state.mouseX = clientX - rect.left;
            state.mouseY = clientY - rect.top;

            if (state.selectedWeapon && !state.rocketActive) {
                const w = state.selectedWeapon;
                if (w.type === 'projectile' || w.type === 'area' || w.type === 'rain' || w.type === 'burst') {
                    PD.Game.fireWeapon(w, state.mouseX, state.mouseY);
                }
            }
        }

        function handlePointerMove(clientX, clientY) {
            const state = PD.Game.getState();
            const rect = canvas.getBoundingClientRect();
            state.mouseX = clientX - rect.left;
            state.mouseY = clientY - rect.top;
        }

        function handlePointerUp() {
            PD.Game.getState().mouseDown = false;
        }

        canvas.addEventListener('mousedown', (e) => {
            handlePointerDown(e.clientX, e.clientY);
        });

        canvas.addEventListener('mousemove', (e) => {
            handlePointerMove(e.clientX, e.clientY);
        });

        canvas.addEventListener('mouseup', handlePointerUp);
        canvas.addEventListener('mouseleave', handlePointerUp);

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            PD.Audio.resume();
            const touch = e.touches[0];
            handlePointerDown(touch.clientX, touch.clientY);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handlePointerMove(touch.clientX, touch.clientY);
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            handlePointerUp();
        }, { passive: false });

        canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            handlePointerUp();
        }, { passive: false });

        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    function setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            const state = PD.Game.getState();
            const key = e.key.toLowerCase();

            if (key === 'w') state.rocketKeys.w = true;
            if (key === 'a') state.rocketKeys.a = true;
            if (key === 's') state.rocketKeys.s = true;
            if (key === 'd') state.rocketKeys.d = true;
            if (key === ' ' || e.code === 'Space') {
                e.preventDefault();
                state.rocketKeys.space = true;
            }

            if (key === 'escape' && state.rocket.active) {
                state.rocket.active = false;
                state.rocketActive = false;
                const destroyers = PD.WEAPONS.destroyer;
                PD.Game.selectWeapon('destroyer', destroyers[0].id);
                updateSelectedWeaponInfo();
            }

            if (e.ctrlKey && e.shiftKey && key === 'a') {
                e.preventDefault();
                elements.adminOverlay.classList.toggle('hidden');
            }
        });

        document.addEventListener('keyup', (e) => {
            const state = PD.Game.getState();
            const key = e.key.toLowerCase();
            if (key === 'w') state.rocketKeys.w = false;
            if (key === 'a') state.rocketKeys.a = false;
            if (key === 's') state.rocketKeys.s = false;
            if (key === 'd') state.rocketKeys.d = false;
            if (key === ' ' || e.code === 'Space') state.rocketKeys.space = false;
        });
    }

    function setupAdminListeners() {
        document.querySelectorAll('.admin-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                handleAdminAction(btn.dataset.action);
            });
        });

        document.querySelectorAll('.admin-toggle input[data-hack]').forEach(cb => {
            cb.addEventListener('change', () => {
                const hack = cb.dataset.hack;
                const state = PD.Game.getState();
                const hackMap = {
                    'one-hit': 'oneHit',
                    'god-mode': 'godMode',
                    'infinite-ammo': 'infiniteAmmo',
                    'no-cooldown': 'noCooldown',
                    'debug-mode': 'debugMode',
                    'auto-destroy': 'autoDestroy',
                    'mega-explosions': 'megaExplosions',
                    'rainbow-mode': 'rainbowMode'
                };
                if (hackMap[hack]) {
                    state.hacks[hackMap[hack]] = cb.checked;
                }
                if (hack === 'infinite-ammo') {
                    buildWeaponList(state.selectedCategory);
                }
            });
        });
    }

    function handleAdminAction(action) {
        const state = PD.Game.getState();
        switch (action) {
            case 'credits-1k': PD.Game.addCredits(1000); break;
            case 'credits-10k': PD.Game.addCredits(10000); break;
            case 'credits-100k': PD.Game.addCredits(100000); break;
            case 'credits-1m': PD.Game.addCredits(1000000); break;
            case 'xp-100': PD.Game.addXP(100); break;
            case 'xp-1000': PD.Game.addXP(1000); break;
            case 'xp-10000': PD.Game.addXP(10000); break;
            case 'unlock-weapons': PD.Game.unlockAllWeapons(); buildWeaponList(state.selectedCategory); break;
            case 'unlock-planets': break;
            case 'unlock-all':
                PD.Game.unlockAllWeapons();
                PD.Game.setLevel(25);
                PD.Game.addCredits(100000);
                buildWeaponList(state.selectedCategory);
                buildPlanetList();
                break;
            case 'max-level':
                PD.Game.setLevel(25);
                buildWeaponList(state.selectedCategory);
                buildPlanetList();
                break;
            case 'reset-progress':
                state.level = 1; state.score = 0; state.credits = 500;
                state.xp = 0; state.xpToNext = 100; state.totalDestroyed = 0;
                state.unlockedWeapons = new Set(['laser']);
                PD.Game.loadPlanet(0);
                buildWeaponList(state.selectedCategory);
                buildPlanetList();
                updatePlanetInfo();
                break;
            case 'destroy-instant':
                state.planetHP = 0;
                PD.Game.destroyPlanet();
                break;
            case 'heal-full':
                state.planetHP = state.planetMaxHP;
                state.planetDestroyed = false;
                PD.Engine.clearPlanetCache();
                break;
            case 'spawn-planet':
                const sel = elements.spawnPlanetSelect.value;
                if (sel) {
                    const idx = PD.PLANETS.findIndex(p => p.id === sel);
                    if (idx >= 0) {
                        PD.Game.loadPlanet(idx);
                        updatePlanetInfo();
                        buildPlanetList();
                    }
                }
                break;
            case 'random-planet':
                const randIdx = Math.floor(Math.random() * PD.PLANETS.length);
                PD.Game.loadPlanet(randIdx);
                updatePlanetInfo();
                buildPlanetList();
                break;
        }
    }

    function buildWeaponList(category) {
        const list = elements.weaponList;
        list.innerHTML = '';
        const weapons = PD.WEAPONS[category];
        if (!weapons) return;

        const state = PD.Game.getState();
        for (const w of weapons) {
            const unlocked = PD.Game.isWeaponUnlocked(w.id);
            const canAfford = state.credits >= (w.cost || 0);
            const meetsLevel = state.level >= w.unlockLevel;
            const canBuy = !unlocked && meetsLevel && canAfford && w.cost > 0;

            const card = document.createElement('div');
            card.className = 'weapon-card' + (unlocked ? '' : ' locked') +
                             (state.selectedWeapon && state.selectedWeapon.id === w.id ? ' active' : '') +
                             (canBuy ? ' buyable' : '');

            const statText = w.dps ? `DPS: ${w.dps}` : (w.hps ? `HPS: ${w.hps}` : 'Spezial');

            card.innerHTML = `
                <span class="w-icon">${w.icon}</span>
                <div class="w-info">
                    <div class="w-name">${w.name}</div>
                    <div class="w-stat">${statText}${w.cooldown ? ` | CD: ${w.cooldown}s` : ''}</div>
                    ${!unlocked && w.cost > 0 ? `<div class="w-level">${canBuy ? '🛒 ' + PD.formatNumber(w.cost) + ' Credits' : 'Lv.' + w.unlockLevel + ' | ' + PD.formatNumber(w.cost) + ' Cr.'}</div>` : ''}
                    ${!unlocked && w.cost === 0 ? '<div class="w-level">Kostenlos ab Lv.' + w.unlockLevel + '</div>' : ''}
                </div>
            `;

            if (unlocked) {
                card.addEventListener('click', () => {
                    PD.Game.selectWeapon(category, w.id);
                    buildWeaponList(category);
                    updateSelectedWeaponInfo();
                    updateRocketUI();
                });
            } else if (canBuy) {
                card.style.cursor = 'pointer';
                card.style.opacity = '0.75';
                card.addEventListener('click', () => {
                    if (state.credits >= w.cost) {
                        state.credits -= w.cost;
                        PD.Game.unlockWeapon(w.id);
                        PD.Game.selectWeapon(category, w.id);
                        PD.Audio.playPurchase();
                        buildWeaponList(category);
                        updateSelectedWeaponInfo();
                        updateRocketUI();
                    }
                });
            }

            list.appendChild(card);
        }
    }

    function buildPlanetList() {
        const list = elements.planetSelectList;
        list.innerHTML = '';
        const state = PD.Game.getState();

        for (let i = 0; i < PD.PLANETS.length; i++) {
            const p = PD.PLANETS[i];
            const unlocked = p.level <= state.level || state.hacks.infiniteAmmo;
            const item = document.createElement('div');
            item.className = 'planet-select-item' +
                             (i === state.currentPlanetIndex ? ' active' : '') +
                             (!unlocked ? ' locked' : '');

            const iconDiv = document.createElement('div');
            iconDiv.className = 'ps-icon';
            iconDiv.style.background = `radial-gradient(circle at 35% 35%, ${p.colors.glow || p.colors.ocean}, ${p.colors.base})`;
            item.appendChild(iconDiv);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'ps-name';
            nameSpan.textContent = p.name;
            item.appendChild(nameSpan);

            const lvlSpan = document.createElement('span');
            lvlSpan.className = 'ps-lvl';
            lvlSpan.textContent = `Lv.${p.level}`;
            item.appendChild(lvlSpan);

            if (unlocked) {
                item.addEventListener('click', () => {
                    PD.Game.loadPlanet(i);
                    updatePlanetInfo();
                    buildPlanetList();
                });
            }

            list.appendChild(item);
        }
    }

    function updatePlanetInfo() {
        const planet = PD.Game.getCurrentPlanet();
        const state = PD.Game.getState();

        elements.planetName.textContent = planet.name;
        elements.planetDesc.textContent = planet.desc;
        elements.planetPop.textContent = PD.formatPop(planet.population);
        elements.planetSize.textContent = PD.sizeLabel(planet.radius);
        elements.planetType.textContent = planet.type;

        const defenses = [];
        if (state.planetShieldActive) defenses.push('Schild');
        if (state.planetInvincible) defenses.push('Unverwundbar');
        if (state.planetArmorReduction > 0) defenses.push('Panzer');
        if (state.satellites.length > 0) defenses.push('Satelliten');
        elements.planetDefense.textContent = defenses.length > 0 ? defenses.join(', ') : 'Keine';

        elements.planetPreview.style.background =
            `radial-gradient(circle at 35% 35%, ${planet.colors.glow || planet.colors.ocean}, ${planet.colors.base}, ${darkenHex(planet.colors.base)})`;
        elements.planetPreview.style.boxShadow = `0 0 20px ${planet.colors.glow || planet.colors.ocean}40, inset -10px -5px 20px rgba(0,0,0,0.5)`;
    }

    function updateHUD() {
        const state = PD.Game.getState();
        const planet = PD.Game.getCurrentPlanet();

        elements.levelValue.textContent = state.level;
        elements.scoreValue.textContent = PD.formatNumber(state.score);
        elements.creditsValue.textContent = PD.formatNumber(Math.floor(state.credits));

        const xpPct = (state.xp / state.xpToNext) * 100;
        elements.xpBar.style.width = xpPct + '%';
        elements.xpText.textContent = `${Math.floor(state.xp)} / ${state.xpToNext}`;

        const hp = Math.max(0, Math.floor(state.planetHP));
        const maxHP = state.planetMaxHP;
        elements.hpText.textContent = `${PD.formatNumber(hp)} / ${PD.formatNumber(maxHP)}`;
        const hpPct = (hp / maxHP) * 100;
        elements.hpBar.style.width = hpPct + '%';

        elements.hpBar.classList.remove('mid', 'low');
        if (hpPct < 25) elements.hpBar.classList.add('low');
        else if (hpPct < 50) elements.hpBar.classList.add('mid');

        const defenses = [];
        if (state.planetShieldActive) defenses.push('Schild');
        if (state.planetInvincible) defenses.push('Unverwundbar');
        if (state.planetArmorReduction > 0) defenses.push('Panzer');
        if (state.satellites.length > 0) defenses.push('Satelliten');
        elements.planetDefense.textContent = defenses.length > 0 ? defenses.join(', ') : 'Keine';
    }

    function updateSelectedWeaponInfo() {
        const weapon = PD.Game.getState().selectedWeapon;
        if (!weapon) return;
        elements.selectedWeaponIcon.textContent = weapon.icon;
        elements.selectedWeaponName.textContent = weapon.name;
        const statText = weapon.dps ? `DPS: ${weapon.dps}` : (weapon.hps ? `HPS: ${weapon.hps}` : 'Spezial');
        elements.selectedWeaponStat.textContent = statText + (weapon.cooldown ? ` | CD: ${weapon.cooldown}s` : '');
    }

    function updateRocketUI() {
        const state = PD.Game.getState();
        if (state.rocket.active) {
            elements.rocketControls.classList.remove('hidden');
        } else {
            elements.rocketControls.classList.add('hidden');
        }
    }

    function showDestroyOverlay() {
        const planet = PD.Game.getCurrentPlanet();
        const state = PD.Game.getState();
        elements.overlayTitle.textContent = `${planet.name} ZERSTÖRT!`;
        elements.overlayText.textContent = `+${planet.reward.credits} Credits | +${planet.reward.xp} XP`;
        elements.gameOverlay.classList.remove('hidden');
    }

    function showLevelComplete(newUnlocks) {
        const planet = PD.Game.getCurrentPlanet();
        const state = PD.Game.getState();
        elements.lcCredits.textContent = `+${planet.reward.credits}`;
        elements.lcXP.textContent = `+${planet.reward.xp}`;
        elements.lcDestroyed.textContent = state.totalDestroyed;

        if (newUnlocks && newUnlocks.length > 0) {
            elements.lcUnlocks.innerHTML = '<h4>Neue Waffen freigeschaltet:</h4>' +
                newUnlocks.map(w => `<div>${w.icon} ${w.name}</div>`).join('');
        } else {
            elements.lcUnlocks.innerHTML = '';
        }

        elements.levelCompleteOverlay.classList.remove('hidden');
    }

    function populateSpawnSelect() {
        const select = elements.spawnPlanetSelect;
        for (const p of PD.PLANETS) {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `${p.name} (Lv.${p.level})`;
            select.appendChild(opt);
        }
    }

    function darkenHex(hex) {
        if (!hex || hex.length < 7) return '#000000';
        const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 80);
        const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 80);
        const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 80);
        return `rgb(${r},${g},${b})`;
    }

    return {
        init, updateHUD, updatePlanetInfo, updateSelectedWeaponInfo,
        updateRocketUI, showDestroyOverlay, showLevelComplete,
        buildWeaponList, buildPlanetList
    };
})();
