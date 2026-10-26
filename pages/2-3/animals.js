// Toddler animals: one chunky subject, 4-10 big regions, friendly face.
const ground = (y = 335) => `<path d="M25 ${y}Q200 ${y - 40} 375 ${y}V375H25Z"/>`;
const eyes = (x1, x2, y, r = 10) => `<circle class="k" cx="${x1}" cy="${y}" r="${r}"/><circle class="k" cx="${x2}" cy="${y}" r="${r}"/>`;
const smile = (x, y, w = 22) => `<path class="l" d="M${x - w} ${y}Q${x} ${y + w} ${x + w} ${y}"/>`;

export default [
  {
    title: 'Kitty',
    art: `${ground()}
<path d="M265 300Q340 300 330 220Q326 196 345 190Q365 200 355 230Q350 320 270 325Z"/>
<ellipse cx="200" cy="285" rx="85" ry="58"/>
<ellipse cx="160" cy="333" rx="30" ry="17"/><ellipse cx="240" cy="333" rx="30" ry="17"/>
<polygon points="122,130 118,48 185,95"/><polygon points="278,130 282,48 215,95"/>
<circle cx="200" cy="170" r="85"/>
${eyes(168, 232, 160, 11)}
<polygon class="k" points="190,185 210,185 200,196"/>
<path class="l" d="M200 196Q200 212 186 210M200 196Q200 212 214 210"/>
<path class="l" d="M150 190H105M150 202L108 214M250 190H295M250 202L292 214"/>`,
  },
  {
    title: 'Puppy',
    art: `${ground()}
<ellipse cx="290" cy="250" rx="16" ry="34" transform="rotate(35 290 250)"/>
<ellipse cx="200" cy="285" rx="85" ry="58"/>
<ellipse cx="160" cy="333" rx="30" ry="17"/><ellipse cx="240" cy="333" rx="30" ry="17"/>
<circle cx="200" cy="165" r="80"/>
<ellipse cx="125" cy="170" rx="30" ry="60" transform="rotate(20 125 170)"/><ellipse cx="275" cy="170" rx="30" ry="60" transform="rotate(-20 275 170)"/>
<ellipse cx="200" cy="198" rx="44" ry="32"/>
${eyes(168, 232, 148, 11)}
<ellipse class="k" cx="200" cy="184" rx="13" ry="9"/>
<path class="l" d="M200 193V203"/>${smile(200, 205, 18)}`,
  },
  {
    title: 'Fish',
    art: `<circle cx="70" cy="80" r="30"/>
<path d="M280 200L365 120Q345 200 365 280Z"/>
<path d="M115 140Q150 55 255 130Z"/><path d="M135 262Q188 372 245 260Z"/>
<ellipse cx="185" cy="200" rx="120" ry="85"/>
<path d="M180 200Q225 180 240 230Q200 250 180 200Z"/>
<path class="l" d="M135 140Q160 200 135 260"/>
<circle class="k" cx="105" cy="180" r="12"/>${smile(95, 218, 18)}`,
  },
  {
    title: 'Bird',
    art: `${ground()}
<ellipse cx="105" cy="230" rx="30" ry="55" transform="rotate(25 105 230)"/><ellipse cx="295" cy="230" rx="30" ry="55" transform="rotate(-25 295 230)"/>
<path d="M185 112Q160 55 200 40Q205 75 228 58Q250 92 218 112Z"/>
<path class="l" d="M175 300V335M160 340L175 330L190 340M225 300V335M210 340L225 330L240 340"/>
<circle cx="200" cy="200" r="100"/>
<ellipse cx="200" cy="245" rx="62" ry="50"/>
${eyes(165, 235, 165, 12)}
<polygon points="168,186 232,186 200,232"/>`,
  },
  {
    title: 'Bunny',
    art: `${ground()}
<circle cx="285" cy="300" r="26"/>
<ellipse cx="200" cy="290" rx="82" ry="58"/>
<ellipse cx="158" cy="335" rx="32" ry="17"/><ellipse cx="242" cy="335" rx="32" ry="17"/>
<ellipse cx="160" cy="95" rx="28" ry="68" transform="rotate(-12 160 95)"/><ellipse cx="240" cy="95" rx="28" ry="68" transform="rotate(12 240 95)"/>
<circle cx="200" cy="185" r="75"/>
${eyes(172, 228, 172, 11)}
<ellipse class="k" cx="200" cy="198" rx="9" ry="7"/>
<path class="l" d="M200 205Q200 218 188 218M200 205Q200 218 212 218"/>
<path class="l" d="M160 205H120M240 205H280"/>`,
  },
  {
    title: 'Mouse',
    art: `${ground()}
<path class="l" d="M270 310Q340 320 340 270Q340 235 310 240"/>
<ellipse cx="200" cy="290" rx="78" ry="56"/>
<ellipse cx="160" cy="335" rx="30" ry="16"/><ellipse cx="240" cy="335" rx="30" ry="16"/>
<circle cx="125" cy="105" r="50"/><circle cx="275" cy="105" r="50"/>
<circle cx="125" cy="105" r="28"/><circle cx="275" cy="105" r="28"/>
<circle cx="200" cy="180" r="78"/>
${eyes(170, 230, 168, 11)}
<circle class="k" cx="200" cy="198" r="10"/>${smile(200, 214, 18)}
<path class="l" d="M165 200H120M235 200H280"/>`,
  },
  {
    title: 'Ladybug',
    art: `<path d="M28 330C40 220 170 120 378 92C372 245 240 362 28 330Z"/>
<path class="l" d="M50 318Q210 245 360 108"/>
<path class="l" d="M178 92Q165 50 135 40M222 92Q235 50 265 40"/><circle class="k" cx="133" cy="40" r="10"/><circle class="k" cx="267" cy="40" r="10"/>
<path d="M200 128A110 110 0 0 0 200 348Z"/><path d="M200 128A110 110 0 0 1 200 348Z"/>
<circle cx="145" cy="215" r="26"/><circle cx="148" cy="295" r="24"/><circle cx="255" cy="215" r="26"/><circle cx="252" cy="295" r="24"/>
<circle cx="200" cy="125" r="56"/>
<circle class="k" cx="180" cy="115" r="9"/><circle class="k" cx="220" cy="115" r="9"/><path class="l" d="M184 140Q200 155 216 140"/>`,
  },
  {
    title: 'Snail',
    art: `${ground(345)}
<path class="l" d="M80 220L65 160M110 220L120 160"/><circle class="k" cx="64" cy="158" r="10"/><circle class="k" cx="121" cy="158" r="10"/>
<path d="M60 320Q45 250 70 220Q100 200 125 225Q140 255 140 290H320Q370 295 355 315Q340 325 320 322Z"/>
<circle cx="230" cy="195" r="100"/>
<circle cx="230" cy="195" r="45"/>
<path class="l" d="M230 195m-18 0a18 18 0 1 1 18 18"/>
<circle class="k" cx="90" cy="250" r="8"/>${smile(95, 272, 14)}`,
  },
  {
    title: 'Bee',
    art: `<ellipse cx="190" cy="98" rx="52" ry="75" transform="rotate(-25 190 98)"/><ellipse cx="272" cy="100" rx="50" ry="72" transform="rotate(25 272 100)"/>
<path d="M320 200Q370 225 396 240Q370 255 320 280Z"/>
<ellipse cx="200" cy="240" rx="145" ry="115"/>
<path d="M163 129Q200 240 163 351A145 115 0 0 0 220 354Q258 240 220 126A145 115 0 0 0 163 129Z"/>
<path d="M262 136Q295 240 262 344A145 115 0 0 0 305 319Q330 240 305 161A145 115 0 0 0 262 136Z"/>
<path class="l" d="M88 148Q70 110 42 100M122 136Q112 95 115 72"/><circle class="k" cx="40" cy="99" r="11"/><circle class="k" cx="115" cy="68" r="11"/>
<circle class="k" cx="92" cy="225" r="11"/><circle class="k" cx="137" cy="225" r="11"/><path class="l" d="M92 258Q114 278 137 258"/>`,
  },
  {
    title: 'Whale',
    art: `<path d="M150 108C138 80 118 66 88 70C100 48 132 46 156 70C162 40 192 30 218 44C190 50 172 72 168 108Z"/>
<path d="M45 215C45 145 120 105 205 105C262 105 300 130 320 165C324 145 320 122 312 100Q345 104 360 134Q374 106 400 104C396 150 374 178 345 192C335 245 300 292 240 306C210 314 160 314 130 309C75 299 45 264 45 215Z"/>
<path d="M45 215C45 264 75 299 130 309C150 312 175 313 195 312C160 282 95 262 45 215Z"/>
<path d="M168 212Q204 196 232 222Q256 246 262 274Q238 276 212 260Q176 240 168 212Z"/>
<path d="M-20 300Q20 282 60 300T140 300T220 300T300 300T380 300T460 300V420H-20Z"/>
<circle class="k" cx="100" cy="168" r="13"/><path class="l" d="M68 200Q98 220 128 204"/>`,
  },
];
