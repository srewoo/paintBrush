const cloud = 'M0 30 Q0 10 20 12 Q28 -8 50 -2 Q68 -10 78 10 Q98 12 96 30 Z';
const road = '<rect x="25" y="318" width="350" height="55" rx="8"/>';
const face = (x, y) => `<circle class="k" cx="${x}" cy="${y}" r="7"/><path class="l" d="M${x - 14} ${y + 22} Q${x} ${y + 34} ${x + 14} ${y + 22}"/>`;
const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle class="l" cx="${x}" cy="${y}" r="${Math.round(r / 3)}"/>`;

export default [
  { title: 'Car', art: `
<path transform="translate(250 40) scale(1.2)" d="${cloud}"/>
${road}
<path d="M40 300 L40 220 Q40 190 72 190 L105 190 Q118 115 180 115 L238 115 Q290 115 305 190 L330 190 Q362 190 362 222 L362 300 Z"/>
<path d="M126 185 Q136 135 178 135 L200 135 L200 185 Z"/>
<path d="M218 135 L238 135 Q276 135 286 185 L218 185 Z"/>
${face(332, 225)}
${wheel(118, 300, 42)}${wheel(288, 300, 42)}` },

  { title: 'Truck', art: `
<path transform="translate(40 30) scale(1.1)" d="${cloud}"/>
${road}
<rect x="32" y="125" width="205" height="175" rx="12"/>
<path d="M245 300 L245 172 Q245 158 260 158 L310 158 Q325 158 335 175 L362 228 Q368 240 368 252 L368 300 Z"/>
<path d="M262 178 L308 178 L336 232 L262 232 Z"/>
${face(338, 258)}
${wheel(100, 302, 40)}${wheel(298, 302, 40)}` },

  { title: 'Bus', art: `
<path transform="translate(140 25) scale(1.2)" d="${cloud}"/>
${road}
<rect x="32" y="105" width="336" height="190" rx="28"/>
<rect x="55" y="130" width="70" height="65" rx="10"/>
<rect x="140" y="130" width="70" height="65" rx="10"/>
<rect x="225" y="130" width="70" height="65" rx="10"/>
<rect x="308" y="130" width="45" height="90" rx="10"/>
${face(318, 248)}
${wheel(105, 298, 38)}${wheel(280, 298, 38)}` },

  { title: 'Train', art: `
<path transform="translate(255 30) scale(1.15)" d="${cloud}"/>
<rect x="25" y="318" width="350" height="45" rx="8"/>
<path d="M270 185 L258 105 L322 105 L310 185 Z"/>
<rect x="150" y="170" width="215" height="135" rx="22"/>
<rect x="40" y="110" width="135" height="195" rx="14"/>
<rect x="65" y="135" width="85" height="70" rx="10"/>
${face(330, 225)}
${wheel(100, 305, 34)}${wheel(205, 305, 34)}${wheel(305, 305, 34)}` },

  { title: 'Airplane', art: `
<path transform="translate(240 30) scale(1.2)" d="${cloud}"/>
<path d="M128 168C105 158 92 132 82 110Q74 94 60 98Q46 102 46 118L42 178Q42 200 70 216C110 250 150 266 205 266L295 266C352 266 378 244 378 215C378 186 352 164 295 164L170 164Q145 164 128 168Z"/>
<path d="M262 236C246 272 212 306 178 330Q156 344 144 330Q136 316 150 296L180 240Q220 222 262 236Z"/>
<path d="M40 196Q75 186 112 200Q118 214 104 220Q70 226 44 214Q34 204 40 196Z"/>
<circle cx="165" cy="198" r="21"/><circle cx="220" cy="198" r="21"/><circle cx="275" cy="198" r="21"/>
${face(338, 205)}` },

  { title: 'Rocket', art: `
