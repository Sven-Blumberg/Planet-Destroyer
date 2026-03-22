const PD = window.PD || {};
window.PD = PD;

PD.PLANETS = [
    {
        id: 'terra_nova', name: 'Terra Nova', desc: 'Ein erdähnlicher Planet voller Leben und Ozeane',
        type: 'Terrestrisch', level: 1, radius: 110, maxHP: 1000, population: 8200000000,
        reward: { credits: 500, xp: 100 },
        colors: { base: '#2d6a1e', ocean: '#1a5a9a', land2: '#3d7a2e', atmosphere: 'rgba(100,180,255,0.15)', glow: '#4488ff' },
        features: ['continents', 'oceans', 'clouds', 'atmosphere'],
        surfaceDetail: 'earth'
    },
    {
        id: 'infernox', name: 'Infernox', desc: 'Ein vulkanischer Höllenplanet mit Lavaströmen',
        type: 'Vulkanisch', level: 2, radius: 100, maxHP: 1500, population: 0,
        reward: { credits: 750, xp: 150 },
        colors: { base: '#3a1a0a', ocean: '#cc3300', land2: '#551100', atmosphere: 'rgba(255,80,20,0.12)', glow: '#ff4400' },
        features: ['lava', 'craters', 'atmosphere'],
        surfaceDetail: 'volcanic'
    },
    {
        id: 'glacius', name: 'Glacius', desc: 'Eine gefrorene Eiswelt mit kristallinen Oberflächen',
        type: 'Eis', level: 3, radius: 105, maxHP: 1200, population: 50000000,
        reward: { credits: 650, xp: 130 },
        colors: { base: '#a0d4ff', ocean: '#6abfff', land2: '#d0eaff', atmosphere: 'rgba(180,220,255,0.15)', glow: '#88ccff' },
        features: ['ice', 'cracks', 'atmosphere'],
        surfaceDetail: 'ice'
    },
    {
        id: 'nebulora', name: 'Nebulora', desc: 'Ein gewaltiger Gasriese mit violetten Stürmen',
        type: 'Gasriese', level: 4, radius: 150, maxHP: 3000, population: 0,
        reward: { credits: 1200, xp: 250 },
        colors: { base: '#4a1a6a', ocean: '#7722aa', land2: '#6633aa', atmosphere: 'rgba(170,68,255,0.12)', glow: '#aa44ff' },
        features: ['bands', 'storms', 'atmosphere', 'rings'],
        surfaceDetail: 'gas'
    },
    {
        id: 'crystallis', name: 'Crystallis', desc: 'Ein schimmernder Planet aus reinem Kristall',
        type: 'Kristall', level: 5, radius: 90, maxHP: 2000, population: 12000000,
        reward: { credits: 1000, xp: 200 },
        colors: { base: '#224466', ocean: '#44aacc', land2: '#66ccee', atmosphere: 'rgba(100,220,255,0.18)', glow: '#44ddff' },
        features: ['crystals', 'shine', 'atmosphere'],
        surfaceDetail: 'crystal'
    },
    {
        id: 'sandoria', name: 'Sandoria', desc: 'Eine endlose Wüstenwelt mit Sandstürmen',
        type: 'Wüste', level: 6, radius: 108, maxHP: 1800, population: 320000000,
        reward: { credits: 900, xp: 180 },
        colors: { base: '#c4a035', ocean: '#d4b045', land2: '#a08020', atmosphere: 'rgba(210,180,100,0.1)', glow: '#ddaa33' },
        features: ['dunes', 'storms', 'atmosphere'],
        surfaceDetail: 'desert'
    },
    {
        id: 'aquaris', name: 'Aquaris', desc: 'Ein komplett mit Wasser bedeckter Ozeanplanet',
        type: 'Ozean', level: 7, radius: 115, maxHP: 2200, population: 900000000,
        reward: { credits: 1100, xp: 220 },
        colors: { base: '#0a3366', ocean: '#1155aa', land2: '#0844aa', atmosphere: 'rgba(60,140,255,0.15)', glow: '#3388ff' },
        features: ['waves', 'deep', 'atmosphere', 'clouds'],
        surfaceDetail: 'ocean'
    },
    {
        id: 'toxica', name: 'Toxica', desc: 'Ein giftiger Planet mit ätzender Atmosphäre',
        type: 'Toxisch', level: 8, radius: 95, maxHP: 2500, population: 0,
        reward: { credits: 1300, xp: 260 },
        colors: { base: '#1a3a1a', ocean: '#33aa22', land2: '#228811', atmosphere: 'rgba(50,200,30,0.18)', glow: '#44ff22' },
        features: ['toxic', 'bubbles', 'atmosphere'],
        surfaceDetail: 'toxic'
    },
    {
        id: 'magnetar', name: 'Magnetar', desc: 'Ein elektromagnetischer Planet mit Blitzstürmen',
        type: 'Elektro', level: 9, radius: 100, maxHP: 2800, population: 0,
        reward: { credits: 1400, xp: 280 },
        colors: { base: '#1a1a3a', ocean: '#4444ff', land2: '#2222aa', atmosphere: 'rgba(100,100,255,0.2)', glow: '#6666ff' },
        features: ['lightning', 'energy', 'atmosphere'],
        surfaceDetail: 'electric'
    },
    {
        id: 'obsidian', name: 'Obsidian', desc: 'Ein dunkler Felsenplanet aus vulkanischem Glas',
        type: 'Gestein', level: 10, radius: 98, maxHP: 3500, population: 5000000,
        reward: { credits: 1800, xp: 350 },
        colors: { base: '#1a1a1a', ocean: '#333333', land2: '#2a2a2a', atmosphere: 'rgba(80,80,80,0.08)', glow: '#555555' },
        features: ['craters', 'shards', 'cracks'],
        surfaceDetail: 'dark'
    },
    {
        id: 'luminara', name: 'Luminara', desc: 'Ein leuchtender Planet aus reiner Energie',
        type: 'Energie', level: 11, radius: 105, maxHP: 4000, population: 0,
        reward: { credits: 2000, xp: 400 },
        colors: { base: '#aaaa22', ocean: '#ffff44', land2: '#dddd33', atmosphere: 'rgba(255,255,100,0.25)', glow: '#ffff66' },
        features: ['glow', 'pulses', 'atmosphere'],
        surfaceDetail: 'energy'
    },
    {
        id: 'fungora', name: 'Fungora', desc: 'Ein organischer Planet bedeckt mit riesigen Pilzen',
        type: 'Organisch', level: 12, radius: 112, maxHP: 3200, population: 2100000000,
        reward: { credits: 1600, xp: 320 },
        colors: { base: '#4a2a4a', ocean: '#aa44aa', land2: '#883388', atmosphere: 'rgba(170,68,170,0.12)', glow: '#cc66cc' },
        features: ['organic', 'spores', 'atmosphere'],
        surfaceDetail: 'organic'
    },
    {
        id: 'mechanis', name: 'Mechanis', desc: 'Ein vollständig mechanisierter Maschinenplanet',
        type: 'Maschine', level: 13, radius: 120, maxHP: 5000, population: 0,
        reward: { credits: 2500, xp: 500 },
        colors: { base: '#3a3a4a', ocean: '#6a6a7a', land2: '#5a5a6a', atmosphere: 'rgba(120,120,140,0.1)', glow: '#8888aa' },
        features: ['grid', 'lights', 'metal'],
        surfaceDetail: 'machine'
    },
    {
        id: 'phantasma', name: 'Phantasma', desc: 'Ein geisterhafter, halb-transparenter Planet',
        type: 'Phantom', level: 14, radius: 108, maxHP: 4500, population: 0,
        reward: { credits: 2200, xp: 450 },
        colors: { base: '#2a3a4a', ocean: '#4488aa', land2: '#336688', atmosphere: 'rgba(100,160,200,0.25)', glow: '#66aacc' },
        features: ['ghost', 'shimmer', 'atmosphere'],
        surfaceDetail: 'phantom'
    },
    {
        id: 'solaris_prime', name: 'Solaris Prime', desc: 'Ein Mini-Stern mit extremer Hitze',
        type: 'Stellar', level: 15, radius: 130, maxHP: 6000, population: 0,
        reward: { credits: 3000, xp: 600 },
        colors: { base: '#cc6600', ocean: '#ffaa00', land2: '#ff8800', atmosphere: 'rgba(255,170,0,0.3)', glow: '#ffcc44' },
        features: ['flares', 'corona', 'intense'],
        surfaceDetail: 'star'
    },
    {
        id: 'void_walker', name: 'Void Walker', desc: 'Ein Planet aus dunkler Materie am Rande der Realität',
        type: 'Void', level: 16, radius: 115, maxHP: 7000, population: 0,
        reward: { credits: 3500, xp: 700 },
        colors: { base: '#0a0a15', ocean: '#1a1a30', land2: '#111125', atmosphere: 'rgba(20,20,60,0.3)', glow: '#3333aa' },
        features: ['void', 'distortion', 'dark'],
        surfaceDetail: 'void'
    },
    {
        id: 'eden', name: 'Eden', desc: 'Ein paradiesischer Planet mit perfektem Ökosystem',
        type: 'Paradies', level: 17, radius: 118, maxHP: 5500, population: 15000000000,
        reward: { credits: 2800, xp: 550 },
        colors: { base: '#228833', ocean: '#2266bb', land2: '#33aa44', atmosphere: 'rgba(100,200,150,0.15)', glow: '#44cc88' },
        features: ['continents', 'oceans', 'clouds', 'atmosphere', 'rings'],
        surfaceDetail: 'paradise'
    },
    {
        id: 'chronos', name: 'Chronos', desc: 'Ein zeitverzerrter Planet wo Vergangenheit und Zukunft verschmelzen',
        type: 'Temporal', level: 18, radius: 110, maxHP: 8000, population: 0,
        reward: { credits: 4000, xp: 800 },
        colors: { base: '#2a2a00', ocean: '#886622', land2: '#554400', atmosphere: 'rgba(180,150,50,0.2)', glow: '#bbaa44' },
        features: ['temporal', 'distortion', 'atmosphere'],
        surfaceDetail: 'temporal'
    },
    {
        id: 'tempestia', name: 'Tempestia', desc: 'Ein Sturmplanet mit ewigen Mega-Hurrikanen',
        type: 'Sturm', level: 19, radius: 140, maxHP: 9000, population: 0,
        reward: { credits: 4500, xp: 900 },
        colors: { base: '#1a2a3a', ocean: '#3355aa', land2: '#2244aa', atmosphere: 'rgba(60,100,180,0.2)', glow: '#4477cc' },
        features: ['storms', 'bands', 'lightning', 'atmosphere'],
        surfaceDetail: 'storm'
    },
    {
        id: 'aurum', name: 'Aurum', desc: 'Ein Planet aus reinem Gold und Edelmetallen',
        type: 'Metall', level: 20, radius: 95, maxHP: 10000, population: 500000000,
        reward: { credits: 6000, xp: 1200 },
        colors: { base: '#aa8800', ocean: '#ddaa00', land2: '#ccaa22', atmosphere: 'rgba(220,180,50,0.15)', glow: '#ffcc33' },
        features: ['metallic', 'shine', 'atmosphere'],
        surfaceDetail: 'gold'
    },
    {
        id: 'ragnarok', name: 'Ragnarök', desc: 'Der ultimative Endzeit-Planet - das Ende aller Dinge',
        type: 'Apokalypse', level: 21, radius: 160, maxHP: 15000, population: 0,
        reward: { credits: 10000, xp: 2000 },
        colors: { base: '#2a0a0a', ocean: '#880000', land2: '#550000', atmosphere: 'rgba(255,0,0,0.2)', glow: '#ff2222' },
        features: ['chaos', 'fire', 'cracks', 'atmosphere'],
        surfaceDetail: 'apocalypse'
    },
    {
        id: 'nexus', name: 'Nexus Prime', desc: 'Der Kern des Universums - unvorstellbare Macht',
        type: 'Kosmisch', level: 22, radius: 170, maxHP: 25000, population: 0,
        reward: { credits: 15000, xp: 3000 },
        colors: { base: '#1a0a2a', ocean: '#5522aa', land2: '#4411aa', atmosphere: 'rgba(130,50,220,0.3)', glow: '#8844ff' },
        features: ['cosmic', 'energy', 'rings', 'atmosphere'],
        surfaceDetail: 'cosmic'
    },
    {
        id: 'omega', name: 'Omega', desc: 'Das letzte Objekt im Universum - unzerstörbar?',
        type: 'Singularität', level: 23, radius: 80, maxHP: 50000, population: 0,
        reward: { credits: 25000, xp: 5000 },
        colors: { base: '#000000', ocean: '#111111', land2: '#080808', atmosphere: 'rgba(255,255,255,0.08)', glow: '#ffffff' },
        features: ['singularity', 'distortion', 'intense'],
        surfaceDetail: 'singularity'
    },
    {
        id: 'prisma', name: 'Prisma', desc: 'Ein schillernder Planet der alle Farben des Lichts reflektiert',
        type: 'Spektral', level: 24, radius: 105, maxHP: 12000, population: 0,
        reward: { credits: 8000, xp: 1500 },
        colors: { base: '#ff4488', ocean: '#44ff88', land2: '#4488ff', atmosphere: 'rgba(255,255,255,0.15)', glow: '#ffffff' },
        features: ['rainbow', 'shine', 'atmosphere'],
        surfaceDetail: 'prismatic'
    },
    {
        id: 'leviathan', name: 'Leviathan', desc: 'Ein lebender Planet - eine kosmische Kreatur',
        type: 'Biologisch', level: 25, radius: 145, maxHP: 20000, population: 1,
        reward: { credits: 12000, xp: 2500 },
        colors: { base: '#2a1a0a', ocean: '#665533', land2: '#554422', atmosphere: 'rgba(150,120,80,0.12)', glow: '#aa8855' },
        features: ['organic', 'tentacles', 'eyes'],
        surfaceDetail: 'living'
    }
];

