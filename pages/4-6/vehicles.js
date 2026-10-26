const cloud = 'M0 30 Q0 10 20 12 Q28 -8 50 -2 Q68 -10 78 10 Q98 12 96 30 Z';
const star = '0,-16 4.1,-5.7 15.2,-4.9 6.7,2.2 9.4,12.9 0,7 -9.4,12.9 -6.7,2.2 -15.2,-4.9 -4.1,-5.7';

export default [
  { title: 'Car', art: `
<circle cx="335" cy="70" r="30"/>
<path transform="translate(40 50)" d="${cloud}"/>
<path transform="translate(170 80) scale(.8)" d="${cloud}"/>
<rect x="20" y="300" width="360" height="70"/>
<rect x="40" y="330" width="50" height="12" rx="4"/><rect x="175" y="330" width="50" height="12" rx="4"/><rect x="310" y="330" width="50" height="12" rx="4"/>
<path d="M50 290 L50 245 Q50 220 80 218 L115 215 L148 165 Q156 155 172 155 L258 155 Q272 155 282 167 L318 215 L338 218 Q360 222 360 248 L360 290 Z"/>
<path d="M128 213 L157 172 L205 172 L205 213 Z"/>
<path d="M220 172 L262 172 L295 213 L220 213 Z"/>
<path class="l" d="M212 220 L212 285"/>
<rect x="225" y="232" width="24" height="10" rx="5"/>
<ellipse cx="348" cy="240" rx="10" ry="12"/>
<rect x="44" y="232" width="16" height="22" rx="4"/>
<circle cx="120" cy="292" r="34"/><circle cx="120" cy="292" r="14"/>
<circle cx="290" cy="292" r="34"/><circle cx="290" cy="292" r="14"/>` },

  { title: 'Bus', art: `
<circle cx="70" cy="65" r="30"/>
<path transform="translate(250 40)" d="${cloud}"/>
<rect x="20" y="300" width="360" height="70"/>
<rect x="40" y="330" width="50" height="12" rx="4"/><rect x="175" y="330" width="50" height="12" rx="4"/><rect x="310" y="330" width="50" height="12" rx="4"/>
<rect x="35" y="120" width="330" height="165" rx="20"/>
<rect x="35" y="215" width="330" height="24"/>
<rect x="55" y="138" width="48" height="55" rx="6"/><rect x="115" y="138" width="48" height="55" rx="6"/>
<rect x="175" y="138" width="48" height="55" rx="6"/><rect x="235" y="138" width="48" height="55" rx="6"/>
<rect x="298" y="138" width="50" height="135" rx="6"/>
<path class="l" d="M323 140 L323 272"/>
<rect x="30" y="268" width="340" height="18" rx="9"/>
<circle cx="352" cy="252" r="9"/>
<circle cx="105" cy="290" r="32"/><circle cx="105" cy="290" r="13"/>
<circle cx="265" cy="290" r="32"/><circle cx="265" cy="290" r="13"/>` },

  { title: 'Train', art: `
<circle cx="340" cy="60" r="28"/>
<circle cx="120" cy="88" r="16"/><circle cx="150" cy="60" r="22"/><circle cx="195" cy="40" r="26"/>
<rect x="30" y="328" width="24" height="32"/><rect x="100" y="328" width="24" height="32"/><rect x="170" y="328" width="24" height="32"/><rect x="240" y="328" width="24" height="32"/><rect x="310" y="328" width="24" height="32"/>
<rect x="20" y="325" width="360" height="16" rx="4"/>
<path d="M112 180 L104 128 L90 112 L148 112 L134 128 L128 180 Z"/>
<path d="M160 180 A22 22 0 0 1 204 180 Z"/>
<rect x="70" y="175" width="175" height="100" rx="14"/>
<rect x="230" y="125" width="110" height="150" rx="6"/>
<rect x="218" y="108" width="134" height="24" rx="8"/>
<rect x="255" y="148" width="60" height="50" rx="6"/>
<circle cx="70" cy="215" r="16"/>
<rect x="45" y="265" width="315" height="22" rx="6"/>
<path d="M60 287 L28 322 L60 322 Z"/>
<circle cx="120" cy="300" r="24"/><circle cx="120" cy="300" r="9"/>
<circle cx="185" cy="300" r="24"/><circle cx="185" cy="300" r="9"/>
<circle cx="295" cy="292" r="32"/><circle cx="295" cy="292" r="12"/>
<path class="l" d="M120 300 L295 292"/>` },

  { title: 'Airplane', art: `
<circle cx="340" cy="60" r="28"/>
<path transform="translate(40 50)" d="${cloud}"/>
<path transform="translate(250 300)" d="${cloud}"/>
<path transform="translate(40 290) scale(.8)" d="${cloud}"/>
<path d="M175 195 L235 195 L275 120 L245 120 Z"/>
<path d="M70 190 L45 110 L85 110 L125 190 Z"/>
<path d="M45 212 Q45 182 90 182 L300 182 Q350 182 368 210 Q350 238 300 238 L90 238 Q45 238 45 212 Z"/>
<path d="M318 190 Q342 193 356 206 L322 206 Z"/>
<circle cx="140" cy="205" r="10"/><circle cx="172" cy="205" r="10"/><circle cx="204" cy="205" r="10"/><circle cx="236" cy="205" r="10"/><circle cx="268" cy="205" r="10"/>
<path d="M165 222 L240 222 L190 310 L150 310 Z"/>
<rect x="160" y="262" width="56" height="24" rx="12"/>
<path d="M55 215 L100 215 L80 248 L45 248 Z"/>` },

  { title: 'Rocket', art: `
<circle cx="80" cy="90" r="36"/><circle cx="68" cy="78" r="9"/><circle cx="94" cy="104" r="9"/>
<circle cx="320" cy="300" r="30"/>
<ellipse cx="320" cy="300" rx="52" ry="12"/>
<path d="M290 300 A30 30 0 0 1 350 300 Z"/>
<polygon transform="translate(320 70)" points="${star}"/>
<polygon transform="translate(60 230)" points="${star}"/>
<polygon transform="translate(340 180)" points="${star}"/>
<polygon transform="translate(90 340)" points="${star}"/>
<path d="M150 220 L100 285 L100 320 L150 290 Z"/>
<path d="M250 220 L300 285 L300 320 L250 290 Z"/>
<path d="M165 300 Q175 350 200 385 Q225 350 235 300 Z"/>
<path d="M182 300 Q190 335 200 355 Q210 335 218 300 Z"/>
<polygon points="168,285 232,285 244,310 156,310"/>
<path d="M200 30 Q258 90 254 190 L250 295 L150 295 L146 190 Q142 90 200 30 Z"/>
<path d="M200 30 Q236 66 247 115 L153 115 Q164 66 200 30 Z"/>
<circle cx="200" cy="175" r="30"/><circle cx="200" cy="175" r="18"/>
<rect x="190" y="230" width="20" height="62" rx="6"/>` },

  { title: 'Fire Truck', art: `
<circle cx="70" cy="60" r="28"/>
<path transform="translate(260 40)" d="${cloud}"/>
<rect x="20" y="300" width="360" height="70"/>
<rect x="40" y="330" width="50" height="12" rx="4"/><rect x="175" y="330" width="50" height="12" rx="4"/><rect x="310" y="330" width="50" height="12" rx="4"/>
<rect x="30" y="170" width="235" height="110" rx="6"/>
<path d="M255 280 L255 135 L318 135 Q334 135 342 160 L365 215 L365 280 Z"/>
<path d="M272 152 L314 152 Q324 152 330 170 L345 208 L272 208 Z"/>
<rect x="285" y="114" width="34" height="22" rx="8"/>
<rect x="40" y="128" width="240" height="22" rx="4"/>
<path class="l" d="M70 128 V150 M100 128 V150 M130 128 V150 M160 128 V150 M190 128 V150 M220 128 V150 M250 128 V150"/>
<rect x="60" y="150" width="20" height="20"/><rect x="215" y="150" width="20" height="20"/>
<rect x="45" y="185" width="65" height="65" rx="6"/><rect x="125" y="185" width="65" height="65" rx="6"/>
<circle cx="228" cy="218" r="24"/><circle cx="228" cy="218" r="9"/>
<rect x="290" y="225" width="22" height="10" rx="5"/>
<rect x="25" y="268" width="345" height="18" rx="9"/>
<rect x="352" y="232" width="16" height="22" rx="4"/>
<circle cx="100" cy="290" r="32"/><circle cx="100" cy="290" r="13"/>
<circle cx="305" cy="290" r="32"/><circle cx="305" cy="290" r="13"/>` },

  { title: 'Tractor', art: `
<circle cx="330" cy="65" r="30"/>
<path transform="translate(40 40)" d="${cloud}"/>
<path d="M20 290 Q120 240 220 275 Q300 245 380 270 L380 380 L20 380 Z"/>
<path class="l" d="M40 360 Q200 330 360 355 M60 335 Q200 312 370 330"/>
<rect x="282" y="140" width="18" height="70" rx="4"/>
<rect x="100" y="96" width="130" height="20" rx="8"/>
<rect x="110" y="112" width="110" height="160" rx="6"/>
<rect x="126" y="128" width="78" height="70" rx="6"/>
<rect x="205" y="200" width="160" height="80" rx="14"/>
<rect x="340" y="215" width="25" height="45" rx="4"/>
<path class="l" d="M225 222 H325 M225 240 H325"/>
<circle cx="145" cy="282" r="64"/><circle cx="145" cy="282" r="34"/><circle cx="145" cy="282" r="13"/>
<circle cx="320" cy="307" r="38"/><circle cx="320" cy="307" r="16"/>` },

  { title: 'Helicopter', art: `
<circle cx="70" cy="65" r="28"/>
<path transform="translate(280 40)" d="${cloud}"/>
<path transform="translate(40 300) scale(.9)" d="${cloud}"/>
<path transform="translate(270 310)" d="${cloud}"/>
<path d="M135 180 L50 170 L50 198 L135 218 Z"/>
<path d="M28 135 L58 135 L66 200 L36 208 Z"/>
<ellipse cx="44" cy="150" rx="12" ry="34"/>
<rect x="200" y="122" width="22" height="22"/>
<rect x="55" y="104" width="310" height="18" rx="9"/>
<ellipse cx="211" cy="113" rx="22" ry="14"/>
<path class="l" d="M165 255 L155 290 M265 255 L275 290"/>
<rect x="115" y="284" width="200" height="16" rx="8"/>
<path d="M120 200 Q120 140 190 140 L235 140 Q305 140 305 205 Q305 258 235 258 L170 258 Q120 258 120 200 Z"/>
<path d="M244 150 Q292 158 296 206 L244 206 Z"/>
<rect x="168" y="160" width="55" height="42" rx="8"/>
<rect x="150" y="222" width="110" height="18" rx="9"/>` },

  { title: 'Bicycle', art: `
<circle cx="330" cy="70" r="30"/>
<path transform="translate(40 50)" d="${cloud}"/>
<path d="M-20 300 Q140 270 240 300 Q320 280 420 300 V420 H-20 Z"/>
<circle cx="110" cy="265" r="62"/><circle cx="110" cy="265" r="48"/>
<circle cx="290" cy="265" r="62"/><circle cx="290" cy="265" r="48"/>
<path class="l" d="M110 217 V313 M62 265 H158 M76 231 L144 299 M76 299 L144 231 M290 217 V313 M242 265 H338 M256 231 L324 299 M256 299 L324 231"/>
<polygon points="110,273 190,273 190,257 110,257"/><polygon points="117,269 177,169 163,161 103,261"/>
<polygon points="198,264 178,159 162,161 182,266"/><polygon points="170,176 268,180 268,164 170,160"/>
<polygon points="196,270 274,177 262,167 184,260"/><polygon points="254,152 282,267 298,263 270,148"/>
<circle cx="110" cy="265" r="11"/><circle cx="290" cy="265" r="11"/>
<rect x="166" y="138" width="10" height="24" class="k"/>
<path d="M140 138 Q170 126 200 134 Q196 146 170 146 Q150 148 140 138 Z"/>
<path d="M262 152 L258 124 L295 118 Q306 118 304 130 L288 132 Z"/>
<circle cx="190" cy="265" r="18"/>
<rect x="200" y="285" width="24" height="10" rx="3"/>
<path class="l" d="M190 265 L212 290"/>` },

  { title: 'Hot Air Balloon', art: `
<circle cx="340" cy="60" r="28"/>
<path transform="translate(30 70) scale(.8)" d="${cloud}"/>
<path transform="translate(290 200) scale(.9)" d="${cloud}"/>
<path class="l" d="M50 220 q10 -10 20 0 q10 -10 20 0 M320 130 q8 -8 16 0 q8 -8 16 0"/>
<path d="M20 340 Q110 300 200 335 Q290 300 380 330 L380 380 L20 380 Z"/>
<path d="M200 30 C295 30 335 110 312 180 C297 228 252 252 242 272 L158 272 C148 252 103 228 88 180 C65 110 105 30 200 30 Z"/>
<path d="M200 30 C238 30 258 120 238 272 L162 272 C142 120 162 30 200 30 Z"/>
<path d="M200 30 C214 30 222 150 216 272 L184 272 C178 150 186 30 200 30 Z"/>
<rect x="155" y="268" width="90" height="18" rx="6"/>
<path class="l" d="M162 286 L170 318 M238 286 L230 318 M190 286 L192 318 M210 286 L208 318"/>
<rect x="160" y="314" width="80" height="16" rx="6"/>
<rect x="165" y="328" width="70" height="44" rx="6"/>
<path class="l" d="M188 330 V370 M212 330 V370 M167 350 H233"/>` },
];
