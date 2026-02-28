// 50 unique aliens with base stats, costs, and visual data
export const aliens = [
  // Tier 1 - Starter aliens (cheap, basic)
  { id: 'alien_001', name: 'Zyx', baseAttack: 10, baseDefense: 5, baseSpeed: 3, baseHP: 100, cost: 0, color: '#00ff00', sprite: 'blob', tier: 1, hitSound: 'boop' },
  { id: 'alien_002', name: 'Blorp', baseAttack: 12, baseDefense: 4, baseSpeed: 3.5, baseHP: 90, cost: 200, color: '#00ffaa', sprite: 'blob', tier: 1, hitSound: 'non' },
  { id: 'alien_003', name: 'Glim', baseAttack: 8, baseDefense: 7, baseSpeed: 2.5, baseHP: 120, cost: 250, color: '#aaffaa', sprite: 'round', tier: 1, hitSound: 'yEny' },
  { id: 'alien_004', name: 'Skree', baseAttack: 15, baseDefense: 3, baseSpeed: 4, baseHP: 70, cost: 300, color: '#ffff00', sprite: 'spiky', tier: 1, hitSound: 'blep' },
  { id: 'alien_005', name: 'Morp', baseAttack: 9, baseDefense: 6, baseSpeed: 3, baseHP: 110, cost: 280, color: '#88ff88', sprite: 'blob', tier: 1, hitSound: 'skrrt' },
  
  // Tier 2 - Early game
  { id: 'alien_006', name: 'Vexar', baseAttack: 18, baseDefense: 8, baseSpeed: 3.5, baseHP: 130, cost: 500, color: '#ff6600', sprite: 'angular', tier: 2, hitSound: 'wonk' },
  { id: 'alien_007', name: 'Krix', baseAttack: 22, baseDefense: 5, baseSpeed: 4.5, baseHP: 100, cost: 550, color: '#ff3300', sprite: 'spiky', tier: 2, hitSound: 'plop' },
  { id: 'alien_008', name: 'Thulm', baseAttack: 14, baseDefense: 12, baseSpeed: 2.5, baseHP: 160, cost: 600, color: '#8888ff', sprite: 'round', tier: 2, hitSound: 'zorp' },
  { id: 'alien_009', name: 'Zixel', baseAttack: 20, baseDefense: 7, baseSpeed: 4, baseHP: 120, cost: 580, color: '#ff00ff', sprite: 'angular', tier: 2, hitSound: 'nyeh' },
  { id: 'alien_010', name: 'Prax', baseAttack: 16, baseDefense: 10, baseSpeed: 3, baseHP: 140, cost: 620, color: '#00ffff', sprite: 'blob', tier: 2, hitSound: 'bwah' },
  
  // Tier 3 - Mid game
  { id: 'alien_011', name: 'Drexel', baseAttack: 28, baseDefense: 10, baseSpeed: 4, baseHP: 150, cost: 900, color: '#ff4444', sprite: 'angular', tier: 3, hitSound: 'glurp' },
  { id: 'alien_012', name: 'Glutch', baseAttack: 20, baseDefense: 15, baseSpeed: 3, baseHP: 200, cost: 950, color: '#44ff44', sprite: 'round', tier: 3, hitSound: 'thwip' },
  { id: 'alien_013', name: 'Nyx', baseAttack: 35, baseDefense: 6, baseSpeed: 5, baseHP: 110, cost: 1000, color: '#aa00ff', sprite: 'spiky', tier: 3, hitSound: 'splonk' },
  { id: 'alien_014', name: 'Orbus', baseAttack: 24, baseDefense: 12, baseSpeed: 3.5, baseHP: 170, cost: 980, color: '#ffaa00', sprite: 'round', tier: 3, hitSound: 'vroop' },
  { id: 'alien_015', name: 'Scrix', baseAttack: 30, baseDefense: 8, baseSpeed: 4.5, baseHP: 130, cost: 1050, color: '#ff0066', sprite: 'spiky', tier: 3, hitSound: 'meep' },
  { id: 'alien_016', name: 'Threx', baseAttack: 26, baseDefense: 14, baseSpeed: 3, baseHP: 180, cost: 1100, color: '#6600ff', sprite: 'angular', tier: 3, hitSound: 'narp' },
  { id: 'alien_017', name: 'Vorn', baseAttack: 22, baseDefense: 18, baseSpeed: 2.5, baseHP: 220, cost: 1150, color: '#0066ff', sprite: 'round', tier: 3, hitSound: 'flob' },
  { id: 'alien_018', name: 'Wrix', baseAttack: 32, baseDefense: 9, baseSpeed: 4, baseHP: 140, cost: 1080, color: '#ff6699', sprite: 'spiky', tier: 3, hitSound: 'skwee' },
  { id: 'alien_019', name: 'Xarn', baseAttack: 28, baseDefense: 11, baseSpeed: 3.5, baseHP: 160, cost: 1120, color: '#99ff00', sprite: 'angular', tier: 3, hitSound: 'blurb' },
  { id: 'alien_020', name: 'Yex', baseAttack: 25, baseDefense: 13, baseSpeed: 3.5, baseHP: 175, cost: 1080, color: '#00ff99', sprite: 'blob', tier: 3, hitSound: 'zonk' },
  
  // Tier 4 - Late-mid game
  { id: 'alien_021', name: 'Zargon', baseAttack: 40, baseDefense: 15, baseSpeed: 4, baseHP: 200, cost: 1600, color: '#ff2222', sprite: 'angular', tier: 4, hitSound: 'plink' },
  { id: 'alien_022', name: 'Blithrax', baseAttack: 35, baseDefense: 20, baseSpeed: 3.5, baseHP: 240, cost: 1700, color: '#22ff22', sprite: 'round', tier: 4, hitSound: 'thonk' },
  { id: 'alien_023', name: 'Cruxel', baseAttack: 45, baseDefense: 12, baseSpeed: 5, baseHP: 170, cost: 1750, color: '#ff00aa', sprite: 'spiky', tier: 4, hitSound: 'wibble' },
  { id: 'alien_024', name: 'Dravix', baseAttack: 38, baseDefense: 18, baseSpeed: 4, baseHP: 210, cost: 1680, color: '#aa00aa', sprite: 'angular', tier: 4, hitSound: 'zzing' },
  { id: 'alien_025', name: 'Ethrix', baseAttack: 42, baseDefense: 14, baseSpeed: 4.5, baseHP: 190, cost: 1720, color: '#ffff44', sprite: 'spiky', tier: 4, hitSound: 'kablam' },
  { id: 'alien_026', name: 'Fluxor', baseAttack: 36, baseDefense: 22, baseSpeed: 3, baseHP: 260, cost: 1800, color: '#44ffff', sprite: 'round', tier: 4, hitSound: 'fwip' },
  { id: 'alien_027', name: 'Grexil', baseAttack: 50, baseDefense: 10, baseSpeed: 5.5, baseHP: 150, cost: 1850, color: '#ff8800', sprite: 'spiky', tier: 4, hitSound: 'squonk' },
  { id: 'alien_028', name: 'Huxley', baseAttack: 40, baseDefense: 16, baseSpeed: 4, baseHP: 220, cost: 1780, color: '#8800ff', sprite: 'angular', tier: 4, hitSound: 'blap' },
  { id: 'alien_029', name: 'Ixion', baseAttack: 44, baseDefense: 15, baseSpeed: 4.5, baseHP: 200, cost: 1820, color: '#00ff66', sprite: 'blob', tier: 4, hitSound: 'vrrt' },
  { id: 'alien_030', name: 'Juxtar', baseAttack: 38, baseDefense: 19, baseSpeed: 3.5, baseHP: 230, cost: 1750, color: '#6666ff', sprite: 'round', tier: 4, hitSound: 'noot' },
  
  // Tier 5 - Late game
  { id: 'alien_031', name: 'Kronix', baseAttack: 55, baseDefense: 22, baseSpeed: 4.5, baseHP: 280, cost: 2500, color: '#ff1111', sprite: 'angular', tier: 5, hitSound: 'pew' },
  { id: 'alien_032', name: 'Luxar', baseAttack: 50, baseDefense: 28, baseSpeed: 4, baseHP: 320, cost: 2600, color: '#11ff11', sprite: 'round', tier: 5, hitSound: 'boing' },
  { id: 'alien_033', name: 'Mordex', baseAttack: 65, baseDefense: 18, baseSpeed: 5.5, baseHP: 240, cost: 2700, color: '#ff11ff', sprite: 'spiky', tier: 5, hitSound: 'splat' },
  { id: 'alien_034', name: 'Nexar', baseAttack: 58, baseDefense: 24, baseSpeed: 4.5, baseHP: 290, cost: 2650, color: '#ffaa44', sprite: 'angular', tier: 5, hitSound: 'zap' },
  { id: 'alien_035', name: 'Oxulon', baseAttack: 52, baseDefense: 30, baseSpeed: 3.5, baseHP: 350, cost: 2750, color: '#44aaff', sprite: 'round', tier: 5, hitSound: 'whump' },
  { id: 'alien_036', name: 'Praxus', baseAttack: 60, baseDefense: 20, baseSpeed: 5, baseHP: 260, cost: 2580, color: '#aa44ff', sprite: 'spiky', tier: 5, hitSound: 'bonk' },
  { id: 'alien_037', name: 'Quorix', baseAttack: 55, baseDefense: 26, baseSpeed: 4, baseHP: 300, cost: 2680, color: '#ffff11', sprite: 'blob', tier: 5, hitSound: 'sproink' },
  { id: 'alien_038', name: 'Raxion', baseAttack: 62, baseDefense: 21, baseSpeed: 5, baseHP: 275, cost: 2720, color: '#11ffff', sprite: 'angular', tier: 5, hitSound: 'flarp' },
  { id: 'alien_039', name: 'Sythex', baseAttack: 58, baseDefense: 25, baseSpeed: 4.5, baseHP: 295, cost: 2650, color: '#ff4488', sprite: 'spiky', tier: 5, hitSound: 'gleep' },
  { id: 'alien_040', name: 'Thraxus', baseAttack: 54, baseDefense: 28, baseSpeed: 4, baseHP: 310, cost: 2600, color: '#88ff44', sprite: 'round', tier: 5, hitSound: 'skree' },
  
  // Tier 6 - End game (legendary)
  { id: 'alien_041', name: 'Ultrax', baseAttack: 75, baseDefense: 35, baseSpeed: 5, baseHP: 400, cost: 4000, color: '#ff0000', sprite: 'legendary', tier: 6, hitSound: 'blort' },
  { id: 'alien_042', name: 'Vortexus', baseAttack: 80, baseDefense: 30, baseSpeed: 5.5, baseHP: 380, cost: 4200, color: '#00ff00', sprite: 'legendary', tier: 6, hitSound: 'twang' },
  { id: 'alien_043', name: 'Wraithon', baseAttack: 90, baseDefense: 25, baseSpeed: 6, baseHP: 350, cost: 4500, color: '#9900ff', sprite: 'legendary', tier: 6, hitSound: 'plonk' },
  { id: 'alien_044', name: 'Xenarch', baseAttack: 70, baseDefense: 40, baseSpeed: 4.5, baseHP: 450, cost: 4300, color: '#ff9900', sprite: 'legendary', tier: 6, hitSound: 'wump' },
  { id: 'alien_045', name: 'Yggdrax', baseAttack: 85, baseDefense: 32, baseSpeed: 5, baseHP: 420, cost: 4600, color: '#0099ff', sprite: 'legendary', tier: 6, hitSound: 'fizz' },
  { id: 'alien_046', name: 'Zephyron', baseAttack: 78, baseDefense: 35, baseSpeed: 5.5, baseHP: 400, cost: 4400, color: '#ff0099', sprite: 'legendary', tier: 6, hitSound: 'crunch' },
  { id: 'alien_047', name: 'Apocalyx', baseAttack: 95, baseDefense: 28, baseSpeed: 5.5, baseHP: 370, cost: 5000, color: '#990000', sprite: 'legendary', tier: 6, hitSound: 'bwoop' },
  { id: 'alien_048', name: 'Behemox', baseAttack: 65, baseDefense: 50, baseSpeed: 3.5, baseHP: 550, cost: 5200, color: '#009900', sprite: 'legendary', tier: 6, hitSound: 'splork' },
  { id: 'alien_049', name: 'Cosmorn', baseAttack: 88, baseDefense: 38, baseSpeed: 5, baseHP: 430, cost: 5500, color: '#9900ff', sprite: 'legendary', tier: 6, hitSound: 'thud' },
  { id: 'alien_050', name: 'Devastar', baseAttack: 100, baseDefense: 40, baseSpeed: 5.5, baseHP: 500, cost: 6000, color: '#ffffff', sprite: 'legendary', tier: 6, hitSound: 'ping' },

  // Tier 1 - Additional starter aliens
  { id: 'alien_051', name: 'Flib', baseAttack: 11, baseDefense: 4, baseSpeed: 3.2, baseHP: 95, cost: 180, color: '#33ff66', sprite: 'blob', tier: 1, hitSound: 'swoosh' },
  { id: 'alien_052', name: 'Gorp', baseAttack: 7, baseDefense: 8, baseSpeed: 2.8, baseHP: 125, cost: 270, color: '#66ffcc', sprite: 'round', tier: 1, hitSound: 'zing' },
  { id: 'alien_053', name: 'Quib', baseAttack: 14, baseDefense: 3, baseSpeed: 4.2, baseHP: 65, cost: 320, color: '#ccff00', sprite: 'spiky', tier: 1, hitSound: 'blam' },
  { id: 'alien_054', name: 'Drip', baseAttack: 10, baseDefense: 5, baseSpeed: 3.3, baseHP: 105, cost: 240, color: '#00ff88', sprite: 'blob', tier: 1, hitSound: 'krunk' },
  { id: 'alien_055', name: 'Snex', baseAttack: 13, baseDefense: 4, baseSpeed: 3.8, baseHP: 85, cost: 290, color: '#88ffaa', sprite: 'spiky', tier: 1, hitSound: 'floop' },
  { id: 'alien_056', name: 'Plik', baseAttack: 8, baseDefense: 6, baseSpeed: 3.0, baseHP: 115, cost: 260, color: '#aaffcc', sprite: 'round', tier: 1, hitSound: 'whee' },
  { id: 'alien_057', name: 'Zub', baseAttack: 12, baseDefense: 5, baseSpeed: 3.4, baseHP: 98, cost: 230, color: '#44ff88', sprite: 'blob', tier: 1, hitSound: 'squish' },
  { id: 'alien_058', name: 'Trix', baseAttack: 16, baseDefense: 2, baseSpeed: 4.5, baseHP: 60, cost: 340, color: '#ffcc33', sprite: 'spiky', tier: 1, hitSound: 'clonk' },
  { id: 'alien_059', name: 'Blob', baseAttack: 6, baseDefense: 9, baseSpeed: 2.5, baseHP: 135, cost: 300, color: '#55ff99', sprite: 'round', tier: 1, hitSound: 'doof' },
  { id: 'alien_060', name: 'Nixle', baseAttack: 11, baseDefense: 6, baseSpeed: 3.1, baseHP: 102, cost: 255, color: '#77ffbb', sprite: 'blob', tier: 1, hitSound: 'ploop' },

  // Tier 2 - Additional early game
  { id: 'alien_061', name: 'Braxil', baseAttack: 19, baseDefense: 7, baseSpeed: 3.8, baseHP: 125, cost: 520, color: '#ff7733', sprite: 'angular', tier: 2, hitSound: 'yoink' },
  { id: 'alien_062', name: 'Clux', baseAttack: 24, baseDefense: 4, baseSpeed: 4.8, baseHP: 95, cost: 570, color: '#ff4422', sprite: 'spiky', tier: 2, hitSound: 'sploosh' },
  { id: 'alien_063', name: 'Druul', baseAttack: 13, baseDefense: 14, baseSpeed: 2.3, baseHP: 175, cost: 640, color: '#9999ff', sprite: 'round', tier: 2, hitSound: 'bweep' },
  { id: 'alien_064', name: 'Frex', baseAttack: 21, baseDefense: 6, baseSpeed: 4.2, baseHP: 115, cost: 560, color: '#ee00ee', sprite: 'angular', tier: 2, hitSound: 'kachow' },
  { id: 'alien_065', name: 'Glix', baseAttack: 15, baseDefense: 11, baseSpeed: 2.8, baseHP: 150, cost: 610, color: '#00eeee', sprite: 'blob', tier: 2, hitSound: 'flump' },
  { id: 'alien_066', name: 'Horix', baseAttack: 23, baseDefense: 5, baseSpeed: 4.6, baseHP: 105, cost: 590, color: '#ff5500', sprite: 'spiky', tier: 2, hitSound: 'skronk' },
  { id: 'alien_067', name: 'Jolt', baseAttack: 17, baseDefense: 9, baseSpeed: 3.3, baseHP: 138, cost: 545, color: '#ffdd00', sprite: 'angular', tier: 2, hitSound: 'blip' },
  { id: 'alien_068', name: 'Kreel', baseAttack: 20, baseDefense: 8, baseSpeed: 3.6, baseHP: 128, cost: 535, color: '#dd00ff', sprite: 'blob', tier: 2, hitSound: 'thwack' },
  { id: 'alien_069', name: 'Lurm', baseAttack: 12, baseDefense: 13, baseSpeed: 2.6, baseHP: 165, cost: 625, color: '#7788ff', sprite: 'round', tier: 2, hitSound: 'zoing' },
  { id: 'alien_070', name: 'Mixel', baseAttack: 22, baseDefense: 6, baseSpeed: 4.0, baseHP: 118, cost: 575, color: '#ff0088', sprite: 'spiky', tier: 2, hitSound: 'nee' },
  { id: 'alien_071', name: 'Norx', baseAttack: 18, baseDefense: 10, baseSpeed: 3.2, baseHP: 142, cost: 605, color: '#00ff77', sprite: 'angular', tier: 2, hitSound: 'brrp' },
  { id: 'alien_072', name: 'Plex', baseAttack: 25, baseDefense: 4, baseSpeed: 5.0, baseHP: 88, cost: 595, color: '#ff2200', sprite: 'spiky', tier: 2, hitSound: 'gwak' },

  // Tier 3 - Additional mid game
  { id: 'alien_073', name: 'Axorn', baseAttack: 27, baseDefense: 11, baseSpeed: 3.8, baseHP: 155, cost: 920, color: '#ff5555', sprite: 'angular', tier: 3, hitSound: 'plorp' },
  { id: 'alien_074', name: 'Brivex', baseAttack: 21, baseDefense: 16, baseSpeed: 2.8, baseHP: 210, cost: 970, color: '#55ff55', sprite: 'round', tier: 3, hitSound: 'snork' },
  { id: 'alien_075', name: 'Crimex', baseAttack: 36, baseDefense: 5, baseSpeed: 5.2, baseHP: 105, cost: 1020, color: '#bb00ff', sprite: 'spiky', tier: 3, hitSound: 'bwee' },
  { id: 'alien_076', name: 'Dexil', baseAttack: 23, baseDefense: 13, baseSpeed: 3.3, baseHP: 175, cost: 960, color: '#ffbb00', sprite: 'round', tier: 3, hitSound: 'klonk' },
  { id: 'alien_077', name: 'Exor', baseAttack: 31, baseDefense: 7, baseSpeed: 4.7, baseHP: 125, cost: 1030, color: '#ff0077', sprite: 'spiky', tier: 3, hitSound: 'fzzt' },
  { id: 'alien_078', name: 'Flurn', baseAttack: 25, baseDefense: 15, baseSpeed: 2.8, baseHP: 190, cost: 1090, color: '#7700ff', sprite: 'angular', tier: 3, hitSound: 'whomp' },
  { id: 'alien_079', name: 'Grux', baseAttack: 29, baseDefense: 10, baseSpeed: 4.2, baseHP: 145, cost: 1010, color: '#ff7788', sprite: 'spiky', tier: 3, hitSound: 'blunk' },
  { id: 'alien_080', name: 'Helux', baseAttack: 33, baseDefense: 8, baseSpeed: 4.4, baseHP: 135, cost: 1070, color: '#88ff00', sprite: 'angular', tier: 3, hitSound: 'skwonk' },
  { id: 'alien_081', name: 'Irix', baseAttack: 24, baseDefense: 14, baseSpeed: 3.2, baseHP: 185, cost: 1060, color: '#00ff88', sprite: 'blob', tier: 3, hitSound: 'nyoom' },
  { id: 'alien_082', name: 'Jexar', baseAttack: 30, baseDefense: 9, baseSpeed: 4.0, baseHP: 150, cost: 990, color: '#ff8866', sprite: 'spiky', tier: 3, hitSound: 'glop' },
  { id: 'alien_083', name: 'Klorn', baseAttack: 26, baseDefense: 12, baseSpeed: 3.6, baseHP: 165, cost: 1040, color: '#6688ff', sprite: 'angular', tier: 3, hitSound: 'fwap' },
  { id: 'alien_084', name: 'Lixus', baseAttack: 34, baseDefense: 6, baseSpeed: 4.8, baseHP: 115, cost: 1055, color: '#ff00aa', sprite: 'spiky', tier: 3, hitSound: 'zrrt' },
  { id: 'alien_085', name: 'Morlix', baseAttack: 22, baseDefense: 17, baseSpeed: 2.6, baseHP: 215, cost: 1130, color: '#0077ff', sprite: 'round', tier: 3, hitSound: 'plunk' },
  { id: 'alien_086', name: 'Nexil', baseAttack: 28, baseDefense: 11, baseSpeed: 3.7, baseHP: 158, cost: 1015, color: '#ff6655', sprite: 'angular', tier: 3, hitSound: 'bweeb' },

  // Tier 4 - Additional late-mid game
  { id: 'alien_087', name: 'Axulon', baseAttack: 41, baseDefense: 14, baseSpeed: 4.2, baseHP: 195, cost: 1620, color: '#ff3333', sprite: 'angular', tier: 4, hitSound: 'spork' },
  { id: 'alien_088', name: 'Bexor', baseAttack: 36, baseDefense: 21, baseSpeed: 3.3, baseHP: 245, cost: 1720, color: '#33ff33', sprite: 'round', tier: 4, hitSound: 'thunk' },
  { id: 'alien_089', name: 'Craxus', baseAttack: 48, baseDefense: 11, baseSpeed: 5.2, baseHP: 165, cost: 1780, color: '#ff00bb', sprite: 'spiky', tier: 4, hitSound: 'womp' },
  { id: 'alien_090', name: 'Dexron', baseAttack: 39, baseDefense: 17, baseSpeed: 4.2, baseHP: 205, cost: 1660, color: '#bb00bb', sprite: 'angular', tier: 4, hitSound: 'blarg' },
  { id: 'alien_091', name: 'Exulon', baseAttack: 43, baseDefense: 13, baseSpeed: 4.7, baseHP: 185, cost: 1740, color: '#ffff55', sprite: 'spiky', tier: 4, hitSound: 'skrunk' },
  { id: 'alien_092', name: 'Fraxil', baseAttack: 37, baseDefense: 23, baseSpeed: 2.8, baseHP: 270, cost: 1820, color: '#55ffff', sprite: 'round', tier: 4, hitSound: 'plip' },
  { id: 'alien_093', name: 'Grexon', baseAttack: 52, baseDefense: 9, baseSpeed: 5.7, baseHP: 145, cost: 1870, color: '#ff9900', sprite: 'spiky', tier: 4, hitSound: 'zwoop' },
  { id: 'alien_094', name: 'Hexil', baseAttack: 42, baseDefense: 15, baseSpeed: 4.2, baseHP: 215, cost: 1760, color: '#9900ff', sprite: 'angular', tier: 4, hitSound: 'gorp' },
  { id: 'alien_095', name: 'Ixulon', baseAttack: 46, baseDefense: 14, baseSpeed: 4.6, baseHP: 198, cost: 1800, color: '#00ff55', sprite: 'blob', tier: 4, hitSound: 'bleep' },
  { id: 'alien_096', name: 'Jexor', baseAttack: 40, baseDefense: 18, baseSpeed: 3.7, baseHP: 225, cost: 1730, color: '#5555ff', sprite: 'round', tier: 4, hitSound: 'squawk' },
  { id: 'alien_097', name: 'Kluxar', baseAttack: 44, baseDefense: 16, baseSpeed: 4.0, baseHP: 208, cost: 1770, color: '#ff5588', sprite: 'angular', tier: 4, hitSound: 'flonk' },
  { id: 'alien_098', name: 'Lexon', baseAttack: 49, baseDefense: 12, baseSpeed: 5.0, baseHP: 175, cost: 1840, color: '#88ff55', sprite: 'spiky', tier: 4, hitSound: 'worp' },
  { id: 'alien_099', name: 'Muxar', baseAttack: 38, baseDefense: 20, baseSpeed: 3.5, baseHP: 235, cost: 1710, color: '#55ff88', sprite: 'round', tier: 4, hitSound: 'zlorp' },
  { id: 'alien_100', name: 'Noxil', baseAttack: 47, baseDefense: 13, baseSpeed: 4.8, baseHP: 188, cost: 1810, color: '#ff88aa', sprite: 'spiky', tier: 4, hitSound: 'nyah' },

  // Tier 5 - Additional late game
  { id: 'alien_101', name: 'Axelus', baseAttack: 56, baseDefense: 21, baseSpeed: 4.7, baseHP: 275, cost: 2520, color: '#ff2222', sprite: 'angular', tier: 5, hitSound: 'thwop' },
  { id: 'alien_102', name: 'Brexar', baseAttack: 51, baseDefense: 27, baseSpeed: 4.2, baseHP: 315, cost: 2580, color: '#22ff22', sprite: 'round', tier: 5, hitSound: 'skloop' },
  { id: 'alien_103', name: 'Cruxel', baseAttack: 67, baseDefense: 17, baseSpeed: 5.7, baseHP: 235, cost: 2720, color: '#ff22ff', sprite: 'spiky', tier: 5, hitSound: 'bwonk' },
  { id: 'alien_104', name: 'Drexus', baseAttack: 59, baseDefense: 23, baseSpeed: 4.7, baseHP: 285, cost: 2630, color: '#ffbb55', sprite: 'angular', tier: 5, hitSound: 'glunk' },
  { id: 'alien_105', name: 'Exalon', baseAttack: 53, baseDefense: 29, baseSpeed: 3.7, baseHP: 345, cost: 2730, color: '#55bbff', sprite: 'round', tier: 5, hitSound: 'poing' },
  { id: 'alien_106', name: 'Fruxor', baseAttack: 61, baseDefense: 19, baseSpeed: 5.2, baseHP: 255, cost: 2560, color: '#bb55ff', sprite: 'spiky', tier: 5, hitSound: 'flub' },
  { id: 'alien_107', name: 'Graxel', baseAttack: 57, baseDefense: 25, baseSpeed: 4.2, baseHP: 298, cost: 2660, color: '#ffff22', sprite: 'blob', tier: 5, hitSound: 'zwerk' },
  { id: 'alien_108', name: 'Hexron', baseAttack: 64, baseDefense: 20, baseSpeed: 5.2, baseHP: 270, cost: 2700, color: '#22ffff', sprite: 'angular', tier: 5, hitSound: 'blooey' },
  { id: 'alien_109', name: 'Ixonar', baseAttack: 59, baseDefense: 24, baseSpeed: 4.7, baseHP: 292, cost: 2640, color: '#ff5599', sprite: 'spiky', tier: 5, hitSound: 'skwop' },
  { id: 'alien_110', name: 'Jraxus', baseAttack: 55, baseDefense: 27, baseSpeed: 4.2, baseHP: 305, cost: 2590, color: '#99ff55', sprite: 'round', tier: 5, hitSound: 'nurg' },
  { id: 'alien_111', name: 'Klexar', baseAttack: 63, baseDefense: 22, baseSpeed: 4.9, baseHP: 278, cost: 2680, color: '#ff7744', sprite: 'angular', tier: 5, hitSound: 'splup' },
  { id: 'alien_112', name: 'Luxon', baseAttack: 52, baseDefense: 30, baseSpeed: 3.5, baseHP: 355, cost: 2760, color: '#4477ff', sprite: 'round', tier: 5, hitSound: 'gworp' },
  { id: 'alien_113', name: 'Mrixel', baseAttack: 66, baseDefense: 18, baseSpeed: 5.5, baseHP: 242, cost: 2710, color: '#ff44bb', sprite: 'spiky', tier: 5, hitSound: 'blep blep' },
  { id: 'alien_114', name: 'Nuxar', baseAttack: 58, baseDefense: 26, baseSpeed: 4.4, baseHP: 302, cost: 2670, color: '#bbff44', sprite: 'angular', tier: 5, hitSound: 'boop boop' },

  // Tier 6 - Additional legendary aliens
  { id: 'alien_115', name: 'Astralox', baseAttack: 76, baseDefense: 34, baseSpeed: 5.2, baseHP: 395, cost: 4050, color: '#ff1100', sprite: 'legendary', tier: 6, hitSound: 'nee nee' },
  { id: 'alien_116', name: 'Blazeon', baseAttack: 82, baseDefense: 29, baseSpeed: 5.7, baseHP: 375, cost: 4250, color: '#11ff00', sprite: 'legendary', tier: 6, hitSound: 'yip yip' },
  { id: 'alien_117', name: 'Chronex', baseAttack: 92, baseDefense: 24, baseSpeed: 6.2, baseHP: 345, cost: 4550, color: '#aa00ff', sprite: 'legendary', tier: 6, hitSound: 'zzt zzt' },
  { id: 'alien_118', name: 'Doomix', baseAttack: 72, baseDefense: 38, baseSpeed: 4.7, baseHP: 445, cost: 4350, color: '#ff8800', sprite: 'legendary', tier: 6, hitSound: 'wub wub' },
  { id: 'alien_119', name: 'Eternix', baseAttack: 87, baseDefense: 31, baseSpeed: 5.2, baseHP: 415, cost: 4650, color: '#0088ff', sprite: 'legendary', tier: 6, hitSound: 'nah nah' },
  { id: 'alien_120', name: 'Fatalox', baseAttack: 79, baseDefense: 34, baseSpeed: 5.7, baseHP: 398, cost: 4450, color: '#ff0088', sprite: 'legendary', tier: 6, hitSound: 'eep eep' },
  { id: 'alien_121', name: 'Galaxor', baseAttack: 97, baseDefense: 27, baseSpeed: 5.7, baseHP: 365, cost: 5100, color: '#880000', sprite: 'legendary', tier: 6, hitSound: 'blub blub' },
  { id: 'alien_122', name: 'Havocix', baseAttack: 68, baseDefense: 48, baseSpeed: 3.7, baseHP: 540, cost: 5250, color: '#008800', sprite: 'legendary', tier: 6, hitSound: 'yee' },
  { id: 'alien_123', name: 'Infinox', baseAttack: 89, baseDefense: 37, baseSpeed: 5.2, baseHP: 425, cost: 5550, color: '#8800ff', sprite: 'legendary', tier: 6, hitSound: 'haw' },
  { id: 'alien_124', name: 'Judgex', baseAttack: 84, baseDefense: 33, baseSpeed: 5.5, baseHP: 405, cost: 4500, color: '#ff8844', sprite: 'legendary', tier: 6, hitSound: 'wah' },
  { id: 'alien_125', name: 'Kaosron', baseAttack: 94, baseDefense: 28, baseSpeed: 5.8, baseHP: 358, cost: 4800, color: '#44ff88', sprite: 'legendary', tier: 6, hitSound: 'dink' },
  { id: 'alien_126', name: 'Luminex', baseAttack: 74, baseDefense: 42, baseSpeed: 4.5, baseHP: 470, cost: 4700, color: '#8844ff', sprite: 'legendary', tier: 6, hitSound: 'tonk' },
  { id: 'alien_127', name: 'Maelox', baseAttack: 91, baseDefense: 30, baseSpeed: 5.5, baseHP: 385, cost: 5000, color: '#ffff00', sprite: 'legendary', tier: 6, hitSound: 'splut' },
  { id: 'alien_128', name: 'Nihilon', baseAttack: 98, baseDefense: 26, baseSpeed: 5.9, baseHP: 355, cost: 5300, color: '#00ffff', sprite: 'legendary', tier: 6, hitSound: 'glink' },

  // Additional Tier 1 variety
  { id: 'alien_129', name: 'Wibble', baseAttack: 9, baseDefense: 7, baseSpeed: 2.9, baseHP: 118, cost: 265, color: '#22ff88', sprite: 'round', tier: 1, hitSound: 'zap zap' },
  { id: 'alien_130', name: 'Yorp', baseAttack: 13, baseDefense: 4, baseSpeed: 3.7, baseHP: 88, cost: 295, color: '#ff8822', sprite: 'spiky', tier: 1, hitSound: 'pow' },
  { id: 'alien_131', name: 'Zink', baseAttack: 10, baseDefense: 6, baseSpeed: 3.1, baseHP: 108, cost: 248, color: '#88ff22', sprite: 'blob', tier: 1, hitSound: 'bop' },

  // Additional Tier 2 variety
  { id: 'alien_132', name: 'Qrix', baseAttack: 19, baseDefense: 9, baseSpeed: 3.5, baseHP: 135, cost: 555, color: '#ff6688', sprite: 'angular', tier: 2, hitSound: 'pip' },
  { id: 'alien_133', name: 'Rexil', baseAttack: 23, baseDefense: 6, baseSpeed: 4.3, baseHP: 112, cost: 585, color: '#6688ff', sprite: 'spiky', tier: 2, hitSound: 'squee' },
  { id: 'alien_134', name: 'Slix', baseAttack: 16, baseDefense: 11, baseSpeed: 3.0, baseHP: 148, cost: 615, color: '#88ff66', sprite: 'round', tier: 2, hitSound: 'flick' },

  // Additional Tier 3 variety
  { id: 'alien_135', name: 'Prixon', baseAttack: 29, baseDefense: 10, baseSpeed: 4.1, baseHP: 152, cost: 1005, color: '#ff9966', sprite: 'angular', tier: 3, hitSound: 'snip' },
  { id: 'alien_136', name: 'Qexar', baseAttack: 33, baseDefense: 7, baseSpeed: 4.6, baseHP: 128, cost: 1045, color: '#6699ff', sprite: 'spiky', tier: 3, hitSound: 'splink' },
  { id: 'alien_137', name: 'Ruxil', baseAttack: 24, baseDefense: 14, baseSpeed: 3.3, baseHP: 182, cost: 1075, color: '#99ff66', sprite: 'round', tier: 3, hitSound: 'guh' },
  { id: 'alien_138', name: 'Sixar', baseAttack: 31, baseDefense: 9, baseSpeed: 4.3, baseHP: 142, cost: 1025, color: '#ff66cc', sprite: 'spiky', tier: 3, hitSound: 'meh' },
  { id: 'alien_139', name: 'Tuxel', baseAttack: 27, baseDefense: 12, baseSpeed: 3.6, baseHP: 168, cost: 1055, color: '#cc66ff', sprite: 'angular', tier: 3, hitSound: 'orp' },

  // Additional Tier 4 variety
  { id: 'alien_140', name: 'Oxunar', baseAttack: 43, baseDefense: 16, baseSpeed: 4.1, baseHP: 212, cost: 1755, color: '#ff4466', sprite: 'angular', tier: 4, hitSound: 'urp' },
  { id: 'alien_141', name: 'Prexon', baseAttack: 48, baseDefense: 13, baseSpeed: 4.7, baseHP: 182, cost: 1795, color: '#4466ff', sprite: 'spiky', tier: 4, hitSound: 'norp' },
  { id: 'alien_142', name: 'Quxar', baseAttack: 39, baseDefense: 19, baseSpeed: 3.6, baseHP: 238, cost: 1745, color: '#66ff44', sprite: 'round', tier: 4, hitSound: 'flep' },
  { id: 'alien_143', name: 'Raxil', baseAttack: 45, baseDefense: 15, baseSpeed: 4.3, baseHP: 202, cost: 1785, color: '#ff44aa', sprite: 'angular', tier: 4, hitSound: 'bwip' },
  { id: 'alien_144', name: 'Suxon', baseAttack: 41, baseDefense: 18, baseSpeed: 3.9, baseHP: 222, cost: 1765, color: '#aa44ff', sprite: 'round', tier: 4, hitSound: 'skrit' },

  // Additional Tier 5 variety
  { id: 'alien_145', name: 'Oxelar', baseAttack: 60, baseDefense: 23, baseSpeed: 4.6, baseHP: 288, cost: 2645, color: '#ff3366', sprite: 'angular', tier: 5, hitSound: 'grunk' },
  { id: 'alien_146', name: 'Praxon', baseAttack: 65, baseDefense: 19, baseSpeed: 5.3, baseHP: 252, cost: 2695, color: '#3366ff', sprite: 'spiky', tier: 5, hitSound: 'plerp' },
  { id: 'alien_147', name: 'Qrexar', baseAttack: 54, baseDefense: 28, baseSpeed: 3.9, baseHP: 338, cost: 2745, color: '#66ff33', sprite: 'round', tier: 5, hitSound: 'zwing' },
  { id: 'alien_148', name: 'Ruxon', baseAttack: 62, baseDefense: 21, baseSpeed: 5.0, baseHP: 272, cost: 2685, color: '#ff33cc', sprite: 'angular', tier: 5, hitSound: 'blong' },

  // Additional Tier 6 variety
  { id: 'alien_149', name: 'Omegox', baseAttack: 86, baseDefense: 36, baseSpeed: 5.3, baseHP: 412, cost: 4750, color: '#dd2200', sprite: 'legendary', tier: 6, hitSound: 'twonk' },
  { id: 'alien_150', name: 'Primex', baseAttack: 93, baseDefense: 32, baseSpeed: 5.6, baseHP: 388, cost: 5050, color: '#00dd22', sprite: 'legendary', tier: 6, hitSound: 'squop' },
]

export function getAlienById(id) {
  return aliens.find(a => a.id === id)
}

export function getAliensByTier(tier) {
  return aliens.filter(a => a.tier === tier)
}