PD.WEAPONS = {
    destroyer: [
        {
            id: 'laser', name: 'Laser Strahl', icon: '🔴', desc: 'Ein fokussierter Lichtstrahl',
            dps: 15, cost: 0, unlockLevel: 1, type: 'continuous',
            color: '#ff3344', width: 3
        },
        {
            id: 'meteor', name: 'Meteor Regen', icon: '☄️', desc: 'Meteoriten regnen auf den Planeten',
            dps: 25, cost: 200, unlockLevel: 2, type: 'rain',
            color: '#ff8844', particleCount: 5
        },
        {
            id: 'nuke', name: 'Nuklear Rakete', icon: '☢️', desc: 'Eine verheerende Atomwaffe',
            dps: 100, cost: 500, unlockLevel: 3, type: 'projectile',
            color: '#ffcc00', explosionRadius: 80, cooldown: 3
        },
        {
            id: 'plasma', name: 'Plasma Kanone', icon: '🟣', desc: 'Schießt heißes Plasma',
            dps: 35, cost: 300, unlockLevel: 4, type: 'burst',
            color: '#aa44ff', burstCount: 3
        },
        {
            id: 'blackhole', name: 'Schwarzes Loch', icon: '🕳️', desc: 'Erzeugt eine gravitische Singularität',
            dps: 80, cost: 1000, unlockLevel: 6, type: 'area',
            color: '#220044', radius: 60
        },
        {
            id: 'antimatter', name: 'Antimaterie Bombe', icon: '💫', desc: 'Antimaterie-Explosion',
            dps: 200, cost: 1500, unlockLevel: 8, type: 'projectile',
            color: '#ff44ff', explosionRadius: 120, cooldown: 5
        },
        {
            id: 'gamma', name: 'Gamma Blitz', icon: '⚡', desc: 'Ein kosmischer Gammastrahlen-Ausbruch',
            dps: 60, cost: 800, unlockLevel: 5, type: 'beam',
            color: '#44ffaa', width: 8
        },
        {
            id: 'ion', name: 'Ionen Kanone', icon: '🔵', desc: 'Orbital-Ionenkanone',
            dps: 50, cost: 600, unlockLevel: 7, type: 'continuous',
            color: '#4488ff', width: 5
        },
        {
            id: 'asteroid', name: 'Asteroiden Einschlag', icon: '🪨', desc: 'Schleudere riesige Asteroiden',
            dps: 150, cost: 1200, unlockLevel: 9, type: 'projectile',
            color: '#886644', explosionRadius: 100, cooldown: 4
        },
        {
            id: 'deathray', name: 'Todesstrahl', icon: '💀', desc: 'Der ultimative Vernichtungsstrahl',
            dps: 120, cost: 2000, unlockLevel: 11, type: 'continuous',
            color: '#ff0000', width: 12
        },
        {
            id: 'rocket', name: 'Steuerbare Rakete', icon: '🚀', desc: 'WASD Steuerung! Fliege die Rakete selbst!',
            dps: 180, cost: 2500, unlockLevel: 10, type: 'rocket',
            color: '#ff8800', explosionRadius: 90
        },
        {
            id: 'supernova', name: 'Supernova', icon: '🌟', desc: 'Erzeugt eine stellare Explosion',
            dps: 500, cost: 5000, unlockLevel: 14, type: 'area',
            color: '#ffffff', radius: 200, cooldown: 10
        },
        {
            id: 'gravity', name: 'Gravitations Brecher', icon: '🌀', desc: 'Zerquetscht durch extreme Gravitation',
            dps: 90, cost: 1800, unlockLevel: 12, type: 'area',
            color: '#8844ff', radius: 80
        },
        {
            id: 'emp', name: 'EMP Schlag', icon: '📡', desc: 'Deaktiviert Schilde und Elektronik',
            dps: 30, cost: 700, unlockLevel: 7, type: 'area',
            color: '#44ccff', radius: 150, special: 'disableShield'
        },
        {
            id: 'solar_flare', name: 'Sonneneruption', icon: '🌞', desc: 'Versengt mit solarer Energie',
            dps: 70, cost: 1100, unlockLevel: 9, type: 'sweep',
            color: '#ffaa00', width: 20
        },
        {
            id: 'quantum', name: 'Quanten Disruptor', icon: '⚛️', desc: 'Destabilisiert die Materie auf Quantenebene',
            dps: 250, cost: 4000, unlockLevel: 15, type: 'continuous',
            color: '#44ffff', width: 6
        },
        {
            id: 'void_torpedo', name: 'Void Torpedo', icon: '🔮', desc: 'Dunkle-Energie-Torpedo',
            dps: 300, cost: 6000, unlockLevel: 17, type: 'projectile',
            color: '#6622cc', explosionRadius: 130, cooldown: 6
        },
        {
            id: 'nanite', name: 'Naniten Schwarm', icon: '🐝', desc: 'Winzige Zerstörer fressen den Planeten',
            dps: 150, cost: 3500, unlockLevel: 13, type: 'swarm',
            color: '#88ff44', particleCount: 30
        },
        {
            id: 'planet_cracker', name: 'Planeten Brecher', icon: '💥', desc: 'Spaltet den Planeten in zwei Hälften',
            dps: 800, cost: 8000, unlockLevel: 19, type: 'beam',
            color: '#ff2200', width: 16, cooldown: 15
        },
        {
            id: 'big_bang', name: 'Urknall', icon: '✨', desc: 'Die ultimative Waffe - ein neuer Urknall',
            dps: 2000, cost: 15000, unlockLevel: 22, type: 'area',
            color: '#ffffff', radius: 300, cooldown: 30
        }
    ],

    protector: [
        {
            id: 'shield', name: 'Schutzschild', icon: '🛡️', desc: 'Energie-Schild um den Planeten',
            hps: 0, cost: 400, unlockLevel: 2, type: 'shield',
            color: '#4488ff', shieldHP: 500, duration: 15
        },
        {
            id: 'satellite', name: 'Verteidigungs Satellit', icon: '🛰️', desc: 'Orbitaler Verteidigungssatellit',
            hps: 0, cost: 600, unlockLevel: 3, type: 'orbital',
            color: '#aaaacc', count: 3
        },
        {
            id: 'forcefield', name: 'Kraftfeld', icon: '🔷', desc: 'Temporäre Unverwundbarkeit',
            hps: 0, cost: 1500, unlockLevel: 8, type: 'invincible',
            color: '#44aaff', duration: 10
        },
        {
            id: 'mag_field', name: 'Magnetfeld', icon: '🧲', desc: 'Lenkt Projektile ab',
            hps: 0, cost: 800, unlockLevel: 5, type: 'deflect',
            color: '#8866ff', duration: 20
        },
        {
            id: 'decoy', name: 'Köder Planet', icon: '🎯', desc: 'Erzeugt ein Hologramm-Ziel',
            hps: 0, cost: 1000, unlockLevel: 7, type: 'decoy',
            color: '#ffaa44'
        },
        {
            id: 'point_defense', name: 'Punktverteidigung', icon: '🔫', desc: 'Automatisches Abwehrsystem',
            hps: 0, cost: 1200, unlockLevel: 10, type: 'autoDefense',
            color: '#ff4444'
        },
        {
            id: 'stealth', name: 'Tarnfeld', icon: '👻', desc: 'Macht den Planeten unsichtbar',
            hps: 0, cost: 2000, unlockLevel: 12, type: 'stealth',
            color: '#44ff88', duration: 12
        },
        {
            id: 'armor', name: 'Panzerplatten', icon: '🪖', desc: 'Massive Panzerung, reduziert Schaden um 50%',
            hps: 0, cost: 3000, unlockLevel: 14, type: 'armor',
            color: '#888888', damageReduction: 0.5
        }
    ],

    healer: [
        {
            id: 'nanobots', name: 'Reparatur Nanobots', icon: '🔧', desc: 'Langsame, stetige Heilung',
            hps: 10, cost: 300, unlockLevel: 2, type: 'continuous',
            color: '#44ff88'
        },
        {
            id: 'atmosphere', name: 'Atmosphären Regenerator', icon: '🌬️', desc: 'Stellt die Atmosphäre wieder her',
            hps: 20, cost: 500, unlockLevel: 4, type: 'continuous',
            color: '#88ccff'
        },
        {
            id: 'core_stab', name: 'Kern Stabilisator', icon: '⚙️', desc: 'Stabilisiert den Planetenkern',
            hps: 40, cost: 900, unlockLevel: 6, type: 'burst',
            color: '#ffaa44'
        },
        {
            id: 'terraform', name: 'Terraformer', icon: '🌱', desc: 'Baut die Oberfläche komplett wieder auf',
            hps: 80, cost: 1500, unlockLevel: 9, type: 'burst',
            color: '#44ff44', cooldown: 8
        },
        {
            id: 'life_seed', name: 'Lebenssaat', icon: '🌿', desc: 'Sät neues Leben und erhöht Population',
            hps: 30, cost: 700, unlockLevel: 5, type: 'continuous',
            color: '#88ff44'
        },
        {
            id: 'regen_field', name: 'Regenerationsfeld', icon: '💚', desc: 'Flächenheilung über die Zeit',
            hps: 60, cost: 1200, unlockLevel: 8, type: 'area',
            color: '#22ff66', radius: 100
        },
        {
            id: 'time_reverse', name: 'Zeit Umkehrer', icon: '⏪', desc: 'Dreht den Schaden zurück',
            hps: 200, cost: 3000, unlockLevel: 13, type: 'burst',
            color: '#ffcc44', cooldown: 15
        },
        {
            id: 'phoenix', name: 'Phoenix Protokoll', icon: '🔥', desc: 'Wiederbelebt zerstörte Planeten!',
            hps: 9999, cost: 5000, unlockLevel: 16, type: 'resurrect',
            color: '#ff8844', cooldown: 30
        }
    ],

    auto: [
        {
            id: 'autoclicker', name: 'Autoclicker', icon: '🖱️', desc: 'Automatisches Feuern der gewählten Waffe',
            cost: 500, unlockLevel: 3, type: 'autoclicker',
            color: '#ffcc00', speed: 5
        },
        {
            id: 'auto_repair', name: 'Auto-Reparatur', icon: '🔄', desc: 'Automatische Planetenreparatur',
            cost: 800, unlockLevel: 5, type: 'autoRepair',
            color: '#44ff88', hps: 5
        },
        {
            id: 'auto_shield', name: 'Auto-Schild', icon: '🛡️', desc: 'Schild wird automatisch erneuert',
            cost: 1200, unlockLevel: 8, type: 'autoShield',
            color: '#4488ff'
        },
        {
            id: 'chain_react', name: 'Kettenreaktion', icon: '⛓️', desc: 'Automatische Komboangriffe',
            cost: 2000, unlockLevel: 11, type: 'chain',
            color: '#ff4488'
        },
        {
            id: 'harvester', name: 'Ressourcen Sammler', icon: '💎', desc: 'Sammelt automatisch Credits',
            cost: 1500, unlockLevel: 6, type: 'harvest',
            color: '#ffaa00', creditsPerSec: 10
        },
        {
            id: 'orbital_strike', name: 'Orbital Bombardement', icon: '🎯', desc: 'Automatisches orbitales Bombardement',
            cost: 3000, unlockLevel: 14, type: 'autoAttack',
            color: '#ff2244', dps: 50
        },
        {
            id: 'auto_nuke', name: 'Auto-Nuklear', icon: '☢️', desc: 'Feuert automatisch Atomraketen',
            cost: 5000, unlockLevel: 18, type: 'autoNuke',
            color: '#ffcc00', dps: 200, cooldown: 5
        }
    ]
};

PD.LEVELS = [];
for (let i = 0; i < PD.PLANETS.length; i++) {
    const p = PD.PLANETS[i];
    PD.LEVELS.push({
        level: i + 1,
        planetId: p.id,
        xpRequired: (i + 1) * 100,
        description: `Zerstöre ${p.name}`
    });
}

PD.formatNumber = function(n) {
    if (n >= 1e12) return (n / 1e12).toFixed(1) + ' Bio.';
    if (n >= 1e9) return (n / 1e9).toFixed(1) + ' Mrd.';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + ' Mio.';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return Math.floor(n).toString();
};

PD.formatPop = function(n) {
    if (n === 0) return 'Unbewohnt';
    if (n === 1) return '1 Entität';
    if (n >= 1e9) return (n / 1e9).toFixed(1) + ' Mrd.';
    if (n >= 1e6) return (n / 1e6).toFixed(0) + ' Mio.';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
};

PD.sizeLabel = function(r) {
    if (r <= 85) return 'Winzig';
    if (r <= 100) return 'Klein';
    if (r <= 115) return 'Mittel';
    if (r <= 135) return 'Groß';
    if (r <= 155) return 'Riesig';
    return 'Kolossal';
};
