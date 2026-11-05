import * as THREE from 'three';
import { GLTFLoader } from './vendor/GLTFLoader.js';
const $=id=>document.getElementById(id), keys=new Set(), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touchMode=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
document.body.classList.toggle('touch-device',touchMode);
const analog={x:0,y:0,pointer:null},boostPointers=new Set();
const boostHeld=()=>keys.has('Space')||boostPointers.size>0;
function resetInput(){keys.clear();analog.x=analog.y=0;analog.pointer=null;boostPointers.clear();$('stick-knob').style.transform='translate(-50%,-50%)';$('joystick').classList.remove('active');$('touch-boost').classList.remove('active');}
function refreshTouch(){document.body.classList.toggle('in-flight',state==='playing');}
let renderer;
try { renderer=new THREE.WebGLRenderer({canvas:$('space'),antialias:true}); } catch(e){$('title').textContent='WebGL is unavailable';$('description').textContent='Open this game in a browser with hardware acceleration enabled.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x070d18);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.4;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x070d18,.009);
const camera=new THREE.PerspectiveCamera(60,1,.1,400);camera.position.set(0,5,19);camera.lookAt(0,1,-20);
scene.add(new THREE.HemisphereLight(0xa9d5ff,0x40332b,2.7));const sun=new THREE.DirectionalLight(0xffe0ba,4);sun.position.set(-12,20,10);scene.add(sun);const rim=new THREE.DirectionalLight(0x5b9cff,3);rim.position.set(8,2,-20);scene.add(rim);
const ship=new THREE.Group();scene.add(ship);let rocket,flames=[];
const starsGeo=new THREE.BufferGeometry(), starData=new Float32Array(1800*3);for(let i=0;i<starData.length;i+=3){starData[i]=(Math.random()-.5)*220;starData[i+1]=(Math.random()-.5)*150;starData[i+2]=Math.random()*300-280;}starsGeo.setAttribute('position',new THREE.BufferAttribute(starData,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xaacbe4,size:.16,transparent:true,opacity:.85})));
const planet=new THREE.Mesh(new THREE.SphereGeometry(25,48,32),new THREE.MeshStandardMaterial({color:0x243851,roughness:1}));planet.position.set(78,32,-190);scene.add(planet);
const rockMats=[0x736b64,0x667780,0x8c7969].map(color=>new THREE.MeshStandardMaterial({color,roughness:.95,flatShading:true}));
const rockGeos=Array.from({length:7},(_,j)=>{let g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position;for(let i=0;i<p.count;i++){let v=new THREE.Vector3().fromBufferAttribute(p,i);let n=1+.16*Math.sin(v.x*13+j)*Math.cos(v.y*11+j)+.12*Math.sin(v.z*9);p.setXYZ(i,v.x*n,v.y*n,v.z*n);}g.computeVertexNormals();return g;});
let rocks=[],particles=[],state='loading',distance=0,fuel=100,hp=3,invulnerable=0,spawnTimer=0,elapsed=0,speed=0,boosting=false,locked=false,noticeTime=0,best=0,flash=0;
try{best=Number(localStorage.getItem('orange-rocket-best'))||0;}catch{}$('best').innerHTML=String(Math.floor(best)).padStart(5,'0')+'<span> m</span>';
const clamp=THREE.MathUtils.clamp;
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.position.z=camera.aspect<1?32:19;camera.lookAt(0,1,-20);camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
function rock(x,y,z,r){let o=new THREE.Mesh(rockGeos[Math.floor(Math.random()*7)],rockMats[Math.floor(Math.random()*3)]);o.position.set(x,y,z);o.scale.set(r,r*(.8+Math.random()*.4),r);o.rotation.set(Math.random()*6,Math.random()*6,0);o.userData={radius:r,spin:(Math.random()-.5)*1.4};scene.add(o);rocks.push(o);return o;}
function seed(){for(let i=0;i<20;i++)rock((Math.random()>.5?1:-1)*(13+Math.random()*25),(Math.random()-.5)*27,-20-Math.random()*150,1+Math.random()*3);}
seed();
new GLTFLoader().load('./assets/rocket.glb',g=>{rocket=g.scene;rocket.scale.setScalar(.40);rocket.rotation.x=-Math.PI/2;ship.add(rocket);rocket.traverse(o=>{if(/flame/i.test(o.name))flames.push({o,scale:o.scale.clone()});});state='menu';$('start').disabled=false;$('start').textContent='Launch flight  ↗';},undefined,()=>{state='error';$('title').textContent='Rocket failed to load';$('description').textContent='Reload the page to try again.';});
function message(t){$('notice').textContent=t;noticeTime=2;}
function clean(){for(let o of rocks)scene.remove(o);rocks=[];for(let p of particles)scene.remove(p);particles=[];}
function start(){clean();seed();state='playing';distance=0;fuel=100;hp=3;elapsed=0;invulnerable=2;spawnTimer=.7;speed=20;locked=false;ship.position.set(0,0,3);ship.rotation.set(0,0,0);ship.visible=true;resetInput();$('overlay').hidden=true;$('pause').hidden=false;document.body.classList.add('playing');message('FLIGHT STARTED');$('start').blur();}
function pause(){if(state==='playing'){state='paused';resetInput();$('eyebrow').textContent='FLIGHT ON HOLD';$('title').textContent='Take a breather.';$('description').textContent='Your flight is paused. Resume when you’re ready.';$('start').textContent='Resume flight  ↗';$('overlay').hidden=false;}else if(state==='paused'){state='playing';$('overlay').hidden=true;$('start').blur();}}
$('start').onclick=()=>state==='paused'?pause():start();$('pause').onclick=pause;
addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)){e.preventDefault();if(state==='playing')keys.add(e.code);}if(!e.repeat&&(e.code==='KeyP'||e.code==='Escape'))pause();if(!e.repeat&&e.code==='Enter'&&['menu','over','paused'].includes(state))$('start').click();});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{resetInput();if(state==='playing')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')pause();});
const stick=$('joystick'),boostButton=$('touch-boost');
function moveStick(e){const r=stick.getBoundingClientRect(),radius=r.width*.34;let x=(e.clientX-r.left-r.width/2)/radius,y=(e.clientY-r.top-r.height/2)/radius;const length=Math.hypot(x,y);if(length>1){x/=length;y/=length;}const strength=Math.max(0,(Math.min(length,1)-.10)/.90);analog.x=length>.10?x/Math.max(Math.min(length,1),.001)*strength:0;analog.y=length>.10?-y/Math.max(Math.min(length,1),.001)*strength:0;$('stick-knob').style.transform='translate(calc(-50% + '+x*radius+'px),calc(-50% + '+y*radius+'px))';}
stick.addEventListener('pointerdown',e=>{if(state!=='playing'||analog.pointer!==null)return;e.preventDefault();analog.pointer=e.pointerId;stick.setPointerCapture(e.pointerId);stick.classList.add('active');moveStick(e);});
stick.addEventListener('pointermove',e=>{if(e.pointerId===analog.pointer){e.preventDefault();moveStick(e);}});
function releaseStick(e){if(e.pointerId!==analog.pointer)return;analog.pointer=null;analog.x=analog.y=0;$('stick-knob').style.transform='translate(-50%,-50%)';stick.classList.remove('active');}
for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,releaseStick);
boostButton.addEventListener('pointerdown',e=>{if(state!=='playing')return;e.preventDefault();boostPointers.add(e.pointerId);boostButton.setPointerCapture(e.pointerId);boostButton.classList.add('active');});
for(const event of ['pointerup','pointercancel','lostpointercapture'])boostButton.addEventListener(event,e=>{boostPointers.delete(e.pointerId);if(!boostPointers.size)boostButton.classList.remove('active');});
if(touchMode){$('description').innerHTML='Dodge the asteroid belt with the joystick.<br>Hold BOOST when you find an opening.';document.querySelector('.controls').innerHTML='<span>LEFT THUMB · STEER</span><span>RIGHT THUMB · BOOST</span>';}
addEventListener('orientationchange',()=>{resetInput();if(state==='playing')pause();});
const sparkGeo=new THREE.IcosahedronGeometry(.10,0),sparkMat=new THREE.MeshBasicMaterial({color:0xffa34d});
function burst(){for(let i=0;i<36;i++){let p=new THREE.Mesh(sparkGeo,sparkMat);p.position.copy(ship.position);p.userData={v:new THREE.Vector3((Math.random()-.5)*14,(Math.random()-.5)*14,(Math.random()-.5)*14),life:.7+Math.random()*.6};scene.add(p);particles.push(p);}}
function collision(){hp--;invulnerable=2;flash=.8;burst();message(hp?'IMPACT · '+hp+' SHIELDS REMAIN':'SIGNAL LOST');if(!hp){state='over';ship.visible=false;resetInput();best=Math.max(best,Math.floor(distance));try{localStorage.setItem('orange-rocket-best',best);}catch{}$('eyebrow').textContent='FLIGHT COMPLETE · SECTOR '+String(1+Math.floor(elapsed/20)).padStart(2,'0');$('title').textContent='One more run?';$('description').textContent=`You travelled ${Math.floor(distance).toLocaleString()} m. Personal best: ${best.toLocaleString()} m. Find a new path through the belt.`;$('start').textContent='Launch again  ↗';$('overlay').hidden=false;$('pause').hidden=true;document.body.classList.remove('playing');}}
function wave(){let count=2+Math.min(4,Math.floor(elapsed/22));for(let i=0;i<count;i++){let x=(Math.random()-.5)*23,y=(Math.random()-.5)*14;rock(x,y,-135-Math.random()*18,.65+Math.random()*1.25);}if(Math.random()<.5)rock(ship.position.x+(Math.random()-.5)*2,ship.position.y+(Math.random()-.5)*2,-155,1);}
let last=performance.now();
function frame(now){requestAnimationFrame(frame);let dt=Math.min((now-last)/1000,.04);last=now;
 if(state==='playing'){
  elapsed+=dt;let dx=Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),dy=Number(keys.has('ArrowUp'))-Number(keys.has('ArrowDown'));dx+=analog.x;dy+=analog.y;let norm=Math.max(1,Math.hypot(dx,dy));
  boosting=boostHeld()&&fuel>0&&!locked;if(boosting){fuel=Math.max(0,fuel-dt*32);if(fuel===0){locked=true;message('BOOST DEPLETED');}}else{fuel=Math.min(100,fuel+dt*18);if(!boostHeld()&&fuel>15)locked=false;}
  let targetSpeed=(22+Math.min(elapsed*.13,13))*(boosting?2.2:1);speed=THREE.MathUtils.damp(speed,targetSpeed,5,dt);distance+=speed*dt;ship.position.x=clamp(ship.position.x+dx/norm*dt*11,-(camera.aspect<1?7:10),(camera.aspect<1?7:10));ship.position.y=clamp(ship.position.y+dy/norm*dt*9,-5.4,6);
  ship.rotation.z=THREE.MathUtils.damp(ship.rotation.z,-dx*.28,9,dt);ship.rotation.x=THREE.MathUtils.damp(ship.rotation.x,dy*.14,9,dt);ship.rotation.y=THREE.MathUtils.damp(ship.rotation.y,-dx*.12,9,dt);
  invulnerable=Math.max(0,invulnerable-dt);ship.visible=invulnerable<=0||Math.sin(now*.035)>-.2;
  spawnTimer-=dt;if(spawnTimer<=0){wave();spawnTimer=Math.max(.48,1.1-elapsed*.004);}
  for(let i=rocks.length-1;i>=0;i--){let o=rocks[i],oldZ=o.position.z;o.position.z+=speed*dt;o.rotation.x+=dt*o.userData.spin;o.rotation.y+=dt*.17;let rr=o.userData.radius*.87+.48;let nearestZ=clamp(ship.position.z,oldZ,o.position.z);if(!invulnerable&&Math.hypot(o.position.x-ship.position.x,o.position.y-ship.position.y,nearestZ-ship.position.z)<rr)collision();if(o.position.z>25){scene.remove(o);rocks.splice(i,1);}}
  if(!reduced){camera.position.x=THREE.MathUtils.damp(camera.position.x,ship.position.x*.12,2,dt);camera.fov=THREE.MathUtils.damp(camera.fov,boosting?70:60,3,dt);camera.updateProjectionMatrix();}
 }else if(state==='menu'||state==='loading'){ship.position.set(camera.aspect<1?3:6,Math.sin(now*.0006)*.3,0);ship.rotation.set(.1,0,-.2);for(let o of rocks)o.rotation.y+=dt*.08;}
 if(state!=='paused'){let fly=state==='playing'?speed:2;for(let i=2;i<starData.length;i+=3){starData[i]+=dt*fly;if(starData[i]>22)starData[i]=-280;}starsGeo.attributes.position.needsUpdate=true;for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.position.addScaledVector(p.userData.v,dt);p.userData.life-=dt;p.scale.setScalar(Math.max(0,p.userData.life));if(p.userData.life<=0){scene.remove(p);particles.splice(i,1);}}for(let f of flames)f.o.scale.copy(f.scale).multiplyScalar((boosting&&state==='playing'?1.6:1)*(1+Math.sin(now*.04)*.08));noticeTime-=dt;if(noticeTime<=0)$('notice').textContent='';flash=Math.max(0,flash-dt*2);}
 refreshTouch();$('flash').style.opacity=flash;$('distance').innerHTML=String(Math.floor(distance)).padStart(5,'0')+'<span> m</span>';$('best').innerHTML=String(Math.floor(best)).padStart(5,'0')+'<span> m</span>';$('speed').innerHTML=Math.round(state==='playing'?speed:0)+'<span> m/s</span>';$('fuel').style.width=fuel+'%';$('fuel-label').textContent=Math.round(fuel)+'%';$('boost-hint').textContent=boosting&&state==='playing'?'BOOST ACTIVE · 2.2× SPEED':locked?(touchMode?'RELEASE BOOST TO RECHARGE':'RELEASE SPACE TO RECHARGE'):(touchMode?'HOLD BOOST TO ACCELERATE':'HOLD SPACE TO BOOST');$('shields').textContent='◆ '.repeat(hp)+'◇ '.repeat(3-hp);$('sector').textContent='SECTOR '+String(1+Math.floor(elapsed/20)).padStart(2,'0');renderer.render(scene,camera);
}
requestAnimationFrame(frame);
// Read-only diagnostics for checking input, resource loading, and gameplay state.
window.gameState=()=>({state,distance,fuel,hp,speed,boosting,locked,position:ship.position.toArray(),rocks:rocks.length,modelLoaded:!!rocket,analog:{x:analog.x,y:analog.y},touchBoost:boostPointers.size>0});