<circle cx="80" cy="80" r="45"/>
<path d="M155 310 Q165 360 200 378 Q235 360 245 310 Z"/>
<path d="M150 215 L92 290 L95 335 L155 310 Z"/>
<path d="M250 215 L308 290 L305 335 L245 310 Z"/>
<path d="M140 140 L260 140 L260 298 Q260 315 243 315 L157 315 Q140 315 140 298 Z"/>
<path d="M140 145 Q140 75 200 28 Q260 75 260 145 Z"/>
<circle cx="200" cy="215" r="42"/>
<circle class="k" cx="185" cy="207" r="6"/><circle class="k" cx="215" cy="207" r="6"/>
<path class="l" d="M186 228 Q200 240 214 228"/>` },

  { title: 'Boat', art: `
<circle cx="75" cy="75" r="40"/>
<path d="M210 55 L210 232 L335 232 Z"/>
<path d="M190 90 L190 232 L85 232 Z"/>
<path class="l" d="M200 45 L200 245"/>
<path d="M45 245 L355 245 Q345 325 290 325 L110 325 Q55 325 45 245 Z"/>
<circle class="k" cx="175" cy="263" r="7"/><circle class="k" cx="225" cy="263" r="7"/>
<path class="l" d="M182 278 Q200 290 218 278"/>
<path d="M25 305 Q62 285 100 305 Q137 325 175 305 Q212 285 250 305 Q287 325 325 305 Q350 292 375 300 L375 372 L25 372 Z"/>` },

  { title: 'Tractor', art: `
<path transform="translate(240 35) scale(1.2)" d="${cloud}"/>
${road}
<rect x="180" y="195" width="175" height="100" rx="16"/>
<path d="M65 290 L65 105 Q65 90 80 90 L200 90 Q215 90 215 105 L215 290 Z"/>
<rect x="88" y="112" width="104" height="80" rx="10"/>
${face(322, 225)}
${wheel(122, 280, 72)}${wheel(305, 305, 45)}` },

  { title: 'Helicopter', art: `
<path transform="translate(285 100)" d="${cloud}"/>
<rect x="30" y="62" width="300" height="20" rx="10"/>
<path class="l" d="M180 82V112M135 285L128 320M210 285L217 320"/>
<rect x="70" y="316" width="210" height="18" rx="9"/>
<path d="M230 168C280 172 320 176 350 178L350 204C310 208 270 216 230 234Z"/>
<circle cx="350" cy="191" r="30"/><path class="l" d="M350 168V214M327 191H373"/>
<path d="M75 200C75 140 120 108 178 108C236 108 268 150 268 200C268 255 228 290 172 290C112 290 75 255 75 200Z"/>
<circle cx="212" cy="178" r="32"/>
<circle class="k" cx="112" cy="190" r="8"/><circle class="k" cx="148" cy="190" r="8"/>
<path class="l" d="M112 222Q130 238 148 222"/>` },

  { title: 'Scooter', art: `<path transform="translate(255 30) scale(1.1)" d="${cloud}"/>
<path d="M-20 320H420V420H-20Z"/>
<path d="M205 240C195 190 220 170 255 170H322C350 170 360 200 345 240Z"/>
<path d="M100 292C100 283 106 278 115 278H182C186 225 222 198 278 198C338 198 368 238 365 282C364 300 352 307 335 307H112C104 307 100 300 100 292Z"/>
<path class="l" d="M128 140L150 92M185 84L218 62"/><circle class="k" cx="220" cy="61" r="10"/>
<rect x="130" y="76" width="70" height="22" rx="11" transform="rotate(-12 165 87)"/>
<path d="M66 300C46 245 52 172 96 142Q125 124 158 140Q178 152 172 182C164 225 164 265 180 300Z"/>
<circle cx="118" cy="112" r="28"/>
<circle class="k" cx="100" cy="196" r="10"/><circle class="k" cx="140" cy="196" r="10"/><path class="l" d="M100 226Q120 244 140 226"/>
<circle cx="290" cy="305" r="42"/><circle class="l" cx="290" cy="305" r="14"/>
<circle cx="115" cy="305" r="42"/><circle class="l" cx="115" cy="305" r="14"/>` },
];
