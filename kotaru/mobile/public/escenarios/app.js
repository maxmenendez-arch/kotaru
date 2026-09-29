(()=>{var wg=Object.defineProperty;var Ld=n=>{throw TypeError(n)};var Ag=(n,e,t)=>e in n?wg(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Xc=(n,e,t)=>Ag(n,typeof e!="symbol"?e+"":e,t),qc=(n,e,t)=>e.has(n)||Ld("Cannot "+t);var dt=(n,e,t)=>(qc(n,e,"read from private field"),t?t.call(n):e.get(n)),qt=(n,e,t)=>e.has(n)?Ld("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),rn=(n,e,t,i)=>(qc(n,e,"write to private field"),i?i.call(n,t):e.set(n,t),t),sn=(n,e,t)=>(qc(n,e,"access private method"),t);var kn="186";var Tf=0,Fu=1,wf=2;var Ho=1,Af=2,ys=3,si=0,zt=1,Ut=2,oi=0,Ms=1,_r=2,Bu=3,Hu=4,Rf=5;var xr=100,Cf=101,Pf=102,If=103,Lf=104,Nf=200,Uf=201,Df=202,Of=203,Vu=204,zu=205,Ff=206,Bf=207,Hf=208,Vf=209,zf=210,Gf=211,kf=212,Wf=213,Xf=214,$a=0,Ka=1,ja=2,es=3,Qa=4,el=5,tl=6,nl=7,Rl=0,qf=1,Yf=2,Wn=0,Gu=1,ku=2,Wu=3,Xu=4,qu=5,Yu=6,Zu=7,Mu="attached",Zf="detached",Ju=300,qi=301,vr=302,Cl=303,Pl=304,Vo=306,Hn=1e3,An=1001,ts=1002,Lt=1003,Il=1004;var yr=1005;var Rt=1006,Ss=1007;var Xn=1008;var en=1009,$u=1010,Ku=1011,Es=1012,Ll=1013,qn=1014,Mn=1015,Sn=1016,Nl=1017,Ul=1018,bs=1020,ju=35902,Qu=35899,eh=1021,th=1022,En=1023,jn=1026,Yi=1027,Dl=1028,Ol=1029,Zi=1030,Fl=1031;var Bl=1033,zo=33776,Go=33777,ko=33778,Wo=33779,Hl=35840,Vl=35841,zl=35842,Gl=35843,kl=36196,Wl=37492,Xl=37496,ql=37488,Yl=37489,Xo=37490,Zl=37491,Jl=37808,$l=37809,Kl=37810,jl=37811,Ql=37812,ec=37813,tc=37814,nc=37815,ic=37816,rc=37817,sc=37818,oc=37819,ac=37820,lc=37821,cc=36492,uc=36494,hc=36495,dc=36283,fc=36284,qo=36285,pc=36286;var or=2300,ar=2301,Ya=2302,Su=2303,Eu=2400,bu=2401,Tu=2402,Jf=2500;var nh=0,Yo=1,Ts=2,$f=3200;var Mr=0,Kf=1,Ci="",At="srgb",an="srgb-linear",lo="linear",_t="srgb";var Za=7680;var jf=519,Qf=512,ep=513,tp=514,mc=515,np=516,ip=517,gc=518,rp=519,ih=35044,rh=35048;var sh="300 es",Bn=2e3,ns=2001;function Rg(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Cg(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function is(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function sp(){let n=is("canvas");return n.style.display="block",n}var Nd={},rs=null;function co(...n){let e="THREE."+n.shift();rs?rs("log",e,...n):console.log(e,...n)}function op(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function ke(...n){n=op(n);let e="THREE."+n.shift();if(rs)rs("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function $e(...n){n=op(n);let e="THREE."+n.shift();if(rs)rs("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function sr(...n){let e=n.join(" ");e in Nd||(Nd[e]=!0,ke(...n))}function ap(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}var lp={[$a]:Ka,[ja]:tl,[Qa]:nl,[es]:el,[Ka]:$a,[tl]:ja,[nl]:Qa,[el]:es},Qn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ud=1234567,ro=Math.PI/180,lr=180/Math.PI;function Rn(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[i&255]+Kt[i>>8&255]+Kt[i>>16&255]+Kt[i>>24&255]).toLowerCase()}function ot(n,e,t){return Math.max(e,Math.min(t,n))}function oh(n,e){return(n%e+e)%e}function Pg(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function Ig(n,e,t){return n!==e?(t-n)/(e-n):0}function so(n,e,t){return(1-t)*n+t*e}function Lg(n,e,t,i){return so(n,e,1-Math.exp(-t*i))}function Ng(n,e=1){return e-Math.abs(oh(n,e*2)-e)}function Ug(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Dg(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Og(n,e){return n+Math.floor(Math.random()*(e-n+1))}function Fg(n,e){return n+Math.random()*(e-n)}function Bg(n){return n*(.5-Math.random())}function Hg(n){n!==void 0&&(Ud=n);let e=Ud+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Vg(n){return n*ro}function zg(n){return n*lr}function Gg(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function kg(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Wg(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Xg(n,e,t,i,r){let s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),d=o((e-i)/2),f=s((i-e)/2),m=o((i-e)/2);switch(r){case"XYX":n.set(a*u,l*h,l*d,a*c);break;case"YZY":n.set(l*d,a*u,l*h,a*c);break;case"ZXZ":n.set(l*h,l*d,a*u,a*c);break;case"XZX":n.set(a*u,l*m,l*f,a*c);break;case"YXY":n.set(l*f,a*u,l*m,a*c);break;case"ZYZ":n.set(l*m,l*f,a*u,a*c);break;default:ke("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Fn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function xt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var mt={DEG2RAD:ro,RAD2DEG:lr,generateUUID:Rn,clamp:ot,euclideanModulo:oh,mapLinear:Pg,inverseLerp:Ig,lerp:so,damp:Lg,pingpong:Ng,smoothstep:Ug,smootherstep:Dg,randInt:Og,randFloat:Fg,randFloatSpread:Bg,seededRandom:Hg,degToRad:Vg,radToDeg:zg,isPowerOfTwo:Gg,ceilPowerOfTwo:kg,floorPowerOfTwo:Wg,setQuaternionFromProperEuler:Xg,normalize:xt,denormalize:Fn},dh=class dh{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ot(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(ot(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};dh.prototype.isVector2=!0;var ce=dh,Ye=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3],d=s[o+0],f=s[o+1],m=s[o+2],_=s[o+3];if(h!==_||l!==d||c!==f||u!==m){let p=l*d+c*f+u*m+h*_;p<0&&(d=-d,f=-f,m=-m,_=-_,p=-p);let g=1-a;if(p<.9995){let M=Math.acos(p),T=Math.sin(M);g=Math.sin(g*M)/T,a=Math.sin(a*M)/T,l=l*g+d*a,c=c*g+f*a,u=u*g+m*a,h=h*g+_*a}else{l=l*g+d*a,c=c*g+f*a,u=u*g+m*a,h=h*g+_*a;let M=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=M,c*=M,u*=M,h*=M}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],m=s[o+3];return e[t]=a*m+u*h+l*f-c*d,e[t+1]=l*m+u*d+c*h-a*f,e[t+2]=c*m+u*f+a*d-l*h,e[t+3]=u*m-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),f=l(r/2),m=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"YXZ":this._x=d*u*h+c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"ZXY":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h-d*f*m;break;case"ZYX":this._x=d*u*h-c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h+d*f*m;break;case"YZX":this._x=d*u*h+c*f*m,this._y=c*f*h+d*u*m,this._z=c*u*m-d*f*h,this._w=c*u*h-d*f*m;break;case"XZY":this._x=d*u*h-c*f*m,this._y=c*f*h-d*u*m,this._z=c*u*m+d*f*h,this._w=c*u*h+d*f*m;break;default:ke("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>h){let f=2*Math.sqrt(1+i-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>h){let f=2*Math.sqrt(1+a-i-h);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ot(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},fh=class fh{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ot(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Yc.copy(this).projectOnVector(e),this.sub(Yc)}reflect(e){return this.sub(Yc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(ot(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};fh.prototype.isVector3=!0;var R=fh,Yc=new R,Dd=new Ye,ph=class ph{constructor(e,t,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],m=i[8],_=r[0],p=r[3],g=r[6],M=r[1],T=r[4],x=r[7],S=r[2],E=r[5],A=r[8];return s[0]=o*_+a*M+l*S,s[3]=o*p+a*T+l*E,s[6]=o*g+a*x+l*A,s[1]=c*_+u*M+h*S,s[4]=c*p+u*T+h*E,s[7]=c*g+u*x+h*A,s[2]=d*_+f*M+m*S,s[5]=d*p+f*T+m*E,s[8]=d*g+f*x+m*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,f=c*s-o*l,m=t*h+i*d+r*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return e[0]=h*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=d*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return sr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Zc.makeScale(e,t)),this}rotate(e){return sr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Zc.makeRotation(-e)),this}translate(e,t){return sr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Zc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ph.prototype.isMatrix3=!0;var qe=ph,Zc=new qe,Od=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fd=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function qg(){let n={enabled:!0,workingColorSpace:an,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===_t&&(r.r=yi(r.r),r.g=yi(r.g),r.b=yi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===_t&&(r.r=Qr(r.r),r.g=Qr(r.g),r.b=Qr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ci?lo:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return sr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return sr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[an]:{primaries:e,whitePoint:i,transfer:lo,toXYZ:Od,fromXYZ:Fd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:At},outputColorSpaceConfig:{drawingBufferColorSpace:At}},[At]:{primaries:e,whitePoint:i,transfer:_t,toXYZ:Od,fromXYZ:Fd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:At}}}),n}var st=qg();function yi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Qr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Dr,il=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Dr===void 0&&(Dr=is("canvas")),Dr.width=e.width,Dr.height=e.height;let r=Dr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Dr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=is("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=yi(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(yi(t[i]/255)*255):t[i]=yi(t[i]);return{data:t,width:e.width,height:e.height}}else return ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Yg=0,ss=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Yg++}),this.uuid=Rn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Jc(r[o].image)):s.push(Jc(r[o]))}else s=Jc(r);i.url=s}return t||(e.images[this.uuid]=i),i}};function Jc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?il.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(ke("Texture: Unable to serialize Texture."),{})}var Zg=0,$c=new R,Ht=class n extends Qn{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=An,r=An,s=Rt,o=Xn,a=En,l=en,c=n.DEFAULT_ANISOTROPY,u=Ci){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zg++}),this.uuid=Rn(),this.name="",this.source=new ss(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ce(0,0),this.repeat=new ce(1,1),this.center=new ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize($c).x}get height(){return this.source.getSize($c).y}get depth(){return this.source.getSize($c).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){ke(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){ke(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ju)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Hn:e.x=e.x-Math.floor(e.x);break;case An:e.x=e.x<0?0:1;break;case ts:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Hn:e.y=e.y-Math.floor(e.y);break;case An:e.y=e.y<0?0:1;break;case ts:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ht.DEFAULT_IMAGE=null;Ht.DEFAULT_MAPPING=Ju;Ht.DEFAULT_ANISOTROPY=1;var mh=class mh{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],m=l[9],_=l[2],p=l[6],g=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(m-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(m+p)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let T=(c+1)/2,x=(f+1)/2,S=(g+1)/2,E=(u+d)/4,A=(h+_)/4,v=(m+p)/4;return T>x&&T>S?T<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(T),r=E/i,s=A/i):x>S?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=E/r,s=v/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=A/s,r=v/s),this.set(i,r,s,t),this}let M=Math.sqrt((p-m)*(p-m)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(p-m)/M,this.y=(h-_)/M,this.z=(d-u)/M,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this.w=ot(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this.w=ot(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(ot(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};mh.prototype.isVector4=!0;var vt=mh,rl=class extends Qn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Rt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t),this.textures=[];let r={width:e,height:t,depth:i.depth},s=new Ht(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Rt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new ss(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Qt=class extends rl{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},uo=class extends Ht{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var sl=class extends Ht{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Al=class Al{constructor(e,t,i,r,s,o,a,l,c,u,h,d,f,m,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,d,f,m,_,p)}set(e,t,i,r,s,o,a,l,c,u,h,d,f,m,_,p){let g=this.elements;return g[0]=e,g[4]=t,g[8]=i,g[12]=r,g[1]=s,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=u,g[10]=h,g[14]=d,g[3]=f,g[7]=m,g[11]=_,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Al().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,r=1/Or.setFromMatrixColumn(e,0).length(),s=1/Or.setFromMatrixColumn(e,1).length(),o=1/Or.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=o*u,f=o*h,m=a*u,_=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+m*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=m+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*u,f=l*h,m=c*u,_=c*h;t[0]=d+_*a,t[4]=m*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-m,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*u,f=l*h,m=c*u,_=c*h;t[0]=d-_*a,t[4]=-o*h,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*u,f=o*h,m=a*u,_=a*h;t[0]=l*u,t[4]=m*c-f,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=f*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,m=a*l,_=a*c;t[0]=l*u,t[4]=_-d*h,t[8]=m*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+m,t[10]=d-_*h}else if(e.order==="XZY"){let d=o*l,f=o*c,m=a*l,_=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=o*u,t[9]=f*h-m,t[2]=m*h-f,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Jg,e,$g)}lookAt(e,t,i){let r=this.elements;return mn.subVectors(e,t),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Ui.crossVectors(i,mn),Ui.lengthSq()===0&&(Math.abs(i.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Ui.crossVectors(i,mn)),Ui.normalize(),_a.crossVectors(mn,Ui),r[0]=Ui.x,r[4]=_a.x,r[8]=mn.x,r[1]=Ui.y,r[5]=_a.y,r[9]=mn.y,r[2]=Ui.z,r[6]=_a.z,r[10]=mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],m=i[2],_=i[6],p=i[10],g=i[14],M=i[3],T=i[7],x=i[11],S=i[15],E=r[0],A=r[4],v=r[8],w=r[12],C=r[1],L=r[5],D=r[9],H=r[13],U=r[2],V=r[6],W=r[10],J=r[14],se=r[3],$=r[7],j=r[11],ee=r[15];return s[0]=o*E+a*C+l*U+c*se,s[4]=o*A+a*L+l*V+c*$,s[8]=o*v+a*D+l*W+c*j,s[12]=o*w+a*H+l*J+c*ee,s[1]=u*E+h*C+d*U+f*se,s[5]=u*A+h*L+d*V+f*$,s[9]=u*v+h*D+d*W+f*j,s[13]=u*w+h*H+d*J+f*ee,s[2]=m*E+_*C+p*U+g*se,s[6]=m*A+_*L+p*V+g*$,s[10]=m*v+_*D+p*W+g*j,s[14]=m*w+_*H+p*J+g*ee,s[3]=M*E+T*C+x*U+S*se,s[7]=M*A+T*L+x*V+S*$,s[11]=M*v+T*D+x*W+S*j,s[15]=M*w+T*H+x*J+S*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],m=e[3],_=e[7],p=e[11],g=e[15],M=l*f-c*d,T=a*f-c*h,x=a*d-l*h,S=o*f-c*u,E=o*d-l*u,A=o*h-a*u;return t*(_*M-p*T+g*x)-i*(m*M-p*S+g*E)+r*(m*T-_*S+g*A)-s*(m*x-_*E+p*A)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return t*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],m=e[12],_=e[13],p=e[14],g=e[15],M=t*a-i*o,T=t*l-r*o,x=t*c-s*o,S=i*l-r*a,E=i*c-s*a,A=r*c-s*l,v=u*_-h*m,w=u*p-d*m,C=u*g-f*m,L=h*p-d*_,D=h*g-f*_,H=d*g-f*p,U=M*H-T*D+x*L+S*C-E*w+A*v;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/U;return e[0]=(a*H-l*D+c*L)*V,e[1]=(r*D-i*H-s*L)*V,e[2]=(_*A-p*E+g*S)*V,e[3]=(d*E-h*A-f*S)*V,e[4]=(l*C-o*H-c*w)*V,e[5]=(t*H-r*C+s*w)*V,e[6]=(p*x-m*A-g*T)*V,e[7]=(u*A-d*x+f*T)*V,e[8]=(o*D-a*C+c*v)*V,e[9]=(i*C-t*D-s*v)*V,e[10]=(m*E-_*x+g*M)*V,e[11]=(h*x-u*E-f*M)*V,e[12]=(a*w-o*L-l*v)*V,e[13]=(t*L-i*w+r*v)*V,e[14]=(_*T-m*S-p*M)*V,e[15]=(u*S-h*T+d*M)*V,this}scale(e){let t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,d=s*c,f=s*u,m=s*h,_=o*u,p=o*h,g=a*h,M=l*c,T=l*u,x=l*h,S=i.x,E=i.y,A=i.z;return r[0]=(1-(_+g))*S,r[1]=(f+x)*S,r[2]=(m-T)*S,r[3]=0,r[4]=(f-x)*E,r[5]=(1-(d+g))*E,r[6]=(p+M)*E,r[7]=0,r[8]=(m+T)*A,r[9]=(p-M)*A,r[10]=(1-(d+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let o=Or.set(r[0],r[1],r[2]).length(),a=Or.set(r[4],r[5],r[6]).length(),l=Or.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Nn.copy(this);let c=1/o,u=1/a,h=1/l;return Nn.elements[0]*=c,Nn.elements[1]*=c,Nn.elements[2]*=c,Nn.elements[4]*=u,Nn.elements[5]*=u,Nn.elements[6]*=u,Nn.elements[8]*=h,Nn.elements[9]*=h,Nn.elements[10]*=h,t.setFromRotationMatrix(Nn),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,r,s,o,a=Bn,l=!1){let c=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r),m,_;if(l)m=s/(o-s),_=o*s/(o-s);else if(a===Bn)m=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===ns)m=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=Bn,l=!1){let c=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),f=-(i+r)/(i-r),m,_;if(l)m=1/(o-s),_=o/(o-s);else if(a===Bn)m=-2/(o-s),_=-(o+s)/(o-s);else if(a===ns)m=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Al.prototype.isMatrix4=!0;var He=Al,Or=new R,Nn=new He,Jg=new R(0,0,0),$g=new R(1,1,1),Ui=new R,_a=new R,mn=new R,Bd=new He,Hd=new Ye,ln=class n{constructor(e=0,t=0,i=0,r=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ot(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ot(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ot(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ot(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Bd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bd,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Hd.setFromEuler(this),this.setFromQuaternion(Hd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ln.DEFAULT_ORDER="XYZ";var ho=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Kg=0,Vd=new R,Fr=new Ye,fi=new He,xa=new R,qs=new R,jg=new R,Qg=new Ye,zd=new R(1,0,0),Gd=new R(0,1,0),kd=new R(0,0,1),Wd={type:"added"},e0={type:"removed"},Br={type:"childadded",child:null},Kc={type:"childremoved",child:null},ct=class n extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kg++}),this.uuid=Rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new R,t=new ln,i=new Ye,r=new R(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new He},normalMatrix:{value:new qe}}),this.matrix=new He,this.matrixWorld=new He,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ho,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fr.setFromAxisAngle(e,t),this.quaternion.multiply(Fr),this}rotateOnWorldAxis(e,t){return Fr.setFromAxisAngle(e,t),this.quaternion.premultiply(Fr),this}rotateX(e){return this.rotateOnAxis(zd,e)}rotateY(e){return this.rotateOnAxis(Gd,e)}rotateZ(e){return this.rotateOnAxis(kd,e)}translateOnAxis(e,t){return Vd.copy(e).applyQuaternion(this.quaternion),this.position.add(Vd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(zd,e)}translateY(e){return this.translateOnAxis(Gd,e)}translateZ(e){return this.translateOnAxis(kd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?xa.copy(e):xa.set(e,t,i);let r=this.parent;this.updateWorldMatrix(!0,!1),qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(qs,xa,this.up):fi.lookAt(xa,qs,this.up),this.quaternion.setFromRotationMatrix(fi),r&&(fi.extractRotation(r.matrixWorld),Fr.setFromRotationMatrix(fi),this.quaternion.premultiply(Fr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wd),Br.child=e,this.dispatchEvent(Br),Br.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(e0),Kc.child=e,this.dispatchEvent(Kc),Kc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wd),Br.child=e,this.dispatchEvent(Br),Br.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qs,e,jg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qs,Qg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),m.length>0&&(i.nodes=m)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};ct.DEFAULT_UP=new R(0,1,0);ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ft=class extends ct{constructor(){super(),this.isGroup=!0,this.type="Group"}},t0={type:"move"},os=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ft,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ft,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ft,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let p=t.getJointPose(_,i),g=this._getHandJoint(c,_);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(t0)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new ft;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},cp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},va={h:0,s:0,l:0};function jc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var Me=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=At){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=st.workingColorSpace){return this.r=e,this.g=t,this.b=i,st.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=st.workingColorSpace){if(e=oh(e,1),t=ot(t,0,1),i=ot(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=jc(o,s,e+1/3),this.g=jc(o,s,e),this.b=jc(o,s,e-1/3)}return st.colorSpaceToWorking(this,r),this}setStyle(e,t=At){function i(s){s!==void 0&&parseFloat(s)<1&&ke("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:ke("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=At){let i=cp[e.toLowerCase()];return i!==void 0?this.setHex(i,t):ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=yi(e.r),this.g=yi(e.g),this.b=yi(e.b),this}copyLinearToSRGB(e){return this.r=Qr(e.r),this.g=Qr(e.g),this.b=Qr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=At){return st.workingToColorSpace(jt.copy(this),e),Math.round(ot(jt.r*255,0,255))*65536+Math.round(ot(jt.g*255,0,255))*256+Math.round(ot(jt.b*255,0,255))}getHexString(e=At){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.workingToColorSpace(jt.copy(this),t);let i=jt.r,r=jt.g,s=jt.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=st.workingColorSpace){return st.workingToColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=At){st.workingToColorSpace(jt.copy(this),e);let t=jt.r,i=jt.g,r=jt.b;return e!==At?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Di),this.setHSL(Di.h+e,Di.s+t,Di.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Di),e.getHSL(va);let i=so(Di.h,va.h,t),r=so(Di.s,va.s,t),s=so(Di.l,va.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},jt=new Me;Me.NAMES=cp;var fo=class n{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new Me(e),this.near=t,this.far=i}clone(){return new n(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},cr=class extends ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Un=new R,pi=new R,Qc=new R,mi=new R,Hr=new R,Vr=new R,Xd=new R,eu=new R,tu=new R,nu=new R,iu=new vt,ru=new vt,su=new vt,vi=class n{constructor(e=new R,t=new R,i=new R){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Un.subVectors(e,t),r.cross(Un);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Un.subVectors(r,t),pi.subVectors(i,t),Qc.subVectors(e,t);let o=Un.dot(Un),a=Un.dot(pi),l=Un.dot(Qc),c=pi.dot(pi),u=pi.dot(Qc),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;let d=1/h,f=(c*l-a*u)*d,m=(o*u-a*l)*d;return s.set(1-f-m,m,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,mi)===null?!1:mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,mi.x),l.addScaledVector(o,mi.y),l.addScaledVector(a,mi.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return iu.setScalar(0),ru.setScalar(0),su.setScalar(0),iu.fromBufferAttribute(e,t),ru.fromBufferAttribute(e,i),su.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(iu,s.x),o.addScaledVector(ru,s.y),o.addScaledVector(su,s.z),o}static isFrontFacing(e,t,i,r){return Un.subVectors(i,t),pi.subVectors(e,t),Un.cross(pi).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),pi.subVectors(this.a,this.b),Un.cross(pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return n.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,r=this.b,s=this.c,o,a;Hr.subVectors(r,i),Vr.subVectors(s,i),eu.subVectors(e,i);let l=Hr.dot(eu),c=Vr.dot(eu);if(l<=0&&c<=0)return t.copy(i);tu.subVectors(e,r);let u=Hr.dot(tu),h=Vr.dot(tu);if(u>=0&&h<=u)return t.copy(r);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Hr,o);nu.subVectors(e,s);let f=Hr.dot(nu),m=Vr.dot(nu);if(m>=0&&f<=m)return t.copy(s);let _=f*c-l*m;if(_<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(i).addScaledVector(Vr,a);let p=u*m-f*h;if(p<=0&&h-u>=0&&f-m>=0)return Xd.subVectors(s,r),a=(h-u)/(h-u+(f-m)),t.copy(r).addScaledVector(Xd,a);let g=1/(p+_+d);return o=_*g,a=d*g,t.copy(i).addScaledVector(Hr,o).addScaledVector(Vr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},_n=class{constructor(e=new R(1/0,1/0,1/0),t=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Dn):Dn.fromBufferAttribute(s,o),Dn.applyMatrix4(e.matrixWorld),this.expandByPoint(Dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ya.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ya.copy(i.boundingBox)),ya.applyMatrix4(e.matrixWorld),this.union(ya)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Dn),Dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ys),Ma.subVectors(this.max,Ys),zr.subVectors(e.a,Ys),Gr.subVectors(e.b,Ys),kr.subVectors(e.c,Ys),Oi.subVectors(Gr,zr),Fi.subVectors(kr,Gr),tr.subVectors(zr,kr);let t=[0,-Oi.z,Oi.y,0,-Fi.z,Fi.y,0,-tr.z,tr.y,Oi.z,0,-Oi.x,Fi.z,0,-Fi.x,tr.z,0,-tr.x,-Oi.y,Oi.x,0,-Fi.y,Fi.x,0,-tr.y,tr.x,0];return!ou(t,zr,Gr,kr,Ma)||(t=[1,0,0,0,1,0,0,0,1],!ou(t,zr,Gr,kr,Ma))?!1:(Sa.crossVectors(Oi,Fi),t=[Sa.x,Sa.y,Sa.z],ou(t,zr,Gr,kr,Ma))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},gi=[new R,new R,new R,new R,new R,new R,new R,new R],Dn=new R,ya=new _n,zr=new R,Gr=new R,kr=new R,Oi=new R,Fi=new R,tr=new R,Ys=new R,Ma=new R,Sa=new R,nr=new R;function ou(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){nr.fromArray(n,s);let a=r.x*Math.abs(nr.x)+r.y*Math.abs(nr.y)+r.z*Math.abs(nr.z),l=e.dot(nr),c=t.dot(nr),u=i.dot(nr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var Ft=new R,Ea=new ce,n0=0,Ke=class extends Qn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:n0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=ih,this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ea.fromBufferAttribute(this,t),Ea.applyMatrix3(e),this.setXY(t,Ea.x,Ea.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Fn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=xt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array),r=xt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array),r=xt(r,this.array),s=xt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var po=class extends Ke{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var mo=class extends Ke{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var nt=class extends Ke{constructor(e,t,i){super(new Float32Array(e),t,i)}},i0=new _n,Zs=new R,au=new R,un=class{constructor(e=new R,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):i0.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zs.subVectors(e,this.center);let t=Zs.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Zs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(au.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zs.copy(e.center).add(au)),this.expandByPoint(Zs.copy(e.center).sub(au))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},r0=0,wn=new He,lu=new ct,Wr=new R,gn=new _n,Js=new _n,Wt=new R,Qe=class n extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:r0++}),this.uuid=Rn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Rg(e)?mo:po)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new qe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return wn.makeRotationFromQuaternion(e),this.applyMatrix4(wn),this}rotateX(e){return wn.makeRotationX(e),this.applyMatrix4(wn),this}rotateY(e){return wn.makeRotationY(e),this.applyMatrix4(wn),this}rotateZ(e){return wn.makeRotationZ(e),this.applyMatrix4(wn),this}translate(e,t,i){return wn.makeTranslation(e,t,i),this.applyMatrix4(wn),this}scale(e,t,i){return wn.makeScale(e,t,i),this.applyMatrix4(wn),this}lookAt(e){return lu.lookAt(e),lu.updateMatrix(),this.applyMatrix4(lu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wr).negate(),this.translate(Wr.x,Wr.y,Wr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new nt(i,3))}else{let i=Math.min(e.length,t.count);for(let r=0;r<i;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _n);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){let s=t[i];gn.setFromBufferAttribute(s),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new un);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){let i=this.boundingSphere.center;if(gn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Js.setFromBufferAttribute(a),this.morphTargetsRelative?(Wt.addVectors(gn.min,Js.min),gn.expandByPoint(Wt),Wt.addVectors(gn.max,Js.max),gn.expandByPoint(Wt)):(gn.expandByPoint(Js.min),gn.expandByPoint(Js.max))}gn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Wt));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Wt.fromBufferAttribute(a,c),l&&(Wr.fromBufferAttribute(e,c),Wt.add(Wr)),r=Math.max(r,i.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,r=t.normal,s=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Ke(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let v=0;v<i.count;v++)a[v]=new R,l[v]=new R;let c=new R,u=new R,h=new R,d=new ce,f=new ce,m=new ce,_=new R,p=new R;function g(v,w,C){c.fromBufferAttribute(i,v),u.fromBufferAttribute(i,w),h.fromBufferAttribute(i,C),d.fromBufferAttribute(s,v),f.fromBufferAttribute(s,w),m.fromBufferAttribute(s,C),u.sub(c),h.sub(c),f.sub(d),m.sub(d);let L=1/(f.x*m.y-m.x*f.y);isFinite(L)&&(_.copy(u).multiplyScalar(m.y).addScaledVector(h,-f.y).multiplyScalar(L),p.copy(h).multiplyScalar(f.x).addScaledVector(u,-m.x).multiplyScalar(L),a[v].add(_),a[w].add(_),a[C].add(_),l[v].add(p),l[w].add(p),l[C].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let v=0,w=M.length;v<w;++v){let C=M[v],L=C.start,D=C.count;for(let H=L,U=L+D;H<U;H+=3)g(e.getX(H+0),e.getX(H+1),e.getX(H+2))}let T=new R,x=new R,S=new R,E=new R;function A(v){S.fromBufferAttribute(r,v),E.copy(S);let w=a[v];T.copy(w),T.sub(S.multiplyScalar(S.dot(w))).normalize(),x.crossVectors(E,w);let L=x.dot(l[v])<0?-1:1;o.setXYZW(v,T.x,T.y,T.z,L)}for(let v=0,w=M.length;v<w;++v){let C=M[v],L=C.start,D=C.count;for(let H=L,U=L+D;H<U;H+=3)A(e.getX(H+0)),A(e.getX(H+1)),A(e.getX(H+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Ke(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let r=new R,s=new R,o=new R,a=new R,l=new R,c=new R,u=new R,h=new R;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),_=e.getX(d+1),p=e.getX(d+2);r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,p),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,m),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,p),a.add(u),l.add(u),c.add(u),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Wt.fromBufferAttribute(e,t),Wt.normalize(),e.setXYZ(t,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),f=0,m=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let g=0;g<u;g++)d[m++]=c[f++]}return new Ke(d,u,h)}if(this.index===null)return ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ei=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ih,this.updateRanges=[],this.version=0,this.uuid=Rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},on=new R,Vn=class n{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyMatrix4(e),this.setXYZ(t,on.x,on.y,on.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.applyNormalMatrix(e),this.setXYZ(t,on.x,on.y,on.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)on.fromBufferAttribute(this,t),on.transformDirection(e),this.setXYZ(t,on.x,on.y,on.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Fn(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=xt(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=xt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Fn(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array),r=xt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=xt(t,this.array),i=xt(i,this.array),r=xt(r,this.array),s=xt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){co("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Ke(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){co("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},cu=new R,s0=new R,o0=new qe,On=class{constructor(e=new R(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=cu.subVectors(i,t).cross(s0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let r=e.delta(cu),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||o0.getNormalMatrix(e),r=this.coplanarPoint(cu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},a0=0,Xt=class extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:a0++}),this.uuid=Rn(),this.name="",this.type="Material",this.blending=Ms,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vu,this.blendDst=zu,this.blendEquation=xr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Za,this.stencilZFail=Za,this.stencilZPass=Za,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){ke(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){ke(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Me().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new On().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ce().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ce().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ur=class extends Xt{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Xr,$s=new R,qr=new R,Yr=new R,Zr=new ce,Ks=new ce,up=new He,ba=new R,js=new R,Ta=new R,qd=new ce,uu=new ce,Yd=new ce,as=class extends ct{constructor(e=new ur){if(super(),this.isSprite=!0,this.type="Sprite",Xr===void 0){Xr=new Qe;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new ei(t,5);Xr.setIndex([0,1,2,0,2,3]),Xr.setAttribute("position",new Vn(i,3,0,!1)),Xr.setAttribute("uv",new Vn(i,2,3,!1))}this.geometry=Xr,this.material=e,this.center=new ce(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&$e('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),qr.setFromMatrixScale(this.matrixWorld),up.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Yr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&qr.multiplyScalar(-Yr.z);let i=this.material.rotation,r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));let o=this.center;wa(ba.set(-.5,-.5,0),Yr,o,qr,r,s),wa(js.set(.5,-.5,0),Yr,o,qr,r,s),wa(Ta.set(.5,.5,0),Yr,o,qr,r,s),qd.set(0,0),uu.set(1,0),Yd.set(1,1);let a=e.ray.intersectTriangle(ba,js,Ta,!1,$s);if(a===null&&(wa(js.set(-.5,.5,0),Yr,o,qr,r,s),uu.set(0,1),a=e.ray.intersectTriangle(ba,Ta,js,!1,$s),a===null))return;let l=e.ray.origin.distanceTo($s);l<e.near||l>e.far||t.push({distance:l,point:$s.clone(),uv:vi.getInterpolation($s,ba,js,Ta,qd,uu,Yd,new ce),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function wa(n,e,t,i,r,s){Zr.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(Ks.x=s*Zr.x-r*Zr.y,Ks.y=r*Zr.x+s*Zr.y):Ks.copy(Zr),n.copy(e),n.x+=Ks.x,n.y+=Ks.y,n.applyMatrix4(up)}var _i=new R,hu=new R,Aa=new R,Ra=new R,hr=class{constructor(e=new R,t=new R(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_i)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=_i.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_i.copy(this.origin).addScaledVector(this.direction,t),_i.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){hu.copy(e).add(t).multiplyScalar(.5),Aa.copy(t).sub(e).normalize(),Ra.copy(this.origin).sub(hu);let s=e.distanceTo(t)*.5,o=-this.direction.dot(Aa),a=Ra.dot(this.direction),l=-Ra.dot(Aa),c=Ra.lengthSq(),u=Math.abs(1-o*o),h,d,f,m;if(u>0)if(h=o*l-a,d=o*a-l,m=s*u,h>=0)if(d>=-m)if(d<=m){let _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-m?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=m?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(hu).addScaledVector(Aa,d),f}intersectSphere(e,t){if(e.radius<0)return null;_i.subVectors(e.center,this.origin);let i=_i.dot(this.direction),r=_i.dot(_i)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,_i)!==null}intersectTriangle(e,t,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,h=e.x-o.x,d=e.y-o.y,f=e.z-o.z,m=t.x-o.x,_=t.y-o.y,p=t.z-o.z,g=i.x-o.x,M=i.y-o.y,T=i.z-o.z,x=Math.abs(l),S=Math.abs(c),E=Math.abs(u),A,v,w,C,L,D,H,U,V,W,J,se;if(x>=S&&x>=E?(w=l,D=h,V=m,se=g,l>=0?(A=c,v=u,C=d,L=f,H=_,U=p,W=M,J=T):(A=u,v=c,C=f,L=d,H=p,U=_,W=T,J=M)):S>=E?(w=c,D=d,V=_,se=M,c>=0?(A=u,v=l,C=f,L=h,H=p,U=m,W=T,J=g):(A=l,v=u,C=h,L=f,H=m,U=p,W=g,J=T)):(w=u,D=f,V=p,se=T,u>=0?(A=l,v=c,C=h,L=d,H=m,U=_,W=g,J=M):(A=c,v=l,C=d,L=h,H=_,U=m,W=M,J=g)),w===0)return null;let $=A/w,j=v/w,ee=1/w,Ie=C-$*D,Te=L-j*D,ae=H-$*V,he=U-j*V,Re=W-$*se,X=J-j*se,ne=Re*he-X*ae,fe=Ie*X-Te*Re,Le=ae*Te-he*Ie;if(r){if(ne<0||fe<0||Le<0)return null}else if((ne<0||fe<0||Le<0)&&(ne>0||fe>0||Le>0))return null;let me=ne+fe+Le;if(me===0)return null;let De=ee*(ne*D+fe*V+Le*se);return(me>0?De<0:De>0)?null:this.at(De/me,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Tt=class extends Xt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=Rl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Zd=new He,ir=new hr,Ca=new un,Jd=new R,Pa=new R,Ia=new R,La=new R,du=new R,Na=new R,$d=new R,Ua=new R,Ct=class extends ct{constructor(e=new Qe,t=new Tt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){Na.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],h=s[l];u!==0&&(du.fromBufferAttribute(h,e),o?Na.addScaledVector(du,u):Na.addScaledVector(du.sub(t),u))}t.add(Na)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ca.copy(i.boundingSphere),Ca.applyMatrix4(s),ir.copy(e.ray).recast(e.near),!(Ca.containsPoint(ir.origin)===!1&&(ir.intersectSphere(Ca,Jd)===null||ir.origin.distanceToSquared(Jd)>(e.far-e.near)**2))&&(Zd.copy(s).invert(),ir.copy(e.ray).applyMatrix4(Zd),!(i.boundingBox!==null&&ir.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ir)))}_computeIntersections(e,t,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let p=d[m],g=o[p.materialIndex],M=Math.max(p.start,f.start),T=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let x=M,S=T;x<S;x+=3){let E=a.getX(x),A=a.getX(x+1),v=a.getX(x+2);r=Da(this,g,e,i,c,u,h,E,A,v),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{let m=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=m,g=_;p<g;p+=3){let M=a.getX(p),T=a.getX(p+1),x=a.getX(p+2);r=Da(this,o,e,i,c,u,h,M,T,x),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let p=d[m],g=o[p.materialIndex],M=Math.max(p.start,f.start),T=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let x=M,S=T;x<S;x+=3){let E=x,A=x+1,v=x+2;r=Da(this,g,e,i,c,u,h,E,A,v),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{let m=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=m,g=_;p<g;p+=3){let M=p,T=p+1,x=p+2;r=Da(this,o,e,i,c,u,h,M,T,x),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}};function l0(n,e,t,i,r,s,o,a){let l;if(e.side===zt?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===si,a),l===null)return null;Ua.copy(a),Ua.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(Ua);return c<t.near||c>t.far?null:{distance:c,point:Ua.clone(),object:n}}function Da(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Pa),n.getVertexPosition(l,Ia),n.getVertexPosition(c,La);let u=l0(n,e,t,i,Pa,Ia,La,$d);if(u){let h=new R;vi.getBarycoord($d,Pa,Ia,La,h),r&&(u.uv=vi.getInterpolatedAttribute(r,a,l,c,h,new ce)),s&&(u.uv1=vi.getInterpolatedAttribute(s,a,l,c,h,new ce)),o&&(u.normal=vi.getInterpolatedAttribute(o,a,l,c,h,new R),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new R,materialIndex:0};vi.getNormal(Pa,Ia,La,d.normal),u.face=d,u.barycoord=h}return u}var Qs=new vt,Kd=new vt,jd=new vt,c0=new vt,Qd=new He,Oa=new R,fu=new un,ef=new He,pu=new hr,dr=class extends Ct{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Mu,this.bindMatrix=new He,this.bindMatrixInverse=new He,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new _n),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Oa),this.boundingBox.expandByPoint(Oa)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new un),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Oa),this.boundingSphere.expandByPoint(Oa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let i=this.material,r=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fu.copy(this.boundingSphere),fu.applyMatrix4(r),e.ray.intersectsSphere(fu)!==!1&&(ef.copy(r).invert(),pu.copy(e.ray).applyMatrix4(ef),!(this.boundingBox!==null&&pu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,pu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new vt,t=this.geometry.attributes.skinWeight;for(let i=0,r=t.count;i<r;i++){e.fromBufferAttribute(t,i);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Mu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Zf?this.bindMatrixInverse.copy(this.bindMatrix).invert():ke("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let i=this.skeleton,r=this.geometry;Kd.fromBufferAttribute(r.attributes.skinIndex,e),jd.fromBufferAttribute(r.attributes.skinWeight,e),t.isVector4?(Qs.copy(t),t.set(0,0,0,0)):(Qs.set(...t,1),t.set(0,0,0)),Qs.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let o=jd.getComponent(s);if(o!==0){let a=Kd.getComponent(s);Qd.multiplyMatrices(i.bones[a].matrixWorld,i.boneInverses[a]),t.addScaledVector(c0.copy(Qs).applyMatrix4(Qd),o)}}return t.isVector4&&(t.w=Qs.w),t.applyMatrix4(this.bindMatrixInverse)}},ls=class extends ct{constructor(){super(),this.isBone=!0,this.type="Bone"}},cs=class extends Ht{constructor(e=null,t=1,i=1,r,s,o,a,l,c=Lt,u=Lt,h,d){super(null,o,a,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},tf=new He,u0=new He,zn=class n{constructor(e=[],t=[]){this.uuid=Rn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){ke("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,r=this.bones.length;i<r;i++)this.boneInverses.push(new He)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let i=new He;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){let e=this.bones,t=this.boneInverses,i=this.boneMatrices,r=this.boneTexture;for(let s=0,o=e.length;s<o;s++){let a=e[s]?e[s].matrixWorld:u0;tf.multiplyMatrices(a,t[s]),tf.toArray(i,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let i=new cs(t,e,e,En,Mn);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){let r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,r=e.bones.length;i<r;i++){let s=e.bones[i],o=t[s];o===void 0&&(ke("Skeleton: No bone found with UUID:",s),o=new ls),this.bones.push(o),this.boneInverses.push(new He().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,i=this.boneInverses;for(let r=0,s=t.length;r<s;r++){let o=t[r];e.bones.push(o.uuid);let a=i[r];e.boneInverses.push(a.toArray())}return e}},Mi=class extends Ke{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Jr=new He,nf=new He,Fa=[],rf=new _n,h0=new He,eo=new Ct,to=new un,go=class extends Ct{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Mi(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,h0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new _n),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Jr),rf.copy(e.boundingBox).applyMatrix4(Jr),this.boundingBox.union(rf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new un),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Jr),to.copy(e.boundingSphere).applyMatrix4(Jr),this.boundingSphere.union(to)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,t){let i=this.matrixWorld,r=this.count;if(eo.geometry=this.geometry,eo.material=this.material,eo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),to.copy(this.boundingSphere),to.applyMatrix4(i),e.ray.intersectsSphere(to)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Jr),nf.multiplyMatrices(i,Jr),eo.matrixWorld=nf,eo.raycast(e,Fa);for(let o=0,a=Fa.length;o<a;o++){let l=Fa[o];l.instanceId=s,l.object=this,t.push(l)}Fa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Mi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new cs(new Float32Array(r*this.count),r,this.count,Dl,Mn));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;return s[l]=a,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},rr=new un,d0=new ce(.5,.5),Ba=new R,us=class{constructor(e=new On,t=new On,i=new On,r=new On,s=new On,o=new On){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Bn,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],m=s[8],_=s[9],p=s[10],g=s[11],M=s[12],T=s[13],x=s[14],S=s[15];if(r[0].setComponents(c-o,f-u,g-m,S-M).normalize(),r[1].setComponents(c+o,f+u,g+m,S+M).normalize(),r[2].setComponents(c+a,f+h,g+_,S+T).normalize(),r[3].setComponents(c-a,f-h,g-_,S-T).normalize(),i)r[4].setComponents(l,d,p,x).normalize(),r[5].setComponents(c-l,f-d,g-p,S-x).normalize();else if(r[4].setComponents(c-l,f-d,g-p,S-x).normalize(),t===Bn)r[5].setComponents(c+l,f+d,g+p,S+x).normalize();else if(t===ns)r[5].setComponents(l,d,p,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),rr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),rr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(rr)}intersectsSprite(e){rr.center.set(0,0,0);let t=d0.distanceTo(e.center);return rr.radius=.7071067811865476+t,rr.applyMatrix4(e.matrixWorld),this.intersectsSphere(rr)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(Ba.x=r.normal.x>0?e.max.x:e.min.x,Ba.y=r.normal.y>0?e.max.y:e.min.y,Ba.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ba)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Yt=class extends Xt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ol=new R,al=new R,sf=new He,no=new hr,Ha=new un,mu=new R,of=new R,Si=class extends ct{constructor(e=new Qe,t=new Yt){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)ol.fromBufferAttribute(t,r-1),al.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=ol.distanceTo(al);e.setAttribute("lineDistance",new nt(i,1))}else ke("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ha.copy(i.boundingSphere),Ha.applyMatrix4(r),Ha.radius+=s,e.ray.intersectsSphere(Ha)===!1)return;sf.copy(r).invert(),no.copy(e.ray).applyMatrix4(sf);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){let f=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let _=f,p=m-1;_<p;_+=c){let g=u.getX(_),M=u.getX(_+1),T=Va(this,e,no,l,g,M,_);T&&t.push(T)}if(this.isLineLoop){let _=u.getX(m-1),p=u.getX(f),g=Va(this,e,no,l,_,p,m-1);g&&t.push(g)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=f,p=m-1;_<p;_+=c){let g=Va(this,e,no,l,_,_+1,_);g&&t.push(g)}if(this.isLineLoop){let _=Va(this,e,no,l,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Va(n,e,t,i,r,s,o){let a=n.geometry.attributes.position;if(ol.fromBufferAttribute(a,r),al.fromBufferAttribute(a,s),t.distanceSqToSegment(ol,al,mu,of)>i)return;mu.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(mu);if(!(c<e.near||c>e.far))return{distance:c,point:of.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var af=new R,lf=new R,hn=class extends Si{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)af.fromBufferAttribute(t,r),lf.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+af.distanceTo(lf);e.setAttribute("lineDistance",new nt(i,1))}else ke("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},_o=class extends Si{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Ei=class extends Xt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},cf=new He,wu=new hr,za=new un,Ga=new R,Vi=class extends ct{constructor(e=new Qe,t=new Ei){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),za.copy(i.boundingSphere),za.applyMatrix4(r),za.radius+=s,e.ray.intersectsSphere(za)===!1)return;cf.copy(r).invert(),wu.copy(e.ray).applyMatrix4(cf);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,_=f;m<_;m++){let p=c.getX(m);Ga.fromBufferAttribute(h,p),uf(Ga,p,l,r,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let m=d,_=f;m<_;m++)Ga.fromBufferAttribute(h,m),uf(Ga,m,l,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function uf(n,e,t,i,r,s,o){let a=wu.distanceSqToPoint(n);if(a<t){let l=new R;wu.closestPointToPoint(n,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var xo=class extends Ht{constructor(e=[],t=qi,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},vo=class extends Ht{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var zi=class extends Ht{constructor(e,t,i=qn,r,s,o,a=Lt,l=Lt,c,u=jn,h=1){if(u!==jn&&u!==Yi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:h};super(d,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ss(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ll=class extends zi{constructor(e,t=qn,i=qi,r,s,o=Lt,a=Lt,l,c=jn){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},yo=class extends Ht{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Gi=class n extends Qe{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,f=0;m("z","y","x",-1,-1,i,t,e,o,s,0),m("z","y","x",1,-1,i,t,-e,o,s,1),m("x","z","y",1,1,e,i,t,r,o,2),m("x","z","y",1,-1,e,i,-t,r,o,3),m("x","y","z",1,-1,e,t,i,r,s,4),m("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(u,3)),this.setAttribute("uv",new nt(h,2));function m(_,p,g,M,T,x,S,E,A,v,w){let C=x/A,L=S/v,D=x/2,H=S/2,U=E/2,V=A+1,W=v+1,J=0,se=0,$=new R;for(let j=0;j<W;j++){let ee=j*L-H;for(let Ie=0;Ie<V;Ie++){let Te=Ie*C-D;$[_]=Te*M,$[p]=ee*T,$[g]=U,c.push($.x,$.y,$.z),$[_]=0,$[p]=0,$[g]=E>0?1:-1,u.push($.x,$.y,$.z),h.push(Ie/A),h.push(1-j/v),J+=1}}for(let j=0;j<v;j++)for(let ee=0;ee<A;ee++){let Ie=d+ee+V*j,Te=d+ee+V*(j+1),ae=d+(ee+1)+V*(j+1),he=d+(ee+1)+V*j;l.push(Ie,Te,he),l.push(Te,ae,he),se+=6}a.addGroup(f,se,w),f+=se,d+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},fr=class n extends Qe{constructor(e=1,t=1,i=4,r=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:r,heightSegments:s},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),r=Math.max(3,Math.floor(r)),s=Math.max(1,Math.floor(s));let o=[],a=[],l=[],c=[],u=t/2,h=Math.PI/2*e,d=t,f=2*h+d,m=i*2+s,_=r+1,p=new R,g=new R;for(let M=0;M<=m;M++){let T=0,x=0,S=0,E=0;if(M<=i){let w=M/i,C=w*Math.PI/2;x=-u-e*Math.cos(C),S=e*Math.sin(C),E=-e*Math.cos(C),T=w*h}else if(M<=i+s){let w=(M-i)/s;x=-u+w*t,S=e,E=0,T=h+w*d}else{let w=(M-i-s)/i,C=w*Math.PI/2;x=u+e*Math.sin(C),S=e*Math.cos(C),E=e*Math.sin(C),T=h+d+w*h}let A=Math.max(0,Math.min(1,T/f)),v=0;M===0?v=.5/r:M===m&&(v=-.5/r);for(let w=0;w<=r;w++){let C=w/r,L=C*Math.PI*2,D=Math.sin(L),H=Math.cos(L);g.x=-S*H,g.y=x,g.z=S*D,a.push(g.x,g.y,g.z),p.set(-S*H,E,S*D),p.normalize(),l.push(p.x,p.y,p.z),c.push(C+v,A)}if(M>0){let w=(M-1)*_;for(let C=0;C<r;C++){let L=w+C,D=w+C+1,H=M*_+C,U=M*_+C+1;o.push(L,D,H),o.push(D,U,H)}}}this.setIndex(o),this.setAttribute("position",new nt(a,3)),this.setAttribute("normal",new nt(l,3)),this.setAttribute("uv",new nt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},xn=class n extends Qe{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);let s=[],o=[],a=[],l=[],c=new R,u=new ce;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=t;h++,d+=3){let f=i+h/t*r;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),u.x=(o[d]/e+1)/2,u.y=(o[d+1]/e+1)/2,l.push(u.x,u.y)}for(let h=1;h<=t;h++)s.push(h,h+1,0);this.setIndex(s),this.setAttribute("position",new nt(o,3)),this.setAttribute("normal",new nt(a,3)),this.setAttribute("uv",new nt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Vt=class n extends Qe{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};let c=this;r=Math.floor(r),s=Math.floor(s);let u=[],h=[],d=[],f=[],m=0,_=[],p=i/2,g=0;M(),o===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(u),this.setAttribute("position",new nt(h,3)),this.setAttribute("normal",new nt(d,3)),this.setAttribute("uv",new nt(f,2));function M(){let x=new R,S=new R,E=0,A=(t-e)/i;for(let v=0;v<=s;v++){let w=[],C=v/s,L=C*(t-e)+e;for(let D=0;D<=r;D++){let H=D/r,U=H*l+a,V=Math.sin(U),W=Math.cos(U);S.x=L*V,S.y=-C*i+p,S.z=L*W,h.push(S.x,S.y,S.z),x.set(V,A,W).normalize(),d.push(x.x,x.y,x.z),f.push(H,1-C),w.push(m++)}_.push(w)}for(let v=0;v<r;v++)for(let w=0;w<s;w++){let C=_[w][v],L=_[w+1][v],D=_[w+1][v+1],H=_[w][v+1];(e>0||w!==0)&&(u.push(C,L,H),E+=3),(t>0||w!==s-1)&&(u.push(L,D,H),E+=3)}c.addGroup(g,E,0),g+=E}function T(x){let S=m,E=new ce,A=new R,v=0,w=x===!0?e:t,C=x===!0?1:-1;for(let D=1;D<=r;D++)h.push(0,p*C,0),d.push(0,C,0),f.push(.5,.5),m++;let L=m;for(let D=0;D<=r;D++){let U=D/r*l+a,V=Math.cos(U),W=Math.sin(U);A.x=w*W,A.y=p*C,A.z=w*V,h.push(A.x,A.y,A.z),d.push(0,C,0),E.x=V*.5+.5,E.y=W*.5*C+.5,f.push(E.x,E.y),m++}for(let D=0;D<r;D++){let H=S+D,U=L+D;x===!0?u.push(U,U+1,H):u.push(U+1,U,H),v+=3}c.addGroup(g,v,x===!0?1:2),g+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},hs=class n extends Vt{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new n(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},cl=class n extends Qe{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};let s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new nt(s,3)),this.setAttribute("normal",new nt(s.slice(),3)),this.setAttribute("uv",new nt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let T=new R,x=new R,S=new R;for(let E=0;E<t.length;E+=3)f(t[E+0],T),f(t[E+1],x),f(t[E+2],S),l(T,x,S,M)}function l(M,T,x,S){let E=S+1,A=[];for(let v=0;v<=E;v++){A[v]=[];let w=M.clone().lerp(x,v/E),C=T.clone().lerp(x,v/E),L=E-v;for(let D=0;D<=L;D++)D===0&&v===E?A[v][D]=w:A[v][D]=w.clone().lerp(C,D/L)}for(let v=0;v<E;v++)for(let w=0;w<2*(E-v)-1;w++){let C=Math.floor(w/2);w%2===0?(d(A[v][C+1]),d(A[v+1][C]),d(A[v][C])):(d(A[v][C+1]),d(A[v+1][C+1]),d(A[v+1][C]))}}function c(M){let T=new R;for(let x=0;x<s.length;x+=3)T.x=s[x+0],T.y=s[x+1],T.z=s[x+2],T.normalize().multiplyScalar(M),s[x+0]=T.x,s[x+1]=T.y,s[x+2]=T.z}function u(){let M=new R;for(let T=0;T<s.length;T+=3){M.x=s[T+0],M.y=s[T+1],M.z=s[T+2];let x=p(M)/2/Math.PI+.5,S=g(M)/Math.PI+.5;o.push(x,1-S)}m(),h()}function h(){for(let M=0;M<o.length;M+=6){let T=o[M+0],x=o[M+2],S=o[M+4],E=Math.max(T,x,S),A=Math.min(T,x,S);E>.9&&A<.1&&(T<.2&&(o[M+0]+=1),x<.2&&(o[M+2]+=1),S<.2&&(o[M+4]+=1))}}function d(M){s.push(M.x,M.y,M.z)}function f(M,T){let x=M*3;T.x=e[x+0],T.y=e[x+1],T.z=e[x+2]}function m(){let M=new R,T=new R,x=new R,S=new R,E=new ce,A=new ce,v=new ce;for(let w=0,C=0;w<s.length;w+=9,C+=6){M.set(s[w+0],s[w+1],s[w+2]),T.set(s[w+3],s[w+4],s[w+5]),x.set(s[w+6],s[w+7],s[w+8]),E.set(o[C+0],o[C+1]),A.set(o[C+2],o[C+3]),v.set(o[C+4],o[C+5]),S.copy(M).add(T).add(x).divideScalar(3);let L=p(S);_(E,C+0,M,L),_(A,C+2,T,L),_(v,C+4,x,L)}}function _(M,T,x,S){S<0&&M.x===1&&(o[T]=M.x-1),x.x===0&&x.z===0&&(o[T]=S/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function g(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}},pr=class n extends cl{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var vn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ke("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),r=0,s=i.length,o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);let u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new ce:new R);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new R,r=[],s=[],o=[],a=new R,l=new He;for(let f=0;f<=e;f++){let m=f/e;r[f]=this.getTangentAt(m,new R)}s[0]=new R,o[0]=new R;let c=Number.MAX_VALUE,u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(ot(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(ot(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(r[m],f*m)),o[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ds=class extends vn{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ce){let i=t,r=Math.PI*2,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);let a=this.aStartAngle+e*s,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ul=class extends ds{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}};function ah(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let d=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){let o=s*s,a=o*s;return n+e*s+t*o+i*a}}}var hf=new R,df=new R,gu=new ah,_u=new ah,xu=new ah,hl=class extends vn{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new R){let i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(df.subVectors(r[0],r[1]).add(r[0]),c=df);let h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(hf.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=hf),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),m<1e-4&&(m=_),p<1e-4&&(p=_),gu.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,m,_,p),_u.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,m,_,p),xu.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,m,_,p)}else this.curveType==="catmullrom"&&(gu.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),_u.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),xu.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return i.set(gu.calc(l),_u.calc(l),xu.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new R().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function ff(n,e,t,i,r){let s=(i-e)*.5,o=(r-t)*.5,a=n*n,l=n*a;return(2*t-2*i+s+o)*l+(-3*t+3*i-2*s-o)*a+s*n+t}function f0(n,e){let t=1-n;return t*t*e}function p0(n,e){return 2*(1-n)*n*e}function m0(n,e){return n*n*e}function oo(n,e,t,i){return f0(n,e)+p0(n,t)+m0(n,i)}function g0(n,e){let t=1-n;return t*t*t*e}function _0(n,e){let t=1-n;return 3*t*t*n*e}function x0(n,e){return 3*(1-n)*n*n*e}function v0(n,e){return n*n*n*e}function ao(n,e,t,i,r){return g0(n,e)+_0(n,t)+x0(n,i)+v0(n,r)}var Mo=class extends vn{constructor(e=new ce,t=new ce,i=new ce,r=new ce){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new ce){let i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(ao(e,r.x,s.x,o.x,a.x),ao(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},dl=class extends vn{constructor(e=new R,t=new R,i=new R,r=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new R){let i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(ao(e,r.x,s.x,o.x,a.x),ao(e,r.y,s.y,o.y,a.y),ao(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},So=class extends vn{constructor(e=new ce,t=new ce){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ce){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ce){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fl=class extends vn{constructor(e=new R,t=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new R){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new R){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Eo=class extends vn{constructor(e=new ce,t=new ce,i=new ce){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ce){let i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(oo(e,r.x,s.x,o.x),oo(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},pl=class extends vn{constructor(e=new R,t=new R,i=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new R){let i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(oo(e,r.x,s.x,o.x),oo(e,r.y,s.y,o.y),oo(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},bo=class extends vn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ce){let i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(ff(a,l.x,c.x,u.x,h.x),ff(a,l.y,c.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new ce().fromArray(r))}return this}},Au=Object.freeze({__proto__:null,ArcCurve:ul,CatmullRomCurve3:hl,CubicBezierCurve:Mo,CubicBezierCurve3:dl,EllipseCurve:ds,LineCurve:So,LineCurve3:fl,QuadraticBezierCurve:Eo,QuadraticBezierCurve3:pl,SplineCurve:bo}),ml=class extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Au[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),r=this.getCurveLengths(),s=0;for(;s<r.length;){if(r[s]>=i){let o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let r=0,s=this.curves;r<s.length;r++){let o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let r=e.curves[t];this.curves.push(new Au[r.type]().fromJSON(r))}return this}},To=class extends ml{constructor(e){super(),this.type="Path",this.currentPoint=new ce,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new So(this.currentPoint.clone(),new ce(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){let s=new Eo(this.currentPoint.clone(),new ce(e,t),new ce(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){let a=new Mo(this.currentPoint.clone(),new ce(e,t),new ce(i,r),new ce(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new bo(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,l){let c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,r,s,o,a,l),this}absellipse(e,t,i,r,s,o,a,l){let c=new ds(e,t,i,r,s,o,a,l);if(this.curves.length>0){let h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);let u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Gn=class extends To{constructor(e){super(e),this.uuid=Rn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let r=e.holes[t];this.holes.push(new To().fromJSON(r))}return this}};function y0(n,e,t=2){let i=e&&e.length,r=i?e[0]*t:n.length,s=hp(n,0,r,t,!0),o=[];if(!s||s.next===s.prev)return o;let a,l,c;if(i&&(s=T0(n,e,s,t)),n.length>80*t){a=n[0],l=n[1];let u=a,h=l;for(let d=t;d<r;d+=t){let f=n[d],m=n[d+1];f<a&&(a=f),m<l&&(l=m),f>u&&(u=f),m>h&&(h=m)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return wo(s,o,t,a,l,c,0),o}function hp(n,e,t,i,r){let s;if(r===O0(n,e,t,i)>0)for(let o=e;o<t;o+=i)s=pf(o/i|0,n[o],n[o+1],s);else for(let o=t-i;o>=e;o-=i)s=pf(o/i|0,n[o],n[o+1],s);return s&&fs(s,s.next)&&(Ro(s),s=s.next),s}function mr(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(fs(t,t.next)||Pt(t.prev,t,t.next)===0)){if(Ro(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function wo(n,e,t,i,r,s,o){if(!n)return;!o&&s&&P0(n,i,r,s);let a=n;for(;n.prev!==n.next;){let l=n.prev,c=n.next;if(s?S0(n,i,r,s):M0(n)){e.push(l.i,n.i,c.i),Ro(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=E0(mr(n),e),wo(n,e,t,i,r,s,2)):o===2&&b0(n,e,t,i,r,s):wo(mr(n),e,t,i,r,s,1);break}}}function M0(n){let e=n.prev,t=n,i=n.next;if(Pt(e,t,i)>=0)return!1;let r=e.x,s=t.x,o=i.x,a=e.y,l=t.y,c=i.y,u=Math.min(r,s,o),h=Math.min(a,l,c),d=Math.max(r,s,o),f=Math.max(a,l,c),m=i.next;for(;m!==e;){if(m.x>=u&&m.x<=d&&m.y>=h&&m.y<=f&&io(r,a,s,l,o,c,m.x,m.y)&&Pt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function S0(n,e,t,i){let r=n.prev,s=n,o=n.next;if(Pt(r,s,o)>=0)return!1;let a=r.x,l=s.x,c=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,l,c),m=Math.min(u,h,d),_=Math.max(a,l,c),p=Math.max(u,h,d),g=Ru(f,m,e,t,i),M=Ru(_,p,e,t,i),T=n.prevZ,x=n.nextZ;for(;T&&T.z>=g&&x&&x.z<=M;){if(T.x>=f&&T.x<=_&&T.y>=m&&T.y<=p&&T!==r&&T!==o&&io(a,u,l,h,c,d,T.x,T.y)&&Pt(T.prev,T,T.next)>=0||(T=T.prevZ,x.x>=f&&x.x<=_&&x.y>=m&&x.y<=p&&x!==r&&x!==o&&io(a,u,l,h,c,d,x.x,x.y)&&Pt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;T&&T.z>=g;){if(T.x>=f&&T.x<=_&&T.y>=m&&T.y<=p&&T!==r&&T!==o&&io(a,u,l,h,c,d,T.x,T.y)&&Pt(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;x&&x.z<=M;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=p&&x!==r&&x!==o&&io(a,u,l,h,c,d,x.x,x.y)&&Pt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function E0(n,e){let t=n;do{let i=t.prev,r=t.next.next;!fs(i,r)&&fp(i,t,t.next,r)&&Ao(i,r)&&Ao(r,i)&&(e.push(i.i,t.i,r.i),Ro(t),Ro(t.next),t=n=r),t=t.next}while(t!==n);return mr(t)}function b0(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&N0(o,a)){let l=pp(o,a);o=mr(o,o.next),l=mr(l,l.next),wo(o,e,t,i,r,s,0),wo(l,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function T0(n,e,t,i){let r=[];for(let s=0,o=e.length;s<o;s++){let a=e[s]*i,l=s<o-1?e[s+1]*i:n.length,c=hp(n,a,l,i,!1);c===c.next&&(c.steiner=!0),r.push(L0(c))}r.sort(w0);for(let s=0;s<r.length;s++)t=A0(r[s],t);return t}function w0(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){let i=(n.next.y-n.y)/(n.next.x-n.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=i-r}return t}function A0(n,e){let t=R0(n,e);if(!t)return e;let i=pp(t,n);return mr(i,i.next),mr(t,t.next)}function R0(n,e){let t=e,i=n.x,r=n.y,s=-1/0,o;if(fs(n,t))return t;do{if(fs(n,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){let h=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>s&&(s=h,o=t.x<t.next.x?t:t.next,h===i))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,u=1/0;t=o;do{if(i>=t.x&&t.x>=l&&i!==t.x&&dp(r<c?i:s,r,l,c,r<c?s:i,r,t.x,t.y)){let h=Math.abs(r-t.y)/(i-t.x);Ao(t,n)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&C0(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function C0(n,e){return Pt(n.prev,n,e.prev)<0&&Pt(e.next,n,n.next)<0}function P0(n,e,t,i){let r=n;do r.z===0&&(r.z=Ru(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,I0(r)}function I0(n){let e,t=1;do{let i=n,r;n=null;let s=null;for(e=0;i;){e++;let o=i,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,t*=2}while(e>1);return n}function Ru(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function L0(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function dp(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function io(n,e,t,i,r,s,o,a){return!(n===o&&e===a)&&dp(n,e,t,i,r,s,o,a)}function N0(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!U0(n,e)&&(Ao(n,e)&&Ao(e,n)&&D0(n,e)&&(Pt(n.prev,n,e.prev)||Pt(n,e.prev,e))||fs(n,e)&&Pt(n.prev,n,n.next)>0&&Pt(e.prev,e,e.next)>0)}function Pt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function fs(n,e){return n.x===e.x&&n.y===e.y}function fp(n,e,t,i){let r=Wa(Pt(n,e,t)),s=Wa(Pt(n,e,i)),o=Wa(Pt(t,i,n)),a=Wa(Pt(t,i,e));return!!(r!==s&&o!==a||r===0&&ka(n,t,e)||s===0&&ka(n,i,e)||o===0&&ka(t,n,i)||a===0&&ka(t,e,i))}function ka(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Wa(n){return n>0?1:n<0?-1:0}function U0(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&fp(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Ao(n,e){return Pt(n.prev,n,n.next)<0?Pt(n,e,n.next)>=0&&Pt(n,n.prev,e)>=0:Pt(n,e,n.prev)<0||Pt(n,n.next,e)<0}function D0(n,e){let t=n,i=!1,r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function pp(n,e){let t=Cu(n.i,n.x,n.y),i=Cu(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function pf(n,e,t,i){let r=Cu(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Ro(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Cu(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function O0(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}var Pu=class{static triangulate(e,t,i=2){return y0(e,t,i)}},$n=class n{static area(e){let t=e.length,i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return n.area(e)<0}static triangulateShape(e,t){let i=[],r=[],s=[];mf(e),gf(i,e);let o=e.length;t.forEach(mf);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,gf(i,t[l]);let a=Pu.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}};function mf(n){let e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function gf(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}var ps=class n extends Qe{constructor(e=new Gn([new ce(.5,.5),new ce(-.5,.5),new ce(-.5,-.5),new ce(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new nt(r,3)),this.setAttribute("uv",new nt(s,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3,g=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:F0,T,x=!1,S,E,A,v;if(g){T=g.getSpacedPoints(u),x=!0,d=!1;let ie=g.isCatmullRomCurve3?g.closed:!1;S=g.computeFrenetFrames(u,ie),E=new R,A=new R,v=new R}d||(p=0,f=0,m=0,_=0);let w=a.extractPoints(c),C=w.shape,L=w.holes;if(!$n.isClockWise(C)){C=C.reverse();for(let ie=0,G=L.length;ie<G;ie++){let N=L[ie];$n.isClockWise(N)&&(L[ie]=N.reverse())}}function H(ie){let N=10000000000000001e-36,O=ie[0];for(let k=1;k<=ie.length;k++){let ue=k%ie.length,de=ie[ue],xe=de.x-O.x,pe=de.y-O.y,I=xe*xe+pe*pe,Xe=Math.max(Math.abs(de.x),Math.abs(de.y),Math.abs(O.x),Math.abs(O.y)),Ze=N*Xe*Xe;if(I<=Ze){ie.splice(ue,1),k--;continue}O=de}}H(C),L.forEach(H);let U=L.length,V=C;for(let ie=0;ie<U;ie++){let G=L[ie];C=C.concat(G)}function W(ie,G,N){return G||$e("ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(G,N)}let J=C.length;function se(ie,G,N){let O,k,ue,de=ie.x-G.x,xe=ie.y-G.y,pe=N.x-ie.x,I=N.y-ie.y,Xe=de*de+xe*xe,Ze=de*I-xe*pe;if(Math.abs(Ze)>Number.EPSILON){let P=Math.sqrt(Xe),y=Math.sqrt(pe*pe+I*I),z=G.x-xe/P,q=G.y+de/P,K=N.x-I/y,ge=N.y+pe/y,_e=((K-z)*I-(ge-q)*pe)/(de*I-xe*pe);O=z+de*_e-ie.x,k=q+xe*_e-ie.y;let te=O*O+k*k;if(te<=2)return new ce(O,k);ue=Math.sqrt(te/2)}else{let P=!1;de>Number.EPSILON?pe>Number.EPSILON&&(P=!0):de<-Number.EPSILON?pe<-Number.EPSILON&&(P=!0):Math.sign(xe)===Math.sign(I)&&(P=!0),P?(O=-xe,k=de,ue=Math.sqrt(Xe)):(O=de,k=xe,ue=Math.sqrt(Xe/2))}return new ce(O/ue,k/ue)}let $=[];for(let ie=0,G=V.length,N=G-1,O=ie+1;ie<G;ie++,N++,O++)N===G&&(N=0),O===G&&(O=0),$[ie]=se(V[ie],V[N],V[O]);let j=[],ee,Ie=$.concat();for(let ie=0,G=U;ie<G;ie++){let N=L[ie];ee=[];for(let O=0,k=N.length,ue=k-1,de=O+1;O<k;O++,ue++,de++)ue===k&&(ue=0),de===k&&(de=0),ee[O]=se(N[O],N[ue],N[de]);j.push(ee),Ie=Ie.concat(ee)}let Te;if(p===0)Te=$n.triangulateShape(V,L);else{let ie=[],G=[];for(let N=0;N<p;N++){let O=N/p,k=f*Math.cos(O*Math.PI/2),ue=m*Math.sin(O*Math.PI/2)+_;for(let de=0,xe=V.length;de<xe;de++){let pe=W(V[de],$[de],ue);fe(pe.x,pe.y,-k),O===0&&ie.push(pe)}for(let de=0,xe=U;de<xe;de++){let pe=L[de];ee=j[de];let I=[];for(let Xe=0,Ze=pe.length;Xe<Ze;Xe++){let P=W(pe[Xe],ee[Xe],ue);fe(P.x,P.y,-k),O===0&&I.push(P)}O===0&&G.push(I)}}Te=$n.triangulateShape(ie,G)}let ae=Te.length,he=m+_;for(let ie=0;ie<J;ie++){let G=d?W(C[ie],Ie[ie],he):C[ie];x?(A.copy(S.normals[0]).multiplyScalar(G.x),E.copy(S.binormals[0]).multiplyScalar(G.y),v.copy(T[0]).add(A).add(E),fe(v.x,v.y,v.z)):fe(G.x,G.y,0)}for(let ie=1;ie<=u;ie++)for(let G=0;G<J;G++){let N=d?W(C[G],Ie[G],he):C[G];x?(A.copy(S.normals[ie]).multiplyScalar(N.x),E.copy(S.binormals[ie]).multiplyScalar(N.y),v.copy(T[ie]).add(A).add(E),fe(v.x,v.y,v.z)):fe(N.x,N.y,h/u*ie)}for(let ie=p-1;ie>=0;ie--){let G=ie/p,N=f*Math.cos(G*Math.PI/2),O=m*Math.sin(G*Math.PI/2)+_;for(let k=0,ue=V.length;k<ue;k++){let de=W(V[k],$[k],O);fe(de.x,de.y,h+N)}for(let k=0,ue=L.length;k<ue;k++){let de=L[k];ee=j[k];for(let xe=0,pe=de.length;xe<pe;xe++){let I=W(de[xe],ee[xe],O);x?fe(I.x,I.y+T[u-1].y,T[u-1].x+N):fe(I.x,I.y,h+N)}}}Re(),X();function Re(){let ie=r.length/3;if(d){let G=0,N=J*G;for(let O=0;O<ae;O++){let k=Te[O];Le(k[2]+N,k[1]+N,k[0]+N)}G=u+p*2,N=J*G;for(let O=0;O<ae;O++){let k=Te[O];Le(k[0]+N,k[1]+N,k[2]+N)}}else{for(let G=0;G<ae;G++){let N=Te[G];Le(N[2],N[1],N[0])}for(let G=0;G<ae;G++){let N=Te[G];Le(N[0]+J*u,N[1]+J*u,N[2]+J*u)}}i.addGroup(ie,r.length/3-ie,0)}function X(){let ie=r.length/3,G=0;ne(V,G),G+=V.length;for(let N=0,O=L.length;N<O;N++){let k=L[N];ne(k,G),G+=k.length}i.addGroup(ie,r.length/3-ie,1)}function ne(ie,G){let N=ie.length;for(;--N>=0;){let O=N,k=N-1;k<0&&(k=ie.length-1);for(let ue=0,de=u+p*2;ue<de;ue++){let xe=J*ue,pe=J*(ue+1),I=G+O+xe,Xe=G+k+xe,Ze=G+k+pe,P=G+O+pe;me(I,Xe,Ze,P)}}}function fe(ie,G,N){l.push(ie),l.push(G),l.push(N)}function Le(ie,G,N){De(ie),De(G),De(N);let O=r.length/3,k=M.generateTopUV(i,r,O-3,O-2,O-1);tt(k[0]),tt(k[1]),tt(k[2])}function me(ie,G,N,O){De(ie),De(G),De(O),De(G),De(N),De(O);let k=r.length/3,ue=M.generateSideWallUV(i,r,k-6,k-3,k-2,k-1);tt(ue[0]),tt(ue[1]),tt(ue[3]),tt(ue[1]),tt(ue[2]),tt(ue[3])}function De(ie){r.push(l[ie*3+0]),r.push(l[ie*3+1]),r.push(l[ie*3+2])}function tt(ie){s.push(ie.x),s.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return B0(t,i,e)}static fromJSON(e,t){let i=[];for(let s=0,o=e.shapes.length;s<o;s++){let a=t[e.shapes[s]];i.push(a)}let r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new Au[r.type]().fromJSON(r)),new n(i,e.options)}},F0={generateTopUV:function(n,e,t,i,r){let s=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[r*3],u=e[r*3+1];return[new ce(s,o),new ce(a,l),new ce(c,u)]},generateSideWallUV:function(n,e,t,i,r,s){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],u=e[i*3+1],h=e[i*3+2],d=e[r*3],f=e[r*3+1],m=e[r*3+2],_=e[s*3],p=e[s*3+1],g=e[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new ce(o,1-l),new ce(c,1-h),new ce(d,1-m),new ce(_,1-g)]:[new ce(a,1-l),new ce(u,1-h),new ce(f,1-m),new ce(p,1-g)]}};function B0(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){let s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Nt=class n extends Qe{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=t/l,f=[],m=[],_=[],p=[];for(let g=0;g<u;g++){let M=g*d-o;for(let T=0;T<c;T++){let x=T*h-s;m.push(x,-M,0),_.push(0,0,1),p.push(T/a),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let M=0;M<a;M++){let T=M+c*g,x=M+c*(g+1),S=M+1+c*(g+1),E=M+1+c*g;f.push(T,x,E),f.push(x,S,E)}this.setIndex(f),this.setAttribute("position",new nt(m,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};var ki=class n extends Qe{constructor(e=new Gn([new ce(0,.5),new ce(-.5,-.5),new ce(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],r=[],s=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(i),this.setAttribute("position",new nt(r,3)),this.setAttribute("normal",new nt(s,3)),this.setAttribute("uv",new nt(o,2));function c(u){let h=r.length/3,d=u.extractPoints(t),f=d.shape,m=d.holes;$n.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,g=m.length;p<g;p++){let M=m[p];$n.isClockWise(M)===!0&&(m[p]=M.reverse())}let _=$n.triangulateShape(f,m);for(let p=0,g=m.length;p<g;p++){let M=m[p];f=f.concat(M)}for(let p=0,g=f.length;p<g;p++){let M=f[p];r.push(M.x,M.y,0),s.push(0,0,1),o.push(M.x,M.y)}for(let p=0,g=_.length;p<g;p++){let M=_[p],T=M[0]+h,x=M[1]+h,S=M[2]+h;i.push(T,x,S),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return H0(t,e)}static fromJSON(e,t){let i=[];for(let r=0,s=e.shapes.length;r<s;r++){let o=t[e.shapes[r]];i.push(o)}return new n(i,e.curveSegments)}};function H0(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){let r=n[t];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e}var Cn=class n extends Qe{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),c=0,u=[],h=new R,d=new R,f=[],m=[],_=[],p=[];for(let g=0;g<=i;g++){let M=[],T=g/i,x=o+T*a,S=e*Math.cos(x),E=Math.sqrt(e*e-S*S),A=0;g===0&&o===0?A=.5/t:g===i&&l===Math.PI&&(A=-.5/t);for(let v=0;v<=t;v++){let w=v/t,C=r+w*s;h.x=-E*Math.cos(C),h.y=S,h.z=E*Math.sin(C),m.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),p.push(w+A,1-T),M.push(c++)}u.push(M)}for(let g=0;g<i;g++)for(let M=0;M<t;M++){let T=u[g][M+1],x=u[g][M],S=u[g+1][M],E=u[g+1][M+1];(g!==0||o>0)&&f.push(T,x,E),(g!==i-1||l<Math.PI)&&f.push(x,S,E)}this.setIndex(f),this.setAttribute("position",new nt(m,3)),this.setAttribute("normal",new nt(_,3)),this.setAttribute("uv",new nt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Co=class n extends Qe{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s,thetaStart:o,thetaLength:a},i=Math.floor(i),r=Math.floor(r);let l=[],c=[],u=[],h=[],d=new R,f=new R,m=new R;for(let _=0;_<=i;_++){let p=o+_/i*a;for(let g=0;g<=r;g++){let M=g/r*s;f.x=(e+t*Math.cos(p))*Math.cos(M),f.y=(e+t*Math.cos(p))*Math.sin(M),f.z=t*Math.sin(p),c.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),m.subVectors(f,d).normalize(),u.push(m.x,m.y,m.z),h.push(g/r),h.push(_/i)}}for(let _=1;_<=i;_++)for(let p=1;p<=r;p++){let g=(r+1)*_+p-1,M=(r+1)*(_-1)+p-1,T=(r+1)*(_-1)+p,x=(r+1)*_+p;l.push(g,M,x),l.push(M,T,x)}this.setIndex(l),this.setAttribute("position",new nt(c,3)),this.setAttribute("normal",new nt(u,3)),this.setAttribute("uv",new nt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function Sr(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let r=n[t][i];if(_f(r))r.isRenderTargetTexture?(ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(_f(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function tn(n){let e={};for(let t=0;t<n.length;t++){let i=Sr(n[t]);for(let r in i)e[r]=i[r]}return e}function _f(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function V0(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function lh(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}var _c={clone:Sr,merge:tn},z0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,G0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Zt=class extends Xt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=z0,this.fragmentShader=G0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Sr(e.uniforms),this.uniformsGroups=V0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new Me().setHex(r.value);break;case"v2":this.uniforms[i].value=new ce().fromArray(r.value);break;case"v3":this.uniforms[i].value=new R().fromArray(r.value);break;case"v4":this.uniforms[i].value=new vt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new qe().fromArray(r.value);break;case"m4":this.uniforms[i].value=new He().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},gl=class extends Zt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Pn=class extends Xt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mr,this.normalScale=new ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},dn=class extends Pn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ce(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ot(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Me(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Me(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Me(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ms=class extends Xt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mr,this.normalScale=new ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=Rl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},_l=class extends Xt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$f,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},xl=class extends Xt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Hi(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Ja(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}function k0(n){function e(r,s){return n[r]-n[s]}let t=n.length,i=new Array(t);for(let r=0;r!==t;++r)i[r]=r;return i.sort(e),i}function xf(n,e,t){let i=n.length,r=new n.constructor(i);for(let s=0,o=0;o!==i;++s){let a=t[s]*e;for(let l=0;l!==e;++l)r[o++]=n[a+l]}return r}function W0(n,e,t,i){let r=1,s=n[0];for(;s!==void 0&&s[i]===void 0;)s=n[r++];if(s===void 0)return;let o=s[i];if(o!==void 0)if(Array.isArray(o))do o=s[i],o!==void 0&&(e.push(s.time),t.push(...o)),s=n[r++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[i],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=n[r++];while(s!==void 0);else do o=s[i],o!==void 0&&(e.push(s.time),t.push(o)),s=n[r++];while(s!==void 0)}var ti=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],s=t[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=t[++i],e<r)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=i[s+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},vl=class extends ti{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Eu,endingEnd:Eu}}intervalChanged_(e,t,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case bu:s=e,a=2*t-i;break;case Tu:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case bu:o=e,l=2*i-t;break;case Tu:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=t}let c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(i-t)/(r-t),_=m*m,p=_*m,g=-d*p+2*d*_-d*m,M=(1+d)*p+(-1.5-2*d)*_+(-.5+d)*m+1,T=(-1-f)*p+(1.5+f)*_+.5*m,x=f*p-f*_;for(let S=0;S!==a;++S)s[S]=g*o[u+S]+M*o[c+S]+T*o[l+S]+x*o[h+S];return s}},yl=class extends ti{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-t)/(r-t),h=1-u;for(let d=0;d!==a;++d)s[d]=o[c+d]*h+o[l+d]*u;return s}},Ml=class extends ti{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Sl=class extends ti{interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let m=(i-t)/(r-t),_=1-m;for(let p=0;p!==a;++p)s[p]=o[c+p]*_+o[l+p]*m;return s}let d=a*2,f=e-1;for(let m=0;m!==a;++m){let _=o[c+m],p=o[l+m],g=f*d+m*2,M=h[g],T=h[g+1],x=e*d+m*2,S=u[x],E=u[x+1],A=q0(i,t,M,S,r);s[m]=mp(A,_,T,E,p)}return s}};function mp(n,e,t,i,r){let s=1-n;return s*s*s*e+3*s*s*n*t+3*s*n*n*i+n*n*n*r}function X0(n,e,t,i,r){let s=1-n;return 3*s*s*(t-e)+6*s*n*(i-t)+3*n*n*(r-i)}function q0(n,e,t,i,r){let s=(n-e)/(r-e);for(let o=0;o<8;o++){let a=mp(s,e,t,i,r)-n;if(Math.abs(a)<1e-10)break;let l=X0(s,e,t,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var fn=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Hi(t,this.TimeBufferType),this.values=Hi(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Hi(e.times,Array),values:Hi(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),Ja(e.settings)&&(i.settings={inTangents:Hi(e.settings.inTangents,Array),outTangents:Hi(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Ml(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new yl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new vl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Sl(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case or:t=this.InterpolantFactoryMethodDiscrete;break;case ar:t=this.InterpolantFactoryMethodLinear;break;case Ya:t=this.InterpolantFactoryMethodSmooth;break;case Su:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return ke("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return or;case this.InterpolantFactoryMethodLinear:return ar;case this.InterpolantFactoryMethodSmooth:return Ya;case this.InterpolantFactoryMethodBezier:return Su}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e;Ja(this.settings)&&(vf(this.settings.inTangents,e),vf(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&($e("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&($e("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){$e("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){$e("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&Cg(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){$e("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===Ya,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let h=a*i,d=h-i,f=h+i;for(let m=0;m!==i;++m){let _=t[h+m];if(_!==t[d+m]||_!==t[f+m]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*i,d=o*i;for(let f=0;f!==i;++f)t[d+f]=t[h+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,Ja(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function vf(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}fn.prototype.ValueTypeName="";fn.prototype.TimeBufferType=Float32Array;fn.prototype.ValueBufferType=Float32Array;fn.prototype.DefaultInterpolation=ar;var bi=class extends fn{constructor(e,t,i){super(e,t,i)}};bi.prototype.ValueTypeName="bool";bi.prototype.ValueBufferType=Array;bi.prototype.DefaultInterpolation=or;bi.prototype.InterpolantFactoryMethodLinear=void 0;bi.prototype.InterpolantFactoryMethodSmooth=void 0;var Po=class extends fn{constructor(e,t,i,r){super(e,t,i,r)}};Po.prototype.ValueTypeName="color";var Ti=class extends fn{constructor(e,t,i,r){super(e,t,i,r)}};Ti.prototype.ValueTypeName="number";var El=class extends ti{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(r-t),c=e*a;for(let u=c+a;c!==u;c+=4)Ye.slerpFlat(s,0,o,c-a,o,c,l);return s}},wi=class extends fn{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new El(this.times,this.values,this.getValueSize(),e)}};wi.prototype.ValueTypeName="quaternion";wi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends fn{constructor(e,t,i){super(e,t,i)}};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=or;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Wi=class extends fn{constructor(e,t,i,r){super(e,t,i,r)}};Wi.prototype.ValueTypeName="vector";var Io=class{constructor(e="",t=-1,i=[],r=Jf){this.name=e,this.tracks=i,this.duration=t,this.blendMode=r,this.uuid=Rn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],i=e.tracks,r=1/(e.fps||1);for(let o=0,a=i.length;o!==a;++o)t.push(Z0(i[o]).scale(r));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],i=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,o=i.length;s!==o;++s)t.push(fn.toJSON(i[s]));return r}static CreateFromMorphTargetSequence(e,t,i,r){let s=t.length,o=[];for(let a=0;a<s;a++){let l=[],c=[];l.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);let u=k0(l);l=xf(l,1,u),c=xf(c,1,u),!r&&l[0]===0&&(l.push(s),c.push(c[0])),o.push(new Ti(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/i))}return new this(e,-1,o)}static findByName(e,t){let i=e;if(!Array.isArray(e)){let r=e;i=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<i.length;r++)if(i[r].name===t)return i[r];return null}static CreateClipsFromMorphTargetSequences(e,t,i){let r={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],u=c.name.match(s);if(u&&u.length>1){let h=u[1],d=r[h];d||(r[h]=d=[]),d.push(c)}}let o=[];for(let a in r)o.push(this.CreateFromMorphTargetSequence(a,r[a],t,i));return o}resetDuration(){let e=this.tracks,t=0;for(let i=0,r=e.length;i!==r;++i){let s=this.tracks[i];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Y0(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ti;case"vector":case"vector2":case"vector3":case"vector4":return Wi;case"color":return Po;case"quaternion":return wi;case"bool":case"boolean":return bi;case"string":return Ai}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function Z0(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Y0(n.type);if(n.times===void 0){let i=[],r=[];W0(n.keys,i,r,"value"),n.times=i,n.values=r}let t;return e.parse!==void 0?t=e.parse(n):t=new e(n.name,n.times,n.values,n.interpolation),Ja(n.settings)&&(t.settings={inTangents:Hi(n.settings.inTangents,Float32Array),outTangents:Hi(n.settings.outTangents,Float32Array)}),t}var Kn={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(yf(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!yf(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function yf(n){try{let e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var bl=class{constructor(e,t,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],m=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},gp=new bl,ni=class{constructor(e){this.manager=e!==void 0?e:gp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ni.DEFAULT_MATERIAL_NAME="__DEFAULT";var xi={},Iu=class extends Error{constructor(e,t){super(e),this.response=t}},gs=class extends ni{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=Kn.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(xi[e]!==void 0){xi[e].push({onLoad:t,onProgress:i,onError:r});return}xi[e]=[],xi[e].push({onLoad:t,onProgress:i,onError:r});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&ke("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=xi[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0,_=0,p=new ReadableStream({start(g){M();function M(){h.read().then(({done:T,value:x})=>{if(T)g.close();else{_+=x.byteLength;let S=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let E=0,A=u.length;E<A;E++){let v=u[E];v.onProgress&&v.onProgress(S)}g.enqueue(x),M()}},T=>{g.error(T)})}}});return new Response(p)}else throw new Iu(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{Kn.add(`file:${e}`,c);let u=xi[e];delete xi[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=xi[e];if(u===void 0)throw this.manager.itemError(e),c;delete xi[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var $r=new WeakMap,_s=class extends ni{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=Kn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);else{let h=$r.get(o);h===void 0&&(h=[],$r.set(o,h)),h.push({onLoad:t,onError:r})}return o}let a=is("img");function l(){u(),t&&t(this);let h=$r.get(this)||[];for(let d=0;d<h.length;d++){let f=h[d];f.onLoad&&f.onLoad(this)}$r.delete(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),Kn.remove(`image:${e}`);let d=$r.get(this)||[];for(let f=0;f<d.length;f++){let m=d[f];m.onError&&m.onError(h)}$r.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Kn.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}};var gr=class extends ni{constructor(e){super(e)}load(e,t,i,r){let s=new Ht,o=new _s(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},i,r),s}},Xi=class extends ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Lo=class extends Xi{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ct.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Me(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},vu=new He,Mf=new R,Sf=new R,xs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ce(512,512),this.mapType=en,this.map=null,this.mapPass=null,this.matrix=new He,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new us,this._frameExtents=new ce(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Mf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Mf),Sf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sf),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,r){vu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(vu,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,o=r?r.z/s.x:1,a=r?r.w/s.y:1,l=r?r.x/s.x:0,c=r?r.y/s.y:0;e.coordinateSystem===ns||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(vu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Xa=new R,qa=new Ye,Jn=new R,No=class extends ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new He,this.projectionMatrix=new He,this.projectionMatrixInverse=new He,this.coordinateSystem=Bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Xa,qa,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xa,qa,Jn.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Xa,qa,Jn),Jn.x===1&&Jn.y===1&&Jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xa,qa,Jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Bi=new R,Ef=new ce,bf=new ce,Bt=class extends No{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=lr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ro*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return lr*2*Math.atan(Math.tan(ro*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z)}getViewSize(e,t){return this.getViewBounds(e,Ef,bf),t.subVectors(bf,Ef)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ro*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Lu=class extends xs{constructor(){super(new Bt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,i=lr*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(i!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=i,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Uo=class extends Xi{constructor(e,t,i=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ct.DEFAULT_UP),this.updateMatrix(),this.target=new ct,this.distance=i,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new Lu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Nu=class extends xs{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0}},yn=class extends Xi{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new Nu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ii=class extends No{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Uu=class extends xs{constructor(){super(new ii(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ri=class extends Xi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ct.DEFAULT_UP),this.updateMatrix(),this.target=new ct,this.shadow=new Uu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Do=class extends Xi{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Ri=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var yu=new WeakMap,Oo=class extends ni{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ke("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ke("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,o=Kn.get(`image-bitmap:${e}`);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(c=>{yu.has(o)===!0?(r&&r(yu.get(o)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Kn.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),yu.set(l,c),Kn.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Kn.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Kr=-90,jr=1,Tl=class extends ct{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Bt(Kr,jr,e,t);r.layers=this.layers,this.add(r);let s=new Bt(Kr,jr,e,t);s.layers=this.layers,this.add(s);let o=new Bt(Kr,jr,e,t);o.layers=this.layers,this.add(o);let a=new Bt(Kr,jr,e,t);a.layers=this.layers,this.add(a);let l=new Bt(Kr,jr,e,t);l.layers=this.layers,this.add(l);let c=new Bt(Kr,jr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===Bn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ns)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}},wl=class extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Fo=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=J0.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function J0(){this._document.hidden===!1&&this.reset()}var ch="\\[\\]\\.:\\/",$0=new RegExp("["+ch+"]","g"),uh="[^"+ch+"]",K0="[^"+ch.replace("\\.","")+"]",j0=/((?:WC+[\/:])*)/.source.replace("WC",uh),Q0=/(WCOD+)?/.source.replace("WCOD",K0),e_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",uh),t_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",uh),n_=new RegExp("^"+j0+Q0+e_+t_+"$"),i_=["material","materials","bones","map"],Du=class{constructor(e,t,i){let r=i||Et.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},Et=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace($0,"")}static parseTrackName(e){let t=n_.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);i_.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ke("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){$e("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){$e("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){$e("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){$e("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){$e("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;$e("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Et.Composite=Du;Et.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Et.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Et.prototype.GetterByBindingType=[Et.prototype._getValue_direct,Et.prototype._getValue_array,Et.prototype._getValue_arrayElement,Et.prototype._getValue_toArray];Et.prototype.SetterByBindingTypeAndVersioning=[[Et.prototype._setValue_direct,Et.prototype._setValue_direct_setNeedsUpdate,Et.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_array,Et.prototype._setValue_array_setNeedsUpdate,Et.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_arrayElement,Et.prototype._setValue_arrayElement_setNeedsUpdate,Et.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_fromArray,Et.prototype._setValue_fromArray_setNeedsUpdate,Et.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ob=new Float32Array(1);var vs=class{constructor(e,t,i,r,s,o=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=i,this.elementSize=r,this.count=s,this.normalized=o,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}};var gh=class gh{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){let s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};gh.prototype.isMatrix2=!0;var Ou=gh;var Bo=class extends hn{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new Qe;r.setAttribute("position",new nt(t,3)),r.setAttribute("color",new nt(i,3));let s=new Yt({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(e,t,i){let r=new Me,s=this.geometry.attributes.color.array;return r.set(e),r.toArray(s,0),r.toArray(s,3),r.set(t),r.toArray(s,6),r.toArray(s,9),r.set(i),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};function hh(n,e,t,i){let r=r_(i);switch(t){case eh:return n*e;case Dl:return n*e/r.components*r.byteLength;case Ol:return n*e/r.components*r.byteLength;case Zi:return n*e*2/r.components*r.byteLength;case Fl:return n*e*2/r.components*r.byteLength;case th:return n*e*3/r.components*r.byteLength;case En:return n*e*4/r.components*r.byteLength;case Bl:return n*e*4/r.components*r.byteLength;case zo:case Go:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ko:case Wo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Vl:case Gl:return Math.max(n,16)*Math.max(e,8)/4;case Hl:case zl:return Math.max(n,8)*Math.max(e,8)/2;case kl:case Wl:case ql:case Yl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Xl:case Xo:case Zl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Jl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case $l:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Kl:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case jl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ql:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case ec:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case tc:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case nc:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ic:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case rc:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case sc:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case oc:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case ac:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case lc:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case cc:case uc:case hc:return Math.ceil(n/4)*Math.ceil(e/4)*16;case dc:case fc:return Math.ceil(n/4)*Math.ceil(e/4)*8;case qo:case pc:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function r_(n){switch(n){case en:case $u:return{byteLength:1,components:1};case Es:case Ku:case Sn:return{byteLength:2,components:1};case Nl:case Ul:return{byteLength:2,components:4};case qn:case Ll:case Mn:return{byteLength:4,components:1};case ju:case Qu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:kn}}));typeof window<"u"&&(window.__THREE__?ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=kn);function Bp(){let n=null,e=!1,t=null,i=null;function r(s,o){i=n.requestAnimationFrame(r),t(s,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function s_(n){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){let u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<h.length;f++){let m=h[d],_=h[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,m=h.length;f<m;f++){let _=h[f];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var o_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,a_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,l_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,c_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,u_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,h_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,d_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,f_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,p_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,m_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,g_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,__=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,x_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,v_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,y_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,M_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,S_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,E_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,b_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,T_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,w_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,A_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,R_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,C_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,P_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,I_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,L_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,N_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,U_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,D_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,O_="gl_FragColor = linearToOutputTexel( gl_FragColor );",F_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,B_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,H_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,V_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,z_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,G_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,k_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,W_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,X_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Y_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Z_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,J_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,K_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,j_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Q_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ex=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ix=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rx=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,sx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ox=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ax=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lx=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,cx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ux=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,px=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_x=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,yx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ex=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Tx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,wx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ax=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Cx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Px=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ix=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ux=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Dx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Ox=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Hx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,kx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,qx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Yx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jx=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$x=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ev=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,tv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,nv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,iv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,sv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ov=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,av=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,fv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,pv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,mv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,gv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_v=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Mv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ev=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Tv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Av=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Rv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Iv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Dv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ov=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,rt={alphahash_fragment:o_,alphahash_pars_fragment:a_,alphamap_fragment:l_,alphamap_pars_fragment:c_,alphatest_fragment:u_,alphatest_pars_fragment:h_,aomap_fragment:d_,aomap_pars_fragment:f_,batching_pars_vertex:p_,batching_vertex:m_,begin_vertex:g_,beginnormal_vertex:__,bsdfs:x_,iridescence_fragment:v_,bumpmap_pars_fragment:y_,clipping_planes_fragment:M_,clipping_planes_pars_fragment:S_,clipping_planes_pars_vertex:E_,clipping_planes_vertex:b_,color_fragment:T_,color_pars_fragment:w_,color_pars_vertex:A_,color_vertex:R_,common:C_,cube_uv_reflection_fragment:P_,defaultnormal_vertex:I_,displacementmap_pars_vertex:L_,displacementmap_vertex:N_,emissivemap_fragment:U_,emissivemap_pars_fragment:D_,colorspace_fragment:O_,colorspace_pars_fragment:F_,envmap_fragment:B_,envmap_common_pars_fragment:H_,envmap_pars_fragment:V_,envmap_pars_vertex:z_,envmap_physical_pars_fragment:j_,envmap_vertex:G_,fog_vertex:k_,fog_pars_vertex:W_,fog_fragment:X_,fog_pars_fragment:q_,gradientmap_pars_fragment:Y_,lightmap_pars_fragment:Z_,lights_lambert_fragment:J_,lights_lambert_pars_fragment:$_,lights_pars_begin:K_,lights_toon_fragment:Q_,lights_toon_pars_fragment:ex,lights_phong_fragment:tx,lights_phong_pars_fragment:nx,lights_physical_fragment:ix,lights_physical_pars_fragment:rx,lights_fragment_begin:sx,lights_fragment_maps:ox,lights_fragment_end:ax,lightprobes_pars_fragment:lx,logdepthbuf_fragment:cx,logdepthbuf_pars_fragment:ux,logdepthbuf_pars_vertex:hx,logdepthbuf_vertex:dx,map_fragment:fx,map_pars_fragment:px,map_particle_fragment:mx,map_particle_pars_fragment:gx,metalnessmap_fragment:_x,metalnessmap_pars_fragment:xx,morphinstance_vertex:vx,morphcolor_vertex:yx,morphnormal_vertex:Mx,morphtarget_pars_vertex:Sx,morphtarget_vertex:Ex,normal_fragment_begin:bx,normal_fragment_maps:Tx,normal_pars_fragment:wx,normal_pars_vertex:Ax,normal_vertex:Rx,normalmap_pars_fragment:Cx,clearcoat_normal_fragment_begin:Px,clearcoat_normal_fragment_maps:Ix,clearcoat_pars_fragment:Lx,iridescence_pars_fragment:Nx,opaque_fragment:Ux,packing:Dx,premultiplied_alpha_fragment:Ox,project_vertex:Fx,dithering_fragment:Bx,dithering_pars_fragment:Hx,roughnessmap_fragment:Vx,roughnessmap_pars_fragment:zx,shadowmap_pars_fragment:Gx,shadowmap_pars_vertex:kx,shadowmap_vertex:Wx,shadowmask_pars_fragment:Xx,skinbase_vertex:qx,skinning_pars_vertex:Yx,skinning_vertex:Zx,skinnormal_vertex:Jx,specularmap_fragment:$x,specularmap_pars_fragment:Kx,tonemapping_fragment:jx,tonemapping_pars_fragment:Qx,transmission_fragment:ev,transmission_pars_fragment:tv,uv_pars_fragment:nv,uv_pars_vertex:iv,uv_vertex:rv,worldpos_vertex:sv,background_vert:ov,background_frag:av,backgroundCube_vert:lv,backgroundCube_frag:cv,cube_vert:uv,cube_frag:hv,depth_vert:dv,depth_frag:fv,distance_vert:pv,distance_frag:mv,equirect_vert:gv,equirect_frag:_v,linedashed_vert:xv,linedashed_frag:vv,meshbasic_vert:yv,meshbasic_frag:Mv,meshlambert_vert:Sv,meshlambert_frag:Ev,meshmatcap_vert:bv,meshmatcap_frag:Tv,meshnormal_vert:wv,meshnormal_frag:Av,meshphong_vert:Rv,meshphong_frag:Cv,meshphysical_vert:Pv,meshphysical_frag:Iv,meshtoon_vert:Lv,meshtoon_frag:Nv,points_vert:Uv,points_frag:Dv,shadow_vert:Ov,shadow_frag:Fv,sprite_vert:Bv,sprite_frag:Hv},Se={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new R},probesMax:{value:new R},probesResolution:{value:new R}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},li={basic:{uniforms:tn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:tn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Me(0)},envMapIntensity:{value:1}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:tn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:tn([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:tn([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new Me(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:tn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:tn([Se.points,Se.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:tn([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:tn([Se.common,Se.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:tn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:tn([Se.sprite,Se.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distance:{uniforms:tn([Se.common,Se.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distance_vert,fragmentShader:rt.distance_frag},shadow:{uniforms:tn([Se.lights,Se.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};li.physical={uniforms:tn([li.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};var xc={r:0,b:0,g:0},Vv=new He,Hp=new qe;Hp.set(-1,0,0,0,1,0,0,0,1);function zv(n,e,t,i,r,s){let o=new Me(0),a=r===!0?0:1,l,c,u=null,h=0,d=null;function f(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){let x=M.backgroundBlurriness>0;T=e.get(T,x)}return T}function m(M){let T=!1,x=f(M);x===null?p(o,a):x&&x.isColor&&(p(x,1),T=!0);let S=n.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(M,T){let x=f(T);x&&(x.isCubeTexture||x.mapping===Vo)?(c===void 0&&(c=new Ct(new Gi(1,1,1),new Zt({name:"BackgroundCubeMaterial",uniforms:Sr(li.backgroundCube.uniforms),vertexShader:li.backgroundCube.vertexShader,fragmentShader:li.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Vv.makeRotationFromEuler(T.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Hp),c.material.toneMapped=st.getTransfer(x.colorSpace)!==_t,(u!==x||h!==x.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=x,h=x.version,d=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Ct(new Nt(2,2),new Zt({name:"BackgroundMaterial",uniforms:Sr(li.background.uniforms),vertexShader:li.background.vertexShader,fragmentShader:li.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=st.getTransfer(x.colorSpace)!==_t,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||h!==x.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,u=x,h=x.version,d=n.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,T){M.getRGB(xc,lh(n)),t.buffers.color.setClear(xc.r,xc.g,xc.b,T,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,T=1){o.set(M),a=T,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(M){a=M,p(o,a)},render:m,addToRenderList:_,dispose:g}}function Gv(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null),s=r,o=!1;function a(L,D,H,U,V){let W=!1,J=h(L,U,H,D);s!==J&&(s=J,c(s.object)),W=f(L,U,H,V),W&&m(L,U,H,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,x(L,D,H,U),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(L){return n.bindVertexArray(L)}function u(L){return n.deleteVertexArray(L)}function h(L,D,H,U){let V=U.wireframe===!0,W=i[D.id];W===void 0&&(W={},i[D.id]=W);let J=L.isInstancedMesh===!0?L.id:0,se=W[J];se===void 0&&(se={},W[J]=se);let $=se[H.id];$===void 0&&($={},se[H.id]=$);let j=$[V];return j===void 0&&(j=d(l()),$[V]=j),j}function d(L){let D=[],H=[],U=[];for(let V=0;V<t;V++)D[V]=0,H[V]=0,U[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:H,attributeDivisors:U,object:L,attributes:{},index:null}}function f(L,D,H,U){let V=s.attributes,W=D.attributes,J=0,se=H.getAttributes();for(let $ in se)if(se[$].location>=0){let ee=V[$],Ie=W[$];if(Ie===void 0&&($==="instanceMatrix"&&L.instanceMatrix&&(Ie=L.instanceMatrix),$==="instanceColor"&&L.instanceColor&&(Ie=L.instanceColor)),ee===void 0||ee.attribute!==Ie||Ie&&ee.data!==Ie.data)return!0;J++}return s.attributesNum!==J||s.index!==U}function m(L,D,H,U){let V={},W=D.attributes,J=0,se=H.getAttributes();for(let $ in se)if(se[$].location>=0){let ee=W[$];ee===void 0&&($==="instanceMatrix"&&L.instanceMatrix&&(ee=L.instanceMatrix),$==="instanceColor"&&L.instanceColor&&(ee=L.instanceColor));let Ie={};Ie.attribute=ee,ee&&ee.data&&(Ie.data=ee.data),V[$]=Ie,J++}s.attributes=V,s.attributesNum=J,s.index=U}function _(){let L=s.newAttributes;for(let D=0,H=L.length;D<H;D++)L[D]=0}function p(L){g(L,0)}function g(L,D){let H=s.newAttributes,U=s.enabledAttributes,V=s.attributeDivisors;H[L]=1,U[L]===0&&(n.enableVertexAttribArray(L),U[L]=1),V[L]!==D&&(n.vertexAttribDivisor(L,D),V[L]=D)}function M(){let L=s.newAttributes,D=s.enabledAttributes;for(let H=0,U=D.length;H<U;H++)D[H]!==L[H]&&(n.disableVertexAttribArray(H),D[H]=0)}function T(L,D,H,U,V,W,J){J===!0?n.vertexAttribIPointer(L,D,H,V,W):n.vertexAttribPointer(L,D,H,U,V,W)}function x(L,D,H,U){_();let V=U.attributes,W=H.getAttributes(),J=D.defaultAttributeValues;for(let se in W){let $=W[se];if($.location>=0){let j=V[se];if(j===void 0&&(se==="instanceMatrix"&&L.instanceMatrix&&(j=L.instanceMatrix),se==="instanceColor"&&L.instanceColor&&(j=L.instanceColor)),j!==void 0){let ee=j.normalized,Ie=j.itemSize,Te=e.get(j);if(Te===void 0)continue;let ae=Te.buffer,he=Te.type,Re=Te.bytesPerElement,X=he===n.INT||he===n.UNSIGNED_INT||j.gpuType===Ll;if(j.isInterleavedBufferAttribute){let ne=j.data,fe=ne.stride,Le=j.offset;if(ne.isInstancedInterleavedBuffer){for(let me=0;me<$.locationSize;me++)g($.location+me,ne.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let me=0;me<$.locationSize;me++)p($.location+me);n.bindBuffer(n.ARRAY_BUFFER,ae);for(let me=0;me<$.locationSize;me++)T($.location+me,Ie/$.locationSize,he,ee,fe*Re,(Le+Ie/$.locationSize*me)*Re,X)}else{if(j.isInstancedBufferAttribute){for(let ne=0;ne<$.locationSize;ne++)g($.location+ne,j.meshPerAttribute);L.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let ne=0;ne<$.locationSize;ne++)p($.location+ne);n.bindBuffer(n.ARRAY_BUFFER,ae);for(let ne=0;ne<$.locationSize;ne++)T($.location+ne,Ie/$.locationSize,he,ee,Ie*Re,Ie/$.locationSize*ne*Re,X)}}else if(J!==void 0){let ee=J[se];if(ee!==void 0)switch(ee.length){case 2:n.vertexAttrib2fv($.location,ee);break;case 3:n.vertexAttrib3fv($.location,ee);break;case 4:n.vertexAttrib4fv($.location,ee);break;default:n.vertexAttrib1fv($.location,ee)}}}}M()}function S(){w();for(let L in i){let D=i[L];for(let H in D){let U=D[H];for(let V in U){let W=U[V];for(let J in W)u(W[J].object),delete W[J];delete U[V]}}delete i[L]}}function E(L){if(i[L.id]===void 0)return;let D=i[L.id];for(let H in D){let U=D[H];for(let V in U){let W=U[V];for(let J in W)u(W[J].object),delete W[J];delete U[V]}}delete i[L.id]}function A(L){for(let D in i){let H=i[D];for(let U in H){let V=H[U];if(V[L.id]===void 0)continue;let W=V[L.id];for(let J in W)u(W[J].object),delete W[J];delete V[L.id]}}}function v(L){for(let D in i){let H=i[D],U=L.isInstancedMesh===!0?L.id:0,V=H[U];if(V!==void 0){for(let W in V){let J=V[W];for(let se in J)u(J[se].object),delete J[se];delete V[W]}delete H[U],Object.keys(H).length===0&&delete i[D]}}}function w(){C(),o=!0,s!==r&&(s=r,c(s.object))}function C(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:w,resetDefaultState:C,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfObject:v,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:p,disableUnusedAttributes:M}}function kv(n,e,t){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];t.update(d,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function Wv(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==En&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let v=A===Sn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==en&&A!==Mn&&!v&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(ke("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=n.getParameter(n.MAX_SAMPLES),E=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:x,maxSamples:S,samples:E}}function Xv(n){let e=this,t=null,i=0,r=!1,s=!1,o=new On,a=new qe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){let m=h.clippingPlanes,_=h.clipIntersection,p=h.clipShadows,g=n.get(h);if(!r||m===null||m.length===0||s&&!p)s?u(null):c();else{let M=s?0:i,T=M*4,x=g.clippingState||null;l.value=x,x=u(m,d,T,f);for(let S=0;S!==T;++S)x[S]=t[S];g.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,m){let _=h!==null?h.length:0,p=null;if(_!==0){if(p=l.value,m!==!0||p===null){let g=f+_*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(p===null||p.length<g)&&(p=new Float32Array(g));for(let T=0,x=f;T!==_;++T,x+=4)o.copy(h[T]).applyMatrix4(M,a),o.normal.toArray(p,x),p[x+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}var As=4,qv=6,Yv=20,Zv=256,Zo=new ii,_p=new Me,_h=null,xh=0,vh=0,yh=!1,Jv=new R,Er=new R,yc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){let{size:o=256,position:a=Jv}=s;_h=this._renderer.getRenderTarget(),xh=this._renderer.getActiveCubeFace(),vh=this._renderer.getActiveMipmapLevel(),yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(_h,xh,vh),this._renderer.xr.enabled=yh,e.scissorTest=!1,ws(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qi||e.mapping===vr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_h=this._renderer.getRenderTarget(),xh=this._renderer.getActiveCubeFace(),vh=this._renderer.getActiveMipmapLevel(),yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Rt,minFilter:Rt,generateMipmaps:!1,type:Sn,format:En,colorSpace:an,depthBuffer:!1},r=xp(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xp(e,t,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=$v(s)),this._blurMaterial=jv(s,e,t),this._ggxMaterial=Kv(s,e,t)}return r}_compileMaterial(e){let t=new Ct(new Qe,e);this._renderer.compile(t,Zo)}_sceneToCubeUV(e,t,i,r,s){let l=new Bt(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(_p),h.toneMapping=Wn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ct(new Gi,new Tt({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,p=_.material,g=!1,M=e.background;M?M.isColor&&(p.color.copy(M),e.background=null,g=!0):(p.color.copy(_p),g=!0);for(let T=0;T<6;T++){let x=T%3;x===0?(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[T],s.y,s.z)):x===1?(l.up.set(0,0,c[T]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[T],s.z)):(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[T]));let S=this._cubeSize;ws(r,x*S,T>2?S:0,S,S),h.setRenderTarget(r),g&&h.render(_,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=M}_textureToCubeUV(e,t){let i=this._renderer,r=e.mapping===qi||e.mapping===vr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=yp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vp());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;ws(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Zo)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=c*1.25,f=h*d,{_lodMax:m}=this,_=this._sizeLods[i],p=3*_*(i>m-As?i-m+As:0),g=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=m-t,ws(s,p,g,3*_,2*_),r.setRenderTarget(s),r.render(a,Zo),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=m-i,ws(e,p,g,3*_,2*_),r.setRenderTarget(e),r.render(a,Zo)}_blur(e,t,i,r){let s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,t,i,r,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[r];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[r],h=3*u*(r>this._lodMax-As?r-this._lodMax+As:0),d=4*(this._cubeSize-u);ws(t,h,d,3*u,2*u),o.setRenderTarget(t),o.render(l,Zo)}};function $v(n){let e=[],t=[],i=n,r=n-As+1+qv;for(let s=0;s<r;s++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],h=6,d=6,f=3,m=new Float32Array(f*d*h),_=new Float32Array(f*d*h);for(let g=0;g<h;g++){let M=g%3*2/3-1,T=g>2?0:-1,x=[M,T,0,M+2/3,T,0,M+2/3,T+1,0,M,T,0,M+2/3,T+1,0,M,T+1,0];m.set(x,f*d*g);for(let S=0;S<d;S++){let E=u[S*2]*2-1,A=u[S*2+1]*2-1;g===0?Er.set(1,A,E):g===1?Er.set(-E,1,-A):g===2?Er.set(-E,A,1):g===3?Er.set(-1,A,-E):g===4?Er.set(-E,-1,A):Er.set(E,A,-1),Er.toArray(_,(g*d+S)*f)}}let p=new Qe;p.setAttribute("position",new Ke(m,f)),p.setAttribute("outputDirection",new Ke(_,f)),t.push(new Ct(p,null)),i>As&&i--}return{lodMeshes:t,sizeLods:e}}function xp(n,e,t){let i=new Qt(n,e,t);return i.texture.mapping=Vo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ws(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Kv(n,e,t){return new Zt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Zv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ec(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function jv(n,e,t){return new Zt({name:"SphericalGaussianBlur",defines:{SAMPLES:Yv,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ec(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function vp(){return new Zt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function yp(){return new Zt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ec(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function Ec(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Mc=class extends Qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new xo(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Gi(5,5,5),s=new Zt({name:"CubemapFromEquirect",uniforms:Sr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:zt,blending:oi});s.uniforms.tEquirect.value=t;let o=new Ct(r,s),a=t.minFilter;return t.minFilter===Xn&&(t.minFilter=Rt),new Tl(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}};function Qv(n){let e=new WeakMap,t=new WeakMap,i=null;function r(d,f=!1){return d==null?null:f?o(d):s(d)}function s(d){if(d&&d.isTexture){let f=d.mapping;if(f===Cl||f===Pl)if(e.has(d)){let m=e.get(d).texture;return a(m,d.mapping)}else{let m=d.image;if(m&&m.height>0){let _=new Mc(m.height);return _.fromEquirectangularTexture(n,d),e.set(d,_),d.addEventListener("dispose",c),a(_.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){let f=d.mapping,m=f===Cl||f===Pl,_=f===qi||f===vr;if(m||_){let p=t.get(d),g=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return i===null&&(i=new yc(n)),p=m?i.fromEquirectangular(d,p):i.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{let M=d.image;return m&&M&&M.height>0||_&&M&&l(M)?(i===null&&(i=new yc(n)),p=m?i.fromEquirectangular(d):i.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",u),p.texture):null}}}return d}function a(d,f){return f===Cl?d.mapping=qi:f===Pl&&(d.mapping=vr),d}function l(d){let f=0,m=6;for(let _=0;_<m;_++)d[_]!==void 0&&f++;return f===m}function c(d){let f=d.target;f.removeEventListener("dispose",c);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function u(d){let f=d.target;f.removeEventListener("dispose",u);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function ey(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let r=t(i);return r===null&&sr("WebGLRenderer: "+i+" extension not supported."),r}}}function ty(n,e,t,i){let r={},s=new WeakMap;function o(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",o),delete r[d.id];let f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){let d=h.attributes;for(let f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(h){let d=[],f=h.index,m=h.attributes.position,_=0;if(m===void 0)return;if(f!==null){let M=f.array;_=f.version;for(let T=0,x=M.length;T<x;T+=3){let S=M[T+0],E=M[T+1],A=M[T+2];d.push(S,E,E,A,A,S)}}else{let M=m.array;_=m.version;for(let T=0,x=M.length/3-1;T<x;T+=3){let S=T+0,E=T+1,A=T+2;d.push(S,E,E,A,A,S)}}let p=new(m.count>=65535?mo:po)(d,1);p.version=_;let g=s.get(h);g&&e.remove(g),s.set(h,p)}function u(h){let d=s.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function ny(n,e,t){let i;function r(h){i=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,d){n.drawElements(i,d,s,h*o),t.update(d,i,1)}function c(h,d,f){f!==0&&(n.drawElementsInstanced(i,d,s,h*o,f),t.update(d,i,f))}function u(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,h,0,f);let _=0;for(let p=0;p<f;p++)_+=d[p];t.update(_,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function iy(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:$e("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function ry(n,e,t){let i=new WeakMap,r=new vt;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=i.get(a);if(d===void 0||d.count!==h){let w=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],T=0;f===!0&&(T=1),m===!0&&(T=2),_===!0&&(T=3);let x=a.attributes.position.count*T,S=1;x>e.maxTextureSize&&(S=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let E=new Float32Array(x*S*4*h),A=new uo(E,x,S,h);A.type=Mn,A.needsUpdate=!0;let v=T*4;for(let C=0;C<h;C++){let L=p[C],D=g[C],H=M[C],U=x*S*4*C;for(let V=0;V<L.count;V++){let W=V*v;f===!0&&(r.fromBufferAttribute(L,V),E[U+W+0]=r.x,E[U+W+1]=r.y,E[U+W+2]=r.z,E[U+W+3]=0),m===!0&&(r.fromBufferAttribute(D,V),E[U+W+4]=r.x,E[U+W+5]=r.y,E[U+W+6]=r.z,E[U+W+7]=0),_===!0&&(r.fromBufferAttribute(H,V),E[U+W+8]=r.x,E[U+W+9]=r.y,E[U+W+10]=r.z,E[U+W+11]=H.itemSize===4?r.w:1)}}d={count:h,texture:A,size:new ce(x,S)},i.set(a,d),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function sy(n,e,t,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==u&&(e.update(d),s.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==u&&(f.update(),s.set(f,u))}return d}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var oy={[Gu]:"LINEAR_TONE_MAPPING",[ku]:"REINHARD_TONE_MAPPING",[Wu]:"CINEON_TONE_MAPPING",[Xu]:"ACES_FILMIC_TONE_MAPPING",[Yu]:"AGX_TONE_MAPPING",[Zu]:"NEUTRAL_TONE_MAPPING",[qu]:"CUSTOM_TONE_MAPPING"};function ay(n,e,t,i,r,s){let o=new Qt(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Qe;c.setAttribute("position",new nt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new nt([0,2,0,0,2,0],2));let u=new gl({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Ct(c,u),d=new ii(-1,1,1,-1,0,1),f=null,m=null,_=!1,p,g=null,M=[],T=!1;this.setSize=function(x,S){o.setSize(x,S),a!==null&&a.setSize(x,S),l!==null&&l.setSize(x,S);for(let E=0;E<M.length;E++){let A=M[E];A.setSize&&A.setSize(x,S)}},this.setEffects=function(x){M=x,T=M.length>0&&M[0].isRenderPass===!0;let S=o.width,E=o.height;M.length>0&&a===null&&(a=new Qt(S,E,{type:Sn,depthBuffer:!1,stencilBuffer:!1}),l=new Qt(S,E,{type:Sn,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<M.length;A++){let v=M[A];v.setSize&&v.setSize(S,E)}},this.begin=function(x,S){if(_||x.toneMapping===Wn&&M.length===0)return!1;if(g=S,S!==null){let E=S.width,A=S.height;(o.width!==E||o.height!==A)&&this.setSize(E,A)}return T===!1&&x.setRenderTarget(o),p=x.toneMapping,x.toneMapping=Wn,!0},this.hasRenderPass=function(){return T},this.end=function(x,S){x.toneMapping=p,_=!0;let E=o,A=a;for(let v=0;v<M.length;v++){let w=M[v];w.enabled!==!1&&(w.render(x,A,E,S),w.needsSwap!==!1&&(E=A,A=A===a?l:a))}if(f!==x.outputColorSpace||m!==x.toneMapping){f=x.outputColorSpace,m=x.toneMapping,u.defines={},st.getTransfer(f)===_t&&(u.defines.SRGB_TRANSFER="");let v=oy[m];v&&(u.defines[v]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=E.texture,x.setRenderTarget(g),x.render(h,d),g=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Vp=new Ht,Eh=new zi(1,1),zp=new uo,Gp=new sl,kp=new xo,Mp=[],Sp=[],Ep=new Float32Array(16),bp=new Float32Array(9),Tp=new Float32Array(4);function Cs(n,e,t){let i=n[0];if(i<=0||i>0)return n;let r=e*t,s=Mp[r];if(s===void 0&&(s=new Float32Array(r),Mp[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Gt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function kt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function bc(n,e){let t=Sp[e];t===void 0&&(t=new Int32Array(e),Sp[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function ly(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function cy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;n.uniform2fv(this.addr,e),kt(t,e)}}function uy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Gt(t,e))return;n.uniform3fv(this.addr,e),kt(t,e)}}function hy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;n.uniform4fv(this.addr,e),kt(t,e)}}function dy(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Gt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),kt(t,e)}else{if(Gt(t,i))return;Tp.set(i),n.uniformMatrix2fv(this.addr,!1,Tp),kt(t,i)}}function fy(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Gt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),kt(t,e)}else{if(Gt(t,i))return;bp.set(i),n.uniformMatrix3fv(this.addr,!1,bp),kt(t,i)}}function py(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(Gt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),kt(t,e)}else{if(Gt(t,i))return;Ep.set(i),n.uniformMatrix4fv(this.addr,!1,Ep),kt(t,i)}}function my(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function gy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;n.uniform2iv(this.addr,e),kt(t,e)}}function _y(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;n.uniform3iv(this.addr,e),kt(t,e)}}function xy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;n.uniform4iv(this.addr,e),kt(t,e)}}function vy(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function yy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;n.uniform2uiv(this.addr,e),kt(t,e)}}function My(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;n.uniform3uiv(this.addr,e),kt(t,e)}}function Sy(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;n.uniform4uiv(this.addr,e),kt(t,e)}}function Ey(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Eh.compareFunction=t.isReversedDepthBuffer()?gc:mc,s=Eh):s=Vp,t.setTexture2D(e||s,r)}function by(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Gp,r)}function Ty(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||kp,r)}function wy(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||zp,r)}function Ay(n){switch(n){case 5126:return ly;case 35664:return cy;case 35665:return uy;case 35666:return hy;case 35674:return dy;case 35675:return fy;case 35676:return py;case 5124:case 35670:return my;case 35667:case 35671:return gy;case 35668:case 35672:return _y;case 35669:case 35673:return xy;case 5125:return vy;case 36294:return yy;case 36295:return My;case 36296:return Sy;case 35678:case 36198:case 36298:case 36306:case 35682:return Ey;case 35679:case 36299:case 36307:return by;case 35680:case 36300:case 36308:case 36293:return Ty;case 36289:case 36303:case 36311:case 36292:return wy}}function Ry(n,e){n.uniform1fv(this.addr,e)}function Cy(n,e){let t=Cs(e,this.size,2);n.uniform2fv(this.addr,t)}function Py(n,e){let t=Cs(e,this.size,3);n.uniform3fv(this.addr,t)}function Iy(n,e){let t=Cs(e,this.size,4);n.uniform4fv(this.addr,t)}function Ly(n,e){let t=Cs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Ny(n,e){let t=Cs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Uy(n,e){let t=Cs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Dy(n,e){n.uniform1iv(this.addr,e)}function Oy(n,e){n.uniform2iv(this.addr,e)}function Fy(n,e){n.uniform3iv(this.addr,e)}function By(n,e){n.uniform4iv(this.addr,e)}function Hy(n,e){n.uniform1uiv(this.addr,e)}function Vy(n,e){n.uniform2uiv(this.addr,e)}function zy(n,e){n.uniform3uiv(this.addr,e)}function Gy(n,e){n.uniform4uiv(this.addr,e)}function ky(n,e,t){let i=this.cache,r=e.length,s=bc(t,r);Gt(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=Eh:o=Vp;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function Wy(n,e,t){let i=this.cache,r=e.length,s=bc(t,r);Gt(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Gp,s[o])}function Xy(n,e,t){let i=this.cache,r=e.length,s=bc(t,r);Gt(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||kp,s[o])}function qy(n,e,t){let i=this.cache,r=e.length,s=bc(t,r);Gt(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||zp,s[o])}function Yy(n){switch(n){case 5126:return Ry;case 35664:return Cy;case 35665:return Py;case 35666:return Iy;case 35674:return Ly;case 35675:return Ny;case 35676:return Uy;case 5124:case 35670:return Dy;case 35667:case 35671:return Oy;case 35668:case 35672:return Fy;case 35669:case 35673:return By;case 5125:return Hy;case 36294:return Vy;case 36295:return zy;case 36296:return Gy;case 35678:case 36198:case 36298:case 36306:case 35682:return ky;case 35679:case 36299:case 36307:return Wy;case 35680:case 36300:case 36308:case 36293:return Xy;case 36289:case 36303:case 36311:case 36292:return qy}}var bh=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ay(t.type)}},Th=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Yy(t.type)}},wh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],i)}}},Mh=/(\w+)(\])?(\[|\.)?/g;function wp(n,e){n.seq.push(e),n.map[e.id]=e}function Zy(n,e,t){let i=n.name,r=i.length;for(Mh.lastIndex=0;;){let s=Mh.exec(i),o=Mh.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){wp(t,c===void 0?new bh(a,n,e):new Th(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new wh(a),wp(t,h)),t=h}}}var Rs=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);Zy(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){let s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&i.push(o)}return i}};function Ap(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var Jy=37297,$y=0;function Ky(n,e){let t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var Rp=new qe;function jy(n){st._getMatrix(Rp,st.workingColorSpace,n);let e=`mat3( ${Rp.elements.map(t=>t.toFixed(4))} )`;switch(st.getTransfer(n)){case lo:return[e,"LinearTransferOETF"];case _t:return[e,"sRGBTransferOETF"];default:return ke("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Cp(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+Ky(n.getShaderSource(e),a)}else return s}function Qy(n,e){let t=jy(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var eM={[Gu]:"Linear",[ku]:"Reinhard",[Wu]:"Cineon",[Xu]:"ACESFilmic",[Yu]:"AgX",[Zu]:"Neutral",[qu]:"Custom"};function tM(n,e){let t=eM[e];return t===void 0?(ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var vc=new R;function nM(){st.getLuminanceCoefficients(vc);let n=vc.x.toFixed(4),e=vc.y.toFixed(4),t=vc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function iM(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($o).join(`
`)}function rM(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function sM(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=n.getActiveAttrib(e,r),o=s.name,a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function $o(n){return n!==""}function Pp(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ip(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var oM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ah(n){return n.replace(oM,lM)}var aM=new Map;function lM(n,e){let t=rt[e];if(t===void 0){let i=aM.get(e);if(i!==void 0)t=rt[i],ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ah(t)}var cM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lp(n){return n.replace(cM,uM)}function uM(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Np(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var hM={[Ho]:"SHADOWMAP_TYPE_PCF",[ys]:"SHADOWMAP_TYPE_VSM"};function dM(n){return hM[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var fM={[qi]:"ENVMAP_TYPE_CUBE",[vr]:"ENVMAP_TYPE_CUBE",[Vo]:"ENVMAP_TYPE_CUBE_UV"};function pM(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":fM[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var mM={[vr]:"ENVMAP_MODE_REFRACTION"};function gM(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":mM[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var _M={[Rl]:"ENVMAP_BLENDING_MULTIPLY",[qf]:"ENVMAP_BLENDING_MIX",[Yf]:"ENVMAP_BLENDING_ADD"};function xM(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":_M[n.combine]||"ENVMAP_BLENDING_NONE"}function vM(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function yM(n,e,t,i){let r=n.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=dM(t),c=pM(t),u=gM(t),h=xM(t),d=vM(t),f=iM(t),m=rM(s),_=r.createProgram(),p,g,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter($o).join(`
`),p.length>0&&(p+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter($o).join(`
`),g.length>0&&(g+=`
`)):(p=[Np(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($o).join(`
`),g=[Np(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Wn?"#define TONE_MAPPING":"",t.toneMapping!==Wn?rt.tonemapping_pars_fragment:"",t.toneMapping!==Wn?tM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,Qy("linearToOutputTexel",t.outputColorSpace),nM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($o).join(`
`)),o=Ah(o),o=Pp(o,t),o=Ip(o,t),a=Ah(a),a=Pp(a,t),a=Ip(a,t),o=Lp(o),a=Lp(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,g=["#define varying in",t.glslVersion===sh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===sh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let T=M+p+o,x=M+g+a,S=Ap(r,r.VERTEX_SHADER,T),E=Ap(r,r.FRAGMENT_SHADER,x);r.attachShader(_,S),r.attachShader(_,E),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(L){if(n.debug.checkShaderErrors){let D=r.getProgramInfoLog(_)||"",H=r.getShaderInfoLog(S)||"",U=r.getShaderInfoLog(E)||"",V=D.trim(),W=H.trim(),J=U.trim(),se=!0,$=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(se=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,S,E);else{let j=Cp(r,S,"vertex"),ee=Cp(r,E,"fragment");$e("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+V+`
`+j+`
`+ee)}else V!==""?ke("WebGLProgram: Program Info Log:",V):(W===""||J==="")&&($=!1);$&&(L.diagnostics={runnable:se,programLog:V,vertexShader:{log:W,prefix:p},fragmentShader:{log:J,prefix:g}})}r.deleteShader(S),r.deleteShader(E),v=new Rs(r,_),w=sM(r,_)}let v;this.getUniforms=function(){return v===void 0&&A(this),v};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=r.getProgramParameter(_,Jy)),C},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=$y++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=E,this}var MM=0,Rh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new Ch(e),t.set(e,i)),i}},Ch=class{constructor(e){this.id=MM++,this.code=e,this.usedTimes=0}};function SM(n){return n===Zi||n===Xo||n===qo}function EM(n,e,t,i,r,s){let o=new ho,a=new Rh,l=new Set,c=[],u=new Map,h=i.logarithmicDepthBuffer,d=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,w,C,L,D,H){let U=L.fog,V=D.geometry,W=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,J=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,se=e.get(v.envMap||W,J),$=se&&se.mapping===Vo?se.image.height:null,j=f[v.type];v.precision!==null&&(d=i.getMaxPrecision(v.precision),d!==v.precision&&ke("WebGLProgram.getParameters:",v.precision,"not supported, using",d,"instead."));let ee=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ie=ee!==void 0?ee.length:0,Te=0;V.morphAttributes.position!==void 0&&(Te=1),V.morphAttributes.normal!==void 0&&(Te=2),V.morphAttributes.color!==void 0&&(Te=3);let ae,he,Re,X;if(j){let yt=li[j];ae=yt.vertexShader,he=yt.fragmentShader}else{ae=v.vertexShader,he=v.fragmentShader;let yt=a.getVertexShaderStage(v),ut=a.getFragmentShaderStage(v);a.update(v,yt,ut),Re=yt.id,X=ut.id}let ne=n.getRenderTarget(),fe=n.state.buffers.depth.getReversed(),Le=D.isInstancedMesh===!0,me=D.isBatchedMesh===!0,De=!!v.map,tt=!!v.matcap,ie=!!se,G=!!v.aoMap,N=!!v.lightMap,O=!!v.bumpMap&&v.wireframe===!1,k=!!v.normalMap,ue=!!v.displacementMap,de=!!v.emissiveMap,xe=!!v.metalnessMap,pe=!!v.roughnessMap,I=v.anisotropy>0,Xe=v.clearcoat>0,Ze=v.dispersion>0,P=v.retroreflectivity>0,y=v.iridescence>0,z=v.sheen>0,q=v.transmission>0,K=I&&!!v.anisotropyMap,ge=Xe&&!!v.clearcoatMap,_e=Xe&&!!v.clearcoatNormalMap,te=Xe&&!!v.clearcoatRoughnessMap,oe=y&&!!v.iridescenceMap,ve=y&&!!v.iridescenceThicknessMap,Ve=z&&!!v.sheenColorMap,we=z&&!!v.sheenRoughnessMap,Ee=!!v.specularMap,ze=!!v.specularColorMap,Je=!!v.specularIntensityMap,et=q&&!!v.transmissionMap,B=q&&!!v.thicknessMap,ye=!!v.gradientMap,re=!!v.alphaMap,be=v.alphaTest>0,Ce=!!v.alphaHash,le=!!v.extensions,We=Wn;v.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(We=n.toneMapping);let Oe={shaderID:j,shaderType:v.type,shaderName:v.name,vertexShader:ae,fragmentShader:he,defines:v.defines,customVertexShaderID:Re,customFragmentShaderID:X,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:d,batching:me,batchingColor:me&&D._colorsTexture!==null,instancing:Le,instancingColor:Le&&D.instanceColor!==null,instancingMorph:Le&&D.morphTexture!==null,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:st.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:De,matcap:tt,envMap:ie,envMapMode:ie&&se.mapping,envMapCubeUVHeight:$,aoMap:G,lightMap:N,bumpMap:O,normalMap:k,displacementMap:ue,emissiveMap:de,normalMapObjectSpace:k&&v.normalMapType===Kf,normalMapTangentSpace:k&&v.normalMapType===Mr,packedNormalMap:k&&v.normalMapType===Mr&&SM(v.normalMap.format),metalnessMap:xe,roughnessMap:pe,anisotropy:I,anisotropyMap:K,clearcoat:Xe,clearcoatMap:ge,clearcoatNormalMap:_e,clearcoatRoughnessMap:te,dispersion:Ze,retroreflection:P,iridescence:y,iridescenceMap:oe,iridescenceThicknessMap:ve,sheen:z,sheenColorMap:Ve,sheenRoughnessMap:we,specularMap:Ee,specularColorMap:ze,specularIntensityMap:Je,transmission:q,transmissionMap:et,thicknessMap:B,gradientMap:ye,opaque:v.transparent===!1&&v.blending===Ms&&v.alphaToCoverage===!1,alphaMap:re,alphaTest:be,alphaHash:Ce,combine:v.combine,mapUv:De&&m(v.map.channel),aoMapUv:G&&m(v.aoMap.channel),lightMapUv:N&&m(v.lightMap.channel),bumpMapUv:O&&m(v.bumpMap.channel),normalMapUv:k&&m(v.normalMap.channel),displacementMapUv:ue&&m(v.displacementMap.channel),emissiveMapUv:de&&m(v.emissiveMap.channel),metalnessMapUv:xe&&m(v.metalnessMap.channel),roughnessMapUv:pe&&m(v.roughnessMap.channel),anisotropyMapUv:K&&m(v.anisotropyMap.channel),clearcoatMapUv:ge&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:_e&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:oe&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:we&&m(v.sheenRoughnessMap.channel),specularMapUv:Ee&&m(v.specularMap.channel),specularColorMapUv:ze&&m(v.specularColorMap.channel),specularIntensityMapUv:Je&&m(v.specularIntensityMap.channel),transmissionMapUv:et&&m(v.transmissionMap.channel),thicknessMapUv:B&&m(v.thicknessMap.channel),alphaMapUv:re&&m(v.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(k||I),vertexNormals:!!V.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!V.attributes.uv&&(De||re),fog:!!U,useFog:v.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||V.attributes.normal===void 0&&k===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:fe,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Ie,morphTextureStride:Te,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:We,decodeVideoTexture:De&&v.map.isVideoTexture===!0&&st.getTransfer(v.map.colorSpace)===_t,decodeVideoTextureEmissive:de&&v.emissiveMap.isVideoTexture===!0&&st.getTransfer(v.emissiveMap.colorSpace)===_t,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ut,flipSided:v.side===zt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:le&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&v.extensions.multiDraw===!0||me)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Oe.vertexUv1s=l.has(1),Oe.vertexUv2s=l.has(2),Oe.vertexUv3s=l.has(3),l.clear(),Oe}function p(v){let w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(let C in v.defines)w.push(C),w.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(g(w,v),M(w,v),w.push(n.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function g(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numSunLights),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numSunLightShadows),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function M(v,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function T(v){let w=f[v.type],C;if(w){let L=li[w];C=_c.clone(L.uniforms)}else C=v.uniforms;return C}function x(v,w){let C=u.get(w);return C!==void 0?++C.usedTimes:(C=new yM(n,w,v,r),c.push(C),u.set(w,C)),C}function S(v){if(--v.usedTimes===0){let w=c.indexOf(v);c[w]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function E(v){a.remove(v)}function A(){a.dispose()}return{getParameters:_,getProgramCacheKey:p,getUniforms:T,acquireProgram:x,releaseProgram:S,releaseShaderCache:E,programs:c,dispose:A}}function bM(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function TM(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Up(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Dp(){let n=[],e=0,t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,m,_,p,g){let M=n[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:m,materialVariant:o(d),groupOrder:_,renderOrder:d.renderOrder,z:p,group:g},n[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=m,M.materialVariant=o(d),M.groupOrder=_,M.renderOrder=d.renderOrder,M.z=p,M.group=g),e++,M}function l(d,f,m,_,p,g,M){M.reversedDepth===!0&&(p=-p);let T=a(d,f,m,_,p,g);m.transmission>0?i.push(T):m.transparent===!0?r.push(T):t.push(T)}function c(d,f,m,_,p,g){let M=a(d,f,m,_,p,g);m.transmission>0?i.unshift(M):m.transparent===!0?r.unshift(M):t.unshift(M)}function u(d,f){t.length>1&&t.sort(d||TM),i.length>1&&i.sort(f||Up),r.length>1&&r.sort(f||Up)}function h(){for(let d=e,f=n.length;d<f;d++){let m=n[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:h,sort:u}}function wM(){let n=new WeakMap;function e(i,r){let s=n.get(i),o;return s===void 0?(o=new Dp,n.set(i,[o])):r>=s.length?(o=new Dp,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function AM(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new R,color:new Me};break;case"SpotLight":t={position:new R,direction:new R,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new R,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new R,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new R,halfWidth:new R,halfHeight:new R};break}return n[e.id]=t,t}}}function RM(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var CM=0;function PM(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function IM(n){let e=new AM,t=RM(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new R);let r=new R,s=new He,o=new He;function a(c){let u=0,h=0,d=0;for(let D=0;D<9;D++)i.probe[D].set(0,0,0);let f=0,m=0,_=0,p=0,g=0,M=0,T=0,x=0,S=0,E=0,A=0,v=0,w=0,C=0;c.sort(PM);for(let D=0,H=c.length;D<H;D++){let U=c[D],V=U.color,W=U.intensity,J=U.distance,se=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===Zi?se=U.shadow.map.texture:se=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)u+=V.r*W,h+=V.g*W,d+=V.b*W;else if(U.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(U.sh.coefficients[$],W);C++}else if(U.isSunLight){let $=e.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let j=U.shadow,ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize.copy(j.mapSize).multiply(j.getFrameExtents()),i.sunShadow[m]=ee,i.sunShadowMap[m]=se;let Ie=j.getViewportCount();for(let Te=0;Te<Ie;Te++)i.sunShadowMatrix[_+Te]=j.getMatrix(Te),i.sunShadowCascade[_+Te]=j._cascadeData[Te];_+=Ie,m++}i.sun[f]=$,f++}else if(U.isDirectionalLight){let $=e.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){let j=U.shadow,ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,i.directionalShadow[p]=ee,i.directionalShadowMap[p]=se,i.directionalShadowMatrix[p]=U.shadow.matrix,S++}i.directional[p]=$,p++}else if(U.isSpotLight){let $=e.get(U);$.position.setFromMatrixPosition(U.matrixWorld),$.color.copy(V).multiplyScalar(W),$.distance=J,$.coneCos=Math.cos(U.angle),$.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),$.decay=U.decay,i.spot[M]=$;let j=U.shadow;if(U.map&&(i.spotLightMap[v]=U.map,v++,j.updateMatrices(U),U.castShadow&&w++),i.spotLightMatrix[M]=j.matrix,U.castShadow){let ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,i.spotShadow[M]=ee,i.spotShadowMap[M]=se,A++}M++}else if(U.isRectAreaLight){let $=e.get(U);$.color.copy(V).multiplyScalar(W),$.halfWidth.set(U.width*.5,0,0),$.halfHeight.set(0,U.height*.5,0),i.rectArea[T]=$,T++}else if(U.isPointLight){let $=e.get(U);if($.color.copy(U.color).multiplyScalar(U.intensity),$.distance=U.distance,$.decay=U.decay,U.castShadow){let j=U.shadow,ee=t.get(U);ee.shadowIntensity=j.intensity,ee.shadowBias=j.bias,ee.shadowNormalBias=j.normalBias,ee.shadowRadius=j.radius,ee.shadowMapSize=j.mapSize,ee.shadowCameraNear=j.camera.near,ee.shadowCameraFar=j.camera.far,i.pointShadow[g]=ee,i.pointShadowMap[g]=se,i.pointShadowMatrix[g]=U.shadow.matrix,E++}i.point[g]=$,g++}else if(U.isHemisphereLight){let $=e.get(U);$.skyColor.copy(U.color).multiplyScalar(W),$.groundColor.copy(U.groundColor).multiplyScalar(W),i.hemi[x]=$,x++}}T>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Se.LTC_FLOAT_1,i.rectAreaLTC2=Se.LTC_FLOAT_2):(i.rectAreaLTC1=Se.LTC_HALF_1,i.rectAreaLTC2=Se.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;let L=i.hash;(L.sunLength!==f||L.directionalLength!==p||L.pointLength!==g||L.spotLength!==M||L.rectAreaLength!==T||L.hemiLength!==x||L.numSunShadows!==m||L.numDirectionalShadows!==S||L.numPointShadows!==E||L.numSpotShadows!==A||L.numSpotMaps!==v||L.numLightProbes!==C)&&(i.sun.length=f,i.directional.length=p,i.spot.length=M,i.rectArea.length=T,i.point.length=g,i.hemi.length=x,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=A,i.spotShadowMap.length=A,i.spotLightMatrix.length=A+v-w,i.spotLightMap.length=v,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=C,L.sunLength=f,L.directionalLength=p,L.pointLength=g,L.spotLength=M,L.rectAreaLength=T,L.hemiLength=x,L.numSunShadows=m,L.numDirectionalShadows=S,L.numPointShadows=E,L.numSpotShadows=A,L.numSpotMaps=v,L.numLightProbes=C,i.version=CM++)}function l(c,u){let h=0,d=0,f=0,m=0,_=0,p=0,g=u.matrixWorldInverse;for(let M=0,T=c.length;M<T;M++){let x=c[M];if(x.isSunLight){let S=i.sun[h];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(g),h++}else if(x.isDirectionalLight){let S=i.directional[d];S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),d++}else if(x.isSpotLight){let S=i.spot[m];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(g),m++}else if(x.isRectAreaLight){let S=i.rectArea[_];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),o.identity(),s.copy(x.matrixWorld),s.premultiply(g),o.extractRotation(s),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){let S=i.point[f];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(g),f++}else if(x.isHemisphereLight){let S=i.hemi[p];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(g),p++}}}return{setup:a,setupView:l,state:i}}function Op(n){let e=new IM(n),t=[],i=[],r=[];function s(d){h.camera=d,t.length=0,i.length=0,r.length=0}function o(d){t.push(d)}function a(d){i.push(d)}function l(d){r.push(d)}function c(){e.setup(t)}function u(d){e.setupView(t,d)}let h={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function LM(n){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new Op(n),e.set(r,[a])):s>=o.length?(a=new Op(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var NM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,UM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,DM=[new R(1,0,0),new R(-1,0,0),new R(0,1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1)],OM=[new R(0,-1,0),new R(0,-1,0),new R(0,0,1),new R(0,0,-1),new R(0,-1,0),new R(0,-1,0)],Fp=new He,Jo=new R,Sh=new R;function FM(n,e,t){let i=new us,r=new ce,s=new ce,o=new vt,a=new _l,l=new xl,c={},u=t.maxTextureSize,h={[si]:zt,[zt]:si,[Ut]:Ut},d=new Zt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ce},radius:{value:4}},vertexShader:NM,fragmentShader:UM}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new Qe;m.setAttribute("position",new Ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Ct(m,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ho;let g=this.type;this.render=function(E,A,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===Af&&(ke("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Ho);let w=n.getRenderTarget(),C=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),D=n.state;D.setBlending(oi),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let H=g!==this.type;H&&A.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(V=>V.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,V=E.length;U<V;U++){let W=E[U],J=W.shadow;if(J===void 0){ke("WebGLShadowMap:",W,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;r.copy(J.mapSize);let se=J.getFrameExtents();r.multiply(se),s.copy(J.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/se.x),r.x=s.x*se.x,J.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/se.y),r.y=s.y*se.y,J.mapSize.y=s.y));let $=n.state.buffers.depth.getReversed();if(J.camera._reversedDepth=$,J.map===null||H===!0){if(J.map!==null&&(J.map.depthTexture!==null&&(J.map.depthTexture.dispose(),J.map.depthTexture=null),J.map.dispose()),this.type===ys){if(W.isPointLight){ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}J.map=new Qt(r.x,r.y,{format:Zi,type:Sn,minFilter:Rt,magFilter:Rt,generateMipmaps:!1}),J.map.texture.name=W.name+".shadowMap",J.map.depthTexture=new zi(r.x,r.y,Mn),J.map.depthTexture.name=W.name+".shadowMapDepth",J.map.depthTexture.format=jn,J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Lt,J.map.depthTexture.magFilter=Lt}else W.isPointLight?(J.map=new Mc(r.x),J.map.depthTexture=new ll(r.x,qn)):(J.map=new Qt(r.x,r.y),J.map.depthTexture=new zi(r.x,r.y,qn)),J.map.depthTexture.name=W.name+".shadowMap",J.map.depthTexture.format=jn,this.type===Ho?(J.map.depthTexture.compareFunction=$?gc:mc,J.map.depthTexture.minFilter=Rt,J.map.depthTexture.magFilter=Rt):(J.map.depthTexture.compareFunction=null,J.map.depthTexture.minFilter=Lt,J.map.depthTexture.magFilter=Lt);J.camera.updateProjectionMatrix()}J.map.isWebGLCubeRenderTarget!==!0&&(J.map.width!==r.x||J.map.height!==r.y)&&J.map.setSize(r.x,r.y);let j=J.map.isWebGLCubeRenderTarget?6:J.getViewportCount();W.isPointLight!==!0&&J.updateMatrices(W,v);for(let ee=0;ee<j;ee++){let Ie=J.getCamera(ee);if(W.isPointLight){let Te=J.camera,ae=J.matrix,he=W.distance||Te.far;he!==Te.far&&(Te.far=he,Te.updateProjectionMatrix()),Jo.setFromMatrixPosition(W.matrixWorld),Te.position.copy(Jo),Sh.copy(Te.position),Sh.add(DM[ee]),Te.up.copy(OM[ee]),Te.lookAt(Sh),Te.updateMatrixWorld(),ae.makeTranslation(-Jo.x,-Jo.y,-Jo.z),Fp.multiplyMatrices(Te.projectionMatrix,Te.matrixWorldInverse),J._frustum.setFromProjectionMatrix(Fp,Te.coordinateSystem,Te.reversedDepth)}if(J.map.isWebGLCubeRenderTarget)n.setRenderTarget(J.map,ee),n.clear();else{ee===0&&(n.setRenderTarget(J.map),n.clear());let Te=J.getViewport(ee);o.set(s.x*Te.x,s.y*Te.y,s.x*Te.z,s.y*Te.w),D.viewport(o)}i=J.getFrustum(ee),x(A,v,Ie,W,this.type)}J.isPointLightShadow!==!0&&this.type===ys&&M(J,v),J.needsUpdate=!1}g=this.type,p.needsUpdate=!1,n.setRenderTarget(w,C,L)};function M(E,A){let v=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new Qt(r.x,r.y,{format:Zi,type:Sn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,v,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,v,f,_,null)}function T(E,A,v,w){let C=null,L=v.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)C=L;else if(C=v.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let D=C.uuid,H=A.uuid,U=c[D];U===void 0&&(U={},c[D]=U);let V=U[H];V===void 0&&(V=C.clone(),U[H]=V,A.addEventListener("dispose",S)),C=V}if(C.visible=A.visible,C.wireframe=A.wireframe,w===ys?C.side=A.shadowSide!==null?A.shadowSide:A.side:C.side=A.shadowSide!==null?A.shadowSide:h[A.side],C.alphaMap=A.alphaMap,C.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,C.map=A.map,C.clipShadows=A.clipShadows,C.clippingPlanes=A.clippingPlanes,C.clipIntersection=A.clipIntersection,C.displacementMap=A.displacementMap,C.displacementScale=A.displacementScale,C.displacementBias=A.displacementBias,C.wireframeLinewidth=A.wireframeLinewidth,C.linewidth=A.linewidth,v.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let D=n.properties.get(C);D.light=v}return C}function x(E,A,v,w,C){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&C===ys)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,E.matrixWorld);let H=e.update(E),U=E.material;if(Array.isArray(U)){let V=H.groups;for(let W=0,J=V.length;W<J;W++){let se=V[W],$=U[se.materialIndex];if($&&$.visible){let j=T(E,$,w,C);E.onBeforeShadow(n,E,A,v,H,j,se),n.renderBufferDirect(v,null,H,j,E,se),E.onAfterShadow(n,E,A,v,H,j,se)}}}else if(U.visible){let V=T(E,U,w,C);E.onBeforeShadow(n,E,A,v,H,V,null),n.renderBufferDirect(v,null,H,V,E,null),E.onAfterShadow(n,E,A,v,H,V,null)}}let D=E.children;for(let H=0,U=D.length;H<U;H++)x(D[H],A,v,w,C)}function S(E){E.target.removeEventListener("dispose",S);for(let v in c){let w=c[v],C=E.target.uuid;C in w&&(w[C].dispose(),delete w[C])}}}function BM(n,e){function t(){let B=!1,ye=new vt,re=null,be=new vt(0,0,0,0);return{setMask:function(Ce){re!==Ce&&!B&&(n.colorMask(Ce,Ce,Ce,Ce),re=Ce)},setLocked:function(Ce){B=Ce},setClear:function(Ce,le,We,Oe,yt){yt===!0&&(Ce*=Oe,le*=Oe,We*=Oe),ye.set(Ce,le,We,Oe),be.equals(ye)===!1&&(n.clearColor(Ce,le,We,Oe),be.copy(ye))},reset:function(){B=!1,re=null,be.set(-1,0,0,0)}}}function i(){let B=!1,ye=!1,re=null,be=null,Ce=null;return{setReversed:function(le){if(ye!==le){let We=e.get("EXT_clip_control");le?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),ye=le;let Oe=Ce;Ce=null,this.setClear(Oe)}},getReversed:function(){return ye},setTest:function(le){le?ne(n.DEPTH_TEST):fe(n.DEPTH_TEST)},setMask:function(le){re!==le&&!B&&(n.depthMask(le),re=le)},setFunc:function(le){if(ye&&(le=lp[le]),be!==le){switch(le){case $a:n.depthFunc(n.NEVER);break;case Ka:n.depthFunc(n.ALWAYS);break;case ja:n.depthFunc(n.LESS);break;case es:n.depthFunc(n.LEQUAL);break;case Qa:n.depthFunc(n.EQUAL);break;case el:n.depthFunc(n.GEQUAL);break;case tl:n.depthFunc(n.GREATER);break;case nl:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}be=le}},setLocked:function(le){B=le},setClear:function(le){Ce!==le&&(Ce=le,ye&&(le=1-le),n.clearDepth(le))},reset:function(){B=!1,re=null,be=null,Ce=null,ye=!1}}}function r(){let B=!1,ye=null,re=null,be=null,Ce=null,le=null,We=null,Oe=null,yt=null;return{setTest:function(ut){B||(ut?ne(n.STENCIL_TEST):fe(n.STENCIL_TEST))},setMask:function(ut){ye!==ut&&!B&&(n.stencilMask(ut),ye=ut)},setFunc:function(ut,pn,bn){(re!==ut||be!==pn||Ce!==bn)&&(n.stencilFunc(ut,pn,bn),re=ut,be=pn,Ce=bn)},setOp:function(ut,pn,bn){(le!==ut||We!==pn||Oe!==bn)&&(n.stencilOp(ut,pn,bn),le=ut,We=pn,Oe=bn)},setLocked:function(ut){B=ut},setClear:function(ut){yt!==ut&&(n.clearStencil(ut),yt=ut)},reset:function(){B=!1,ye=null,re=null,be=null,Ce=null,le=null,We=null,Oe=null,yt=null}}}let s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap,u={},h={},d={},f=new WeakMap,m=[],_=null,p=!1,g=null,M=null,T=null,x=null,S=null,E=null,A=null,v=new Me(0,0,0),w=0,C=!1,L=null,D=null,H=null,U=null,V=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),J=!1,se=0,$=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(se=parseFloat(/^WebGL (\d)/.exec($)[1]),J=se>=1):$.indexOf("OpenGL ES")!==-1&&(se=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),J=se>=2);let j=null,ee={},Ie=n.getParameter(n.SCISSOR_BOX),Te=n.getParameter(n.VIEWPORT),ae=new vt().fromArray(Ie),he=new vt().fromArray(Te);function Re(B,ye,re,be){let Ce=new Uint8Array(4),le=n.createTexture();n.bindTexture(B,le),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let We=0;We<re;We++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(ye,0,n.RGBA,1,1,be,0,n.RGBA,n.UNSIGNED_BYTE,Ce):n.texImage2D(ye+We,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ce);return le}let X={};X[n.TEXTURE_2D]=Re(n.TEXTURE_2D,n.TEXTURE_2D,1),X[n.TEXTURE_CUBE_MAP]=Re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[n.TEXTURE_2D_ARRAY]=Re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),X[n.TEXTURE_3D]=Re(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(n.DEPTH_TEST),o.setFunc(es),O(!1),k(Fu),ne(n.CULL_FACE),G(oi);function ne(B){u[B]!==!0&&(n.enable(B),u[B]=!0)}function fe(B){u[B]!==!1&&(n.disable(B),u[B]=!1)}function Le(B,ye){return d[B]!==ye?(n.bindFramebuffer(B,ye),d[B]=ye,B===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=ye),B===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=ye),!0):!1}function me(B,ye){let re=m,be=!1;if(B){re=f.get(ye),re===void 0&&(re=[],f.set(ye,re));let Ce=B.textures;if(re.length!==Ce.length||re[0]!==n.COLOR_ATTACHMENT0){for(let le=0,We=Ce.length;le<We;le++)re[le]=n.COLOR_ATTACHMENT0+le;re.length=Ce.length,be=!0}}else re[0]!==n.BACK&&(re[0]=n.BACK,be=!0);be&&n.drawBuffers(re)}function De(B){return _!==B?(n.useProgram(B),_=B,!0):!1}let tt={[xr]:n.FUNC_ADD,[Cf]:n.FUNC_SUBTRACT,[Pf]:n.FUNC_REVERSE_SUBTRACT};tt[If]=n.MIN,tt[Lf]=n.MAX;let ie={[Nf]:n.ZERO,[Uf]:n.ONE,[Df]:n.SRC_COLOR,[Vu]:n.SRC_ALPHA,[zf]:n.SRC_ALPHA_SATURATE,[Hf]:n.DST_COLOR,[Ff]:n.DST_ALPHA,[Of]:n.ONE_MINUS_SRC_COLOR,[zu]:n.ONE_MINUS_SRC_ALPHA,[Vf]:n.ONE_MINUS_DST_COLOR,[Bf]:n.ONE_MINUS_DST_ALPHA,[Gf]:n.CONSTANT_COLOR,[kf]:n.ONE_MINUS_CONSTANT_COLOR,[Wf]:n.CONSTANT_ALPHA,[Xf]:n.ONE_MINUS_CONSTANT_ALPHA};function G(B,ye,re,be,Ce,le,We,Oe,yt,ut){if(B===oi){p===!0&&(fe(n.BLEND),p=!1);return}if(p===!1&&(ne(n.BLEND),p=!0),B!==Rf){if(B!==g||ut!==C){if((M!==xr||S!==xr)&&(n.blendEquation(n.FUNC_ADD),M=xr,S=xr),ut)switch(B){case Ms:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _r:n.blendFunc(n.ONE,n.ONE);break;case Bu:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hu:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:$e("WebGLState: Invalid blending: ",B);break}else switch(B){case Ms:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case _r:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Bu:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Hu:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",B);break}T=null,x=null,E=null,A=null,v.set(0,0,0),w=0,g=B,C=ut}return}Ce=Ce||ye,le=le||re,We=We||be,(ye!==M||Ce!==S)&&(n.blendEquationSeparate(tt[ye],tt[Ce]),M=ye,S=Ce),(re!==T||be!==x||le!==E||We!==A)&&(n.blendFuncSeparate(ie[re],ie[be],ie[le],ie[We]),T=re,x=be,E=le,A=We),(Oe.equals(v)===!1||yt!==w)&&(n.blendColor(Oe.r,Oe.g,Oe.b,yt),v.copy(Oe),w=yt),g=B,C=!1}function N(B,ye){B.side===Ut?fe(n.CULL_FACE):ne(n.CULL_FACE);let re=B.side===zt;ye&&(re=!re),O(re),B.blending===Ms&&B.transparent===!1?G(oi):G(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),s.setMask(B.colorWrite);let be=B.stencilWrite;a.setTest(be),be&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),de(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):fe(n.SAMPLE_ALPHA_TO_COVERAGE)}function O(B){L!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),L=B)}function k(B){B!==Tf?(ne(n.CULL_FACE),B!==D&&(B===Fu?n.cullFace(n.BACK):B===wf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):fe(n.CULL_FACE),D=B}function ue(B){B!==H&&(J&&n.lineWidth(B),H=B)}function de(B,ye,re){B?(ne(n.POLYGON_OFFSET_FILL),(U!==ye||V!==re)&&(U=ye,V=re,o.getReversed()&&(ye=-ye),n.polygonOffset(ye,re))):fe(n.POLYGON_OFFSET_FILL)}function xe(B){B?ne(n.SCISSOR_TEST):fe(n.SCISSOR_TEST)}function pe(B){B===void 0&&(B=n.TEXTURE0+W-1),j!==B&&(n.activeTexture(B),j=B)}function I(B,ye,re){re===void 0&&(j===null?re=n.TEXTURE0+W-1:re=j);let be=ee[re];be===void 0&&(be={type:void 0,texture:void 0},ee[re]=be),(be.type!==B||be.texture!==ye)&&(j!==re&&(n.activeTexture(re),j=re),n.bindTexture(B,ye||X[B]),be.type=B,be.texture=ye)}function Xe(){let B=ee[j];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Ze(){try{n.compressedTexImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function P(){try{n.compressedTexImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function y(){try{n.texSubImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function z(){try{n.texSubImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function K(){try{n.compressedTexSubImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function ge(){try{n.texStorage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function _e(){try{n.texStorage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function te(){try{n.texImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function oe(){try{n.texImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function ve(B){return h[B]!==void 0?h[B]:n.getParameter(B)}function Ve(B,ye){h[B]!==ye&&(n.pixelStorei(B,ye),h[B]=ye)}function we(B){ae.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),ae.copy(B))}function Ee(B){he.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),he.copy(B))}function ze(B,ye){let re=c.get(ye);re===void 0&&(re=new WeakMap,c.set(ye,re));let be=re.get(B);be===void 0&&(be=n.getUniformBlockIndex(ye,B.name),re.set(B,be))}function Je(B,ye){let be=c.get(ye).get(B);l.get(ye)!==be&&(n.uniformBlockBinding(ye,be,B.__bindingPointIndex),l.set(ye,be))}function et(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},h={},j=null,ee={},d={},f=new WeakMap,m=[],_=null,p=!1,g=null,M=null,T=null,x=null,S=null,E=null,A=null,v=new Me(0,0,0),w=0,C=!1,L=null,D=null,H=null,U=null,V=null,ae.set(0,0,n.canvas.width,n.canvas.height),he.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ne,disable:fe,bindFramebuffer:Le,drawBuffers:me,useProgram:De,setBlending:G,setMaterial:N,setFlipSided:O,setCullFace:k,setLineWidth:ue,setPolygonOffset:de,setScissorTest:xe,activeTexture:pe,bindTexture:I,unbindTexture:Xe,compressedTexImage2D:Ze,compressedTexImage3D:P,texImage2D:te,texImage3D:oe,pixelStorei:Ve,getParameter:ve,updateUBOMapping:ze,uniformBlockBinding:Je,texStorage2D:ge,texStorage3D:_e,texSubImage2D:y,texSubImage3D:z,compressedTexSubImage2D:q,compressedTexSubImage3D:K,scissor:we,viewport:Ee,reset:et}}function HM(n,e,t,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ce,u=new WeakMap,h=new Set,d,f=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,y){return m?new OffscreenCanvas(P,y):is("canvas")}function p(P,y,z){let q=1,K=Ze(P);if((K.width>z||K.height>z)&&(q=z/Math.max(K.width,K.height)),q<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let ge=Math.floor(q*K.width),_e=Math.floor(q*K.height);d===void 0&&(d=_(ge,_e));let te=y?_(ge,_e):d;return te.width=ge,te.height=_e,te.getContext("2d").drawImage(P,0,0,ge,_e),ke("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+ge+"x"+_e+")."),te}else return"data"in P&&ke("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),P;return P}function g(P){return P.generateMipmaps}function M(P){n.generateMipmap(P)}function T(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(P,y,z,q,K,ge=!1){if(P!==null){if(n[P]!==void 0)return n[P];ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let _e;q&&(_e=e.get("EXT_texture_norm16"),_e||ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let te=y;if(y===n.RED&&(z===n.FLOAT&&(te=n.R32F),z===n.HALF_FLOAT&&(te=n.R16F),z===n.UNSIGNED_BYTE&&(te=n.R8),z===n.UNSIGNED_SHORT&&_e&&(te=_e.R16_EXT),z===n.SHORT&&_e&&(te=_e.R16_SNORM_EXT)),y===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(te=n.R8UI),z===n.UNSIGNED_SHORT&&(te=n.R16UI),z===n.UNSIGNED_INT&&(te=n.R32UI),z===n.BYTE&&(te=n.R8I),z===n.SHORT&&(te=n.R16I),z===n.INT&&(te=n.R32I)),y===n.RG&&(z===n.FLOAT&&(te=n.RG32F),z===n.HALF_FLOAT&&(te=n.RG16F),z===n.UNSIGNED_BYTE&&(te=n.RG8),z===n.UNSIGNED_SHORT&&_e&&(te=_e.RG16_EXT),z===n.SHORT&&_e&&(te=_e.RG16_SNORM_EXT)),y===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(te=n.RG8UI),z===n.UNSIGNED_SHORT&&(te=n.RG16UI),z===n.UNSIGNED_INT&&(te=n.RG32UI),z===n.BYTE&&(te=n.RG8I),z===n.SHORT&&(te=n.RG16I),z===n.INT&&(te=n.RG32I)),y===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(te=n.RGB8UI),z===n.UNSIGNED_SHORT&&(te=n.RGB16UI),z===n.UNSIGNED_INT&&(te=n.RGB32UI),z===n.BYTE&&(te=n.RGB8I),z===n.SHORT&&(te=n.RGB16I),z===n.INT&&(te=n.RGB32I)),y===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(te=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(te=n.RGBA16UI),z===n.UNSIGNED_INT&&(te=n.RGBA32UI),z===n.BYTE&&(te=n.RGBA8I),z===n.SHORT&&(te=n.RGBA16I),z===n.INT&&(te=n.RGBA32I)),y===n.RGB&&(z===n.UNSIGNED_SHORT&&_e&&(te=_e.RGB16_EXT),z===n.SHORT&&_e&&(te=_e.RGB16_SNORM_EXT),z===n.UNSIGNED_INT_5_9_9_9_REV&&(te=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(te=n.R11F_G11F_B10F)),y===n.RGBA){let oe=ge?lo:st.getTransfer(K);z===n.FLOAT&&(te=n.RGBA32F),z===n.HALF_FLOAT&&(te=n.RGBA16F),z===n.UNSIGNED_BYTE&&(te=oe===_t?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT&&_e&&(te=_e.RGBA16_EXT),z===n.SHORT&&_e&&(te=_e.RGBA16_SNORM_EXT),z===n.UNSIGNED_SHORT_4_4_4_4&&(te=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(te=n.RGB5_A1)}return(te===n.R16F||te===n.R32F||te===n.RG16F||te===n.RG32F||te===n.RGBA16F||te===n.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function S(P,y){let z;return P?y===null||y===qn||y===bs?z=n.DEPTH24_STENCIL8:y===Mn?z=n.DEPTH32F_STENCIL8:y===Es&&(z=n.DEPTH24_STENCIL8,ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===qn||y===bs?z=n.DEPTH_COMPONENT24:y===Mn?z=n.DEPTH_COMPONENT32F:y===Es&&(z=n.DEPTH_COMPONENT16),z}function E(P,y){return g(P)===!0||P.isFramebufferTexture&&P.minFilter!==Lt&&P.minFilter!==Rt?Math.log2(Math.max(y.width,y.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?y.mipmaps.length:1}function A(P){let y=P.target;y.removeEventListener("dispose",A),w(y),y.isVideoTexture&&u.delete(y),y.isHTMLTexture&&h.delete(y)}function v(P){let y=P.target;y.removeEventListener("dispose",v),L(y)}function w(P){let y=i.get(P);if(y.__webglInit===void 0)return;let z=P.source,q=f.get(z);if(q){let K=q[y.__cacheKey];K.usedTimes--,K.usedTimes===0&&C(P),Object.keys(q).length===0&&f.delete(z)}i.remove(P)}function C(P){let y=i.get(P);n.deleteTexture(y.__webglTexture);let z=P.source,q=f.get(z);delete q[y.__cacheKey],o.memory.textures--}function L(P){let y=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(y.__webglFramebuffer[q]))for(let K=0;K<y.__webglFramebuffer[q].length;K++)n.deleteFramebuffer(y.__webglFramebuffer[q][K]);else n.deleteFramebuffer(y.__webglFramebuffer[q]);y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer[q])}else{if(Array.isArray(y.__webglFramebuffer))for(let q=0;q<y.__webglFramebuffer.length;q++)n.deleteFramebuffer(y.__webglFramebuffer[q]);else n.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&n.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&n.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let q=0;q<y.__webglColorRenderbuffer.length;q++)y.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(y.__webglColorRenderbuffer[q]);y.__webglDepthRenderbuffer&&n.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let z=P.textures;for(let q=0,K=z.length;q<K;q++){let ge=i.get(z[q]);ge.__webglTexture&&(n.deleteTexture(ge.__webglTexture),o.memory.textures--),i.remove(z[q])}i.remove(P)}let D=0;function H(){D=0}function U(){return D}function V(P){D=P}function W(){let P=D;return P>=r.maxTextures&&ke("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+r.maxTextures),D+=1,P}function J(P){let y=[];return y.push(P.wrapS),y.push(P.wrapT),y.push(P.wrapR||0),y.push(P.magFilter),y.push(P.minFilter),y.push(P.anisotropy),y.push(P.internalFormat),y.push(P.format),y.push(P.type),y.push(P.generateMipmaps),y.push(P.premultiplyAlpha),y.push(P.flipY),y.push(P.unpackAlignment),y.push(P.colorSpace),y.join()}function se(P,y){let z=i.get(P);if(P.isVideoTexture&&I(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&z.__version!==P.version){let q=P.image;if(q===null)ke("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)ke("WebGLRenderer: Texture marked for update but image is incomplete");else{fe(z,P,y);return}}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+y)}function $(P,y){let z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){fe(z,P,y);return}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+y)}function j(P,y){let z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){fe(z,P,y);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+y)}function ee(P,y){let z=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&z.__version!==P.version){Le(z,P,y);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+y)}let Ie={[Hn]:n.REPEAT,[An]:n.CLAMP_TO_EDGE,[ts]:n.MIRRORED_REPEAT},Te={[Lt]:n.NEAREST,[Il]:n.NEAREST_MIPMAP_NEAREST,[yr]:n.NEAREST_MIPMAP_LINEAR,[Rt]:n.LINEAR,[Ss]:n.LINEAR_MIPMAP_NEAREST,[Xn]:n.LINEAR_MIPMAP_LINEAR},ae={[Qf]:n.NEVER,[rp]:n.ALWAYS,[ep]:n.LESS,[mc]:n.LEQUAL,[tp]:n.EQUAL,[gc]:n.GEQUAL,[np]:n.GREATER,[ip]:n.NOTEQUAL};function he(P,y){if(y.type===Mn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Rt||y.magFilter===Ss||y.magFilter===yr||y.magFilter===Xn||y.minFilter===Rt||y.minFilter===Ss||y.minFilter===yr||y.minFilter===Xn)&&ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,Ie[y.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,Ie[y.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,Ie[y.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,Te[y.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,Te[y.minFilter]),y.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,ae[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Lt||y.minFilter!==yr&&y.minFilter!==Xn||y.type===Mn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||i.get(y).__currentAnisotropy){let z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),i.get(y).__currentAnisotropy=y.anisotropy}}}function Re(P,y){let z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,y.addEventListener("dispose",A));let q=y.source,K=f.get(q);K===void 0&&(K={},f.set(q,K));let ge=J(y);if(ge!==P.__cacheKey){K[ge]===void 0&&(K[ge]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,z=!0),K[ge].usedTimes++;let _e=K[P.__cacheKey];_e!==void 0&&(K[P.__cacheKey].usedTimes--,_e.usedTimes===0&&C(y)),P.__cacheKey=ge,P.__webglTexture=K[ge].texture}return z}function X(P,y,z){return Math.floor(Math.floor(P/z)/y)}function ne(P,y,z,q){let ge=P.updateRanges;if(ge.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,y.width,y.height,z,q,y.data);else{ge.sort((Ve,we)=>Ve.start-we.start);let _e=0;for(let Ve=1;Ve<ge.length;Ve++){let we=ge[_e],Ee=ge[Ve],ze=we.start+we.count,Je=X(Ee.start,y.width,4),et=X(we.start,y.width,4);Ee.start<=ze+1&&Je===et&&X(Ee.start+Ee.count-1,y.width,4)===Je?we.count=Math.max(we.count,Ee.start+Ee.count-we.start):(++_e,ge[_e]=Ee)}ge.length=_e+1;let te=t.getParameter(n.UNPACK_ROW_LENGTH),oe=t.getParameter(n.UNPACK_SKIP_PIXELS),ve=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,y.width);for(let Ve=0,we=ge.length;Ve<we;Ve++){let Ee=ge[Ve],ze=Math.floor(Ee.start/4),Je=Math.ceil(Ee.count/4),et=ze%y.width,B=Math.floor(ze/y.width),ye=Je,re=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,et),t.pixelStorei(n.UNPACK_SKIP_ROWS,B),t.texSubImage2D(n.TEXTURE_2D,0,et,B,ye,re,z,q,y.data)}P.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,te),t.pixelStorei(n.UNPACK_SKIP_PIXELS,oe),t.pixelStorei(n.UNPACK_SKIP_ROWS,ve)}}function fe(P,y,z){let q=n.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),y.isData3DTexture&&(q=n.TEXTURE_3D);let K=Re(P,y),ge=y.source;t.bindTexture(q,P.__webglTexture,n.TEXTURE0+z);let _e=i.get(ge);if(ge.version!==_e.__version||K===!0){if(t.activeTexture(n.TEXTURE0+z),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){let re=st.getPrimaries(st.workingColorSpace),be=y.colorSpace===Ci?null:st.getPrimaries(y.colorSpace),Ce=y.colorSpace===Ci||re===be?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce)}t.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment);let oe=p(y.image,!1,r.maxTextureSize);oe=Xe(y,oe);let ve=s.convert(y.format,y.colorSpace),Ve=s.convert(y.type),we=x(y.internalFormat,ve,Ve,y.normalized,y.colorSpace,y.isVideoTexture);he(q,y);let Ee,ze=y.mipmaps,Je=y.isVideoTexture!==!0,et=_e.__version===void 0||K===!0,B=ge.dataReady,ye=E(y,oe);if(y.isDepthTexture)we=S(y.format===Yi,y.type),et&&(Je?t.texStorage2D(n.TEXTURE_2D,1,we,oe.width,oe.height):t.texImage2D(n.TEXTURE_2D,0,we,oe.width,oe.height,0,ve,Ve,null));else if(y.isDataTexture)if(ze.length>0){Je&&et&&t.texStorage2D(n.TEXTURE_2D,ye,we,ze[0].width,ze[0].height);for(let re=0,be=ze.length;re<be;re++)Ee=ze[re],Je?B&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,Ee.width,Ee.height,ve,Ve,Ee.data):t.texImage2D(n.TEXTURE_2D,re,we,Ee.width,Ee.height,0,ve,Ve,Ee.data);y.generateMipmaps=!1}else Je?(et&&t.texStorage2D(n.TEXTURE_2D,ye,we,oe.width,oe.height),B&&ne(y,oe,ve,Ve)):t.texImage2D(n.TEXTURE_2D,0,we,oe.width,oe.height,0,ve,Ve,oe.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Je&&et&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,we,ze[0].width,ze[0].height,oe.depth);for(let re=0,be=ze.length;re<be;re++)if(Ee=ze[re],y.format!==En)if(ve!==null)if(Je){if(B)if(y.layerUpdates.size>0){let Ce=hh(Ee.width,Ee.height,y.format,y.type);for(let le of y.layerUpdates){let We=Ee.data.subarray(le*Ce/Ee.data.BYTES_PER_ELEMENT,(le+1)*Ce/Ee.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,le,Ee.width,Ee.height,1,ve,We)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,Ee.width,Ee.height,oe.depth,ve,Ee.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,re,we,Ee.width,Ee.height,oe.depth,0,Ee.data,0,0);else ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Je?B&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,Ee.width,Ee.height,oe.depth,ve,Ve,Ee.data):t.texImage3D(n.TEXTURE_2D_ARRAY,re,we,Ee.width,Ee.height,oe.depth,0,ve,Ve,Ee.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{Je&&et&&t.texStorage2D(n.TEXTURE_2D,ye,we,ze[0].width,ze[0].height);for(let re=0,be=ze.length;re<be;re++)Ee=ze[re],y.format!==En?ve!==null?Je?B&&t.compressedTexSubImage2D(n.TEXTURE_2D,re,0,0,Ee.width,Ee.height,ve,Ee.data):t.compressedTexImage2D(n.TEXTURE_2D,re,we,Ee.width,Ee.height,0,Ee.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Je?B&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,Ee.width,Ee.height,ve,Ve,Ee.data):t.texImage2D(n.TEXTURE_2D,re,we,Ee.width,Ee.height,0,ve,Ve,Ee.data)}else if(y.isDataArrayTexture)if(Je){if(et&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ye,we,oe.width,oe.height,oe.depth),B)if(y.layerUpdates.size>0){let re=hh(oe.width,oe.height,y.format,y.type);for(let be of y.layerUpdates){let Ce=oe.data.subarray(be*re/oe.data.BYTES_PER_ELEMENT,(be+1)*re/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,be,oe.width,oe.height,1,ve,Ve,Ce)}y.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,ve,Ve,oe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,we,oe.width,oe.height,oe.depth,0,ve,Ve,oe.data);else if(y.isData3DTexture)Je?(et&&t.texStorage3D(n.TEXTURE_3D,ye,we,oe.width,oe.height,oe.depth),B&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,ve,Ve,oe.data)):t.texImage3D(n.TEXTURE_3D,0,we,oe.width,oe.height,oe.depth,0,ve,Ve,oe.data);else if(y.isFramebufferTexture){if(et)if(Je)t.texStorage2D(n.TEXTURE_2D,ye,we,oe.width,oe.height);else{let re=oe.width,be=oe.height;for(let Ce=0;Ce<ye;Ce++)t.texImage2D(n.TEXTURE_2D,Ce,we,re,be,0,ve,Ve,null),re>>=1,be>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in n){let re=n.canvas;if(re.hasAttribute("layoutsubtree")||re.setAttribute("layoutsubtree","true"),oe.parentNode!==re){re.appendChild(oe),h.add(y),re.onpaint=be=>{let Ce=be.changedElements;for(let le of h)Ce.includes(le.image)&&(le.needsUpdate=!0)},re.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,oe);else{let Ce=n.RGBA,le=n.RGBA,We=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Ce,le,We,oe)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(ze.length>0){if(Je&&et){let re=Ze(ze[0]);t.texStorage2D(n.TEXTURE_2D,ye,we,re.width,re.height)}for(let re=0,be=ze.length;re<be;re++)Ee=ze[re],Je?B&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,ve,Ve,Ee):t.texImage2D(n.TEXTURE_2D,re,we,ve,Ve,Ee);y.generateMipmaps=!1}else if(Je){if(et){let re=Ze(oe);t.texStorage2D(n.TEXTURE_2D,ye,we,re.width,re.height)}B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ve,Ve,oe)}else t.texImage2D(n.TEXTURE_2D,0,we,ve,Ve,oe);g(y)&&M(q),_e.__version=ge.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Le(P,y,z){if(y.image.length!==6)return;let q=Re(P,y),K=y.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+z);let ge=i.get(K);if(K.version!==ge.__version||q===!0){t.activeTexture(n.TEXTURE0+z);let _e=st.getPrimaries(st.workingColorSpace),te=y.colorSpace===Ci?null:st.getPrimaries(y.colorSpace),oe=y.colorSpace===Ci||_e===te?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);let ve=y.isCompressedTexture||y.image[0].isCompressedTexture,Ve=y.image[0]&&y.image[0].isDataTexture,we=[];for(let le=0;le<6;le++)!ve&&!Ve?we[le]=p(y.image[le],!0,r.maxCubemapSize):we[le]=Ve?y.image[le].image:y.image[le],we[le]=Xe(y,we[le]);let Ee=we[0],ze=s.convert(y.format,y.colorSpace),Je=s.convert(y.type),et=x(y.internalFormat,ze,Je,y.normalized,y.colorSpace),B=y.isVideoTexture!==!0,ye=ge.__version===void 0||q===!0,re=K.dataReady,be=E(y,Ee);he(n.TEXTURE_CUBE_MAP,y);let Ce;if(ve){B&&ye&&t.texStorage2D(n.TEXTURE_CUBE_MAP,be,et,Ee.width,Ee.height);for(let le=0;le<6;le++){Ce=we[le].mipmaps;for(let We=0;We<Ce.length;We++){let Oe=Ce[We];y.format!==En?ze!==null?B?re&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We,0,0,Oe.width,Oe.height,ze,Oe.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We,et,Oe.width,Oe.height,0,Oe.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We,0,0,Oe.width,Oe.height,ze,Je,Oe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We,et,Oe.width,Oe.height,0,ze,Je,Oe.data)}}}else{if(Ce=y.mipmaps,B&&ye){Ce.length>0&&be++;let le=Ze(we[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,be,et,le.width,le.height)}for(let le=0;le<6;le++)if(Ve){B?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,we[le].width,we[le].height,ze,Je,we[le].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,et,we[le].width,we[le].height,0,ze,Je,we[le].data);for(let We=0;We<Ce.length;We++){let yt=Ce[We].image[le].image;B?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We+1,0,0,yt.width,yt.height,ze,Je,yt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We+1,et,yt.width,yt.height,0,ze,Je,yt.data)}}else{B?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,ze,Je,we[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,et,ze,Je,we[le]);for(let We=0;We<Ce.length;We++){let Oe=Ce[We];B?re&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We+1,0,0,ze,Je,Oe.image[le]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+le,We+1,et,ze,Je,Oe.image[le])}}}g(y)&&M(n.TEXTURE_CUBE_MAP),ge.__version=K.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function me(P,y,z,q,K,ge){let _e=s.convert(z.format,z.colorSpace),te=s.convert(z.type),oe=x(z.internalFormat,_e,te,z.normalized,z.colorSpace),ve=i.get(y),Ve=i.get(z);if(Ve.__renderTarget=y,!ve.__hasExternalTextures){let we=Math.max(1,y.width>>ge),Ee=Math.max(1,y.height>>ge);K===n.TEXTURE_3D||K===n.TEXTURE_2D_ARRAY?t.texImage3D(K,ge,oe,we,Ee,y.depth,0,_e,te,null):t.texImage2D(K,ge,oe,we,Ee,0,_e,te,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),pe(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,K,Ve.__webglTexture,0,xe(y)):(K===n.TEXTURE_2D||K>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,K,Ve.__webglTexture,ge),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(P,y,z){if(n.bindRenderbuffer(n.RENDERBUFFER,P),y.depthBuffer){let q=y.depthTexture,K=q&&q.isDepthTexture?q.type:null,ge=S(y.stencilBuffer,K),_e=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;pe(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xe(y),ge,y.width,y.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,xe(y),ge,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,ge,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,_e,n.RENDERBUFFER,P)}else{let q=y.textures;for(let K=0;K<q.length;K++){let ge=q[K],_e=s.convert(ge.format,ge.colorSpace),te=s.convert(ge.type),oe=x(ge.internalFormat,_e,te,ge.normalized,ge.colorSpace);pe(y)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xe(y),oe,y.width,y.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,xe(y),oe,y.width,y.height):n.renderbufferStorage(n.RENDERBUFFER,oe,y.width,y.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function tt(P,y,z){let q=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let K=i.get(y.depthTexture);if(K.__renderTarget=y,(!K.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),q){if(K.__webglInit===void 0&&(K.__webglInit=!0,y.depthTexture.addEventListener("dispose",A)),K.__webglTexture===void 0){K.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,K.__webglTexture),he(n.TEXTURE_CUBE_MAP,y.depthTexture);let ve=s.convert(y.depthTexture.format),Ve=s.convert(y.depthTexture.type),we;y.depthTexture.format===jn?we=n.DEPTH_COMPONENT24:y.depthTexture.format===Yi&&(we=n.DEPTH24_STENCIL8);for(let Ee=0;Ee<6;Ee++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,we,y.width,y.height,0,ve,Ve,null)}}else se(y.depthTexture,0);let ge=K.__webglTexture,_e=xe(y),te=q?n.TEXTURE_CUBE_MAP_POSITIVE_X+z:n.TEXTURE_2D,oe=y.depthTexture.format===Yi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(y.depthTexture.format===jn)pe(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,oe,te,ge,0,_e):n.framebufferTexture2D(n.FRAMEBUFFER,oe,te,ge,0);else if(y.depthTexture.format===Yi)pe(y)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,oe,te,ge,0,_e):n.framebufferTexture2D(n.FRAMEBUFFER,oe,te,ge,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(P){let y=i.get(P),z=P.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==P.depthTexture){let q=P.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),q){let K=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,q.removeEventListener("dispose",K)};q.addEventListener("dispose",K),y.__depthDisposeCallback=K}y.__boundDepthTexture=q}if(P.depthTexture&&!y.__autoAllocateDepthBuffer)if(z)for(let q=0;q<6;q++)tt(y.__webglFramebuffer[q],P,q);else{let q=P.texture.mipmaps;q&&q.length>0?tt(y.__webglFramebuffer[0],P,0):tt(y.__webglFramebuffer,P,0)}else if(z){y.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[q]),y.__webglDepthbuffer[q]===void 0)y.__webglDepthbuffer[q]=n.createRenderbuffer(),De(y.__webglDepthbuffer[q],P,!1);else{let K=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ge=y.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,ge),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,ge)}}else{let q=P.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=n.createRenderbuffer(),De(y.__webglDepthbuffer,P,!1);else{let K=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ge=y.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ge),n.framebufferRenderbuffer(n.FRAMEBUFFER,K,n.RENDERBUFFER,ge)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function G(P,y,z){let q=i.get(P);y!==void 0&&me(q.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&ie(P)}function N(P){let y=P.texture,z=i.get(P),q=i.get(y);P.addEventListener("dispose",v);let K=P.textures,ge=P.isWebGLCubeRenderTarget===!0,_e=K.length>1;if(_e||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=y.version,o.memory.textures++),ge){z.__webglFramebuffer=[];for(let te=0;te<6;te++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[te]=[];for(let oe=0;oe<y.mipmaps.length;oe++)z.__webglFramebuffer[te][oe]=n.createFramebuffer()}else z.__webglFramebuffer[te]=n.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let te=0;te<y.mipmaps.length;te++)z.__webglFramebuffer[te]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(_e)for(let te=0,oe=K.length;te<oe;te++){let ve=i.get(K[te]);ve.__webglTexture===void 0&&(ve.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&pe(P)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let te=0;te<K.length;te++){let oe=K[te];z.__webglColorRenderbuffer[te]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[te]);let ve=s.convert(oe.format,oe.colorSpace),Ve=s.convert(oe.type),we=x(oe.internalFormat,ve,Ve,oe.normalized,oe.colorSpace,P.isXRRenderTarget===!0),Ee=xe(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ee,we,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+te,n.RENDERBUFFER,z.__webglColorRenderbuffer[te])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),De(z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ge){t.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),he(n.TEXTURE_CUBE_MAP,y);for(let te=0;te<6;te++)if(y.mipmaps&&y.mipmaps.length>0)for(let oe=0;oe<y.mipmaps.length;oe++)me(z.__webglFramebuffer[te][oe],P,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,oe);else me(z.__webglFramebuffer[te],P,y,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);g(y)&&M(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(_e){for(let te=0,oe=K.length;te<oe;te++){let ve=K[te],Ve=i.get(ve),we=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(we=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(we,Ve.__webglTexture),he(we,ve),me(z.__webglFramebuffer,P,ve,n.COLOR_ATTACHMENT0+te,we,0),g(ve)&&M(we)}t.unbindTexture()}else{let te=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(te=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(te,q.__webglTexture),he(te,y),y.mipmaps&&y.mipmaps.length>0)for(let oe=0;oe<y.mipmaps.length;oe++)me(z.__webglFramebuffer[oe],P,y,n.COLOR_ATTACHMENT0,te,oe);else me(z.__webglFramebuffer,P,y,n.COLOR_ATTACHMENT0,te,0);g(y)&&M(te),t.unbindTexture()}P.depthBuffer&&ie(P)}function O(P){let y=P.textures;for(let z=0,q=y.length;z<q;z++){let K=y[z];if(g(K)){let ge=T(P),_e=i.get(K).__webglTexture;t.bindTexture(ge,_e),M(ge),t.unbindTexture()}}}let k=[],ue=[];function de(P){if(P.samples>0){if(pe(P)===!1){let y=P.textures,z=P.width,q=P.height,K=n.COLOR_BUFFER_BIT,ge=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_e=i.get(P),te=y.length>1;if(te)for(let ve=0;ve<y.length;ve++)t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,_e.__webglMultisampledFramebuffer);let oe=P.texture.mipmaps;oe&&oe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglFramebuffer);for(let ve=0;ve<y.length;ve++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(K|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(K|=n.STENCIL_BUFFER_BIT)),te){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,_e.__webglColorRenderbuffer[ve]);let Ve=i.get(y[ve]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ve,0)}n.blitFramebuffer(0,0,z,q,0,0,z,q,K,n.NEAREST),l===!0&&(k.length=0,ue.length=0,k.push(n.COLOR_ATTACHMENT0+ve),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(k.push(ge),ue.push(ge),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ue)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,k))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),te)for(let ve=0;ve<y.length;ve++){t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.RENDERBUFFER,_e.__webglColorRenderbuffer[ve]);let Ve=i.get(y[ve]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,_e.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ve,n.TEXTURE_2D,Ve,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,_e.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){let y=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[y])}}}function xe(P){return Math.min(r.maxSamples,P.samples)}function pe(P){let y=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function I(P){let y=o.render.frame;u.get(P)!==y&&(u.set(P,y),P.update())}function Xe(P,y){let z=P.colorSpace,q=P.format,K=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||z!==an&&z!==Ci&&(st.getTransfer(z)===_t?(q!==En||K!==en)&&ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",z)),y}function Ze(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=H,this.getTextureUnits=U,this.setTextureUnits=V,this.setTexture2D=se,this.setTexture2DArray=$,this.setTexture3D=j,this.setTextureCube=ee,this.rebindTextures=G,this.setupRenderTarget=N,this.updateRenderTargetMipmap=O,this.updateMultisampleRenderTarget=de,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=me,this.useMultisampledRTT=pe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function VM(n,e){function t(i,r=Ci){let s,o=st.getTransfer(r);if(i===en)return n.UNSIGNED_BYTE;if(i===Nl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ul)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ju)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Qu)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===$u)return n.BYTE;if(i===Ku)return n.SHORT;if(i===Es)return n.UNSIGNED_SHORT;if(i===Ll)return n.INT;if(i===qn)return n.UNSIGNED_INT;if(i===Mn)return n.FLOAT;if(i===Sn)return n.HALF_FLOAT;if(i===eh)return n.ALPHA;if(i===th)return n.RGB;if(i===En)return n.RGBA;if(i===jn)return n.DEPTH_COMPONENT;if(i===Yi)return n.DEPTH_STENCIL;if(i===Dl)return n.RED;if(i===Ol)return n.RED_INTEGER;if(i===Zi)return n.RG;if(i===Fl)return n.RG_INTEGER;if(i===Bl)return n.RGBA_INTEGER;if(i===zo||i===Go||i===ko||i===Wo)if(o===_t)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===zo)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Go)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ko)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Wo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===zo)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Go)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ko)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Wo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Hl||i===Vl||i===zl||i===Gl)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Hl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Vl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===zl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Gl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===kl||i===Wl||i===Xl||i===ql||i===Yl||i===Xo||i===Zl)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===kl||i===Wl)return o===_t?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Xl)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===ql)return s.COMPRESSED_R11_EAC;if(i===Yl)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Xo)return s.COMPRESSED_RG11_EAC;if(i===Zl)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Jl||i===$l||i===Kl||i===jl||i===Ql||i===ec||i===tc||i===nc||i===ic||i===rc||i===sc||i===oc||i===ac||i===lc)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Jl)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===$l)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Kl)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===jl)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ql)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ec)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===tc)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===nc)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ic)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===rc)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===sc)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===oc)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ac)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===lc)return o===_t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===cc||i===uc||i===hc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===cc)return o===_t?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===uc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===hc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===dc||i===fc||i===qo||i===pc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===dc)return s.COMPRESSED_RED_RGTC1_EXT;if(i===fc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===qo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===pc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===bs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var zM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,GM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ph=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new yo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new Zt({vertexShader:zM,fragmentShader:GM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ct(new Nt(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ih=class extends Qn{constructor(e,t){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,m=null,_=typeof XRWebGLBinding<"u",p=new Ph,g={},M=t.getContextAttributes(),T=null,x=null,S=[],E=[],A=new ce,v=null,w=null,C=new Bt;C.viewport=new vt;let L=new Bt;L.viewport=new vt;let D=[C,L],H=new wl,U=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let ne=S[X];return ne===void 0&&(ne=new os,S[X]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(X){let ne=S[X];return ne===void 0&&(ne=new os,S[X]=ne),ne.getGripSpace()},this.getHand=function(X){let ne=S[X];return ne===void 0&&(ne=new os,S[X]=ne),ne.getHandSpace()};function W(X){let ne=E.indexOf(X.inputSource);if(ne===-1)return;let fe=S[ne];fe!==void 0&&(fe.update(X.inputSource,X.frame,c||o),fe.dispatchEvent({type:X.type,data:X.inputSource}))}function J(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",J),r.removeEventListener("inputsourceschange",se);for(let X=0;X<S.length;X++){let ne=E[X];ne!==null&&(E[X]=null,S[X].disconnect(ne))}U=null,V=null,p.reset();for(let X in g)delete g[X];if(e.setRenderTarget(T),f=null,d=null,h=null,r=null,x=null,Re.stop(),i.isPresenting=!1,e.setPixelRatio(v),e.setSize(A.width,A.height,!1),w!==null){let X=w.camera;X.fov=w.fov,X.zoom=w.zoom,X.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,i.isPresenting===!0&&ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(T=e.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",J),r.addEventListener("inputsourceschange",se),M.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,Le=null,me=null;M.depth&&(me=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=M.stencil?Yi:jn,Le=M.stencil?bs:qn);let De={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(De),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Qt(d.textureWidth,d.textureHeight,{format:En,type:en,depthTexture:new zi(d.textureWidth,d.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let fe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,fe),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Qt(f.framebufferWidth,f.framebufferHeight,{format:En,type:en,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Re.setContext(r),Re.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function se(X){for(let ne=0;ne<X.removed.length;ne++){let fe=X.removed[ne],Le=E.indexOf(fe);Le>=0&&(E[Le]=null,S[Le].disconnect(fe))}for(let ne=0;ne<X.added.length;ne++){let fe=X.added[ne],Le=E.indexOf(fe);if(Le===-1){for(let De=0;De<S.length;De++)if(De>=E.length){E.push(fe),Le=De;break}else if(E[De]===null){E[De]=fe,Le=De;break}if(Le===-1)break}let me=S[Le];me&&me.connect(fe)}}let $=new R,j=new R;function ee(X,ne,fe){$.setFromMatrixPosition(ne.matrixWorld),j.setFromMatrixPosition(fe.matrixWorld);let Le=$.distanceTo(j),me=ne.projectionMatrix.elements,De=fe.projectionMatrix.elements,tt=me[14]/(me[10]-1),ie=me[14]/(me[10]+1),G=(me[9]+1)/me[5],N=(me[9]-1)/me[5],O=(me[8]-1)/me[0],k=(De[8]+1)/De[0],ue=tt*O,de=tt*k,xe=Le/(-O+k),pe=xe*-O;if(ne.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(pe),X.translateZ(xe),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),me[10]===-1)X.projectionMatrix.copy(ne.projectionMatrix),X.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let I=tt+xe,Xe=ie+xe,Ze=ue-pe,P=de+(Le-pe),y=G*ie/Xe*I,z=N*ie/Xe*I;X.projectionMatrix.makePerspective(Ze,P,y,z,I,Xe),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function Ie(X,ne){ne===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(ne.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let ne=X.near,fe=X.far;p.texture!==null&&(p.depthNear>0&&(ne=p.depthNear),p.depthFar>0&&(fe=p.depthFar)),H.near=L.near=C.near=ne,H.far=L.far=C.far=fe,(U!==H.near||V!==H.far)&&(r.updateRenderState({depthNear:H.near,depthFar:H.far}),U=H.near,V=H.far),H.layers.mask=X.layers.mask|6,C.layers.mask=H.layers.mask&-5,L.layers.mask=H.layers.mask&-3;let Le=X.parent,me=H.cameras;Ie(H,Le);for(let De=0;De<me.length;De++)Ie(me[De],Le);me.length===2?ee(H,C,L):H.projectionMatrix.copy(C.projectionMatrix),w===null&&X.isPerspectiveCamera&&(w={camera:X,fov:X.fov,zoom:X.zoom}),Te(X,H,Le)};function Te(X,ne,fe){fe===null?X.matrix.copy(ne.matrixWorld):(X.matrix.copy(fe.matrixWorld),X.matrix.invert(),X.matrix.multiply(ne.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(ne.projectionMatrix),X.projectionMatrixInverse.copy(ne.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=lr*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(H)},this.getCameraTexture=function(X){return g[X]};let ae=null;function he(X,ne){if(u=ne.getViewerPose(c||o),m=ne,u!==null){let fe=u.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Le=!1;fe.length!==H.cameras.length&&(H.cameras.length=0,Le=!0);for(let ie=0;ie<fe.length;ie++){let G=fe[ie],N=null;if(f!==null)N=f.getViewport(G);else{let k=h.getViewSubImage(d,G);N=k.viewport,ie===0&&(e.setRenderTargetTextures(x,k.colorTexture,k.depthStencilTexture),e.setRenderTarget(x))}let O=D[ie];O===void 0&&(O=new Bt,O.layers.enable(ie),O.viewport=new vt,D[ie]=O),O.matrix.fromArray(G.transform.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale),O.projectionMatrix.fromArray(G.projectionMatrix),O.projectionMatrixInverse.copy(O.projectionMatrix).invert(),O.viewport.set(N.x,N.y,N.width,N.height),ie===0&&(H.matrix.copy(O.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),Le===!0&&H.cameras.push(O)}let me=r.enabledFeatures;if(me&&me.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){h=i.getBinding();let ie=h.getDepthInformation(fe[0]);ie&&ie.isValid&&ie.texture&&p.init(ie,r.renderState)}if(me&&me.includes("camera-access")&&_){e.state.unbindTexture(),h=i.getBinding();for(let ie=0;ie<fe.length;ie++){let G=fe[ie].camera;if(G){let N=g[G];N||(N=new yo,g[G]=N);let O=h.getCameraImage(G);N.sourceTexture=O}}}}for(let fe=0;fe<S.length;fe++){let Le=E[fe],me=S[fe];Le!==null&&me!==void 0&&me.update(Le,ne,c||o)}ae&&ae(X,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),m=null}let Re=new Bp;Re.setAnimationLoop(he),this.setAnimationLoop=function(X){ae=X},this.dispose=function(){}}},kM=new He,Wp=new qe;Wp.set(-1,0,0,0,1,0,0,0,1);function WM(n,e){function t(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function i(p,g){g.color.getRGB(p.fogColor.value,lh(n)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function r(p,g,M,T,x){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(p,g):g.isMeshLambertMaterial?(s(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(p,g),h(p,g)):g.isMeshPhongMaterial?(s(p,g),u(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(p,g),d(p,g),g.isMeshPhysicalMaterial&&f(p,g,x)):g.isMeshMatcapMaterial?(s(p,g),m(p,g)):g.isMeshDepthMaterial?s(p,g):g.isMeshDistanceMaterial?(s(p,g),_(p,g)):g.isMeshNormalMaterial?s(p,g):g.isLineBasicMaterial?(o(p,g),g.isLineDashedMaterial&&a(p,g)):g.isPointsMaterial?l(p,g,M,T):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,t(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===zt&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,t(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===zt&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,t(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,t(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let M=e.get(g),T=M.envMap,x=M.envMapRotation;T&&(p.envMap.value=T,p.envMapRotation.value.setFromMatrix4(kM.makeRotationFromEuler(x)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Wp),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,p.aoMapTransform))}function o(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform))}function a(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,M,T){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*M,p.scale.value=T*.5,g.map&&(p.map.value=g.map,t(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,t(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,t(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function u(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function h(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function d(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,M){p.ior.value=g.ior,g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===zt&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function _(p,g){let M=e.get(g).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function XM(n,e,t,i){let r={},s={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){let E=S.program;i.uniformBlockBinding(x,E)}function c(x,S){let E=r[x.id];E===void 0&&(p(x),E=u(x),r[x.id]=E,x.addEventListener("dispose",M));let A=S.program;i.updateUBOMapping(x,A);let v=e.render.frame;s[x.id]!==v&&(d(x),s[x.id]=v)}function u(x){let S=h();x.__bindingPointIndex=S;let E=n.createBuffer(),A=x.__size,v=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,A,v),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,E),E}function h(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return $e("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){let S=r[x.id],E=x.uniforms,A=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let v=0,w=E.length;v<w;v++){let C=E[v];if(Array.isArray(C))for(let L=0,D=C.length;L<D;L++)f(C[L],v,L,A);else f(C,v,0,A)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(x,S,E,A){if(_(x,S,E,A)===!0){let v=x.__offset,w=x.value;if(Array.isArray(w)){let C=0;for(let L=0;L<w.length;L++){let D=w[L],H=g(D);m(D,x.__data,C),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(C+=H.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(w,x.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,v,x.__data)}}function m(x,S,E){typeof x=="number"||typeof x=="boolean"?S[0]=x:x.isMatrix3?(S[0]=x.elements[0],S[1]=x.elements[1],S[2]=x.elements[2],S[3]=0,S[4]=x.elements[3],S[5]=x.elements[4],S[6]=x.elements[5],S[7]=0,S[8]=x.elements[6],S[9]=x.elements[7],S[10]=x.elements[8],S[11]=0):ArrayBuffer.isView(x)?S.set(new x.constructor(x.buffer,x.byteOffset,S.length)):x.toArray(S,E)}function _(x,S,E,A){let v=x.value,w=S+"_"+E;if(A[w]===void 0)return typeof v=="number"||typeof v=="boolean"?A[w]=v:ArrayBuffer.isView(v)?A[w]=v.slice():A[w]=v.clone(),!0;{let C=A[w];if(typeof v=="number"||typeof v=="boolean"){if(C!==v)return A[w]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(C.equals(v)===!1)return C.copy(v),!0}}return!1}function p(x){let S=x.uniforms,E=0,A=16;for(let w=0,C=S.length;w<C;w++){let L=Array.isArray(S[w])?S[w]:[S[w]];for(let D=0,H=L.length;D<H;D++){let U=L[D],V=Array.isArray(U.value)?U.value:[U.value];for(let W=0,J=V.length;W<J;W++){let se=V[W],$=g(se),j=E%A,ee=j%$.boundary,Ie=j+ee;E+=ee,Ie!==0&&A-Ie<$.storage&&(E+=A-Ie),U.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=E,E+=$.storage}}}let v=E%A;return v>0&&(E+=A-v),x.__size=E,x.__cache={},this}function g(x){let S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(S.boundary=16,S.storage=x.byteLength):ke("WebGLRenderer: Unsupported uniform value type.",x),S}function M(x){let S=x.target;S.removeEventListener("dispose",M);let E=o.indexOf(S.__bindingPointIndex);o.splice(E,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function T(){for(let x in r)n.deleteBuffer(r[x]);o=[],r={},s={}}return{bind:l,update:c,dispose:T}}var qM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ai=null;function YM(){return ai===null&&(ai=new cs(qM,16,16,Zi,Sn),ai.name="DFG_LUT",ai.minFilter=Rt,ai.magFilter=Rt,ai.wrapS=An,ai.wrapT=An,ai.generateMipmaps=!1,ai.needsUpdate=!0),ai}var Sc=class{constructor(e={}){let{canvas:t=sp(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=en}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=o;let _=f,p=new Set([Bl,Fl,Ol]),g=new Set([en,qn,Es,bs,Nl,Ul]),M=new Uint32Array(4),T=new Int32Array(4),x=new R,S=null,E=null,A=[],v=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,L=!1,D=null,H=null,U=null,V=null;this._outputColorSpace=At;let W=0,J=0,se=null,$=-1,j=null,ee=new vt,Ie=new vt,Te=null,ae=new Me(0),he=0,Re=t.width,X=t.height,ne=1,fe=null,Le=null,me=new vt(0,0,Re,X),De=new vt(0,0,Re,X),tt=!1,ie=new us,G=!1,N=!1,O=new He,k=new R,ue=new vt,de={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},xe=!1;function pe(){return se===null?ne:1}let I=i;function Xe(b,F){return t.getContext(b,F)}let Ze,P,y,z,q,K,ge,_e,te,oe,ve,Ve,we,Ee,ze,Je,et,B,ye,re,be,Ce,le;try{let b={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${kn}`),t.addEventListener("webglcontextlost",yt,!1),t.addEventListener("webglcontextrestored",ut,!1),t.addEventListener("webglcontextcreationerror",pn,!1),I===null){let F="webgl2";if(I=Xe(F,b),I===null)throw Xe(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}We()}catch(b){throw t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",pn,!1),$e("WebGLRenderer: "+b.message),b}function We(){Ze=new ey(I),Ze.init(),be=new VM(I,Ze),P=new Wv(I,Ze,e,be),y=new BM(I,Ze),P.reversedDepthBuffer&&d&&y.buffers.depth.setReversed(!0),H=I.createFramebuffer(),U=I.createFramebuffer(),V=I.createFramebuffer(),z=new iy(I),q=new bM,K=new HM(I,Ze,y,q,P,be,z),ge=new Qv(C),_e=new s_(I),Ce=new Gv(I,_e),te=new ty(I,_e,z,Ce),oe=new sy(I,te,_e,Ce,z),B=new ry(I,P,K),ze=new Xv(q),ve=new EM(C,ge,Ze,P,Ce,ze),Ve=new WM(C,q),we=new wM,Ee=new LM(Ze),et=new zv(C,ge,y,oe,m,l),Je=new FM(C,oe,P),le=new XM(I,z,P,y),ye=new kv(I,Ze,z),re=new ny(I,Ze,z),z.programs=ve.programs,C.capabilities=P,C.extensions=Ze,C.properties=q,C.renderLists=we,C.shadowMap=Je,C.state=y,C.info=z}_!==en&&(w=new ay(_,t.width,t.height,a,r,s));let Oe=new Ih(C,I);this.xr=Oe,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let b=Ze.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=Ze.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(b){b!==void 0&&(ne=b,this.setSize(Re,X,!1))},this.getSize=function(b){return b.set(Re,X)},this.setSize=function(b,F,Q=!0){if(Oe.isPresenting){ke("WebGLRenderer: Can't change size while VR device is presenting.");return}Re=b,X=F,t.width=Math.floor(b*ne),t.height=Math.floor(F*ne),Q===!0&&(t.style.width=b+"px",t.style.height=F+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,b,F)},this.getDrawingBufferSize=function(b){return b.set(Re*ne,X*ne).floor()},this.setDrawingBufferSize=function(b,F,Q){Re=b,X=F,ne=Q,t.width=Math.floor(b*Q),t.height=Math.floor(F*Q),this.setViewport(0,0,b,F)},this.setEffects=function(b){if(_===en){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let F=0;F<b.length;F++)if(b[F].isOutputPass===!0){ke("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(ee)},this.getViewport=function(b){return b.copy(me)},this.setViewport=function(b,F,Q,Y){b.isVector4?me.set(b.x,b.y,b.z,b.w):me.set(b,F,Q,Y),y.viewport(ee.copy(me).multiplyScalar(ne).round())},this.getScissor=function(b){return b.copy(De)},this.setScissor=function(b,F,Q,Y){b.isVector4?De.set(b.x,b.y,b.z,b.w):De.set(b,F,Q,Y),y.scissor(Ie.copy(De).multiplyScalar(ne).round())},this.getScissorTest=function(){return tt},this.setScissorTest=function(b){y.setScissorTest(tt=b)},this.setOpaqueSort=function(b){fe=b},this.setTransparentSort=function(b){Le=b},this.getClearColor=function(b){return b.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(b=!0,F=!0,Q=!0){let Y=0;if(b){let Z=!1;if(se!==null){let Pe=se.texture.format;Z=p.has(Pe)}if(Z){let Pe=se.texture.type,Ue=g.has(Pe),Ae=et.getClearColor(),Fe=et.getClearAlpha(),Ge=Ae.r,it=Ae.g,lt=Ae.b;Ue?(M[0]=Ge,M[1]=it,M[2]=lt,M[3]=Fe,I.clearBufferuiv(I.COLOR,0,M)):(T[0]=Ge,T[1]=it,T[2]=lt,T[3]=Fe,I.clearBufferiv(I.COLOR,0,T))}else Y|=I.COLOR_BUFFER_BIT}F&&(Y|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&(Y|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&I.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),D=b},this.dispose=function(){t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",ut,!1),t.removeEventListener("webglcontextcreationerror",pn,!1),et.dispose(),we.dispose(),Ee.dispose(),q.dispose(),ge.dispose(),oe.dispose(),Ce.dispose(),le.dispose(),ve.dispose(),Oe.dispose(),Oe.removeEventListener("sessionstart",fa),Oe.removeEventListener("sessionend",pa),Pi.stop()};function yt(b){b.preventDefault(),co("WebGLRenderer: Context Lost."),L=!0}function ut(){co("WebGLRenderer: Context Restored."),L=!1;let b=z.autoReset,F=Je.enabled,Q=Je.autoUpdate,Y=Je.needsUpdate,Z=Je.type;We(),z.autoReset=b,Je.enabled=F,Je.autoUpdate=Q,Je.needsUpdate=Y,Je.type=Z}function pn(b){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function bn(b){let F=b.target;F.removeEventListener("dispose",bn),Gc(F)}function Gc(b){kc(b),q.remove(b)}function kc(b){let F=q.get(b).programs;F!==void 0&&(F.forEach(function(Q){ve.releaseProgram(Q)}),b.isShaderMaterial&&ve.releaseShaderCache(b))}this.renderBufferDirect=function(b,F,Q,Y,Z,Pe){F===null&&(F=de);let Ue=Z.isMesh&&Z.matrixWorld.determinantAffine()<0,Ae=Eg(b,F,Q,Y,Z);y.setMaterial(Y,Ue);let Fe=Q.index,Ge=1;if(Y.wireframe===!0){if(Fe=te.getWireframeAttribute(Q),Fe===void 0)return;Ge=2}let it=Q.drawRange,lt=Q.attributes.position,Be=it.start*Ge,gt=(it.start+it.count)*Ge;Pe!==null&&(Be=Math.max(Be,Pe.start*Ge),gt=Math.min(gt,(Pe.start+Pe.count)*Ge)),Fe!==null?(Be=Math.max(Be,0),gt=Math.min(gt,Fe.count)):lt!=null&&(Be=Math.max(Be,0),gt=Math.min(gt,lt.count));let Ot=gt-Be;if(Ot<0||Ot===1/0)return;Ce.setup(Z,Y,Ae,Q,Fe);let wt,St=ye;if(Fe!==null&&(wt=_e.get(Fe),St=re,St.setIndex(wt)),Z.isMesh)Y.wireframe===!0?(y.setLineWidth(Y.wireframeLinewidth*pe()),St.setMode(I.LINES)):St.setMode(I.TRIANGLES);else if(Z.isLine){let $t=Y.linewidth;$t===void 0&&($t=1),y.setLineWidth($t*pe()),Z.isLineSegments?St.setMode(I.LINES):Z.isLineLoop?St.setMode(I.LINE_LOOP):St.setMode(I.LINE_STRIP)}else Z.isPoints?St.setMode(I.POINTS):Z.isSprite&&St.setMode(I.TRIANGLES);if(Z.isBatchedMesh)if(Ze.get("WEBGL_multi_draw"))St.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{let $t=Z._multiDrawStarts,Ne=Z._multiDrawCounts,nn=Z._multiDrawCount,ht=Fe?_e.get(Fe).bytesPerElement:1,Tn=q.get(Y).currentProgram.getUniforms();for(let Zn=0;Zn<nn;Zn++)Tn.setValue(I,"_gl_DrawID",Zn),St.render($t[Zn]/ht,Ne[Zn])}else if(Z.isInstancedMesh)St.renderInstances(Be,Ot,Z.count);else if(Q.isInstancedBufferGeometry){let $t=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Ne=Math.min(Q.instanceCount,$t);St.renderInstances(Be,Ot,Ne)}else St.render(Be,Ot)};function ha(b,F,Q,Y){D!==null&&b.isNodeMaterial&&D.setObject(Y,b),G===!0&&ze.setState(b,Q,!1),b.transparent===!0&&b.side===Ut&&b.forceSinglePass===!1?(b.side=zt,b.needsUpdate=!0,Lr(b,F,Y),b.side=si,b.needsUpdate=!0,Lr(b,F,Y),b.side=Ut):Lr(b,F,Y)}this.compile=function(b,F,Q=null){Q===null&&(Q=b),D!==null&&D.renderStart(b,F,Q),E=Ee.get(Q),E.init(F),v.push(E),Q.traverseVisible(function(Z){Z.isLight&&Z.layers.test(F.layers)&&(E.pushLight(Z),Z.castShadow&&E.pushShadow(Z))}),b!==Q&&b.traverseVisible(function(Z){Z.isLight&&Z.layers.test(F.layers)&&(E.pushLight(Z),Z.castShadow&&E.pushShadow(Z))}),E.setupLights(),D!==null&&D.updateLights(E.state.lightsArray),N=this.localClippingEnabled,G=ze.init(this.clippingPlanes,N),G===!0&&ze.setGlobalState(this.clippingPlanes,F),D!==null&&Je.render(E.state.shadowsArray,Q,F);let Y=new Set;return b.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;let Pe=Z.material;if(Pe)if(Array.isArray(Pe))for(let Ue=0;Ue<Pe.length;Ue++){let Ae=Pe[Ue];ha(Ae,Q,F,Z),Y.add(Ae)}else ha(Pe,Q,F,Z),Y.add(Pe)}),E=v.pop(),D!==null&&D.renderEnd(),Y},this.compileAsync=function(b,F,Q=null){let Y=this.compile(b,F,Q);return new Promise(Z=>{function Pe(){if(Y.forEach(function(Ue){let Fe=q.get(Ue).currentProgram;(Fe===void 0||Fe.isReady())&&Y.delete(Ue)}),Y.size===0){Z(b);return}setTimeout(Pe,10)}Ze.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let Qi=null;function da(b){Qi&&Qi(b)}function fa(){Pi.stop()}function pa(){Pi.start()}let Pi=new Bp;Pi.setAnimationLoop(da),typeof self<"u"&&Pi.setContext(self),this.setAnimationLoop=function(b){Qi=b,Oe.setAnimationLoop(b),b===null?Pi.stop():Pi.start()},Oe.addEventListener("sessionstart",fa),Oe.addEventListener("sessionend",pa),this.render=function(b,F){if(F!==void 0&&F.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;D!==null&&D.renderStart(b,F);let Q=Oe.enabled===!0&&Oe.isPresenting===!0,Y=w!==null&&(se===null||Q)&&w.begin(C,se);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Oe.enabled===!0&&Oe.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Oe.cameraAutoUpdate===!0&&Oe.updateCamera(F),F=Oe.getCamera()),b.isScene===!0&&b.onBeforeRender(C,b,F,se),E=Ee.get(b,v.length),E.init(F),E.state.textureUnits=K.getTextureUnits(),v.push(E),O.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),ie.setFromProjectionMatrix(O,Bn,F.reversedDepth),N=this.localClippingEnabled,G=ze.init(this.clippingPlanes,N),S=we.get(b,A.length),S.init(),A.push(S),Oe.enabled===!0&&Oe.isPresenting===!0){let Ue=C.xr.getDepthSensingMesh();Ue!==null&&ks(Ue,F,-1/0,C.sortObjects)}ks(b,F,0,C.sortObjects),S.finish(),D!==null&&D.updateLights(E.state.lightsArray),C.sortObjects===!0&&S.sort(fe,Le),xe=Oe.enabled===!1||Oe.isPresenting===!1||Oe.hasDepthSensing()===!1,xe&&et.addToRenderList(S,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),G===!0&&ze.beginShadows();let Z=E.state.shadowsArray;if(Je.render(Z,b,F),G===!0&&ze.endShadows(),(Y&&w.hasRenderPass())===!1){let Ue=S.opaque,Ae=S.transmissive;if(E.setupLights(),F.isArrayCamera){let Fe=F.cameras;if(Ae.length>0)for(let Ge=0,it=Fe.length;Ge<it;Ge++){let lt=Fe[Ge];ma(Ue,Ae,b,lt)}xe&&et.render(b);for(let Ge=0,it=Fe.length;Ge<it;Ge++){let lt=Fe[Ge];Ws(S,b,lt,lt.viewport)}}else Ae.length>0&&ma(Ue,Ae,b,F),xe&&et.render(b),Ws(S,b,F)}se!==null&&J===0&&(K.updateMultisampleRenderTarget(se),K.updateRenderTargetMipmap(se)),Y&&w.end(C),b.isScene===!0&&b.onAfterRender(C,b,F),Ce.resetDefaultState(),$=-1,j=null,v.pop(),v.length>0?(E=v[v.length-1],K.setTextureUnits(E.state.textureUnits),G===!0&&ze.setGlobalState(C.clippingPlanes,E.state.camera)):E=null,A.pop(),A.length>0?S=A[A.length-1]:S=null,D!==null&&D.renderEnd()};function ks(b,F,Q,Y){if(b.visible===!1)return;if(b.layers.test(F.layers)){if(b.isGroup)Q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(F);else if(b.isLightProbeGrid)E.pushLightProbeGrid(b);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(ie)){Y&&ue.setFromMatrixPosition(b.matrixWorld).applyMatrix4(O);let Ue=oe.update(b),Ae=b.material;Ae.visible&&S.push(b,Ue,Ae,Q,ue.z,null,F)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(ie))){let Ue=oe.update(b),Ae=b.material;if(Y&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ue.copy(b.boundingSphere.center)):(Ue.boundingSphere===null&&Ue.computeBoundingSphere(),ue.copy(Ue.boundingSphere.center)),ue.applyMatrix4(b.matrixWorld).applyMatrix4(O)),Array.isArray(Ae)){let Fe=Ue.groups;for(let Ge=0,it=Fe.length;Ge<it;Ge++){let lt=Fe[Ge],Be=Ae[lt.materialIndex];Be&&Be.visible&&S.push(b,Ue,Be,Q,ue.z,lt,F)}}else Ae.visible&&S.push(b,Ue,Ae,Q,ue.z,null,F)}}let Pe=b.children;for(let Ue=0,Ae=Pe.length;Ue<Ae;Ue++)ks(Pe[Ue],F,Q,Y)}function Ws(b,F,Q,Y){let{opaque:Z,transmissive:Pe,transparent:Ue}=b;E.setupLightsView(Q),G===!0&&ze.setGlobalState(C.clippingPlanes,Q),Y&&y.viewport(ee.copy(Y)),Z.length>0&&Ir(Z,F,Q),Pe.length>0&&Ir(Pe,F,Q),Ue.length>0&&Ir(Ue,F,Q),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function ma(b,F,Q,Y){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[Y.id]===void 0){let Be=Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[Y.id]=new Qt(1,1,{generateMipmaps:!0,type:Be?Sn:en,minFilter:Xn,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:st.workingColorSpace})}let Pe=E.state.transmissionRenderTarget[Y.id],Ue=Y.viewport||ee;Pe.setSize(Ue.z*C.transmissionResolutionScale,Ue.w*C.transmissionResolutionScale);let Ae=C.getRenderTarget(),Fe=C.getActiveCubeFace(),Ge=C.getActiveMipmapLevel();C.setRenderTarget(Pe),C.getClearColor(ae),he=C.getClearAlpha(),he<1&&C.setClearColor(16777215,.5),C.clear(),xe&&et.render(Q);let it=C.toneMapping;C.toneMapping=Wn;let lt=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),E.setupLightsView(Y),G===!0&&ze.setGlobalState(C.clippingPlanes,Y),Ir(b,Q,Y),K.updateMultisampleRenderTarget(Pe),K.updateRenderTargetMipmap(Pe),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let gt=0,Ot=F.length;gt<Ot;gt++){let wt=F[gt],{object:St,geometry:$t,material:Ne,group:nn}=wt;if(Ne.side===Ut&&St.layers.test(Y.layers)){let ht=Ne.side;Ne.side=zt,Ne.needsUpdate=!0,er(St,Q,Y,$t,Ne,nn),Ne.side=ht,Ne.needsUpdate=!0,Be=!0}}Be===!0&&(K.updateMultisampleRenderTarget(Pe),K.updateRenderTargetMipmap(Pe))}C.setRenderTarget(Ae,Fe,Ge),C.setClearColor(ae,he),lt!==void 0&&(Y.viewport=lt),C.toneMapping=it}function Ir(b,F,Q){let Y=F.isScene===!0?F.overrideMaterial:null;for(let Z=0,Pe=b.length;Z<Pe;Z++){let Ue=b[Z],{object:Ae,geometry:Fe,group:Ge}=Ue,it=Ue.material;it.allowOverride===!0&&Y!==null&&(it=Y),Ae.layers.test(Q.layers)&&er(Ae,F,Q,Fe,it,Ge)}}function er(b,F,Q,Y,Z,Pe){D!==null&&Z.isNodeMaterial&&D.setObject(b,Z),b.onBeforeRender(C,F,Q,Y,Z,Pe),b.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),Z.onBeforeRender(C,F,Q,Y,b,Pe),Z.transparent===!0&&Z.side===Ut&&Z.forceSinglePass===!1?(Z.side=zt,Z.needsUpdate=!0,C.renderBufferDirect(Q,F,Y,Z,b,Pe),Z.side=si,Z.needsUpdate=!0,C.renderBufferDirect(Q,F,Y,Z,b,Pe),Z.side=Ut):C.renderBufferDirect(Q,F,Y,Z,b,Pe),b.onAfterRender(C,F,Q,Y,Z,Pe)}function Lr(b,F,Q){F.isScene!==!0&&(F=de);let Y=q.get(b),Z=E.state.lights,Pe=E.state.shadowsArray,Ue=Z.state.version,Ae=ve.getParameters(b,Z.state,Pe,F,Q,E.state.lightProbeGridArray),Fe=ve.getProgramCacheKey(Ae),Ge=Y.programs;Y.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?F.environment:null,Y.fog=F.fog;let it=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;Y.envMap=ge.get(b.envMap||Y.environment,it),Y.envMapRotation=Y.environment!==null&&b.envMap===null?F.environmentRotation:b.envMapRotation,Ge===void 0&&(b.addEventListener("dispose",bn),Ge=new Map,Y.programs=Ge);let lt=Ge.get(Fe);if(lt!==void 0){if(Y.currentProgram===lt&&Y.lightsStateVersion===Ue)return Xs(b,Ae),lt}else Ae.uniforms=ve.getUniforms(b),D!==null&&b.isNodeMaterial&&D.build(b,Q,Ae),b.onBeforeCompile(Ae,C),lt=ve.acquireProgram(Ae,Fe),Ge.set(Fe,lt),Y.uniforms=Ae.uniforms;let Be=Y.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Be.clippingPlanes=ze.uniform),Xs(b,Ae),Y.needsLights=Tg(b),Y.lightsStateVersion=Ue,Y.needsLights&&(Be.ambientLightColor.value=Z.state.ambient,Be.lightProbe.value=Z.state.probe,Be.sunLights.value=Z.state.sun,Be.sunLightShadows.value=Z.state.sunShadow,Be.directionalLights.value=Z.state.directional,Be.directionalLightShadows.value=Z.state.directionalShadow,Be.spotLights.value=Z.state.spot,Be.spotLightShadows.value=Z.state.spotShadow,Be.rectAreaLights.value=Z.state.rectArea,Be.ltc_1.value=Z.state.rectAreaLTC1,Be.ltc_2.value=Z.state.rectAreaLTC2,Be.pointLights.value=Z.state.point,Be.pointLightShadows.value=Z.state.pointShadow,Be.hemisphereLights.value=Z.state.hemi,Be.sunShadowMatrix.value=Z.state.sunShadowMatrix,Be.sunShadowCascade.value=Z.state.sunShadowCascade,Be.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,Be.spotLightMatrix.value=Z.state.spotLightMatrix,Be.spotLightMap.value=Z.state.spotLightMap,Be.pointShadowMatrix.value=Z.state.pointShadowMatrix),Y.lightProbeGrid=E.state.lightProbeGridArray.length>0,Y.currentProgram=lt,Y.uniformsList=null,lt}function ga(b){if(b.uniformsList===null){let F=b.currentProgram.getUniforms();b.uniformsList=Rs.seqWithValue(F.seq,b.uniforms)}return b.uniformsList}function Xs(b,F){let Q=q.get(b);Q.outputColorSpace=F.outputColorSpace,Q.batching=F.batching,Q.batchingColor=F.batchingColor,Q.instancing=F.instancing,Q.instancingColor=F.instancingColor,Q.instancingMorph=F.instancingMorph,Q.skinning=F.skinning,Q.morphTargets=F.morphTargets,Q.morphNormals=F.morphNormals,Q.morphColors=F.morphColors,Q.morphTargetsCount=F.morphTargetsCount,Q.numClippingPlanes=F.numClippingPlanes,Q.numIntersection=F.numClipIntersection,Q.vertexAlphas=F.vertexAlphas,Q.vertexTangents=F.vertexTangents,Q.toneMapping=F.toneMapping}function Wc(b,F){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;x.setFromMatrixPosition(F.matrixWorld);for(let Q=0,Y=b.length;Q<Y;Q++){let Z=b[Q];if(Z.texture!==null&&Z.boundingBox.containsPoint(x))return Z}return null}function Eg(b,F,Q,Y,Z){F.isScene!==!0&&(F=de),K.resetTextureUnits();let Pe=F.fog,Ue=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?F.environment:null,Ae=se===null?C.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:st.workingColorSpace,Fe=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,Ge=ge.get(Y.envMap||Ue,Fe),it=Y.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,lt=!!Q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Be=!!Q.morphAttributes.position,gt=!!Q.morphAttributes.normal,Ot=!!Q.morphAttributes.color,wt=Wn;Y.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(wt=C.toneMapping);let St=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,$t=St!==void 0?St.length:0,Ne=q.get(Y),nn=E.state.lights;if(G===!0&&(N===!0||b!==j)){let bt=b===j&&Y.id===$;ze.setState(Y,b,bt)}let ht=!1;Y.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==nn.state.version||Ne.outputColorSpace!==Ae||Z.isBatchedMesh&&Ne.batching===!1||!Z.isBatchedMesh&&Ne.batching===!0||Z.isBatchedMesh&&Ne.batchingColor===!0&&Z._colorsTexture===null||Z.isBatchedMesh&&Ne.batchingColor===!1&&Z._colorsTexture!==null||Z.isInstancedMesh&&Ne.instancing===!1||!Z.isInstancedMesh&&Ne.instancing===!0||Z.isSkinnedMesh&&Ne.skinning===!1||!Z.isSkinnedMesh&&Ne.skinning===!0||Z.isInstancedMesh&&Ne.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Ne.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Ne.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Ne.instancingMorph===!1&&Z.morphTexture!==null||Ne.envMap!==Ge||Y.fog===!0&&Ne.fog!==Pe||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==ze.numPlanes||Ne.numIntersection!==ze.numIntersection)||Ne.vertexAlphas!==it||Ne.vertexTangents!==lt||Ne.morphTargets!==Be||Ne.morphNormals!==gt||Ne.morphColors!==Ot||Ne.toneMapping!==wt||Ne.morphTargetsCount!==$t||!!Ne.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ht=!0):(ht=!0,Ne.__version=Y.version);let Tn=Ne.currentProgram;ht===!0&&(Tn=Lr(Y,F,Z),D&&Y.isNodeMaterial&&D.onUpdateProgram(Y,Tn,Ne));let Zn=!1,Ii=!1,Nr=!1,Mt=Tn.getUniforms(),It=Ne.uniforms;if(y.useProgram(Tn.program)&&(Zn=!0,Ii=!0,Nr=!0),Y.id!==$&&($=Y.id,Ii=!0),Ne.needsLights){let bt=Wc(E.state.lightProbeGridArray,Z);Ne.lightProbeGrid!==bt&&(Ne.lightProbeGrid=bt,Ii=!0)}if(Zn||j!==b){y.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Mt.setValue(I,"projectionMatrix",b.projectionMatrix),Mt.setValue(I,"viewMatrix",b.matrixWorldInverse);let Ni=Mt.map.cameraPosition;Ni!==void 0&&Ni.setValue(I,k.setFromMatrixPosition(b.matrixWorld)),P.logarithmicDepthBuffer&&Mt.setValue(I,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Mt.setValue(I,"isOrthographic",b.isOrthographicCamera===!0),j!==b&&(j=b,Ii=!0,Nr=!0)}if(Ne.needsLights&&(nn.state.sunShadowMap.length>0&&Mt.setValue(I,"sunShadowMap",nn.state.sunShadowMap,K),nn.state.directionalShadowMap.length>0&&Mt.setValue(I,"directionalShadowMap",nn.state.directionalShadowMap,K),nn.state.spotShadowMap.length>0&&Mt.setValue(I,"spotShadowMap",nn.state.spotShadowMap,K),nn.state.pointShadowMap.length>0&&Mt.setValue(I,"pointShadowMap",nn.state.pointShadowMap,K)),Z.isSkinnedMesh){Mt.setOptional(I,Z,"bindMatrix"),Mt.setOptional(I,Z,"bindMatrixInverse");let bt=Z.skeleton;bt&&(bt.boneTexture===null&&bt.computeBoneTexture(),Mt.setValue(I,"boneTexture",bt.boneTexture,K))}Z.isBatchedMesh&&(Mt.setOptional(I,Z,"batchingTexture"),Mt.setValue(I,"batchingTexture",Z._matricesTexture,K),Mt.setOptional(I,Z,"batchingIdTexture"),Mt.setValue(I,"batchingIdTexture",Z._indirectTexture,K),Mt.setOptional(I,Z,"batchingColorTexture"),Z._colorsTexture!==null&&Mt.setValue(I,"batchingColorTexture",Z._colorsTexture,K));let Li=Q.morphAttributes;if((Li.position!==void 0||Li.normal!==void 0||Li.color!==void 0)&&B.update(Z,Q,Tn),(Ii||Ne.receiveShadow!==Z.receiveShadow)&&(Ne.receiveShadow=Z.receiveShadow,Mt.setValue(I,"receiveShadow",Z.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&F.environment!==null&&(It.envMapIntensity.value=F.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=YM()),Ii){if(Mt.setValue(I,"toneMappingExposure",C.toneMappingExposure),Ne.needsLights&&bg(It,Nr),Pe&&Y.fog===!0&&Ve.refreshFogUniforms(It,Pe),Ve.refreshMaterialUniforms(It,Y,ne,X,E.state.transmissionRenderTarget[b.id]),Ne.needsLights&&Ne.lightProbeGrid){let bt=Ne.lightProbeGrid;It.probesSH.value=bt.texture,It.probesMin.value.copy(bt.boundingBox.min),It.probesMax.value.copy(bt.boundingBox.max),It.probesResolution.value.copy(bt.resolution)}Rs.upload(I,ga(Ne),It,K)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Rs.upload(I,ga(Ne),It,K),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Mt.setValue(I,"center",Z.center),Mt.setValue(I,"modelViewMatrix",Z.modelViewMatrix),Mt.setValue(I,"normalMatrix",Z.normalMatrix),Mt.setValue(I,"modelMatrix",Z.matrixWorld),Y.uniformsGroups!==void 0){let bt=Y.uniformsGroups;for(let Ni=0,Ur=bt.length;Ni<Ur;Ni++){let Id=bt[Ni];le.update(Id,Tn),le.bind(Id,Tn)}}return Tn}function bg(b,F){b.ambientLightColor.needsUpdate=F,b.lightProbe.needsUpdate=F,b.sunLights.needsUpdate=F,b.sunLightShadows.needsUpdate=F,b.directionalLights.needsUpdate=F,b.directionalLightShadows.needsUpdate=F,b.pointLights.needsUpdate=F,b.pointLightShadows.needsUpdate=F,b.spotLights.needsUpdate=F,b.spotLightShadows.needsUpdate=F,b.rectAreaLights.needsUpdate=F,b.hemisphereLights.needsUpdate=F}function Tg(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return J},this.getRenderTarget=function(){return se},this.setRenderTargetTextures=function(b,F,Q){let Y=q.get(b);Y.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),q.get(b.texture).__webglTexture=F,q.get(b.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:Q,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,F){let Q=q.get(b);Q.__webglFramebuffer=F,Q.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(b,F=0,Q=0){se=b,W=F,J=Q;let Y=null,Z=!1,Pe=!1;if(b){let Ae=q.get(b);if(Ae.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(I.FRAMEBUFFER,Ae.__webglFramebuffer),ee.copy(b.viewport),Ie.copy(b.scissor),Te=b.scissorTest,y.viewport(ee),y.scissor(Ie),y.setScissorTest(Te),$=-1;return}else if(Ae.__webglFramebuffer===void 0)K.setupRenderTarget(b);else if(Ae.__hasExternalTextures)K.rebindTextures(b,q.get(b.texture).__webglTexture,q.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let it=b.depthTexture;if(Ae.__boundDepthTexture!==it){if(it!==null&&q.has(it)&&(b.width!==it.image.width||b.height!==it.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");K.setupDepthRenderbuffer(b)}}let Fe=b.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(Pe=!0);let Ge=q.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ge[F])?Y=Ge[F][Q]:Y=Ge[F],Z=!0):b.samples>0&&K.useMultisampledRTT(b)===!1?Y=q.get(b).__webglMultisampledFramebuffer:Array.isArray(Ge)?Y=Ge[Q]:Y=Ge,ee.copy(b.viewport),Ie.copy(b.scissor),Te=b.scissorTest}else ee.copy(me).multiplyScalar(ne).floor(),Ie.copy(De).multiplyScalar(ne).floor(),Te=tt;if(Q!==0&&(Y=H),y.bindFramebuffer(I.FRAMEBUFFER,Y)&&y.drawBuffers(b,Y),y.viewport(ee),y.scissor(Ie),y.setScissorTest(Te),Z){let Ae=q.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ae.__webglTexture,Q)}else if(Pe){let Ae=F;for(let Fe=0;Fe<b.textures.length;Fe++){let Ge=q.get(b.textures[Fe]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Fe,Ge.__webglTexture,Q,Ae)}}else if(b!==null&&Q!==0){let Ae=q.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ae.__webglTexture,Q)}$=-1};function Pd(b){let F=q.get(b);return(F.__readFormat!==b.format||F.__readType!==b.type)&&(F.__readFormat=b.format,F.__readType=b.type,F.__formatReadable=P.textureFormatReadable(b.format),F.__typeReadable=P.textureTypeReadable(b.type)),F}this.readRenderTargetPixels=function(b,F,Q,Y,Z,Pe,Ue,Ae=0){if(!(b&&b.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Fe=q.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ue!==void 0&&(Fe=Fe[Ue]),Fe){y.bindFramebuffer(I.FRAMEBUFFER,Fe);try{let Ge=b.textures[Ae],it=Ge.format,lt=Ge.type;b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ae);let Be=Pd(Ge);if(Be.__formatReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Be.__typeReadable===!1){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=b.width-Y&&Q>=0&&Q<=b.height-Z&&I.readPixels(F,Q,Y,Z,be.convert(it),be.convert(lt),Pe)}finally{let Ge=se!==null?q.get(se).__webglFramebuffer:null;y.bindFramebuffer(I.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(b,F,Q,Y,Z,Pe,Ue,Ae=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Fe=q.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ue!==void 0&&(Fe=Fe[Ue]),Fe)if(F>=0&&F<=b.width-Y&&Q>=0&&Q<=b.height-Z){y.bindFramebuffer(I.FRAMEBUFFER,Fe);let Ge=b.textures[Ae],it=Ge.format,lt=Ge.type;b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ae);let Be=Pd(Ge);if(Be.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Be.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let gt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,gt),I.bufferData(I.PIXEL_PACK_BUFFER,Pe.byteLength,I.STREAM_READ),I.readPixels(F,Q,Y,Z,be.convert(it),be.convert(lt),0),I.bindBuffer(I.PIXEL_PACK_BUFFER,null);let Ot=se!==null?q.get(se).__webglFramebuffer:null;y.bindFramebuffer(I.FRAMEBUFFER,Ot);let wt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await ap(I,wt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,gt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,Pe),I.bindBuffer(I.PIXEL_PACK_BUFFER,null),I.deleteBuffer(gt),I.deleteSync(wt),Pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,F=null,Q=0){let Y=Math.pow(2,-Q),Z=Math.floor(b.image.width*Y),Pe=Math.floor(b.image.height*Y),Ue=F!==null?F.x:0,Ae=F!==null?F.y:0;K.setTexture2D(b,0),I.copyTexSubImage2D(I.TEXTURE_2D,Q,0,0,Ue,Ae,Z,Pe),y.unbindTexture()},this.copyTextureToTexture=function(b,F,Q=null,Y=null,Z=0,Pe=0){let Ue,Ae,Fe,Ge,it,lt,Be,gt,Ot,wt=b.isCompressedTexture?b.mipmaps[Pe]:b.image;if(Q!==null)Ue=Q.max.x-Q.min.x,Ae=Q.max.y-Q.min.y,Fe=Q.isBox3?Q.max.z-Q.min.z:1,Ge=Q.min.x,it=Q.min.y,lt=Q.isBox3?Q.min.z:0;else{let It=Math.pow(2,-Z);Ue=Math.floor(wt.width*It),Ae=Math.floor(wt.height*It),b.isDataArrayTexture?Fe=wt.depth:b.isData3DTexture?Fe=Math.floor(wt.depth*It):Fe=1,Ge=0,it=0,lt=0}Y!==null?(Be=Y.x,gt=Y.y,Ot=Y.z):(Be=0,gt=0,Ot=0);let St=be.convert(F.format),$t=be.convert(F.type),Ne;F.isData3DTexture?(K.setTexture3D(F,0),Ne=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(K.setTexture2DArray(F,0),Ne=I.TEXTURE_2D_ARRAY):(K.setTexture2D(F,0),Ne=I.TEXTURE_2D),y.activeTexture(I.TEXTURE0),y.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),y.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),y.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);let nn=y.getParameter(I.UNPACK_ROW_LENGTH),ht=y.getParameter(I.UNPACK_IMAGE_HEIGHT),Tn=y.getParameter(I.UNPACK_SKIP_PIXELS),Zn=y.getParameter(I.UNPACK_SKIP_ROWS),Ii=y.getParameter(I.UNPACK_SKIP_IMAGES);y.pixelStorei(I.UNPACK_ROW_LENGTH,wt.width),y.pixelStorei(I.UNPACK_IMAGE_HEIGHT,wt.height),y.pixelStorei(I.UNPACK_SKIP_PIXELS,Ge),y.pixelStorei(I.UNPACK_SKIP_ROWS,it),y.pixelStorei(I.UNPACK_SKIP_IMAGES,lt);let Nr=b.isDataArrayTexture||b.isData3DTexture,Mt=F.isDataArrayTexture||F.isData3DTexture;if(b.isDepthTexture){let It=q.get(b),Li=q.get(F),bt=q.get(It.__renderTarget),Ni=q.get(Li.__renderTarget);y.bindFramebuffer(I.READ_FRAMEBUFFER,bt.__webglFramebuffer),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ni.__webglFramebuffer);for(let Ur=0;Ur<Fe;Ur++)Nr&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,q.get(b).__webglTexture,Z,lt+Ur),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,q.get(F).__webglTexture,Pe,Ot+Ur)),I.blitFramebuffer(Ge,it,Ue,Ae,Be,gt,Ue,Ae,I.DEPTH_BUFFER_BIT,I.NEAREST);y.bindFramebuffer(I.READ_FRAMEBUFFER,null),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(Z!==0||b.isRenderTargetTexture||q.has(b)){let It=q.get(b),Li=q.get(F);y.bindFramebuffer(I.READ_FRAMEBUFFER,U),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,V);for(let bt=0;bt<Fe;bt++)Nr?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,It.__webglTexture,Z,lt+bt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,It.__webglTexture,Z),Mt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Li.__webglTexture,Pe,Ot+bt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Li.__webglTexture,Pe),Z!==0?I.blitFramebuffer(Ge,it,Ue,Ae,Be,gt,Ue,Ae,I.COLOR_BUFFER_BIT,I.NEAREST):Mt?I.copyTexSubImage3D(Ne,Pe,Be,gt,Ot+bt,Ge,it,Ue,Ae):I.copyTexSubImage2D(Ne,Pe,Be,gt,Ge,it,Ue,Ae);y.bindFramebuffer(I.READ_FRAMEBUFFER,null),y.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Mt?b.isDataTexture||b.isData3DTexture?I.texSubImage3D(Ne,Pe,Be,gt,Ot,Ue,Ae,Fe,St,$t,wt.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(Ne,Pe,Be,gt,Ot,Ue,Ae,Fe,St,wt.data):I.texSubImage3D(Ne,Pe,Be,gt,Ot,Ue,Ae,Fe,St,$t,wt):b.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,Pe,Be,gt,Ue,Ae,St,$t,wt.data):b.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,Pe,Be,gt,wt.width,wt.height,St,wt.data):I.texSubImage2D(I.TEXTURE_2D,Pe,Be,gt,Ue,Ae,St,$t,wt);y.pixelStorei(I.UNPACK_ROW_LENGTH,nn),y.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ht),y.pixelStorei(I.UNPACK_SKIP_PIXELS,Tn),y.pixelStorei(I.UNPACK_SKIP_ROWS,Zn),y.pixelStorei(I.UNPACK_SKIP_IMAGES,Ii),Pe===0&&F.generateMipmaps&&I.generateMipmap(Ne),y.unbindTexture()},this.initRenderTarget=function(b){q.get(b).__webglFramebuffer===void 0&&K.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?K.setTextureCube(b,0):b.isData3DTexture?K.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?K.setTexture2DArray(b,0):K.setTexture2D(b,0),y.unbindTexture()},this.resetState=function(){W=0,J=0,se=null,y.reset(),Ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=st._getDrawingBufferColorSpace(e),t.unpackColorSpace=st._getUnpackColorSpace()}};function Lh(n,e){if(e===nh)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(e===Ts||e===Yo){let t=n.getIndex();if(t===null){let s=[],o=n.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)s.push(a);n.setIndex(s),t=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}let i=t.count-2,r=[];if(e===Ts)for(let s=1;s<=i;s++)r.push(t.getX(0)),r.push(t.getX(s)),r.push(t.getX(s+1));else for(let s=0;s<i;s++)s%2===0?(r.push(t.getX(s)),r.push(t.getX(s+1)),r.push(t.getX(s+2))):(r.push(t.getX(s+2)),r.push(t.getX(s+1)),r.push(t.getX(s)));return r.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),n.setIndex(r),n.clearGroups(),n}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),n}function Xp(n){let e=new Map,t=new Map,i=n.clone();return qp(n,i,function(r,s){e.set(s,r),t.set(r,s)}),i.traverse(function(r){if(!r.isSkinnedMesh)return;let s=r,o=e.get(r),a=o.skeleton.bones;s.skeleton=o.skeleton.clone(),s.bindMatrix.copy(o.bindMatrix),s.skeleton.bones=a.map(function(l){return t.get(l)}),s.bind(s.skeleton,s.bindMatrix)}),i}function qp(n,e,t){t(n,e);for(let i=0;i<n.children.length;i++)qp(n.children[i],e.children[i],t)}var Tc=class extends ni{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Hh(t)}),this.register(function(t){return new Vh(t)}),this.register(function(t){return new Jh(t)}),this.register(function(t){return new $h(t)}),this.register(function(t){return new Kh(t)}),this.register(function(t){return new Gh(t)}),this.register(function(t){return new kh(t)}),this.register(function(t){return new Wh(t)}),this.register(function(t){return new Xh(t)}),this.register(function(t){return new Bh(t)}),this.register(function(t){return new qh(t)}),this.register(function(t){return new zh(t)}),this.register(function(t){return new Zh(t)}),this.register(function(t){return new Yh(t)}),this.register(function(t){return new Oh(t)}),this.register(function(t){return new wc(t,at.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new wc(t,at.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new jh(t)})}load(e,t,i,r){let s=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=Ri.extractUrlBase(e);o=Ri.resolveURL(c,this.path)}else o=Ri.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){r?r(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new gs(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,o,function(u){t(u),s.manager.itemEnd(e)},a)}catch(u){a(u)}},i,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,r){let s,o={},a={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Kp){try{o[at.KHR_BINARY_GLTF]=new Qh(e)}catch(h){r&&r(h);return}s=JSON.parse(o[at.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new od(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,o[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){let h=s.extensionsUsed[u],d=s.extensionsRequired||[];switch(h){case at.KHR_MATERIALS_UNLIT:o[h]=new Fh;break;case at.KHR_DRACO_MESH_COMPRESSION:o[h]=new ed(s,this.dracoLoader);break;case at.KHR_TEXTURE_TRANSFORM:o[h]=new td;break;case at.KHR_MESH_QUANTIZATION:o[h]=new nd;break;default:d.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(i,r)}parseAsync(e,t){let i=this;return new Promise(function(r,s){i.parse(e,t,r,s)})}};function ZM(){let n={};return{get:function(e){return n[e]},add:function(e,t){n[e]=t},remove:function(e){delete n[e]},removeAll:function(){n={}}}}function Dt(n,e,t){let i=n.json.materials[e];return i.extensions&&i.extensions[t]?i.extensions[t]:null}var at={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Oh=class{constructor(e){this.parser=e,this.name=at.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let i=0,r=t.length;i<r;i++){let s=t[i];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,i="light:"+e,r=t.cache.get(i);if(r)return r;let s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,u=new Me(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],an);let h=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new ri(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new yn(u),c.distance=h;break;case"spot":c=new Uo(u),c.distance=h,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),ci(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),r=Promise.resolve(c),t.cache.add(i,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,i=this.parser,s=i.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return i._getNodeRef(t.cache,a,l)})}},Fh=class{constructor(){this.name=at.KHR_MATERIALS_UNLIT}getMaterialType(){return Tt}extendParams(e,t,i){let r=[];e.color=new Me(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],an),e.opacity=o[3]}s.baseColorTexture!==void 0&&r.push(i.assignTexture(e,"map",s.baseColorTexture,At))}return Promise.all(r)}},Bh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);return i===null||i.emissiveStrength!==void 0&&(t.emissiveIntensity=i.emissiveStrength),Promise.resolve()}},Hh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];if(i.clearcoatFactor!==void 0&&(t.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&r.push(this.parser.assignTexture(t,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(r.push(this.parser.assignTexture(t,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){let s=i.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ce(s,s)}return Promise.all(r)}},Vh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);return i===null||(t.dispersion=i.dispersion!==void 0?i.dispersion:0),Promise.resolve()}},zh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];return i.iridescenceFactor!==void 0&&(t.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&r.push(this.parser.assignTexture(t,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(t.iridescenceIOR=i.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(r)}},Gh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SHEEN}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];if(t.sheenColor=new Me(0,0,0),t.sheenRoughness=0,t.sheen=1,i.sheenColorFactor!==void 0){let s=i.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],an)}return i.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&r.push(this.parser.assignTexture(t,"sheenColorMap",i.sheenColorTexture,At)),i.sheenRoughnessTexture!==void 0&&r.push(this.parser.assignTexture(t,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(r)}},kh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];return i.transmissionFactor!==void 0&&(t.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&r.push(this.parser.assignTexture(t,"transmissionMap",i.transmissionTexture)),Promise.all(r)}},Wh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_VOLUME}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];t.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&r.push(this.parser.assignTexture(t,"thicknessMap",i.thicknessTexture)),t.attenuationDistance=i.attenuationDistance||1/0;let s=i.attenuationColor||[1,1,1];return t.attenuationColor=new Me().setRGB(s[0],s[1],s[2],an),Promise.all(r)}},Xh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IOR}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);return i===null||(t.ior=i.ior!==void 0?i.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},qh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];t.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&r.push(this.parser.assignTexture(t,"specularIntensityMap",i.specularTexture));let s=i.specularColorFactor||[1,1,1];return t.specularColor=new Me().setRGB(s[0],s[1],s[2],an),i.specularColorTexture!==void 0&&r.push(this.parser.assignTexture(t,"specularColorMap",i.specularColorTexture,At)),Promise.all(r)}},Yh=class{constructor(e){this.parser=e,this.name=at.EXT_MATERIALS_BUMP}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];return t.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&r.push(this.parser.assignTexture(t,"bumpMap",i.bumpTexture)),Promise.all(r)}},Zh=class{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Dt(this.parser,e,this.name)!==null?dn:null}extendMaterialParams(e,t){let i=Dt(this.parser,e,this.name);if(i===null)return Promise.resolve();let r=[];return i.anisotropyStrength!==void 0&&(t.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(t.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&r.push(this.parser.assignTexture(t,"anisotropyMap",i.anisotropyTexture)),Promise.all(r)}},Jh=class{constructor(e){this.parser=e,this.name=at.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,i=t.json,r=i.textures[e];if(!r.extensions||!r.extensions[this.name])return null;let s=r.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}},$h=class{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,i=this.parser,r=i.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],a=r.images[o.source],l=i.textureLoader;if(a.uri){let c=i.options.manager.getHandler(a.uri);c!==null&&(l=c)}return i.loadTextureImage(e,o.source,l)}},Kh=class{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,i=this.parser,r=i.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;let o=s.extensions[t],a=r.images[o.source],l=i.textureLoader;if(a.uri){let c=i.options.manager.getHandler(a.uri);c!==null&&(l=c)}return i.loadTextureImage(e,o.source,l)}},wc=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){let r=i.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){let l=r.byteOffset||0,c=r.byteLength||0,u=r.count,h=r.byteStride,d=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,h,d,r.mode,r.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(u*h);return o.decodeGltfBuffer(new Uint8Array(f),u,h,d,r.mode,r.filter),f})})}else return null}},jh=class{constructor(e){this.name=at.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;let r=t.meshes[i.mesh];for(let c of r.primitives)if(c.mode!==In.TRIANGLES&&c.mode!==In.TRIANGLE_STRIP&&c.mode!==In.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=i.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(let m of h){let _=new He,p=new R,g=new Ye,M=new R(1,1,1),T=new go(m.geometry,m.material,d);for(let S=0;S<d;S++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,S),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,S),l.SCALE&&M.fromBufferAttribute(l.SCALE,S),T.setMatrixAt(S,_.compose(p,g,M));let x=null;for(let S in l)if(S==="_COLOR_0"){let E=l[S];T.instanceColor=new Mi(E.array,E.itemSize,E.normalized)}else if(S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"){if(x===null){let A=T.geometry;x=new Qe,x.name=A.name;for(let v in A.attributes)x.setAttribute(v,A.attributes[v]);for(let v in A.morphAttributes)x.morphAttributes[v]=A.morphAttributes[v];A.index!==null&&x.setIndex(A.index),x.morphTargetsRelative=A.morphTargetsRelative;for(let v of A.groups)x.addGroup(v.start,v.count,v.materialIndex);A.boundingBox!==null&&(x.boundingBox=A.boundingBox.clone()),A.boundingSphere!==null&&(x.boundingSphere=A.boundingSphere.clone()),x.drawRange.start=A.drawRange.start,x.drawRange.count=A.drawRange.count,x.userData=Object.assign({},A.userData),T.geometry=x}let E=l[S];x.setAttribute(S,new Mi(E.array,E.itemSize,E.normalized))}ct.prototype.copy.call(T,m),this.parser.assignFinalMaterial(T),f.push(T)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},Kp="glTF",Ko=12,Yp={JSON:1313821514,BIN:5130562},Qh=class{constructor(e){this.name=at.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ko),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Kp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let r=this.header.length-Ko,s=new DataView(e,Ko),o=0;for(;o<r;){let a=s.getUint32(o,!0);o+=4;let l=s.getUint32(o,!0);if(o+=4,l===Yp.JSON){let c=new Uint8Array(e,Ko+o,a);this.content=i.decode(c)}else if(l===Yp.BIN){let c=Ko+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},ed=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=at.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let i=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let u in o){let h=rd[u]||u.toLowerCase();a[h]=o[u]}for(let u in e.attributes){let h=rd[u]||u.toLowerCase();if(o[u]!==void 0){let d=i.accessors[e.attributes[u]],f=Ps[d.componentType];c[h]=f.name,l[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,d){r.decodeDracoFile(u,function(f){for(let m in f.attributes){let _=f.attributes[m],p=l[m];p!==void 0&&(_.normalized=p)}h(f)},a,c,an,d)})})}},td=class{constructor(){this.name=at.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let i=Math.cos(e.rotation),r=Math.sin(e.rotation);e.matrix.set(e.repeat.x*i,e.repeat.y*r,e.offset.x,-e.repeat.x*r,e.repeat.y*i,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},nd=class{constructor(){this.name=at.KHR_MESH_QUANTIZATION}},Ac=class extends ti{constructor(e,t,i,r){super(e,t,i,r)}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let o=0;o!==r;o++)t[o]=i[s+o];return t}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=r-t,h=(i-t)/u,d=h*h,f=d*h,m=e*c,_=m-c,p=-2*f+3*d,g=f-d,M=1-p,T=g-d+h;for(let x=0;x!==a;x++){let S=o[_+x+a],E=o[_+x+l]*u,A=o[m+x+a],v=o[m+x]*u;s[x]=M*S+T*E+p*A+g*v}return s}},JM=new Ye,id=class extends Ac{interpolate_(e,t,i,r){let s=super.interpolate_(e,t,i,r);return JM.fromArray(s).normalize().toArray(s),s}},In={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ps={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Zp={9728:Lt,9729:Rt,9984:Il,9985:Ss,9986:yr,9987:Xn},Jp={33071:An,33648:ts,10497:Hn},Nh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},rd={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Ji={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},$M={CUBICSPLINE:void 0,LINEAR:ar,STEP:or},Uh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function KM(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new Pn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:si})),n.DefaultMaterial}function br(n,e,t){for(let i in t.extensions)n[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function ci(n,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(n.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function jM(n,e,t){let i=!1,r=!1,s=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(i=!0),h.NORMAL!==void 0&&(r=!0),h.COLOR_0!==void 0&&(s=!0),i&&r&&s)break}if(!i&&!r&&!s)return Promise.resolve(n);let o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(i){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):n.attributes.position;o.push(d)}if(r){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):n.attributes.normal;a.push(d)}if(s){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):n.attributes.color;l.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let u=c[0],h=c[1],d=c[2];return i&&(n.morphAttributes.position=u),r&&(n.morphAttributes.normal=h),s&&(n.morphAttributes.color=d),n.morphTargetsRelative=!0,n})}function QM(n,e){if(n.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)n.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(n.morphTargetInfluences.length===t.length){n.morphTargetDictionary={};for(let i=0,r=t.length;i<r;i++)n.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function eS(n){let e,t=n.extensions&&n.extensions[at.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Dh(t.attributes):e=n.indices+":"+Dh(n.attributes)+":"+n.mode,n.targets!==void 0)for(let i=0,r=n.targets.length;i<r;i++)e+=":"+Dh(n.targets[i]);return e}function Dh(n){let e="",t=Object.keys(n).sort();for(let i=0,r=t.length;i<r;i++)e+=t[i]+":"+n[t[i]]+";";return e}function sd(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function tS(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var nS=new He,od=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new ZM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,r=-1,s=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);r=i&&l?parseInt(l[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&r<17||s&&o<98?this.textureLoader=new gr(this.options.manager):this.textureLoader=new Oo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new gs(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let i=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(o){let a={scene:o[0][r.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:r.asset,parser:i,userData:{}};return br(s,a,r),ci(a,r),Promise.all(i._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){let o=t[r].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let r=0,s=e.length;r<s;r++){let o=e[r];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(i[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;let r=i.clone(),s=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,u]of o.children.entries())s(u,a.children[c])};return s(i,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){let r=e(t[i]);if(r)return r}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let i=[];for(let r=0;r<t.length;r++){let s=e(t[r]);s&&i.push(s)}return i}getDependency(e,t){let i=e+":"+t,r=this.cache.get(i);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(i,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){let i=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,o){return i.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[at.KHR_BINARY_GLTF].body);let r=this.options;return new Promise(function(s,o){i.load(Ri.resolveURL(t.uri,r.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){let r=t.byteLength||0,s=t.byteOffset||0;return i.slice(s,s+r)})}loadAccessor(e){let t=this,i=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){let o=Nh[r.type],a=Ps[r.componentType],l=r.normalized===!0,c=new a(r.count*o);return Promise.resolve(new Ke(c,o,l))}let s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(o){let a=o[0],l=Nh[r.type],c=Ps[r.componentType],u=c.BYTES_PER_ELEMENT,h=u*l,d=r.byteOffset||0,f=r.bufferView!==void 0?i.bufferViews[r.bufferView].byteStride:void 0,m=r.normalized===!0,_,p;if(f&&f!==h){let g=Math.floor(d/f),M="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+g+":"+r.count,T=t.cache.get(M);T||(_=new c(a,g*f,r.count*f/u),T=new ei(_,f/u),t.cache.add(M,T)),p=new Vn(T,l,d%f/u,m)}else a===null?_=new c(r.count*l):_=new c(a,d,r.count*l),p=new Ke(_,l,m);if(r.sparse!==void 0){let g=Nh.SCALAR,M=Ps[r.sparse.indices.componentType],T=r.sparse.indices.byteOffset||0,x=r.sparse.values.byteOffset||0,S=new M(o[1],T,r.sparse.count*g),E=new c(o[2],x,r.sparse.count*l);a!==null&&(p=new Ke(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let A=0,v=S.length;A<v;A++){let w=S[A];if(p.setX(w,E[A*l]),l>=2&&p.setY(w,E[A*l+1]),l>=3&&p.setZ(w,E[A*l+2]),l>=4&&p.setW(w,E[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=m}return p})}loadTexture(e){let t=this.json,i=this.options,s=t.textures[e].source,o=t.images[s],a=this.textureLoader;if(o.uri){let l=i.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,i){let r=this,s=this.json,o=s.textures[e],a=s.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,i).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let d=(s.samplers||{})[o.sampler]||{};return u.magFilter=Zp[d.magFilter]||Rt,u.minFilter=Zp[d.minFilter]||Xn,u.wrapS=Jp[d.wrapS]||Hn,u.wrapT=Jp[d.wrapT]||Hn,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Lt&&u.minFilter!==Rt,r.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let i=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let o=r.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=i.getDependency("bufferView",o.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:o.mimeType});return l=a.createObjectURL(d),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(h){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(_){let p=new Ht(_);p.needsUpdate=!0,d(p)}),t.load(Ri.resolveURL(h,s.path),m,void 0,f)})}).then(function(h){return c===!0&&a.revokeObjectURL(l),ci(h,o),h.userData.mimeType=o.mimeType||tS(o.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),h});return this.sourceCache[e]=u,u}assignTexture(e,t,i,r){let s=this;return this.getDependency("texture",i.index).then(function(o){if(!o)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(o=o.clone(),o.channel=i.texCoord),s.extensions[at.KHR_TEXTURE_TRANSFORM]){let a=i.extensions!==void 0?i.extensions[at.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=s.associations.get(o);o=s.extensions[at.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,l)}}return r!==void 0&&(o.colorSpace=r),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,i=e.material,r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+i.uuid,l=this.cache.get(a);l||(l=new Ei,Xt.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,l.sizeAttenuation=!1,this.cache.add(a,l)),i=l}else if(e.isLine){let a="LineBasicMaterial:"+i.uuid,l=this.cache.get(a);l||(l=new Yt,Xt.prototype.copy.call(l,i),l.color.copy(i.color),l.map=i.map,this.cache.add(a,l)),i=l}if(r||s||o){let a="ClonedMaterial:"+i.uuid+":";r&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=i.clone(),s&&(l.vertexColors=!0),o&&(l.flatShading=!0),r&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(i))),i=l}e.material=i}getMaterialType(){return Pn}loadMaterial(e){let t=this,i=this.json,r=this.extensions,s=i.materials[e],o,a={},l=s.extensions||{},c=[];if(l[at.KHR_MATERIALS_UNLIT]){let h=r[at.KHR_MATERIALS_UNLIT];o=h.getMaterialType(),c.push(h.extendParams(a,s,t))}else{let h=s.pbrMetallicRoughness||{};if(a.color=new Me(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],an),a.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",h.baseColorTexture,At)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=Ut);let u=s.alphaMode||Uh.OPAQUE;if(u===Uh.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Uh.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==Tt&&(c.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new ce(1,1),s.normalTexture.scale!==void 0)){let h=s.normalTexture.scale;a.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&o!==Tt&&(c.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==Tt){let h=s.emissiveFactor;a.emissive=new Me().setRGB(h[0],h[1],h[2],an)}return s.emissiveTexture!==void 0&&o!==Tt&&c.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,At)),Promise.all(c).then(function(){let h=new o(a);return s.name&&(h.name=s.name),ci(h,s),t.associations.set(h,{materials:e}),s.extensions&&br(r,h,s),h})}createUniqueName(e){let t=Et.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,i=this.extensions,r=this.primitiveCache;function s(a){return i[at.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return $p(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],u=eS(c),h=r[u];if(h)o.push(h.promise);else{let d;c.extensions&&c.extensions[at.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=$p(new Qe,c,t),c.mode===In.TRIANGLE_STRIP?d=d.then(f=>Lh(f,Yo)):c.mode===In.TRIANGLE_FAN&&(d=d.then(f=>Lh(f,Ts))),r[u]={primitive:c,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){let t=this,i=this.json,r=this.extensions,s=i.meshes[e],o=s.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let u=o[l].material===void 0?KM(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],h=[];for(let f=0,m=u.length;f<m;f++){let _=u[f],p=o[f],g,M=c[f];if(p.mode===In.TRIANGLES||p.mode===In.TRIANGLE_STRIP||p.mode===In.TRIANGLE_FAN||p.mode===void 0){let T=s.isSkinnedMesh===!0,x=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");T&&x===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),g=T&&x?new dr(_,M):new Ct(_,M),g.isSkinnedMesh===!0&&g.normalizeSkinWeights()}else if(p.mode===In.LINES)g=new hn(_,M);else if(p.mode===In.LINE_STRIP)g=new Si(_,M);else if(p.mode===In.LINE_LOOP)g=new _o(_,M);else if(p.mode===In.POINTS)g=new Vi(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(g.geometry.morphAttributes).length>0&&QM(g,s),g.name=t.createUniqueName(s.name||"mesh_"+e),ci(g,s),p.extensions&&br(r,g,p),t.assignFinalMaterial(g),h.push(g)}for(let f=0,m=h.length;f<m;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return s.extensions&&br(r,h[0],s),h[0];let d=new ft;s.extensions&&br(r,d,s),t.associations.set(d,{meshes:e});for(let f=0,m=h.length;f<m;f++)d.add(h[f]);return d})}loadCamera(e){let t,i=this.json.cameras[e],r=i[i.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Bt(mt.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):i.type==="orthographic"&&(t=new ii(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),ci(t,i),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],i=[];for(let r=0,s=t.joints.length;r<s;r++)i.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(r){let s=r.pop(),o=r,a=[],l=[];for(let c=0,u=o.length;c<u;c++){let h=o[c];if(h){a.push(h);let d=new He;s!==null&&d.fromArray(s.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new zn(a,l)})}loadAnimation(e){let t=this.json,i=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let h=0,d=r.channels.length;h<d;h++){let f=r.channels[h],m=r.samplers[f.sampler],_=f.target,p=_.node,g=r.parameters!==void 0?r.parameters[m.input]:m.input,M=r.parameters!==void 0?r.parameters[m.output]:m.output;_.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",M)),c.push(m),u.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],f=h[1],m=h[2],_=h[3],p=h[4],g=[];for(let T=0,x=d.length;T<x;T++){let S=d[T],E=f[T],A=m[T],v=_[T],w=p[T];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let C=i._createAnimationTracks(S,E,A,v,w);if(C)for(let L=0;L<C.length;L++)g.push(C[L])}let M=new Io(s,void 0,g);return ci(M,r),M})}createNodeMesh(e){let t=this.json,i=this,r=t.nodes[e];return r.mesh===void 0?null:i.getDependency("mesh",r.mesh).then(function(s){let o=i._getNodeRef(i.meshCache,r.mesh,s);return r.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=r.weights.length;l<c;l++)a.morphTargetInfluences[l]=r.weights[l]}),o})}loadNode(e){let t=this.json,i=this,r=t.nodes[e],s=i._loadNodeShallow(e),o=[],a=r.children||[];for(let c=0,u=a.length;c<u;c++)o.push(i.getDependency("node",a[c]));let l=r.skin===void 0?Promise.resolve(null):i.getDependency("skin",r.skin);return Promise.all([s,Promise.all(o),l]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,nS)});for(let f=0,m=h.length;f<m;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){let f=u.userData.pivot,m=h[0];u.pivot=new R().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],m.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,i=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],o=s.name?r.createUniqueName(s.name):"",a=[],l=r._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),s.camera!==void 0&&a.push(r.getDependency("camera",s.camera).then(function(c){return r._getNodeRef(r.cameraCache,s.camera,c)})),r._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(s.isBone===!0?u=new ls:c.length>1?u=new ft:c.length===1?u=c[0]:u=new ct,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=o),ci(u,s),s.extensions&&br(i,u,s),s.matrix!==void 0){let h=new He;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);if(!r.associations.has(u))r.associations.set(u,{});else if(s.mesh!==void 0&&r.meshCache.refs[s.mesh]>1){let h=r.associations.get(u);r.associations.set(u,{...h})}return r.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,i=this.json.scenes[e],r=this,s=new ft;i.name&&(s.name=r.createUniqueName(i.name)),ci(s,i),i.extensions&&br(t,s,i);let o=i.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(r.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,h=l.length;u<h;u++){let d=l[u];d.parent!==null?s.add(Xp(d)):s.add(d)}let c=u=>{let h=new Map;for(let[d,f]of r.associations)(d instanceof Xt||d instanceof Ht)&&h.set(d,f);return u.traverse(d=>{let f=r.associations.get(d);f!=null&&h.set(d,f)}),h};return r.associations=c(s),s})}_createAnimationTracks(e,t,i,r,s){let o=[],a=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}Ji[s.path]===Ji.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(a);let u;switch(Ji[s.path]){case Ji.weights:u=Ti;break;case Ji.rotation:u=wi;break;case Ji.translation:case Ji.scale:u=Wi;break;default:switch(i.itemSize){case 1:u=Ti;break;case 2:case 3:default:u=Wi;break}break}let h=r.interpolation!==void 0?$M[r.interpolation]:ar,d=this._getArrayFromAccessor(i);for(let f=0,m=l.length;f<m;f++){let _=new u(l[f]+"."+Ji[s.path],t.array,d,h);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),o.push(_)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let i=sd(t.constructor),r=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)r[s]=t[s]*i;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){let r=this instanceof wi?id:Ac;return new r(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function iS(n,e,t){let i=e.attributes,r=new _n;if(i.POSITION!==void 0){let a=t.json.accessors[i.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(r.set(new R(l[0],l[1],l[2]),new R(c[0],c[1],c[2])),a.normalized){let u=sd(Ps[a.componentType]);r.min.multiplyScalar(u),r.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let a=new R,l=new R;for(let c=0,u=s.length;c<u;c++){let h=s[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){let _=sd(Ps[d.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(a)}n.boundingBox=r;let o=new un;r.getCenter(o.center),o.radius=r.min.distanceTo(r.max)/2,n.boundingSphere=o}function $p(n,e,t){let i=e.attributes,r=[];function s(o,a){return t.getDependency("accessor",o).then(function(l){n.setAttribute(a,l)})}for(let o in i){let a=rd[o]||o.toLowerCase();a in n.attributes||r.push(s(i[o],a))}if(e.indices!==void 0&&!n.index){let o=t.getDependency("accessor",e.indices).then(function(a){n.setIndex(a)});r.push(o)}return st.workingColorSpace!==an&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${st.workingColorSpace}" not supported.`),ci(n,e),iS(n,e,t),Promise.all(r).then(function(){return e.targets!==void 0?jM(n,e.targets,t):n})}var Rc=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(n,e)).next())}),pt=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(n,e)).next())}),jp=class extends ct{constructor(n){super(),this.weight=0,this.isBinary=!1,this.overrideBlink="none",this.overrideLookAt="none",this.overrideMouth="none",this._binds=[],this.name=`VRMExpression_${n}`,this.expressionName=n,this.type="VRMExpression",this.visible=!1}get binds(){return this._binds}get overrideBlinkAmount(){return this.overrideBlink==="block"?0<this.outputWeight?1:0:this.overrideBlink==="blend"?this.outputWeight:0}get overrideLookAtAmount(){return this.overrideLookAt==="block"?0<this.outputWeight?1:0:this.overrideLookAt==="blend"?this.outputWeight:0}get overrideMouthAmount(){return this.overrideMouth==="block"?0<this.outputWeight?1:0:this.overrideMouth==="blend"?this.outputWeight:0}get outputWeight(){return this.isBinary?this.weight>.5?1:0:this.weight}addBind(n){this._binds.push(n)}deleteBind(n){let e=this._binds.indexOf(n);e>=0&&this._binds.splice(e,1)}applyWeight(n){var e;let t=this.outputWeight;t*=(e=n?.multiplier)!=null?e:1,this.isBinary&&t<1&&(t=0),this._binds.forEach(i=>i.applyWeight(t))}clearAppliedWeight(){this._binds.forEach(n=>n.clearAppliedWeight())}};function Um(n,e,t){var i,r;let s=n.parser.json,o=(i=s.nodes)==null?void 0:i[e];if(o==null)return console.warn(`extractPrimitivesInternal: Attempt to use nodes[${e}] of glTF but the node doesn't exist`),null;let a=o.mesh;if(a==null)return null;let l=(r=s.meshes)==null?void 0:r[a];if(l==null)return console.warn(`extractPrimitivesInternal: Attempt to use meshes[${a}] of glTF but the mesh doesn't exist`),null;let c=l.primitives.length,u=[];return t.traverse(h=>{u.length<c&&h.isMesh&&u.push(h)}),u}function Qp(n,e){return pt(this,null,function*(){let t=yield n.parser.getDependency("node",e);return Um(n,e,t)})}function em(n){return pt(this,null,function*(){let e=yield n.parser.getDependencies("node"),t=new Map;return e.forEach((i,r)=>{let s=Um(n,r,i);s!=null&&t.set(r,s)}),t})}var vd={Aa:"aa",Ih:"ih",Ou:"ou",Ee:"ee",Oh:"oh",Blink:"blink",Happy:"happy",Angry:"angry",Sad:"sad",Relaxed:"relaxed",LookUp:"lookUp",Surprised:"surprised",LookDown:"lookDown",LookLeft:"lookLeft",LookRight:"lookRight",BlinkLeft:"blinkLeft",BlinkRight:"blinkRight",Neutral:"neutral"};function Dm(n){return Math.max(Math.min(n,1),0)}var tm=class Om{constructor(){this.blinkExpressionNames=["blink","blinkLeft","blinkRight"],this.lookAtExpressionNames=["lookLeft","lookRight","lookUp","lookDown"],this.mouthExpressionNames=["aa","ee","ih","oh","ou"],this._expressions=[],this._expressionMap={}}get expressions(){return this._expressions.concat()}get expressionMap(){return Object.assign({},this._expressionMap)}get presetExpressionMap(){let e={},t=new Set(Object.values(vd));return Object.entries(this._expressionMap).forEach(([i,r])=>{t.has(i)&&(e[i]=r)}),e}get customExpressionMap(){let e={},t=new Set(Object.values(vd));return Object.entries(this._expressionMap).forEach(([i,r])=>{t.has(i)||(e[i]=r)}),e}copy(e){return this._expressions.concat().forEach(i=>{this.unregisterExpression(i)}),e._expressions.forEach(i=>{this.registerExpression(i)}),this.blinkExpressionNames=e.blinkExpressionNames.concat(),this.lookAtExpressionNames=e.lookAtExpressionNames.concat(),this.mouthExpressionNames=e.mouthExpressionNames.concat(),this}clone(){return new Om().copy(this)}getExpression(e){var t;return(t=this._expressionMap[e])!=null?t:null}registerExpression(e){this._expressions.push(e),this._expressionMap[e.expressionName]=e}unregisterExpression(e){let t=this._expressions.indexOf(e);t===-1&&console.warn("VRMExpressionManager: The specified expressions is not registered"),this._expressions.splice(t,1),delete this._expressionMap[e.expressionName]}getValue(e){var t;let i=this.getExpression(e);return(t=i?.weight)!=null?t:null}setValue(e,t){let i=this.getExpression(e);i&&(i.weight=Dm(t))}resetValues(){this._expressions.forEach(e=>{e.weight=0})}getExpressionTrackName(e){let t=this.getExpression(e);return t?`${t.name}.weight`:null}update(){let e=this._calculateWeightMultipliers();this._expressions.forEach(t=>{t.clearAppliedWeight()}),this._expressions.forEach(t=>{let i=1,r=t.expressionName;this.blinkExpressionNames.indexOf(r)!==-1&&(i*=e.blink),this.lookAtExpressionNames.indexOf(r)!==-1&&(i*=e.lookAt),this.mouthExpressionNames.indexOf(r)!==-1&&(i*=e.mouth),t.applyWeight({multiplier:i})})}_calculateWeightMultipliers(){let e=1,t=1,i=1;return this._expressions.forEach(r=>{e-=r.overrideBlinkAmount,t-=r.overrideLookAtAmount,i-=r.overrideMouthAmount}),e=Math.max(0,e),t=Math.max(0,t),i=Math.max(0,i),{blink:e,lookAt:t,mouth:i}}},jo={Color:"color",EmissionColor:"emissionColor",ShadeColor:"shadeColor",MatcapColor:"matcapColor",RimColor:"rimColor",OutlineColor:"outlineColor"},rS={_Color:jo.Color,_EmissionColor:jo.EmissionColor,_ShadeColor:jo.ShadeColor,_RimColor:jo.RimColor,_OutlineColor:jo.OutlineColor},sS=new Me,Fm=class Bm{constructor({material:e,type:t,targetValue:i,targetAlpha:r}){this.material=e,this.type=t,this.targetValue=i,this.targetAlpha=r??1;let s=this._initColorBindState(),o=this._initAlphaBindState();this._state={color:s,alpha:o}}applyWeight(e){let{color:t,alpha:i}=this._state;if(t!=null){let{propertyName:r,deltaValue:s}=t,o=this.material[r];o?.add(sS.copy(s).multiplyScalar(e))}if(i!=null){let{propertyName:r,deltaValue:s}=i;this.material[r]!=null&&(this.material[r]+=s*e)}}clearAppliedWeight(){let{color:e,alpha:t}=this._state;if(e!=null){let{propertyName:i,initialValue:r}=e,s=this.material[i];s?.copy(r)}if(t!=null){let{propertyName:i,initialValue:r}=t;this.material[i]!=null&&(this.material[i]=r)}}_initColorBindState(){var e,t,i;let{material:r,type:s,targetValue:o}=this,a=this._getPropertyNameMap(),l=(t=(e=a?.[s])==null?void 0:e[0])!=null?t:null;if(l==null)return console.warn(`Tried to add a material color bind to the material ${(i=r.name)!=null?i:"(no name)"}, the type ${s} but the material or the type is not supported.`),null;let u=r[l].clone(),h=new Me(o.r-u.r,o.g-u.g,o.b-u.b);return{propertyName:l,initialValue:u,deltaValue:h}}_initAlphaBindState(){var e,t,i;let{material:r,type:s,targetAlpha:o}=this,a=this._getPropertyNameMap(),l=(t=(e=a?.[s])==null?void 0:e[1])!=null?t:null;if(l==null&&o!==1)return console.warn(`Tried to add a material alpha bind to the material ${(i=r.name)!=null?i:"(no name)"}, the type ${s} but the material or the type does not support alpha.`),null;if(l==null)return null;let c=r[l],u=o-c;return{propertyName:l,initialValue:c,deltaValue:u}}_getPropertyNameMap(){var e,t;return(t=(e=Object.entries(Bm._propertyNameMapMap).find(([i])=>this.material[i]===!0))==null?void 0:e[1])!=null?t:null}};Fm._propertyNameMapMap={isMeshStandardMaterial:{color:["color","opacity"],emissionColor:["emissive",null]},isMeshBasicMaterial:{color:["color","opacity"]},isMToonMaterial:{color:["color","opacity"],emissionColor:["emissive",null],outlineColor:["outlineColorFactor",null],matcapColor:["matcapFactor",null],rimColor:["parametricRimColorFactor",null],shadeColor:["shadeColorFactor",null]}};var nm=Fm,Dc=class{constructor({primitives:n,index:e,weight:t}){this.primitives=n,this.index=e,this.weight=t}applyWeight(n){this.primitives.forEach(e=>{var t;((t=e.morphTargetInfluences)==null?void 0:t[this.index])!=null&&(e.morphTargetInfluences[this.index]+=this.weight*n)})}clearAppliedWeight(){this.primitives.forEach(n=>{var e;((e=n.morphTargetInfluences)==null?void 0:e[this.index])!=null&&(n.morphTargetInfluences[this.index]=0)})}},im=new ce,Hm=class Vm{constructor({material:e,scale:t,offset:i}){var r,s;this.material=e,this.scale=t,this.offset=i;let o=(r=Object.entries(Vm._propertyNamesMap).find(([a])=>e[a]===!0))==null?void 0:r[1];o==null?(console.warn(`Tried to add a texture transform bind to the material ${(s=e.name)!=null?s:"(no name)"} but the material is not supported.`),this._properties=[]):(this._properties=[],o.forEach(a=>{var l;let c=(l=e[a])==null?void 0:l.clone();if(!c)return null;e[a]=c;let u=c.offset.clone(),h=c.repeat.clone(),d=i.clone().sub(u),f=t.clone().sub(h);this._properties.push({name:a,initialOffset:u,deltaOffset:d,initialScale:h,deltaScale:f})}))}applyWeight(e){this._properties.forEach(t=>{let i=this.material[t.name];i!==void 0&&(i.offset.add(im.copy(t.deltaOffset).multiplyScalar(e)),i.repeat.add(im.copy(t.deltaScale).multiplyScalar(e)))})}clearAppliedWeight(){this._properties.forEach(e=>{let t=this.material[e.name];t!==void 0&&(t.offset.copy(e.initialOffset),t.repeat.copy(e.initialScale))})}};Hm._propertyNamesMap={isMeshStandardMaterial:["map","emissiveMap","bumpMap","normalMap","displacementMap","roughnessMap","metalnessMap","alphaMap"],isMeshBasicMaterial:["map","specularMap","alphaMap"],isMToonMaterial:["map","normalMap","emissiveMap","shadeMultiplyTexture","rimMultiplyTexture","outlineWidthMultiplyTexture","uvAnimationMaskTexture"]};var rm=Hm,oS=new Set(["1.0","1.0-beta"]),zm=class Gm{get name(){return"VRMExpressionLoaderPlugin"}constructor(e){this.parser=e}afterRoot(e){return pt(this,null,function*(){e.userData.vrmExpressionManager=yield this._import(e)})}_import(e){return pt(this,null,function*(){let t=yield this._v1Import(e);if(t)return t;let i=yield this._v0Import(e);return i||null})}_v1Import(e){return pt(this,null,function*(){var t,i;let r=this.parser.json;if(!(((t=r.extensionsUsed)==null?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;let o=(i=r.extensions)==null?void 0:i.VRMC_vrm;if(!o)return null;let a=o.specVersion;if(!oS.has(a))return console.warn(`VRMExpressionLoaderPlugin: Unknown VRMC_vrm specVersion "${a}"`),null;let l=o.expressions;if(!l)return null;let c=new Set(Object.values(vd)),u=new Map;l.preset!=null&&Object.entries(l.preset).forEach(([d,f])=>{if(f!=null){if(!c.has(d)){console.warn(`VRMExpressionLoaderPlugin: Unknown preset name "${d}" detected. Ignoring the expression`);return}u.set(d,f)}}),l.custom!=null&&Object.entries(l.custom).forEach(([d,f])=>{if(c.has(d)){console.warn(`VRMExpressionLoaderPlugin: Custom expression cannot have preset name "${d}". Ignoring the expression`);return}u.set(d,f)});let h=new tm;return yield Promise.all(Array.from(u.entries()).map(d=>pt(this,[d],function*([f,m]){var _,p,g,M,T,x,S;let E=new jp(f);if(e.scene.add(E),E.isBinary=(_=m.isBinary)!=null?_:!1,E.overrideBlink=(p=m.overrideBlink)!=null?p:"none",E.overrideLookAt=(g=m.overrideLookAt)!=null?g:"none",E.overrideMouth=(M=m.overrideMouth)!=null?M:"none",(T=m.morphTargetBinds)==null||T.forEach(A=>pt(this,null,function*(){var v;if(A.node===void 0||A.index===void 0)return;let w=yield Qp(e,A.node),C=A.index;if(!w.every(L=>Array.isArray(L.morphTargetInfluences)&&C<L.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${m.name} attempts to index morph #${C} but not found.`);return}E.addBind(new Dc({primitives:w,index:C,weight:(v=A.weight)!=null?v:1}))})),m.materialColorBinds||m.textureTransformBinds){let A=[];e.scene.traverse(v=>{let w=v.material;w&&(Array.isArray(w)?A.push(...w):A.push(w))}),(x=m.materialColorBinds)==null||x.forEach(v=>pt(this,null,function*(){A.filter(C=>{var L;let D=(L=this.parser.associations.get(C))==null?void 0:L.materials;return v.material===D}).forEach(C=>{E.addBind(new nm({material:C,type:v.type,targetValue:new Me().fromArray(v.targetValue),targetAlpha:v.targetValue[3]}))})})),(S=m.textureTransformBinds)==null||S.forEach(v=>pt(this,null,function*(){A.filter(C=>{var L;let D=(L=this.parser.associations.get(C))==null?void 0:L.materials;return v.material===D}).forEach(C=>{var L,D;E.addBind(new rm({material:C,offset:new ce().fromArray((L=v.offset)!=null?L:[0,0]),scale:new ce().fromArray((D=v.scale)!=null?D:[1,1])}))})}))}h.registerExpression(E)}))),h})}_v0Import(e){return pt(this,null,function*(){var t;let i=this.parser.json,r=(t=i.extensions)==null?void 0:t.VRM;if(!r)return null;let s=r.blendShapeMaster;if(!s)return null;let o=new tm,a=s.blendShapeGroups;if(!a)return o;let l=new Set;return yield Promise.all(a.map(c=>pt(this,null,function*(){var u;let h=c.presetName,d=h!=null&&Gm.v0v1PresetNameMap[h]||null,f=d??c.name;if(f==null){console.warn("VRMExpressionLoaderPlugin: One of custom expressions has no name. Ignoring the expression");return}if(l.has(f)){console.warn(`VRMExpressionLoaderPlugin: An expression preset ${h} has duplicated entries. Ignoring the expression`);return}l.add(f);let m=new jp(f);e.scene.add(m),m.isBinary=(u=c.isBinary)!=null?u:!1,c.binds&&c.binds.forEach(p=>pt(this,null,function*(){var g;if(p.mesh===void 0||p.index===void 0)return;let M=[];if((g=i.nodes)==null||g.forEach((x,S)=>{x.mesh===p.mesh&&M.push(S)}),M.length===0){console.warn(`VRMExpressionLoaderPlugin: ${c.name} attempts to bind a morph target to the mesh #${p.mesh} but the mesh is not found or not used in the scene. Ignoring the bind.`);return}let T=p.index;yield Promise.all(M.map(x=>pt(this,null,function*(){var S;let E=yield Qp(e,x);if(!E.every(A=>Array.isArray(A.morphTargetInfluences)&&T<A.morphTargetInfluences.length)){console.warn(`VRMExpressionLoaderPlugin: ${c.name} attempts to index ${T}th morph but not found.`);return}m.addBind(new Dc({primitives:E,index:T,weight:.01*((S=p.weight)!=null?S:100)}))})))}));let _=c.materialValues;_&&_.length!==0&&_.forEach(p=>{if(p.materialName===void 0||p.propertyName===void 0||p.targetValue===void 0)return;let g=[];e.scene.traverse(T=>{if(T.material){let x=T.material;Array.isArray(x)?g.push(...x.filter(S=>(S.name===p.materialName||S.name===p.materialName+" (Outline)")&&g.indexOf(S)===-1)):x.name===p.materialName&&g.indexOf(x)===-1&&g.push(x)}});let M=p.propertyName;g.forEach(T=>{if(M==="_MainTex_ST"){let S=new ce(p.targetValue[0],p.targetValue[1]),E=new ce(p.targetValue[2],p.targetValue[3]);E.y=1-E.y-S.y,m.addBind(new rm({material:T,scale:S,offset:E}));return}let x=rS[M];if(x){m.addBind(new nm({material:T,type:x,targetValue:new Me().fromArray(p.targetValue),targetAlpha:p.targetValue[3]}));return}console.warn(M+" is not supported")})}),o.registerExpression(m)}))),o})}};zm.v0v1PresetNameMap={a:"aa",e:"ee",i:"ih",o:"oh",u:"ou",blink:"blink",joy:"happy",angry:"angry",sorrow:"sad",fun:"relaxed",lookup:"lookUp",lookdown:"lookDown",lookleft:"lookLeft",lookright:"lookRight",blink_l:"blinkLeft",blink_r:"blinkRight",neutral:"neutral"};var aS=zm;var Td=class Us{constructor(e,t){this._firstPersonOnlyLayer=Us.DEFAULT_FIRSTPERSON_ONLY_LAYER,this._thirdPersonOnlyLayer=Us.DEFAULT_THIRDPERSON_ONLY_LAYER,this._initializedLayers=!1,this.humanoid=e,this.meshAnnotations=t}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMFirstPerson: humanoid must be same in order to copy");return this.meshAnnotations=e.meshAnnotations.map(t=>({meshes:t.meshes.concat(),type:t.type})),this}clone(){return new Us(this.humanoid,this.meshAnnotations).copy(this)}get firstPersonOnlyLayer(){return this._firstPersonOnlyLayer}get thirdPersonOnlyLayer(){return this._thirdPersonOnlyLayer}setup({firstPersonOnlyLayer:e=Us.DEFAULT_FIRSTPERSON_ONLY_LAYER,thirdPersonOnlyLayer:t=Us.DEFAULT_THIRDPERSON_ONLY_LAYER}={}){this._initializedLayers||(this._firstPersonOnlyLayer=e,this._thirdPersonOnlyLayer=t,this.meshAnnotations.forEach(i=>{i.meshes.forEach(r=>{i.type==="firstPersonOnly"?(r.layers.set(this._firstPersonOnlyLayer),r.traverse(s=>s.layers.set(this._firstPersonOnlyLayer))):i.type==="thirdPersonOnly"?(r.layers.set(this._thirdPersonOnlyLayer),r.traverse(s=>s.layers.set(this._thirdPersonOnlyLayer))):i.type==="auto"&&this._createHeadlessModel(r)})}),this._initializedLayers=!0)}_excludeTriangles(e,t,i,r){let s=0;if(t!=null&&t.length>0)for(let o=0;o<e.length;o+=3){let a=e[o],l=e[o+1],c=e[o+2],u=t[a],h=i[a];if(u[0]>0&&r.includes(h[0])||u[1]>0&&r.includes(h[1])||u[2]>0&&r.includes(h[2])||u[3]>0&&r.includes(h[3]))continue;let d=t[l],f=i[l];if(d[0]>0&&r.includes(f[0])||d[1]>0&&r.includes(f[1])||d[2]>0&&r.includes(f[2])||d[3]>0&&r.includes(f[3]))continue;let m=t[c],_=i[c];m[0]>0&&r.includes(_[0])||m[1]>0&&r.includes(_[1])||m[2]>0&&r.includes(_[2])||m[3]>0&&r.includes(_[3])||(e[s++]=a,e[s++]=l,e[s++]=c)}return s}_createErasedMesh(e,t){let i=new dr(e.geometry.clone(),e.material);i.name=`${e.name}(erase)`,i.frustumCulled=e.frustumCulled,i.layers.set(this._firstPersonOnlyLayer);let r=i.geometry,s=r.getAttribute("skinIndex"),o=s instanceof vs?[]:s.array,a=[];for(let _=0;_<o.length;_+=4)a.push([o[_],o[_+1],o[_+2],o[_+3]]);let l=r.getAttribute("skinWeight"),c=l instanceof vs?[]:l.array,u=[];for(let _=0;_<c.length;_+=4)u.push([c[_],c[_+1],c[_+2],c[_+3]]);let h=r.getIndex();if(!h)throw new Error("The geometry doesn't have an index buffer");let d=Array.from(h.array),f=this._excludeTriangles(d,u,a,t),m=[];for(let _=0;_<f;_++)m[_]=d[_];return r.setIndex(m),e.onBeforeRender&&(i.onBeforeRender=e.onBeforeRender),i.bind(new zn(e.skeleton.bones,e.skeleton.boneInverses),new He),i}_createHeadlessModelForSkinnedMesh(e,t){let i=[];if(t.skeleton.bones.forEach((s,o)=>{this._isEraseTarget(s)&&i.push(o)}),!i.length){t.layers.enable(this._thirdPersonOnlyLayer),t.layers.enable(this._firstPersonOnlyLayer);return}t.layers.set(this._thirdPersonOnlyLayer);let r=this._createErasedMesh(t,i);e.add(r)}_createHeadlessModel(e){if(e.type==="Group")if(e.layers.set(this._thirdPersonOnlyLayer),this._isEraseTarget(e))e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer));else{let t=new ft;t.name=`_headless_${e.name}`,t.layers.set(this._firstPersonOnlyLayer),e.parent.add(t),e.children.filter(i=>i.type==="SkinnedMesh").forEach(i=>{let r=i;this._createHeadlessModelForSkinnedMesh(t,r)})}else if(e.type==="SkinnedMesh"){let t=e;this._createHeadlessModelForSkinnedMesh(e.parent,t)}else this._isEraseTarget(e)&&(e.layers.set(this._thirdPersonOnlyLayer),e.traverse(t=>t.layers.set(this._thirdPersonOnlyLayer)))}_isEraseTarget(e){return e===this.humanoid.getRawBoneNode("head")?!0:e.parent?this._isEraseTarget(e.parent):!1}};Td.DEFAULT_FIRSTPERSON_ONLY_LAYER=9;Td.DEFAULT_THIRDPERSON_ONLY_LAYER=10;var sm=Td,lS=new Set(["1.0","1.0-beta"]),cS=class{get name(){return"VRMFirstPersonLoaderPlugin"}constructor(n){this.parser=n}afterRoot(n){return pt(this,null,function*(){let e=n.userData.vrmHumanoid;if(e!==null){if(e===void 0)throw new Error("VRMFirstPersonLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");n.userData.vrmFirstPerson=yield this._import(n,e)}})}_import(n,e){return pt(this,null,function*(){if(e==null)return null;let t=yield this._v1Import(n,e);if(t)return t;let i=yield this._v0Import(n,e);return i||null})}_v1Import(n,e){return pt(this,null,function*(){var t,i;let r=this.parser.json;if(!(((t=r.extensionsUsed)==null?void 0:t.indexOf("VRMC_vrm"))!==-1))return null;let o=(i=r.extensions)==null?void 0:i.VRMC_vrm;if(!o)return null;let a=o.specVersion;if(!lS.has(a))return console.warn(`VRMFirstPersonLoaderPlugin: Unknown VRMC_vrm specVersion "${a}"`),null;let l=o.firstPerson,c=[],u=yield em(n);return Array.from(u.entries()).forEach(([h,d])=>{var f,m;let _=(f=l?.meshAnnotations)==null?void 0:f.find(p=>p.node===h);c.push({meshes:d,type:(m=_?.type)!=null?m:"auto"})}),new sm(e,c)})}_v0Import(n,e){return pt(this,null,function*(){var t;let i=this.parser.json,r=(t=i.extensions)==null?void 0:t.VRM;if(!r)return null;let s=r.firstPerson;if(!s)return null;let o=[],a=yield em(n);return Array.from(a.entries()).forEach(([l,c])=>{let u=i.nodes[l],h=s.meshAnnotations?s.meshAnnotations.find(d=>d.mesh===u.mesh):void 0;o.push({meshes:c,type:this._convertV0FlagToV1Type(h?.firstPersonFlag)})}),new sm(e,o)})}_convertV0FlagToV1Type(n){return n==="FirstPersonOnly"?"firstPersonOnly":n==="ThirdPersonOnly"?"thirdPersonOnly":n==="Both"?"both":"auto"}};var om=new R,am=new R,uS=new Ye,lm=class extends ft{constructor(n){super(),this.vrmHumanoid=n,this._boneAxesMap=new Map,Object.values(n.humanBones).forEach(e=>{let t=new Bo(1);t.matrixAutoUpdate=!1,t.material.depthTest=!1,t.material.depthWrite=!1,this.add(t),this._boneAxesMap.set(e,t)})}dispose(){Array.from(this._boneAxesMap.values()).forEach(n=>{n.geometry.dispose(),n.material.dispose()})}updateMatrixWorld(n){Array.from(this._boneAxesMap.entries()).forEach(([e,t])=>{e.node.updateWorldMatrix(!0,!1),e.node.matrixWorld.decompose(om,uS,am);let i=om.set(.1,.1,.1).divide(am);t.matrix.copy(e.node.matrixWorld).scale(i)}),super.updateMatrixWorld(n)}},ad=["hips","spine","chest","upperChest","neck","head","leftEye","rightEye","jaw","leftUpperLeg","leftLowerLeg","leftFoot","leftToes","rightUpperLeg","rightLowerLeg","rightFoot","rightToes","leftShoulder","leftUpperArm","leftLowerArm","leftHand","rightShoulder","rightUpperArm","rightLowerArm","rightHand","leftThumbMetacarpal","leftThumbProximal","leftThumbDistal","leftIndexProximal","leftIndexIntermediate","leftIndexDistal","leftMiddleProximal","leftMiddleIntermediate","leftMiddleDistal","leftRingProximal","leftRingIntermediate","leftRingDistal","leftLittleProximal","leftLittleIntermediate","leftLittleDistal","rightThumbMetacarpal","rightThumbProximal","rightThumbDistal","rightIndexProximal","rightIndexIntermediate","rightIndexDistal","rightMiddleProximal","rightMiddleIntermediate","rightMiddleDistal","rightRingProximal","rightRingIntermediate","rightRingDistal","rightLittleProximal","rightLittleIntermediate","rightLittleDistal"];var hS={hips:null,spine:"hips",chest:"spine",upperChest:"chest",neck:"upperChest",head:"neck",leftEye:"head",rightEye:"head",jaw:"head",leftUpperLeg:"hips",leftLowerLeg:"leftUpperLeg",leftFoot:"leftLowerLeg",leftToes:"leftFoot",rightUpperLeg:"hips",rightLowerLeg:"rightUpperLeg",rightFoot:"rightLowerLeg",rightToes:"rightFoot",leftShoulder:"upperChest",leftUpperArm:"leftShoulder",leftLowerArm:"leftUpperArm",leftHand:"leftLowerArm",rightShoulder:"upperChest",rightUpperArm:"rightShoulder",rightLowerArm:"rightUpperArm",rightHand:"rightLowerArm",leftThumbMetacarpal:"leftHand",leftThumbProximal:"leftThumbMetacarpal",leftThumbDistal:"leftThumbProximal",leftIndexProximal:"leftHand",leftIndexIntermediate:"leftIndexProximal",leftIndexDistal:"leftIndexIntermediate",leftMiddleProximal:"leftHand",leftMiddleIntermediate:"leftMiddleProximal",leftMiddleDistal:"leftMiddleIntermediate",leftRingProximal:"leftHand",leftRingIntermediate:"leftRingProximal",leftRingDistal:"leftRingIntermediate",leftLittleProximal:"leftHand",leftLittleIntermediate:"leftLittleProximal",leftLittleDistal:"leftLittleIntermediate",rightThumbMetacarpal:"rightHand",rightThumbProximal:"rightThumbMetacarpal",rightThumbDistal:"rightThumbProximal",rightIndexProximal:"rightHand",rightIndexIntermediate:"rightIndexProximal",rightIndexDistal:"rightIndexIntermediate",rightMiddleProximal:"rightHand",rightMiddleIntermediate:"rightMiddleProximal",rightMiddleDistal:"rightMiddleIntermediate",rightRingProximal:"rightHand",rightRingIntermediate:"rightRingProximal",rightRingDistal:"rightRingIntermediate",rightLittleProximal:"rightHand",rightLittleIntermediate:"rightLittleProximal",rightLittleDistal:"rightLittleIntermediate"};function km(n){return n.invert?n.invert():n.inverse(),n}var Tr=new R,wr=new Ye,yd=class{constructor(n){this.humanBones=n,this.restPose=this.getAbsolutePose()}getAbsolutePose(){let n={};return Object.keys(this.humanBones).forEach(e=>{let t=e,i=this.getBoneNode(t);i&&(Tr.copy(i.position),wr.copy(i.quaternion),n[t]={position:Tr.toArray(),rotation:wr.toArray()})}),n}getPose(){let n={};return Object.keys(this.humanBones).forEach(e=>{let t=e,i=this.getBoneNode(t);if(!i)return;Tr.set(0,0,0),wr.identity();let r=this.restPose[t];r?.position&&Tr.fromArray(r.position).negate(),r?.rotation&&km(wr.fromArray(r.rotation)),Tr.add(i.position),wr.premultiply(i.quaternion),n[t]={position:Tr.toArray(),rotation:wr.toArray()}}),n}setPose(n){Object.entries(n).forEach(([e,t])=>{let i=e,r=this.getBoneNode(i);if(!r)return;let s=this.restPose[i];s&&(t?.position&&(r.position.fromArray(t.position),s.position&&r.position.add(Tr.fromArray(s.position))),t?.rotation&&(r.quaternion.fromArray(t.rotation),s.rotation&&r.quaternion.multiply(wr.fromArray(s.rotation))))})}resetPose(){Object.entries(this.restPose).forEach(([n,e])=>{let t=this.getBoneNode(n);t&&(e?.position&&t.position.fromArray(e.position),e?.rotation&&t.quaternion.fromArray(e.rotation))})}getBone(n){var e;return(e=this.humanBones[n])!=null?e:void 0}getBoneNode(n){var e,t;return(t=(e=this.humanBones[n])==null?void 0:e.node)!=null?t:null}},ld=new R,dS=new Ye,fS=new R,cm=class Wm extends yd{static _setupTransforms(e){let t=new ct;t.name="VRMHumanoidRig";let i={},r={},s={},o={};ad.forEach(l=>{var c;let u=e.getBoneNode(l);if(u){let h=new R,d=new Ye;u.updateWorldMatrix(!0,!1),u.matrixWorld.decompose(h,d,ld),i[l]=h,r[l]=d,s[l]=u.quaternion.clone();let f=new Ye;(c=u.parent)==null||c.matrixWorld.decompose(ld,f,ld),o[l]=f}});let a={};return ad.forEach(l=>{var c;let u=e.getBoneNode(l);if(u){let h=i[l],d=l,f;for(;f==null&&(d=hS[d],d!=null);)f=i[d];let m=new ct;m.name="Normalized_"+u.name,(d?(c=a[d])==null?void 0:c.node:t).add(m),m.position.copy(h),f&&m.position.sub(f),a[l]={node:m}}}),{rigBones:a,root:t,parentWorldRotations:o,boneRotations:s}}constructor(e){let{rigBones:t,root:i,parentWorldRotations:r,boneRotations:s}=Wm._setupTransforms(e);super(t),this.original=e,this.root=i,this._parentWorldRotations=r,this._boneRotations=s}update(){ad.forEach(e=>{let t=this.original.getBoneNode(e);if(t!=null){let i=this.getBoneNode(e),r=this._parentWorldRotations[e],s=dS.copy(r).invert(),o=this._boneRotations[e];if(t.quaternion.copy(i.quaternion).multiply(r).premultiply(s).multiply(o),e==="hips"){let a=i.getWorldPosition(fS);t.parent.updateWorldMatrix(!0,!1);let l=t.parent.matrixWorld,c=a.applyMatrix4(l.invert());t.position.copy(c)}}})}},um=class Xm{get restPose(){return console.warn("VRMHumanoid: restPose is deprecated. Use either rawRestPose or normalizedRestPose instead."),this.rawRestPose}get rawRestPose(){return this._rawHumanBones.restPose}get normalizedRestPose(){return this._normalizedHumanBones.restPose}get humanBones(){return this._rawHumanBones.humanBones}get rawHumanBones(){return this._rawHumanBones.humanBones}get normalizedHumanBones(){return this._normalizedHumanBones.humanBones}get normalizedHumanBonesRoot(){return this._normalizedHumanBones.root}constructor(e,t){var i;this.autoUpdateHumanBones=(i=t?.autoUpdateHumanBones)!=null?i:!0,this._rawHumanBones=new yd(e),this._normalizedHumanBones=new cm(this._rawHumanBones)}copy(e){return this.autoUpdateHumanBones=e.autoUpdateHumanBones,this._rawHumanBones=new yd(e.humanBones),this._normalizedHumanBones=new cm(this._rawHumanBones),this}clone(){return new Xm(this.humanBones,{autoUpdateHumanBones:this.autoUpdateHumanBones}).copy(this)}getAbsolutePose(){return console.warn("VRMHumanoid: getAbsolutePose() is deprecated. Use either getRawAbsolutePose() or getNormalizedAbsolutePose() instead."),this.getRawAbsolutePose()}getRawAbsolutePose(){return this._rawHumanBones.getAbsolutePose()}getNormalizedAbsolutePose(){return this._normalizedHumanBones.getAbsolutePose()}getPose(){return console.warn("VRMHumanoid: getPose() is deprecated. Use either getRawPose() or getNormalizedPose() instead."),this.getRawPose()}getRawPose(){return this._rawHumanBones.getPose()}getNormalizedPose(){return this._normalizedHumanBones.getPose()}setPose(e){return console.warn("VRMHumanoid: setPose() is deprecated. Use either setRawPose() or setNormalizedPose() instead."),this.setRawPose(e)}setRawPose(e){return this._rawHumanBones.setPose(e)}setNormalizedPose(e){return this._normalizedHumanBones.setPose(e)}resetPose(){return console.warn("VRMHumanoid: resetPose() is deprecated. Use either resetRawPose() or resetNormalizedPose() instead."),this.resetRawPose()}resetRawPose(){return this._rawHumanBones.resetPose()}resetNormalizedPose(){return this._normalizedHumanBones.resetPose()}getBone(e){return console.warn("VRMHumanoid: getBone() is deprecated. Use either getRawBone() or getNormalizedBone() instead."),this.getRawBone(e)}getRawBone(e){return this._rawHumanBones.getBone(e)}getNormalizedBone(e){return this._normalizedHumanBones.getBone(e)}getBoneNode(e){return console.warn("VRMHumanoid: getBoneNode() is deprecated. Use either getRawBoneNode() or getNormalizedBoneNode() instead."),this.getRawBoneNode(e)}getRawBoneNode(e){return this._rawHumanBones.getBoneNode(e)}getNormalizedBoneNode(e){return this._normalizedHumanBones.getBoneNode(e)}update(){this.autoUpdateHumanBones&&this._normalizedHumanBones.update()}},pS={Hips:"hips",Spine:"spine",Head:"head",LeftUpperLeg:"leftUpperLeg",LeftLowerLeg:"leftLowerLeg",LeftFoot:"leftFoot",RightUpperLeg:"rightUpperLeg",RightLowerLeg:"rightLowerLeg",RightFoot:"rightFoot",LeftUpperArm:"leftUpperArm",LeftLowerArm:"leftLowerArm",LeftHand:"leftHand",RightUpperArm:"rightUpperArm",RightLowerArm:"rightLowerArm",RightHand:"rightHand"},mS=new Set(["1.0","1.0-beta"]),hm={leftThumbProximal:"leftThumbMetacarpal",leftThumbIntermediate:"leftThumbProximal",rightThumbProximal:"rightThumbMetacarpal",rightThumbIntermediate:"rightThumbProximal"},gS=class{get name(){return"VRMHumanoidLoaderPlugin"}constructor(n,e){this.parser=n,this.helperRoot=e?.helperRoot,this.autoUpdateHumanBones=e?.autoUpdateHumanBones}afterRoot(n){return pt(this,null,function*(){n.userData.vrmHumanoid=yield this._import(n)})}_import(n){return pt(this,null,function*(){let e=yield this._v1Import(n);if(e)return e;let t=yield this._v0Import(n);return t||null})}_v1Import(n){return pt(this,null,function*(){var e,t;let i=this.parser.json;if(!(((e=i.extensionsUsed)==null?void 0:e.indexOf("VRMC_vrm"))!==-1))return null;let s=(t=i.extensions)==null?void 0:t.VRMC_vrm;if(!s)return null;let o=s.specVersion;if(!mS.has(o))return console.warn(`VRMHumanoidLoaderPlugin: Unknown VRMC_vrm specVersion "${o}"`),null;let a=s.humanoid;if(!a)return null;let l=a.humanBones.leftThumbIntermediate!=null||a.humanBones.rightThumbIntermediate!=null,c={};a.humanBones!=null&&(yield Promise.all(Object.entries(a.humanBones).map(h=>pt(this,[h],function*([d,f]){let m=d,_=f.node;if(l){let g=hm[m];g!=null&&(m=g)}let p=yield this.parser.getDependency("node",_);if(p==null){console.warn(`A glTF node bound to the humanoid bone ${m} (index = ${_}) does not exist`);return}c[m]={node:p}}))));let u=new um(this._ensureRequiredBonesExist(c),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(n.scene.add(u.normalizedHumanBonesRoot),this.helperRoot){let h=new lm(u);this.helperRoot.add(h),h.renderOrder=this.helperRoot.renderOrder}return u})}_v0Import(n){return pt(this,null,function*(){var e;let i=(e=this.parser.json.extensions)==null?void 0:e.VRM;if(!i)return null;let r=i.humanoid;if(!r)return null;let s={};r.humanBones!=null&&(yield Promise.all(r.humanBones.map(a=>pt(this,null,function*(){let l=a.bone,c=a.node;if(l==null||c==null)return;if(c<0){console.warn(`A glTF node index for the humanoid bone ${l} is negative (${c}), ignoring this bone.`);return}let u=yield this.parser.getDependency("node",c);if(u==null){console.warn(`A glTF node bound to the humanoid bone ${l} (index = ${c}) does not exist`);return}let h=hm[l],d=h??l;if(s[d]!=null){console.warn(`Multiple bone entries for ${d} detected (index = ${c}), ignoring duplicated entries.`);return}s[d]={node:u}}))));let o=new um(this._ensureRequiredBonesExist(s),{autoUpdateHumanBones:this.autoUpdateHumanBones});if(n.scene.add(o.normalizedHumanBonesRoot),this.helperRoot){let a=new lm(o);this.helperRoot.add(a),a.renderOrder=this.helperRoot.renderOrder}return o})}_ensureRequiredBonesExist(n){let e=Object.values(pS).filter(t=>n[t]==null);if(e.length>0)throw new Error(`VRMHumanoidLoaderPlugin: These humanoid bones are required but not exist: ${e.join(", ")}`);return n}},dm=class extends Qe{constructor(){super(),this._currentTheta=0,this._currentRadius=0,this.theta=0,this.radius=0,this._currentTheta=0,this._currentRadius=0,this._attrPos=new Ke(new Float32Array(65*3),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Ke(new Uint16Array(3*63),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let n=!1;this._currentTheta!==this.theta&&(this._currentTheta=this.theta,n=!0),this._currentRadius!==this.radius&&(this._currentRadius=this.radius,n=!0),n&&this._buildPosition()}_buildPosition(){this._attrPos.setXYZ(0,0,0,0);for(let n=0;n<64;n++){let e=n/63*this._currentTheta;this._attrPos.setXYZ(n+1,this._currentRadius*Math.sin(e),0,this._currentRadius*Math.cos(e))}this._attrPos.needsUpdate=!0}_buildIndex(){for(let n=0;n<63;n++)this._attrIndex.setXYZ(n*3,0,n+1,n+2);this._attrIndex.needsUpdate=!0}},_S=class extends Qe{constructor(){super(),this.radius=0,this._currentRadius=0,this.tail=new R,this._currentTail=new R,this._attrPos=new Ke(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Ke(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let n=!1;this._currentRadius!==this.radius&&(this._currentRadius=this.radius,n=!0),this._currentTail.equals(this.tail)||(this._currentTail.copy(this.tail),n=!0),n&&this._buildPosition()}_buildPosition(){for(let n=0;n<32;n++){let e=n/16*Math.PI;this._attrPos.setXYZ(n,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+n,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+n,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let n=0;n<32;n++){let e=(n+1)%32;this._attrIndex.setXY(n*2,n,e),this._attrIndex.setXY(64+n*2,32+n,32+e),this._attrIndex.setXY(128+n*2,64+n,64+e)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}},Cc=new Ye,fm=new Ye,Qo=new R,pm=new R,mm=Math.sqrt(2)/2,xS=new Ye(0,0,-mm,mm),vS=new R(0,1,0),yS=class extends ft{constructor(n){super(),this.matrixAutoUpdate=!1,this.vrmLookAt=n;{let e=new dm;e.radius=.5;let t=new Tt({color:65280,transparent:!0,opacity:.5,side:Ut,depthTest:!1,depthWrite:!1});this._meshPitch=new Ct(e,t),this.add(this._meshPitch)}{let e=new dm;e.radius=.5;let t=new Tt({color:16711680,transparent:!0,opacity:.5,side:Ut,depthTest:!1,depthWrite:!1});this._meshYaw=new Ct(e,t),this.add(this._meshYaw)}{let e=new _S;e.radius=.1;let t=new Yt({color:16777215,depthTest:!1,depthWrite:!1});this._lineTarget=new hn(e,t),this._lineTarget.frustumCulled=!1,this.add(this._lineTarget)}}dispose(){this._meshYaw.geometry.dispose(),this._meshYaw.material.dispose(),this._meshPitch.geometry.dispose(),this._meshPitch.material.dispose(),this._lineTarget.geometry.dispose(),this._lineTarget.material.dispose()}updateMatrixWorld(n){let e=mt.DEG2RAD*this.vrmLookAt.yaw;this._meshYaw.geometry.theta=e,this._meshYaw.geometry.update();let t=mt.DEG2RAD*this.vrmLookAt.pitch;this._meshPitch.geometry.theta=t,this._meshPitch.geometry.update(),this.vrmLookAt.getLookAtWorldPosition(Qo),this.vrmLookAt.getLookAtWorldQuaternion(Cc),Cc.multiply(this.vrmLookAt.getFaceFrontQuaternion(fm)),this._meshYaw.position.copy(Qo),this._meshYaw.quaternion.copy(Cc),this._meshPitch.position.copy(Qo),this._meshPitch.quaternion.copy(Cc),this._meshPitch.quaternion.multiply(fm.setFromAxisAngle(vS,e)),this._meshPitch.quaternion.multiply(xS);let{target:i,autoUpdate:r}=this.vrmLookAt;i!=null&&r&&(i.getWorldPosition(pm).sub(Qo),this._lineTarget.geometry.tail.copy(pm),this._lineTarget.geometry.update(),this._lineTarget.position.copy(Qo)),super.updateMatrixWorld(n)}},MS=new R,SS=new R;function Md(n,e){return n.matrixWorld.decompose(MS,e,SS),e}function Lc(n){return[Math.atan2(-n.z,n.x),Math.atan2(n.y,Math.sqrt(n.x*n.x+n.z*n.z))]}function gm(n){let e=Math.round(n/2/Math.PI);return n-2*Math.PI*e}var _m=new R(0,0,1),ES=new R,bS=new R,TS=new R,wS=new Ye,cd=new Ye,xm=new Ye,AS=new Ye,ud=new ln,qm=class Ym{constructor(e,t){this.offsetFromHeadBone=new R,this.autoUpdate=!0,this.faceFront=new R(0,0,1),this.humanoid=e,this.applier=t,this._yaw=0,this._pitch=0,this._needsUpdate=!0,this._restHeadWorldQuaternion=this.getLookAtWorldQuaternion(new Ye)}get yaw(){return this._yaw}set yaw(e){this._yaw=e,this._needsUpdate=!0}get pitch(){return this._pitch}set pitch(e){this._pitch=e,this._needsUpdate=!0}get euler(){return console.warn("VRMLookAt: euler is deprecated. use getEuler() instead."),this.getEuler(new ln)}getEuler(e){return e.set(mt.DEG2RAD*this._pitch,mt.DEG2RAD*this._yaw,0,"YXZ")}copy(e){if(this.humanoid!==e.humanoid)throw new Error("VRMLookAt: humanoid must be same in order to copy");return this.offsetFromHeadBone.copy(e.offsetFromHeadBone),this.applier=e.applier,this.autoUpdate=e.autoUpdate,this.target=e.target,this.faceFront.copy(e.faceFront),this}clone(){return new Ym(this.humanoid,this.applier).copy(this)}reset(){this._yaw=0,this._pitch=0,this._needsUpdate=!0}getLookAtWorldPosition(e){let t=this.humanoid.getRawBoneNode("head");return e.copy(this.offsetFromHeadBone).applyMatrix4(t.matrixWorld)}getLookAtWorldQuaternion(e){let t=this.humanoid.getRawBoneNode("head");return Md(t,e)}getFaceFrontQuaternion(e){if(this.faceFront.distanceToSquared(_m)<.01)return e.copy(this._restHeadWorldQuaternion).invert();let[t,i]=Lc(this.faceFront);return ud.set(0,.5*Math.PI+t,i,"YZX"),e.setFromEuler(ud).premultiply(AS.copy(this._restHeadWorldQuaternion).invert())}getLookAtWorldDirection(e){return this.getLookAtWorldQuaternion(cd),this.getFaceFrontQuaternion(xm),e.copy(_m).applyQuaternion(cd).applyQuaternion(xm).applyEuler(this.getEuler(ud))}lookAt(e){let t=wS.copy(this._restHeadWorldQuaternion).multiply(km(this.getLookAtWorldQuaternion(cd))),i=this.getLookAtWorldPosition(bS),r=TS.copy(e).sub(i).applyQuaternion(t).normalize(),[s,o]=Lc(this.faceFront),[a,l]=Lc(r),c=gm(a-s),u=gm(o-l);this._yaw=mt.RAD2DEG*c,this._pitch=mt.RAD2DEG*u,this._needsUpdate=!0}update(e){this.target!=null&&this.autoUpdate&&this.lookAt(this.target.getWorldPosition(ES)),this._needsUpdate&&(this._needsUpdate=!1,this.applier.applyYawPitch(this._yaw,this._pitch))}};qm.EULER_ORDER="YXZ";var RS=qm,CS=new R(0,0,1),ui=new Ye,Is=new Ye,Ln=new ln(0,0,0,"YXZ"),Nc=class{constructor(n,e,t,i,r){this.humanoid=n,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=t,this.rangeMapVerticalDown=i,this.rangeMapVerticalUp=r,this.faceFront=new R(0,0,1),this._restQuatLeftEye=new Ye,this._restQuatRightEye=new Ye,this._restLeftEyeParentWorldQuat=new Ye,this._restRightEyeParentWorldQuat=new Ye;let s=this.humanoid.getRawBoneNode("leftEye"),o=this.humanoid.getRawBoneNode("rightEye");s&&(this._restQuatLeftEye.copy(s.quaternion),Md(s.parent,this._restLeftEyeParentWorldQuat)),o&&(this._restQuatRightEye.copy(o.quaternion),Md(o.parent,this._restRightEyeParentWorldQuat))}applyYawPitch(n,e){let t=this.humanoid.getRawBoneNode("leftEye"),i=this.humanoid.getRawBoneNode("rightEye"),r=this.humanoid.getNormalizedBoneNode("leftEye"),s=this.humanoid.getNormalizedBoneNode("rightEye");t&&(e<0?Ln.x=-mt.DEG2RAD*this.rangeMapVerticalDown.map(-e):Ln.x=mt.DEG2RAD*this.rangeMapVerticalUp.map(e),n<0?Ln.y=-mt.DEG2RAD*this.rangeMapHorizontalInner.map(-n):Ln.y=mt.DEG2RAD*this.rangeMapHorizontalOuter.map(n),ui.setFromEuler(Ln),this._getWorldFaceFrontQuat(Is),r.quaternion.copy(Is).multiply(ui).multiply(Is.invert()),ui.copy(this._restLeftEyeParentWorldQuat),t.quaternion.copy(r.quaternion).multiply(ui).premultiply(ui.invert()).multiply(this._restQuatLeftEye)),i&&(e<0?Ln.x=-mt.DEG2RAD*this.rangeMapVerticalDown.map(-e):Ln.x=mt.DEG2RAD*this.rangeMapVerticalUp.map(e),n<0?Ln.y=-mt.DEG2RAD*this.rangeMapHorizontalOuter.map(-n):Ln.y=mt.DEG2RAD*this.rangeMapHorizontalInner.map(n),ui.setFromEuler(Ln),this._getWorldFaceFrontQuat(Is),s.quaternion.copy(Is).multiply(ui).multiply(Is.invert()),ui.copy(this._restRightEyeParentWorldQuat),i.quaternion.copy(s.quaternion).multiply(ui).premultiply(ui.invert()).multiply(this._restQuatRightEye))}lookAt(n){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=mt.RAD2DEG*n.y,t=mt.RAD2DEG*n.x;this.applyYawPitch(e,t)}_getWorldFaceFrontQuat(n){if(this.faceFront.distanceToSquared(CS)<.01)return n.identity();let[e,t]=Lc(this.faceFront);return Ln.set(0,.5*Math.PI+e,t,"YZX"),n.setFromEuler(Ln)}};Nc.type="bone";var Sd=class{constructor(n,e,t,i,r){this.expressions=n,this.rangeMapHorizontalInner=e,this.rangeMapHorizontalOuter=t,this.rangeMapVerticalDown=i,this.rangeMapVerticalUp=r}applyYawPitch(n,e){e<0?(this.expressions.setValue("lookDown",0),this.expressions.setValue("lookUp",this.rangeMapVerticalUp.map(-e))):(this.expressions.setValue("lookUp",0),this.expressions.setValue("lookDown",this.rangeMapVerticalDown.map(e))),n<0?(this.expressions.setValue("lookLeft",0),this.expressions.setValue("lookRight",this.rangeMapHorizontalOuter.map(-n))):(this.expressions.setValue("lookRight",0),this.expressions.setValue("lookLeft",this.rangeMapHorizontalOuter.map(n)))}lookAt(n){console.warn("VRMLookAtBoneApplier: lookAt() is deprecated. use apply() instead.");let e=mt.RAD2DEG*n.y,t=mt.RAD2DEG*n.x;this.applyYawPitch(e,t)}};Sd.type="expression";var vm=class{constructor(n,e){this.inputMaxValue=n,this.outputScale=e}map(n){return this.outputScale*Dm(n/this.inputMaxValue)}},PS=new Set(["1.0","1.0-beta"]),Pc=.01,IS=class{get name(){return"VRMLookAtLoaderPlugin"}constructor(n,e){this.parser=n,this.helperRoot=e?.helperRoot}afterRoot(n){return pt(this,null,function*(){let e=n.userData.vrmHumanoid;if(e===null)return;if(e===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmHumanoid is undefined. VRMHumanoidLoaderPlugin have to be used first");let t=n.userData.vrmExpressionManager;if(t!==null){if(t===void 0)throw new Error("VRMLookAtLoaderPlugin: vrmExpressionManager is undefined. VRMExpressionLoaderPlugin have to be used first");n.userData.vrmLookAt=yield this._import(n,e,t)}})}_import(n,e,t){return pt(this,null,function*(){if(e==null||t==null)return null;let i=yield this._v1Import(n,e,t);if(i)return i;let r=yield this._v0Import(n,e,t);return r||null})}_v1Import(n,e,t){return pt(this,null,function*(){var i,r,s;let o=this.parser.json;if(!(((i=o.extensionsUsed)==null?void 0:i.indexOf("VRMC_vrm"))!==-1))return null;let l=(r=o.extensions)==null?void 0:r.VRMC_vrm;if(!l)return null;let c=l.specVersion;if(!PS.has(c))return console.warn(`VRMLookAtLoaderPlugin: Unknown VRMC_vrm specVersion "${c}"`),null;let u=l.lookAt;if(!u)return null;let h=u.type==="expression"?1:10,d=this._v1ImportRangeMap(u.rangeMapHorizontalInner,h),f=this._v1ImportRangeMap(u.rangeMapHorizontalOuter,h),m=this._v1ImportRangeMap(u.rangeMapVerticalDown,h),_=this._v1ImportRangeMap(u.rangeMapVerticalUp,h),p;u.type==="expression"?p=new Sd(t,d,f,m,_):p=new Nc(e,d,f,m,_);let g=this._importLookAt(e,p);return g.offsetFromHeadBone.fromArray((s=u.offsetFromHeadBone)!=null?s:[0,.06,0]),g})}_v1ImportRangeMap(n,e){var t,i;let r=(t=n?.inputMaxValue)!=null?t:90,s=(i=n?.outputScale)!=null?i:e;return r<Pc&&(console.warn("VRMLookAtLoaderPlugin: inputMaxValue of a range map is too small. Consider reviewing the range map!"),r=Pc),new vm(r,s)}_v0Import(n,e,t){return pt(this,null,function*(){var i,r,s,o;let l=(i=this.parser.json.extensions)==null?void 0:i.VRM;if(!l)return null;let c=l.firstPerson;if(!c)return null;let u=c.lookAtTypeName==="BlendShape"?1:10,h=this._v0ImportDegreeMap(c.lookAtHorizontalInner,u),d=this._v0ImportDegreeMap(c.lookAtHorizontalOuter,u),f=this._v0ImportDegreeMap(c.lookAtVerticalDown,u),m=this._v0ImportDegreeMap(c.lookAtVerticalUp,u),_;c.lookAtTypeName==="BlendShape"?_=new Sd(t,h,d,f,m):_=new Nc(e,h,d,f,m);let p=this._importLookAt(e,_);return c.firstPersonBoneOffset?p.offsetFromHeadBone.set((r=c.firstPersonBoneOffset.x)!=null?r:0,(s=c.firstPersonBoneOffset.y)!=null?s:.06,-((o=c.firstPersonBoneOffset.z)!=null?o:0)):p.offsetFromHeadBone.set(0,.06,0),p.faceFront.set(0,0,-1),_ instanceof Nc&&_.faceFront.set(0,0,-1),p})}_v0ImportDegreeMap(n,e){var t,i;let r=n?.curve;JSON.stringify(r)!=="[0,0,0,1,1,1,1,0]"&&console.warn("Curves of LookAtDegreeMap defined in VRM 0.0 are not supported");let s=(t=n?.xRange)!=null?t:90,o=(i=n?.yRange)!=null?i:e;return s<Pc&&(console.warn("VRMLookAtLoaderPlugin: xRange of a degree map is too small. Consider reviewing the degree map!"),s=Pc),new vm(s,o)}_importLookAt(n,e){let t=new RS(n,e);if(this.helperRoot){let i=new yS(t);this.helperRoot.add(i),i.renderOrder=this.helperRoot.renderOrder}return t}};function LS(n,e){return typeof n!="string"||n===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(n)&&(e=e.replace(/(^https?:\/\/[^/]+).*/i,"$1")),/^(https?:)?\/\//i.test(n)||/^data:.*,.*$/i.test(n)||/^blob:.*$/i.test(n)?n:e+n)}var NS=new Set(["1.0","1.0-beta"]),US=class{get name(){return"VRMMetaLoaderPlugin"}constructor(n,e){var t,i,r;this.parser=n,this.needThumbnailImage=(t=e?.needThumbnailImage)!=null?t:!1,this.acceptLicenseUrls=(i=e?.acceptLicenseUrls)!=null?i:["https://vrm.dev/licenses/1.0/"],this.acceptV0Meta=(r=e?.acceptV0Meta)!=null?r:!0}afterRoot(n){return pt(this,null,function*(){n.userData.vrmMeta=yield this._import(n)})}_import(n){return pt(this,null,function*(){let e=yield this._v1Import(n);if(e!=null)return e;let t=yield this._v0Import(n);return t??null})}_v1Import(n){return pt(this,null,function*(){var e,t,i;let r=this.parser.json;if(!(((e=r.extensionsUsed)==null?void 0:e.indexOf("VRMC_vrm"))!==-1))return null;let o=(t=r.extensions)==null?void 0:t.VRMC_vrm;if(o==null)return null;let a=o.specVersion;if(!NS.has(a))return console.warn(`VRMMetaLoaderPlugin: Unknown VRMC_vrm specVersion "${a}"`),null;let l=o.meta;if(!l)return null;let c=l.licenseUrl;if(!new Set(this.acceptLicenseUrls).has(c))throw new Error(`VRMMetaLoaderPlugin: The license url "${c}" is not accepted`);let h;return this.needThumbnailImage&&l.thumbnailImage!=null&&(h=(i=yield this._extractGLTFImage(l.thumbnailImage))!=null?i:void 0),{metaVersion:"1",name:l.name,version:l.version,authors:l.authors,copyrightInformation:l.copyrightInformation,contactInformation:l.contactInformation,references:l.references,thirdPartyLicenses:l.thirdPartyLicenses,thumbnailImage:h,licenseUrl:l.licenseUrl,avatarPermission:l.avatarPermission,allowExcessivelyViolentUsage:l.allowExcessivelyViolentUsage,allowExcessivelySexualUsage:l.allowExcessivelySexualUsage,commercialUsage:l.commercialUsage,allowPoliticalOrReligiousUsage:l.allowPoliticalOrReligiousUsage,allowAntisocialOrHateUsage:l.allowAntisocialOrHateUsage,creditNotation:l.creditNotation,allowRedistribution:l.allowRedistribution,modification:l.modification,otherLicenseUrl:l.otherLicenseUrl}})}_v0Import(n){return pt(this,null,function*(){var e;let i=(e=this.parser.json.extensions)==null?void 0:e.VRM;if(!i)return null;let r=i.meta;if(!r)return null;if(!this.acceptV0Meta)throw new Error("VRMMetaLoaderPlugin: Attempted to load VRM0.0 meta but acceptV0Meta is false");let s;return this.needThumbnailImage&&r.texture!=null&&r.texture!==-1&&(s=yield this.parser.getDependency("texture",r.texture)),{metaVersion:"0",allowedUserName:r.allowedUserName,author:r.author,commercialUssageName:r.commercialUssageName,contactInformation:r.contactInformation,licenseName:r.licenseName,otherLicenseUrl:r.otherLicenseUrl,otherPermissionUrl:r.otherPermissionUrl,reference:r.reference,sexualUssageName:r.sexualUssageName,texture:s??void 0,title:r.title,version:r.version,violentUssageName:r.violentUssageName}})}_extractGLTFImage(n){return pt(this,null,function*(){var e;let i=(e=this.parser.json.images)==null?void 0:e[n];if(i==null)return console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${n}] of glTF as a thumbnail but the image doesn't exist`),null;let r=i.uri;if(i.bufferView!=null){let o=yield this.parser.getDependency("bufferView",i.bufferView),a=new Blob([o],{type:i.mimeType});r=URL.createObjectURL(a)}return r==null?(console.warn(`VRMMetaLoaderPlugin: Attempt to use images[${n}] of glTF as a thumbnail but the image couldn't load properly`),null):yield new _s().loadAsync(LS(r,this.parser.options.path)).catch(o=>(console.error(o),console.warn("VRMMetaLoaderPlugin: Failed to load a thumbnail image"),null))})}},DS=class{constructor(n){this.scene=n.scene,this.meta=n.meta,this.humanoid=n.humanoid,this.expressionManager=n.expressionManager,this.firstPerson=n.firstPerson,this.lookAt=n.lookAt}update(n){this.humanoid.update(),this.lookAt&&this.lookAt.update(n),this.expressionManager&&this.expressionManager.update()}};var OS=class extends DS{constructor(n){super(n),this.materials=n.materials,this.springBoneManager=n.springBoneManager,this.nodeConstraintManager=n.nodeConstraintManager}update(n){super.update(n),this.nodeConstraintManager&&this.nodeConstraintManager.update(),this.springBoneManager&&this.springBoneManager.update(n),this.materials&&this.materials.forEach(e=>{e.update&&e.update(n)})}},FS=Object.defineProperty,ym=Object.getOwnPropertySymbols,BS=Object.prototype.hasOwnProperty,HS=Object.prototype.propertyIsEnumerable,Mm=(n,e,t)=>e in n?FS(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,Sm=(n,e)=>{for(var t in e||(e={}))BS.call(e,t)&&Mm(n,t,e[t]);if(ym)for(var t of ym(e))HS.call(e,t)&&Mm(n,t,e[t]);return n},Rr=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(n,e)).next())}),VS={"":3e3,srgb:3001};function zS(n,e){parseInt(kn,10)>=152?n.colorSpace=e:n.encoding=VS[e]}var GS=class{get pending(){return Promise.all(this._pendings)}constructor(n,e){this._parser=n,this._materialParams=e,this._pendings=[]}assignPrimitive(n,e){e!=null&&(this._materialParams[n]=e)}assignColor(n,e,t){if(e!=null){let i=new Me().fromArray(e);t&&i.convertSRGBToLinear(),this._materialParams[n]=i}}assignTexture(n,e,t){return Rr(this,null,function*(){let i=Rr(this,null,function*(){if(e!=null){let r=yield this._parser.assignTexture(this._materialParams,n,e);if(r==null){console.warn("GLTFMToonMaterialParamsAssignHelper: Failed to load texture. The rendering result may be wrong");return}t&&zS(r,"srgb")}});return this._pendings.push(i),i})}assignTextureByIndex(n,e,t){return Rr(this,null,function*(){return this.assignTexture(n,e!=null?{index:e}:void 0,t)})}},kS=`// #define PHONG

varying vec3 vViewPosition;

#ifndef FLAT_SHADED
  varying vec3 vNormal;
#endif

#include <common>

// #include <uv_pars_vertex>
#ifdef MTOON_USE_UV
  varying vec2 vUv;

  // COMPAT: pre-r151 uses a common uvTransform
  #if THREE_VRM_THREE_REVISION < 151
    uniform mat3 uvTransform;
  #endif
#endif

// #include <uv2_pars_vertex>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    attribute vec2 uv2;
    varying vec2 vUv2;
    uniform mat3 uv2Transform;
  #endif
#endif

// #include <displacementmap_pars_vertex>
// #include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
  uniform sampler2D outlineWidthMultiplyTexture;
  uniform mat3 outlineWidthMultiplyTextureUvTransform;
#endif

uniform float outlineWidthFactor;

void main() {

  // #include <uv_vertex>
  #ifdef MTOON_USE_UV
    // COMPAT: pre-r151 uses a common uvTransform
    #if THREE_VRM_THREE_REVISION >= 151
      vUv = uv;
    #else
      vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
    #endif
  #endif

  // #include <uv2_vertex>
  // COMAPT: pre-r151 uses uv2 for lightMap and aoMap
  #if THREE_VRM_THREE_REVISION < 151
    #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
      vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;
    #endif
  #endif

  #include <color_vertex>

  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>

  // we need this to compute the outline properly
  objectNormal = normalize( objectNormal );

  #include <defaultnormal_vertex>

  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
    vNormal = normalize( transformedNormal );
  #endif

  #include <begin_vertex>

  #include <morphtarget_vertex>
  #include <skinning_vertex>
  // #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  vViewPosition = - mvPosition.xyz;

  #ifdef OUTLINE
    float worldNormalLength = length( transformedNormal );
    vec3 outlineOffset = outlineWidthFactor * worldNormalLength * objectNormal;

    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;
      float outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;
      outlineOffset *= outlineTex;
    #endif

    #ifdef OUTLINE_WIDTH_SCREEN
      outlineOffset *= vViewPosition.z / projectionMatrix[ 1 ].y;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * vec4( outlineOffset + transformed, 1.0 );

    gl_Position.z += 1E-6 * gl_Position.w; // anti-artifact magic
  #endif

  #include <worldpos_vertex>
  // #include <envmap_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>

}`,WS=`// #define PHONG

uniform vec3 litFactor;

uniform float opacity;

uniform vec3 shadeColorFactor;
#ifdef USE_SHADEMULTIPLYTEXTURE
  uniform sampler2D shadeMultiplyTexture;
  uniform mat3 shadeMultiplyTextureUvTransform;
#endif

uniform float shadingShiftFactor;
uniform float shadingToonyFactor;

#ifdef USE_SHADINGSHIFTTEXTURE
  uniform sampler2D shadingShiftTexture;
  uniform mat3 shadingShiftTextureUvTransform;
  uniform float shadingShiftTextureScale;
#endif

uniform float giEqualizationFactor;

uniform vec3 parametricRimColorFactor;
#ifdef USE_RIMMULTIPLYTEXTURE
  uniform sampler2D rimMultiplyTexture;
  uniform mat3 rimMultiplyTextureUvTransform;
#endif
uniform float rimLightingMixFactor;
uniform float parametricRimFresnelPowerFactor;
uniform float parametricRimLiftFactor;

#ifdef USE_MATCAPTEXTURE
  uniform vec3 matcapFactor;
  uniform sampler2D matcapTexture;
  uniform mat3 matcapTextureUvTransform;
#endif

uniform vec3 emissive;
uniform float emissiveIntensity;

uniform vec3 outlineColorFactor;
uniform float outlineLightingMixFactor;

#ifdef USE_UVANIMATIONMASKTEXTURE
  uniform sampler2D uvAnimationMaskTexture;
  uniform mat3 uvAnimationMaskTextureUvTransform;
#endif

uniform float uvAnimationScrollXOffset;
uniform float uvAnimationScrollYOffset;
uniform float uvAnimationRotationPhase;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>

// #include <uv_pars_fragment>
#if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
  varying vec2 vUv;
#endif

// #include <uv2_pars_fragment>
// COMAPT: pre-r151 uses uv2 for lightMap and aoMap
#if THREE_VRM_THREE_REVISION < 151
  #if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    varying vec2 vUv2;
  #endif
#endif

#include <map_pars_fragment>

#ifdef USE_MAP
  uniform mat3 mapUvTransform;
#endif

// #include <alphamap_pars_fragment>

#include <alphatest_pars_fragment>

#include <aomap_pars_fragment>
// #include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>

#ifdef USE_EMISSIVEMAP
  uniform mat3 emissiveMapUvTransform;
#endif

// #include <envmap_common_pars_fragment>
// #include <envmap_pars_fragment>
// #include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>

// #include <bsdfs>
// COMPAT: pre-r151 doesn't have BRDF_Lambert in <common>
#if THREE_VRM_THREE_REVISION < 151
  vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
    return RECIPROCAL_PI * diffuseColor;
  }
#endif

#include <lights_pars_begin>

#include <normal_pars_fragment>

// #include <lights_phong_pars_fragment>
varying vec3 vViewPosition;

struct MToonMaterial {
  vec3 diffuseColor;
  vec3 shadeColor;
  float shadingShift;
};

float linearstep( float a, float b, float t ) {
  return clamp( ( t - a ) / ( b - a ), 0.0, 1.0 );
}

/**
 * Convert NdotL into toon shading factor using shadingShift and shadingToony
 */
float getShading(
  const in float dotNL,
  const in float shadow,
  const in float shadingShift
) {
  float shading = dotNL;
  shading = shading + shadingShift;
  shading = linearstep( -1.0 + shadingToonyFactor, 1.0 - shadingToonyFactor, shading );
  shading *= shadow;
  return shading;
}

/**
 * Mix diffuseColor and shadeColor using shading factor and light color
 */
vec3 getDiffuse(
  const in MToonMaterial material,
  const in float shading,
  in vec3 lightColor
) {
  #ifdef DEBUG_LITSHADERATE
    return vec3( BRDF_Lambert( shading * lightColor ) );
  #endif

  vec3 col = lightColor * BRDF_Lambert( mix( material.shadeColor, material.diffuseColor, shading ) );

  // The "comment out if you want to PBR absolutely" line
  #ifdef V0_COMPAT_SHADE
    col = min( col, material.diffuseColor );
  #endif

  return col;
}

// COMPAT: pre-r156 uses a struct GeometricContext
#if THREE_VRM_THREE_REVISION >= 157
  void RE_Direct_MToon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometryNormal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#else
  void RE_Direct_MToon( const in IncidentLight directLight, const in GeometricContext geometry, const in MToonMaterial material, const in float shadow, inout ReflectedLight reflectedLight ) {
    float dotNL = clamp( dot( geometry.normal, directLight.direction ), -1.0, 1.0 );
    vec3 irradiance = directLight.color;

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;

    irradiance *= dotNL;

    float shading = getShading( dotNL, shadow, material.shadingShift );

    // toon shaded diffuse
    reflectedLight.directDiffuse += getDiffuse( material, shading, directLight.color );
  }

  void RE_IndirectDiffuse_MToon( const in vec3 irradiance, const in GeometricContext geometry, const in MToonMaterial material, inout ReflectedLight reflectedLight ) {
    // indirect diffuse will use diffuseColor, no shadeColor involved
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );

    // directSpecular will be used for rim lighting, not an actual specular
    reflectedLight.directSpecular += irradiance;
  }
#endif

#define RE_Direct RE_Direct_MToon
#define RE_IndirectDiffuse RE_IndirectDiffuse_MToon
#define Material_LightProbeLOD( material ) (0)

#include <shadowmap_pars_fragment>
// #include <bumpmap_pars_fragment>

// #include <normalmap_pars_fragment>
#ifdef USE_NORMALMAP

  uniform sampler2D normalMap;
  uniform mat3 normalMapUvTransform;
  uniform vec2 normalScale;

#endif

// COMPAT: pre-r151
// USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
#if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

  uniform mat3 normalMatrix;

#endif

// COMPAT: pre-r151
// USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( TANGENTSPACE_NORMALMAP ) )

  // Per-Pixel Tangent Space Normal Mapping
  // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html

  // three-vrm specific change: it requires \`uv\` as an input in order to support uv scrolls

  // Temporary compat against shader change @ Three.js r126, r151
  #if THREE_VRM_THREE_REVISION >= 151

    mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {

      vec3 q0 = dFdx( eye_pos.xyz );
      vec3 q1 = dFdy( eye_pos.xyz );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = surf_norm;

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );

      return mat3( T * scale, B * scale, N );

    }

  #else

    vec3 perturbNormal2Arb( vec2 uv, vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {

      vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
      vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
      vec2 st0 = dFdx( uv.st );
      vec2 st1 = dFdy( uv.st );

      vec3 N = normalize( surf_norm );

      vec3 q1perp = cross( q1, N );
      vec3 q0perp = cross( N, q0 );

      vec3 T = q1perp * st0.x + q0perp * st1.x;
      vec3 B = q1perp * st0.y + q0perp * st1.y;

      // three-vrm specific change: Workaround for the issue that happens when delta of uv = 0.0
      // TODO: Is this still required? Or shall I make a PR about it?
      if ( length( T ) == 0.0 || length( B ) == 0.0 ) {
        return surf_norm;
      }

      float det = max( dot( T, T ), dot( B, B ) );
      float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );

      return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );

    }

  #endif

#endif

// #include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// == post correction ==========================================================
void postCorrection() {
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}

// == main procedure ===========================================================
void main() {
  #include <clipping_planes_fragment>

  vec2 uv = vec2(0.5, 0.5);

  #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
    uv = vUv;

    float uvAnimMask = 1.0;
    #ifdef USE_UVANIMATIONMASKTEXTURE
      vec2 uvAnimationMaskTextureUv = ( uvAnimationMaskTextureUvTransform * vec3( uv, 1 ) ).xy;
      uvAnimMask = texture2D( uvAnimationMaskTexture, uvAnimationMaskTextureUv ).b;
    #endif

    float uvRotCos = cos( uvAnimationRotationPhase * uvAnimMask );
    float uvRotSin = sin( uvAnimationRotationPhase * uvAnimMask );
    uv = mat2( uvRotCos, -uvRotSin, uvRotSin, uvRotCos ) * ( uv - 0.5 ) + 0.5;
    uv = uv + vec2( uvAnimationScrollXOffset, uvAnimationScrollYOffset ) * uvAnimMask;
  #endif

  #ifdef DEBUG_UV
    gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
    #if ( defined( MTOON_USE_UV ) && !defined( MTOON_UVS_VERTEX_ONLY ) )
      gl_FragColor = vec4( uv, 0.0, 1.0 );
    #endif
    return;
  #endif

  vec4 diffuseColor = vec4( litFactor, opacity );
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  vec3 totalEmissiveRadiance = emissive * emissiveIntensity;

  #include <logdepthbuf_fragment>

  // #include <map_fragment>
  #ifdef USE_MAP
    vec2 mapUv = ( mapUvTransform * vec3( uv, 1 ) ).xy;
    vec4 sampledDiffuseColor = texture2D( map, mapUv );
    #ifdef DECODE_VIDEO_TEXTURE
      sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
    #endif
    diffuseColor *= sampledDiffuseColor;
  #endif

  // #include <color_fragment>
  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    diffuseColor.rgb *= vColor;
  #endif

  // #include <alphamap_fragment>

  #include <alphatest_fragment>

  // #include <specularmap_fragment>

  // #include <normal_fragment_begin>
  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;

  #ifdef FLAT_SHADED

    vec3 fdx = dFdx( vViewPosition );
    vec3 fdy = dFdy( vViewPosition );
    vec3 normal = normalize( cross( fdx, fdy ) );

  #else

    vec3 normal = normalize( vNormal );

    #ifdef DOUBLE_SIDED

      normal *= faceDirection;

    #endif

  #endif

  #ifdef USE_NORMALMAP

    vec2 normalMapUv = ( normalMapUvTransform * vec3( uv, 1 ) ).xy;

  #endif

  #ifdef USE_NORMALMAP_TANGENTSPACE

    #ifdef USE_TANGENT

      mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn = getTangentFrame( - vViewPosition, normal, normalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn[0] *= faceDirection;
      tbn[1] *= faceDirection;

    #endif

  #endif

  #ifdef USE_CLEARCOAT_NORMALMAP

    #ifdef USE_TANGENT

      mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );

    #else

      mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );

    #endif

    #if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )

      tbn2[0] *= faceDirection;
      tbn2[1] *= faceDirection;

    #endif

  #endif

  // non perturbed normal for clearcoat among others

  vec3 nonPerturbedNormal = normal;

  #ifdef OUTLINE
    normal *= -1.0;
  #endif

  // #include <normal_fragment_maps>

  // COMPAT: pre-r151
  // USE_NORMALMAP_OBJECTSPACE used to be OBJECTSPACE_NORMALMAP in pre-r151
  #if defined( USE_NORMALMAP_OBJECTSPACE ) || defined( OBJECTSPACE_NORMALMAP )

    normal = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals

    #ifdef FLIP_SIDED

      normal = - normal;

    #endif

    #ifdef DOUBLE_SIDED

      normal = normal * faceDirection;

    #endif

    normal = normalize( normalMatrix * normal );

  // COMPAT: pre-r151
  // USE_NORMALMAP_TANGENTSPACE used to be TANGENTSPACE_NORMALMAP in pre-r151
  #elif defined( USE_NORMALMAP_TANGENTSPACE ) || defined( TANGENTSPACE_NORMALMAP )

    vec3 mapN = texture2D( normalMap, normalMapUv ).xyz * 2.0 - 1.0;
    mapN.xy *= normalScale;

    // COMPAT: pre-r151
    #if THREE_VRM_THREE_REVISION >= 151 || defined( USE_TANGENT )

      normal = normalize( tbn * mapN );

    #else

      normal = perturbNormal2Arb( uv, -vViewPosition, normal, mapN, faceDirection );

    #endif

  #endif

  // #include <emissivemap_fragment>
  #ifdef USE_EMISSIVEMAP
    vec2 emissiveMapUv = ( emissiveMapUvTransform * vec3( uv, 1 ) ).xy;
    totalEmissiveRadiance *= texture2D( emissiveMap, emissiveMapUv ).rgb;
  #endif

  #ifdef DEBUG_NORMAL
    gl_FragColor = vec4( 0.5 + 0.5 * normal, 1.0 );
    return;
  #endif

  // -- MToon: lighting --------------------------------------------------------
  // accumulation
  // #include <lights_phong_fragment>
  MToonMaterial material;

  material.diffuseColor = diffuseColor.rgb;

  material.shadeColor = shadeColorFactor;
  #ifdef USE_SHADEMULTIPLYTEXTURE
    vec2 shadeMultiplyTextureUv = ( shadeMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadeColor *= texture2D( shadeMultiplyTexture, shadeMultiplyTextureUv ).rgb;
  #endif

  #if ( defined( USE_COLOR ) && !defined( IGNORE_VERTEX_COLOR ) )
    material.shadeColor.rgb *= vColor;
  #endif

  material.shadingShift = shadingShiftFactor;
  #ifdef USE_SHADINGSHIFTTEXTURE
    vec2 shadingShiftTextureUv = ( shadingShiftTextureUvTransform * vec3( uv, 1 ) ).xy;
    material.shadingShift += texture2D( shadingShiftTexture, shadingShiftTextureUv ).r * shadingShiftTextureScale;
  #endif

  // #include <lights_fragment_begin>

  // MToon Specific changes:
  // Since we want to take shadows into account of shading instead of irradiance,
  // we had to modify the codes that multiplies the results of shadowmap into color of direct lights.

  // COMPAT: pre-r156 uses a struct GeometricContext
  #if THREE_VRM_THREE_REVISION >= 157
    vec3 geometryPosition = - vViewPosition;
    vec3 geometryNormal = normal;
    vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    vec3 geometryClearcoatNormal;

    #ifdef USE_CLEARCOAT

      geometryClearcoatNormal = clearcoatNormal;

    #endif
  #else
    GeometricContext geometry;

    geometry.position = - vViewPosition;
    geometry.normal = normal;
    geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

    #ifdef USE_CLEARCOAT

      geometry.clearcoatNormal = clearcoatNormal;

    #endif
  #endif

  IncidentLight directLight;

  // since these variables will be used in unrolled loop, we have to define in prior
  float shadow;

  #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

    PointLight pointLight;
    #if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
    PointLightShadow pointLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

      pointLight = pointLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getPointLightInfo( pointLight, geometryPosition, directLight );
      #else
        getPointLightInfo( pointLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
      pointLightShadow = pointLightShadows[ i ];
      // COMPAT: pre-r166
      // r166 introduced shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
      #else
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
      #endif
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

    SpotLight spotLight;
    // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS, r144+ uses NUM_SPOT_LIGHT_COORDS
    #if THREE_VRM_THREE_REVISION >= 144
      #if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_COORDS > 0
      SpotLightShadow spotLightShadow;
      #endif
    #elif defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
    SpotLightShadow spotLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

      spotLight = spotLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getSpotLightInfo( spotLight, geometryPosition, directLight );
      #else
        getSpotLightInfo( spotLight, geometry, directLight );
      #endif

      shadow = 1.0;
      // COMPAT: pre-r144 uses NUM_SPOT_LIGHT_SHADOWS and vSpotShadowCoord, r144+ uses NUM_SPOT_LIGHT_COORDS and vSpotLightCoord
      // COMPAT: pre-r166 does not have shadowIntensity, r166+ has shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )
        spotLightShadow = spotLightShadows[ i ];
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
        #endif
      #elif THREE_VRM_THREE_REVISION >= 144
        #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_COORDS )
        spotLightShadow = spotLightShadows[ i ];
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
        #endif
      #elif defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
      spotLightShadow = spotLightShadows[ i ];
      shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

    DirectionalLight directionalLight;
    #if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
    DirectionalLightShadow directionalLightShadow;
    #endif

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

      directionalLight = directionalLights[ i ];

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        getDirectionalLightInfo( directionalLight, directLight );
      #else
        getDirectionalLightInfo( directionalLight, geometry, directLight );
      #endif

      shadow = 1.0;
      #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
      directionalLightShadow = directionalLightShadows[ i ];
      // COMPAT: pre-r166
      // r166 introduced shadowIntensity
      #if THREE_VRM_THREE_REVISION >= 166
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
      #else
        shadow = all( bvec2( directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
      #endif
      #endif

      // COMPAT: pre-r156 uses a struct GeometricContext
      #if THREE_VRM_THREE_REVISION >= 157
        RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, shadow, reflectedLight );
      #else
        RE_Direct( directLight, geometry, material, shadow, reflectedLight );
      #endif

    }
    #pragma unroll_loop_end

  #endif

  // #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

  //   RectAreaLight rectAreaLight;

  //   #pragma unroll_loop_start
  //   for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

  //     rectAreaLight = rectAreaLights[ i ];
  //     RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

  //   }
  //   #pragma unroll_loop_end

  // #endif

  #if defined( RE_IndirectDiffuse )

    vec3 iblIrradiance = vec3( 0.0 );

    vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

    // COMPAT: pre-r156 uses a struct GeometricContext
    // COMPAT: pre-r156 doesn't have a define USE_LIGHT_PROBES
    #if THREE_VRM_THREE_REVISION >= 157
      #if defined( USE_LIGHT_PROBES )
        irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
      #endif
    #else
      irradiance += getLightProbeIrradiance( lightProbe, geometry.normal );
    #endif

    #if ( NUM_HEMI_LIGHTS > 0 )

      #pragma unroll_loop_start
      for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

        // COMPAT: pre-r156 uses a struct GeometricContext
        #if THREE_VRM_THREE_REVISION >= 157
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
        #else
          irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
        #endif

      }
      #pragma unroll_loop_end

    #endif

  #endif

  // #if defined( RE_IndirectSpecular )

  //   vec3 radiance = vec3( 0.0 );
  //   vec3 clearcoatRadiance = vec3( 0.0 );

  // #endif

  #include <lights_fragment_maps>
  #include <lights_fragment_end>

  // modulation
  #include <aomap_fragment>

  vec3 col = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;

  #ifdef DEBUG_LITSHADERATE
    gl_FragColor = vec4( col, diffuseColor.a );
    postCorrection();
    return;
  #endif

  // -- MToon: rim lighting -----------------------------------------
  vec3 viewDir = normalize( vViewPosition );

  #ifndef PHYSICALLY_CORRECT_LIGHTS
    reflectedLight.directSpecular /= PI;
  #endif
  vec3 rimMix = mix( vec3( 1.0 ), reflectedLight.directSpecular, rimLightingMixFactor );

  vec3 rim = parametricRimColorFactor * pow( saturate( 1.0 - dot( viewDir, normal ) + parametricRimLiftFactor ), parametricRimFresnelPowerFactor );

  #ifdef USE_MATCAPTEXTURE
    {
      vec3 x = normalize( vec3( viewDir.z, 0.0, -viewDir.x ) );
      vec3 y = cross( viewDir, x ); // guaranteed to be normalized
      vec2 sphereUv = 0.5 + 0.5 * vec2( dot( x, normal ), -dot( y, normal ) );
      sphereUv = ( matcapTextureUvTransform * vec3( sphereUv, 1 ) ).xy;
      vec3 matcap = texture2D( matcapTexture, sphereUv ).rgb;
      rim += matcapFactor * matcap;
    }
  #endif

  #ifdef USE_RIMMULTIPLYTEXTURE
    vec2 rimMultiplyTextureUv = ( rimMultiplyTextureUvTransform * vec3( uv, 1 ) ).xy;
    rim *= texture2D( rimMultiplyTexture, rimMultiplyTextureUv ).rgb;
  #endif

  col += rimMix * rim;

  // -- MToon: Emission --------------------------------------------------------
  col += totalEmissiveRadiance;

  // #include <envmap_fragment>

  // -- Almost done! -----------------------------------------------------------
  #if defined( OUTLINE )
    col = outlineColorFactor.rgb * mix( vec3( 1.0 ), col, outlineLightingMixFactor );
  #endif

  #ifdef OPAQUE
    diffuseColor.a = 1.0;
  #endif

  gl_FragColor = vec4( col, diffuseColor.a );
  postCorrection();
}
`,XS={None:"none",Normal:"normal",LitShadeRate:"litShadeRate",UV:"uv"},Em={None:"none",WorldCoordinates:"worldCoordinates",ScreenCoordinates:"screenCoordinates"},qS={3e3:"",3001:"srgb"};function hd(n){return parseInt(kn,10)>=152?n.colorSpace:qS[n.encoding]}var YS=class extends Zt{constructor(n={}){var e;super({vertexShader:kS,fragmentShader:WS}),this.uvAnimationScrollXSpeedFactor=0,this.uvAnimationScrollYSpeedFactor=0,this.uvAnimationRotationSpeedFactor=0,this.fog=!0,this.normalMapType=Mr,this._ignoreVertexColor=!0,this._v0CompatShade=!1,this._debugMode=XS.None,this._outlineWidthMode=Em.None,this._isOutline=!1,n.transparentWithZWrite&&(n.depthWrite=!0),delete n.transparentWithZWrite,n.fog=!0,n.lights=!0,n.clipping=!0,this.uniforms=_c.merge([Se.common,Se.normalmap,Se.emissivemap,Se.fog,Se.lights,{litFactor:{value:new Me(1,1,1)},mapUvTransform:{value:new qe},colorAlpha:{value:1},normalMapUvTransform:{value:new qe},shadeColorFactor:{value:new Me(0,0,0)},shadeMultiplyTexture:{value:null},shadeMultiplyTextureUvTransform:{value:new qe},shadingShiftFactor:{value:0},shadingShiftTexture:{value:null},shadingShiftTextureUvTransform:{value:new qe},shadingShiftTextureScale:{value:1},shadingToonyFactor:{value:.9},giEqualizationFactor:{value:.9},matcapFactor:{value:new Me(1,1,1)},matcapTexture:{value:null},matcapTextureUvTransform:{value:new qe},parametricRimColorFactor:{value:new Me(0,0,0)},rimMultiplyTexture:{value:null},rimMultiplyTextureUvTransform:{value:new qe},rimLightingMixFactor:{value:1},parametricRimFresnelPowerFactor:{value:5},parametricRimLiftFactor:{value:0},emissive:{value:new Me(0,0,0)},emissiveIntensity:{value:1},emissiveMapUvTransform:{value:new qe},outlineWidthMultiplyTexture:{value:null},outlineWidthMultiplyTextureUvTransform:{value:new qe},outlineWidthFactor:{value:0},outlineColorFactor:{value:new Me(0,0,0)},outlineLightingMixFactor:{value:1},uvAnimationMaskTexture:{value:null},uvAnimationMaskTextureUvTransform:{value:new qe},uvAnimationScrollXOffset:{value:0},uvAnimationScrollYOffset:{value:0},uvAnimationRotationPhase:{value:0}},(e=n.uniforms)!=null?e:{}]),this.setValues(n),this._uploadUniformsWorkaround(),this.customProgramCacheKey=()=>[...Object.entries(this._generateDefines()).map(([t,i])=>`${t}:${i}`),this.matcapTexture?`matcapTextureColorSpace:${hd(this.matcapTexture)}`:"",this.shadeMultiplyTexture?`shadeMultiplyTextureColorSpace:${hd(this.shadeMultiplyTexture)}`:"",this.rimMultiplyTexture?`rimMultiplyTextureColorSpace:${hd(this.rimMultiplyTexture)}`:""].join(","),this.onBeforeCompile=t=>{let i=parseInt(kn,10),r=Object.entries(Sm(Sm({},this._generateDefines()),this.defines)).filter(([s,o])=>!!o).map(([s,o])=>`#define ${s} ${o}`).join(`
`)+`
`;t.vertexShader=r+t.vertexShader,t.fragmentShader=r+t.fragmentShader,i<154&&(t.fragmentShader=t.fragmentShader.replace("#include <colorspace_fragment>","#include <encodings_fragment>"))}}get color(){return this.uniforms.litFactor.value}set color(n){this.uniforms.litFactor.value=n}get map(){return this.uniforms.map.value}set map(n){this.uniforms.map.value=n}get normalMap(){return this.uniforms.normalMap.value}set normalMap(n){this.uniforms.normalMap.value=n}get normalScale(){return this.uniforms.normalScale.value}set normalScale(n){this.uniforms.normalScale.value=n}get emissive(){return this.uniforms.emissive.value}set emissive(n){this.uniforms.emissive.value=n}get emissiveIntensity(){return this.uniforms.emissiveIntensity.value}set emissiveIntensity(n){this.uniforms.emissiveIntensity.value=n}get emissiveMap(){return this.uniforms.emissiveMap.value}set emissiveMap(n){this.uniforms.emissiveMap.value=n}get shadeColorFactor(){return this.uniforms.shadeColorFactor.value}set shadeColorFactor(n){this.uniforms.shadeColorFactor.value=n}get shadeMultiplyTexture(){return this.uniforms.shadeMultiplyTexture.value}set shadeMultiplyTexture(n){this.uniforms.shadeMultiplyTexture.value=n}get shadingShiftFactor(){return this.uniforms.shadingShiftFactor.value}set shadingShiftFactor(n){this.uniforms.shadingShiftFactor.value=n}get shadingShiftTexture(){return this.uniforms.shadingShiftTexture.value}set shadingShiftTexture(n){this.uniforms.shadingShiftTexture.value=n}get shadingShiftTextureScale(){return this.uniforms.shadingShiftTextureScale.value}set shadingShiftTextureScale(n){this.uniforms.shadingShiftTextureScale.value=n}get shadingToonyFactor(){return this.uniforms.shadingToonyFactor.value}set shadingToonyFactor(n){this.uniforms.shadingToonyFactor.value=n}get giEqualizationFactor(){return this.uniforms.giEqualizationFactor.value}set giEqualizationFactor(n){this.uniforms.giEqualizationFactor.value=n}get matcapFactor(){return this.uniforms.matcapFactor.value}set matcapFactor(n){this.uniforms.matcapFactor.value=n}get matcapTexture(){return this.uniforms.matcapTexture.value}set matcapTexture(n){this.uniforms.matcapTexture.value=n}get parametricRimColorFactor(){return this.uniforms.parametricRimColorFactor.value}set parametricRimColorFactor(n){this.uniforms.parametricRimColorFactor.value=n}get rimMultiplyTexture(){return this.uniforms.rimMultiplyTexture.value}set rimMultiplyTexture(n){this.uniforms.rimMultiplyTexture.value=n}get rimLightingMixFactor(){return this.uniforms.rimLightingMixFactor.value}set rimLightingMixFactor(n){this.uniforms.rimLightingMixFactor.value=n}get parametricRimFresnelPowerFactor(){return this.uniforms.parametricRimFresnelPowerFactor.value}set parametricRimFresnelPowerFactor(n){this.uniforms.parametricRimFresnelPowerFactor.value=n}get parametricRimLiftFactor(){return this.uniforms.parametricRimLiftFactor.value}set parametricRimLiftFactor(n){this.uniforms.parametricRimLiftFactor.value=n}get outlineWidthMultiplyTexture(){return this.uniforms.outlineWidthMultiplyTexture.value}set outlineWidthMultiplyTexture(n){this.uniforms.outlineWidthMultiplyTexture.value=n}get outlineWidthFactor(){return this.uniforms.outlineWidthFactor.value}set outlineWidthFactor(n){this.uniforms.outlineWidthFactor.value=n}get outlineColorFactor(){return this.uniforms.outlineColorFactor.value}set outlineColorFactor(n){this.uniforms.outlineColorFactor.value=n}get outlineLightingMixFactor(){return this.uniforms.outlineLightingMixFactor.value}set outlineLightingMixFactor(n){this.uniforms.outlineLightingMixFactor.value=n}get uvAnimationMaskTexture(){return this.uniforms.uvAnimationMaskTexture.value}set uvAnimationMaskTexture(n){this.uniforms.uvAnimationMaskTexture.value=n}get uvAnimationScrollXOffset(){return this.uniforms.uvAnimationScrollXOffset.value}set uvAnimationScrollXOffset(n){this.uniforms.uvAnimationScrollXOffset.value=n}get uvAnimationScrollYOffset(){return this.uniforms.uvAnimationScrollYOffset.value}set uvAnimationScrollYOffset(n){this.uniforms.uvAnimationScrollYOffset.value=n}get uvAnimationRotationPhase(){return this.uniforms.uvAnimationRotationPhase.value}set uvAnimationRotationPhase(n){this.uniforms.uvAnimationRotationPhase.value=n}get ignoreVertexColor(){return this._ignoreVertexColor}set ignoreVertexColor(n){this._ignoreVertexColor=n,this.needsUpdate=!0}get v0CompatShade(){return this._v0CompatShade}set v0CompatShade(n){this._v0CompatShade=n,this.needsUpdate=!0}get debugMode(){return this._debugMode}set debugMode(n){this._debugMode=n,this.needsUpdate=!0}get outlineWidthMode(){return this._outlineWidthMode}set outlineWidthMode(n){this._outlineWidthMode=n,this.needsUpdate=!0}get isOutline(){return this._isOutline}set isOutline(n){this._isOutline=n,this.needsUpdate=!0}get isMToonMaterial(){return!0}update(n){this._uploadUniformsWorkaround(),this._updateUVAnimation(n)}copy(n){return super.copy(n),this.map=n.map,this.normalMap=n.normalMap,this.emissiveMap=n.emissiveMap,this.shadeMultiplyTexture=n.shadeMultiplyTexture,this.shadingShiftTexture=n.shadingShiftTexture,this.matcapTexture=n.matcapTexture,this.rimMultiplyTexture=n.rimMultiplyTexture,this.outlineWidthMultiplyTexture=n.outlineWidthMultiplyTexture,this.uvAnimationMaskTexture=n.uvAnimationMaskTexture,this.normalMapType=n.normalMapType,this.uvAnimationScrollXSpeedFactor=n.uvAnimationScrollXSpeedFactor,this.uvAnimationScrollYSpeedFactor=n.uvAnimationScrollYSpeedFactor,this.uvAnimationRotationSpeedFactor=n.uvAnimationRotationSpeedFactor,this.ignoreVertexColor=n.ignoreVertexColor,this.v0CompatShade=n.v0CompatShade,this.debugMode=n.debugMode,this.outlineWidthMode=n.outlineWidthMode,this.isOutline=n.isOutline,this.needsUpdate=!0,this}_updateUVAnimation(n){this.uniforms.uvAnimationScrollXOffset.value+=n*this.uvAnimationScrollXSpeedFactor,this.uniforms.uvAnimationScrollYOffset.value+=n*this.uvAnimationScrollYSpeedFactor,this.uniforms.uvAnimationRotationPhase.value+=n*this.uvAnimationRotationSpeedFactor,this.uniforms.alphaTest.value=this.alphaTest,this.uniformsNeedUpdate=!0}_uploadUniformsWorkaround(){this.uniforms.opacity.value=this.opacity,this._updateTextureMatrix(this.uniforms.map,this.uniforms.mapUvTransform),this._updateTextureMatrix(this.uniforms.normalMap,this.uniforms.normalMapUvTransform),this._updateTextureMatrix(this.uniforms.emissiveMap,this.uniforms.emissiveMapUvTransform),this._updateTextureMatrix(this.uniforms.shadeMultiplyTexture,this.uniforms.shadeMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.shadingShiftTexture,this.uniforms.shadingShiftTextureUvTransform),this._updateTextureMatrix(this.uniforms.matcapTexture,this.uniforms.matcapTextureUvTransform),this._updateTextureMatrix(this.uniforms.rimMultiplyTexture,this.uniforms.rimMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.outlineWidthMultiplyTexture,this.uniforms.outlineWidthMultiplyTextureUvTransform),this._updateTextureMatrix(this.uniforms.uvAnimationMaskTexture,this.uniforms.uvAnimationMaskTextureUvTransform),this.uniformsNeedUpdate=!0}_generateDefines(){let n=parseInt(kn,10),e=this.outlineWidthMultiplyTexture!==null,t=this.map!==null||this.normalMap!==null||this.emissiveMap!==null||this.shadeMultiplyTexture!==null||this.shadingShiftTexture!==null||this.rimMultiplyTexture!==null||this.uvAnimationMaskTexture!==null;return{THREE_VRM_THREE_REVISION:n,OUTLINE:this._isOutline,MTOON_USE_UV:e||t,MTOON_UVS_VERTEX_ONLY:e&&!t,V0_COMPAT_SHADE:this._v0CompatShade,USE_SHADEMULTIPLYTEXTURE:this.shadeMultiplyTexture!==null,USE_SHADINGSHIFTTEXTURE:this.shadingShiftTexture!==null,USE_MATCAPTEXTURE:this.matcapTexture!==null,USE_RIMMULTIPLYTEXTURE:this.rimMultiplyTexture!==null,USE_OUTLINEWIDTHMULTIPLYTEXTURE:this._isOutline&&this.outlineWidthMultiplyTexture!==null,USE_UVANIMATIONMASKTEXTURE:this.uvAnimationMaskTexture!==null,IGNORE_VERTEX_COLOR:this._ignoreVertexColor===!0,DEBUG_NORMAL:this._debugMode==="normal",DEBUG_LITSHADERATE:this._debugMode==="litShadeRate",DEBUG_UV:this._debugMode==="uv",OUTLINE_WIDTH_SCREEN:this._isOutline&&this._outlineWidthMode===Em.ScreenCoordinates}}_updateTextureMatrix(n,e){n.value&&(n.value.matrixAutoUpdate&&n.value.updateMatrix(),e.value.copy(n.value.matrix))}},ZS=new Set(["1.0","1.0-beta"]),Zm=class Uc{get name(){return Uc.EXTENSION_NAME}constructor(e,t={}){var i,r,s,o;this.parser=e,this.materialType=(i=t.materialType)!=null?i:YS,this.renderOrderOffset=(r=t.renderOrderOffset)!=null?r:0,this.v0CompatShade=(s=t.v0CompatShade)!=null?s:!1,this.debugMode=(o=t.debugMode)!=null?o:"none",this._mToonMaterialSet=new Set}beforeRoot(){return Rr(this,null,function*(){this._removeUnlitExtensionIfMToonExists()})}afterRoot(e){return Rr(this,null,function*(){e.userData.vrmMToonMaterials=Array.from(this._mToonMaterialSet)})}getMaterialType(e){return this._getMToonExtension(e)?this.materialType:null}extendMaterialParams(e,t){let i=this._getMToonExtension(e);return i?this._extendMaterialParams(i,t):null}loadMesh(e){return Rr(this,null,function*(){var t;let i=this.parser,s=(t=i.json.meshes)==null?void 0:t[e];if(s==null)throw new Error(`MToonMaterialLoaderPlugin: Attempt to use meshes[${e}] of glTF but the mesh doesn't exist`);let o=s.primitives,a=yield i.loadMesh(e);if(o.length===1){let l=a,c=o[0].material;c!=null&&this._setupPrimitive(l,c)}else{let l=a;for(let c=0;c<o.length;c++){let u=l.children[c],h=o[c].material;h!=null&&this._setupPrimitive(u,h)}}return a})}_removeUnlitExtensionIfMToonExists(){let i=this.parser.json.materials;i?.map((r,s)=>{var o;this._getMToonExtension(s)&&((o=r.extensions)!=null&&o.KHR_materials_unlit)&&delete r.extensions.KHR_materials_unlit})}_getMToonExtension(e){var t,i;let o=(t=this.parser.json.materials)==null?void 0:t[e];if(o==null){console.warn(`MToonMaterialLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}let a=(i=o.extensions)==null?void 0:i[Uc.EXTENSION_NAME];if(a==null)return;let l=a.specVersion;if(!ZS.has(l)){console.warn(`MToonMaterialLoaderPlugin: Unknown ${Uc.EXTENSION_NAME} specVersion "${l}"`);return}return a}_extendMaterialParams(e,t){return Rr(this,null,function*(){var i;delete t.metalness,delete t.roughness;let r=new GS(this.parser,t);r.assignPrimitive("transparentWithZWrite",e.transparentWithZWrite),r.assignColor("shadeColorFactor",e.shadeColorFactor),r.assignTexture("shadeMultiplyTexture",e.shadeMultiplyTexture,!0),r.assignPrimitive("shadingShiftFactor",e.shadingShiftFactor),r.assignTexture("shadingShiftTexture",e.shadingShiftTexture,!0),r.assignPrimitive("shadingShiftTextureScale",(i=e.shadingShiftTexture)==null?void 0:i.scale),r.assignPrimitive("shadingToonyFactor",e.shadingToonyFactor),r.assignPrimitive("giEqualizationFactor",e.giEqualizationFactor),r.assignColor("matcapFactor",e.matcapFactor),r.assignTexture("matcapTexture",e.matcapTexture,!0),r.assignColor("parametricRimColorFactor",e.parametricRimColorFactor),r.assignTexture("rimMultiplyTexture",e.rimMultiplyTexture,!0),r.assignPrimitive("rimLightingMixFactor",e.rimLightingMixFactor),r.assignPrimitive("parametricRimFresnelPowerFactor",e.parametricRimFresnelPowerFactor),r.assignPrimitive("parametricRimLiftFactor",e.parametricRimLiftFactor),r.assignPrimitive("outlineWidthMode",e.outlineWidthMode),r.assignPrimitive("outlineWidthFactor",e.outlineWidthFactor),r.assignTexture("outlineWidthMultiplyTexture",e.outlineWidthMultiplyTexture,!1),r.assignColor("outlineColorFactor",e.outlineColorFactor),r.assignPrimitive("outlineLightingMixFactor",e.outlineLightingMixFactor),r.assignTexture("uvAnimationMaskTexture",e.uvAnimationMaskTexture,!1),r.assignPrimitive("uvAnimationScrollXSpeedFactor",e.uvAnimationScrollXSpeedFactor),r.assignPrimitive("uvAnimationScrollYSpeedFactor",e.uvAnimationScrollYSpeedFactor),r.assignPrimitive("uvAnimationRotationSpeedFactor",e.uvAnimationRotationSpeedFactor),r.assignPrimitive("v0CompatShade",this.v0CompatShade),r.assignPrimitive("debugMode",this.debugMode),yield r.pending})}_setupPrimitive(e,t){let i=this._getMToonExtension(t);if(i){let r=this._parseRenderOrder(i);e.renderOrder=r+this.renderOrderOffset,this._generateOutline(e),this._addToMaterialSet(e);return}}_shouldGenerateOutline(e){return typeof e.outlineWidthMode=="string"&&e.outlineWidthMode!=="none"&&typeof e.outlineWidthFactor=="number"&&e.outlineWidthFactor>0}_generateOutline(e){let t=e.material;if(!(t instanceof Xt)||!this._shouldGenerateOutline(t))return;e.material=[t];let i=t.clone();i.name+=" (Outline)",i.isOutline=!0,i.side=zt,e.material.push(i);let r=e.geometry,s=r.index?r.index.count:r.attributes.position.count/3;r.addGroup(0,s,0),r.addGroup(0,s,1)}_addToMaterialSet(e){let t=e.material,i=new Set;Array.isArray(t)?t.forEach(r=>i.add(r)):i.add(t);for(let r of i)this._mToonMaterialSet.add(r)}_parseRenderOrder(e){var t;return(e.transparentWithZWrite?0:19)+((t=e.renderQueueOffsetNumber)!=null?t:0)}};Zm.EXTENSION_NAME="VRMC_materials_mtoon";var JS=Zm,$S=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(n,e)).next())}),Jm=class Ed{get name(){return Ed.EXTENSION_NAME}constructor(e){this.parser=e}extendMaterialParams(e,t){return $S(this,null,function*(){let i=this._getHDREmissiveMultiplierExtension(e);if(i==null)return;console.warn("VRMMaterialsHDREmissiveMultiplierLoaderPlugin: `VRMC_materials_hdr_emissiveMultiplier` is archived. Use `KHR_materials_emissive_strength` instead.");let r=i.emissiveMultiplier;t.emissiveIntensity=r})}_getHDREmissiveMultiplierExtension(e){var t,i;let o=(t=this.parser.json.materials)==null?void 0:t[e];if(o==null){console.warn(`VRMMaterialsHDREmissiveMultiplierLoaderPlugin: Attempt to use materials[${e}] of glTF but the material doesn't exist`);return}let a=(i=o.extensions)==null?void 0:i[Ed.EXTENSION_NAME];if(a!=null)return a}};Jm.EXTENSION_NAME="VRMC_materials_hdr_emissiveMultiplier";var KS=Jm,jS=Object.defineProperty,QS=Object.defineProperties,eE=Object.getOwnPropertyDescriptors,bm=Object.getOwnPropertySymbols,tE=Object.prototype.hasOwnProperty,nE=Object.prototype.propertyIsEnumerable,Tm=(n,e,t)=>e in n?jS(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,hi=(n,e)=>{for(var t in e||(e={}))tE.call(e,t)&&Tm(n,t,e[t]);if(bm)for(var t of bm(e))nE.call(e,t)&&Tm(n,t,e[t]);return n},wm=(n,e)=>QS(n,eE(e)),iE=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(n,e)).next())});function Ls(n){return Math.pow(n,2.2)}var rE=class{get name(){return"VRMMaterialsV0CompatPlugin"}constructor(n){var e;this.parser=n,this._renderQueueMapTransparent=new Map,this._renderQueueMapTransparentZWrite=new Map;let t=this.parser.json;t.extensionsUsed=(e=t.extensionsUsed)!=null?e:[],t.extensionsUsed.indexOf("KHR_texture_transform")===-1&&t.extensionsUsed.push("KHR_texture_transform")}beforeRoot(){return iE(this,null,function*(){var n;let e=this.parser.json,t=(n=e.extensions)==null?void 0:n.VRM,i=t?.materialProperties;i&&(this._populateRenderQueueMap(i),i.forEach((r,s)=>{var o,a;let l=(o=e.materials)==null?void 0:o[s];if(l==null){console.warn(`VRMMaterialsV0CompatPlugin: Attempt to use materials[${s}] of glTF but the material doesn't exist`);return}if(r.shader==="VRM/MToon"){let c=this._parseV0MToonProperties(r,l);e.materials[s]=c}else if((a=r.shader)!=null&&a.startsWith("VRM/Unlit")){let c=this._parseV0UnlitProperties(r,l);e.materials[s]=c}else r.shader==="VRM_USE_GLTFSHADER"||console.warn(`VRMMaterialsV0CompatPlugin: Unknown shader: ${r.shader}`)}))})}_parseV0MToonProperties(n,e){var t,i,r,s,o,a,l,c,u,h,d,f,m,_,p,g,M,T,x,S,E,A,v,w,C,L,D,H,U,V,W,J,se,$,j,ee,Ie,Te,ae,he,Re,X,ne,fe,Le,me,De,tt,ie,G,N,O,k,ue,de;let xe=(i=(t=n.keywordMap)==null?void 0:t._ALPHABLEND_ON)!=null?i:!1,I=((r=n.floatProperties)==null?void 0:r._ZWrite)===1&&xe,Xe=this._v0ParseRenderQueue(n),Ze=(o=(s=n.keywordMap)==null?void 0:s._ALPHATEST_ON)!=null?o:!1,P=xe?"BLEND":Ze?"MASK":"OPAQUE",y=Ze?(l=(a=n.floatProperties)==null?void 0:a._Cutoff)!=null?l:.5:void 0,q=((u=(c=n.floatProperties)==null?void 0:c._CullMode)!=null?u:2)===0,K=this._portTextureTransform(n),ge=((d=(h=n.vectorProperties)==null?void 0:h._Color)!=null?d:[1,1,1,1]).map((Xs,Wc)=>Wc===3?Xs:Ls(Xs)),_e=(f=n.textureProperties)==null?void 0:f._MainTex,te=_e!=null?{index:_e,extensions:hi({},K)}:void 0,oe=(_=(m=n.floatProperties)==null?void 0:m._BumpScale)!=null?_:1,ve=(p=n.textureProperties)==null?void 0:p._BumpMap,Ve=ve!=null?{index:ve,scale:oe,extensions:hi({},K)}:void 0,we=((M=(g=n.vectorProperties)==null?void 0:g._EmissionColor)!=null?M:[0,0,0,1]).map(Ls),Ee=(T=n.textureProperties)==null?void 0:T._EmissionMap,ze=Ee!=null?{index:Ee,extensions:hi({},K)}:void 0,Je=((S=(x=n.vectorProperties)==null?void 0:x._ShadeColor)!=null?S:[.97,.81,.86,1]).map(Ls),et=(E=n.textureProperties)==null?void 0:E._ShadeTexture,B=et!=null?{index:et,extensions:hi({},K)}:void 0,ye=(v=(A=n.floatProperties)==null?void 0:A._ShadeShift)!=null?v:0,re=(C=(w=n.floatProperties)==null?void 0:w._ShadeToony)!=null?C:.9;re=mt.lerp(re,1,.5+.5*ye),ye=-ye-(1-re);let be=(D=(L=n.floatProperties)==null?void 0:L._IndirectLightIntensity)!=null?D:.1,Ce=be?1-be:void 0,le=(H=n.textureProperties)==null?void 0:H._SphereAdd,We=le!=null?[1,1,1]:void 0,Oe=le!=null?{index:le}:void 0,yt=(V=(U=n.floatProperties)==null?void 0:U._RimLightingMix)!=null?V:0,ut=(W=n.textureProperties)==null?void 0:W._RimTexture,pn=ut!=null?{index:ut,extensions:hi({},K)}:void 0,bn=((se=(J=n.vectorProperties)==null?void 0:J._RimColor)!=null?se:[0,0,0,1]).map(Ls),Gc=(j=($=n.floatProperties)==null?void 0:$._RimFresnelPower)!=null?j:1,kc=(Ie=(ee=n.floatProperties)==null?void 0:ee._RimLift)!=null?Ie:0,ha=["none","worldCoordinates","screenCoordinates"][(ae=(Te=n.floatProperties)==null?void 0:Te._OutlineWidthMode)!=null?ae:0],Qi=(Re=(he=n.floatProperties)==null?void 0:he._OutlineWidth)!=null?Re:0;Qi=.01*Qi;let da=(X=n.textureProperties)==null?void 0:X._OutlineWidthTexture,fa=da!=null?{index:da,extensions:hi({},K)}:void 0,pa=((fe=(ne=n.vectorProperties)==null?void 0:ne._OutlineColor)!=null?fe:[0,0,0]).map(Ls),ks=((me=(Le=n.floatProperties)==null?void 0:Le._OutlineColorMode)!=null?me:0)===1?(tt=(De=n.floatProperties)==null?void 0:De._OutlineLightingMix)!=null?tt:1:0,Ws=(ie=n.textureProperties)==null?void 0:ie._UvAnimMaskTexture,ma=Ws!=null?{index:Ws,extensions:hi({},K)}:void 0,Ir=(N=(G=n.floatProperties)==null?void 0:G._UvAnimScrollX)!=null?N:0,er=(k=(O=n.floatProperties)==null?void 0:O._UvAnimScrollY)!=null?k:0;er!=null&&(er=-er);let Lr=(de=(ue=n.floatProperties)==null?void 0:ue._UvAnimRotation)!=null?de:0,ga={specVersion:"1.0",transparentWithZWrite:I,renderQueueOffsetNumber:Xe,shadeColorFactor:Je,shadeMultiplyTexture:B,shadingShiftFactor:ye,shadingToonyFactor:re,giEqualizationFactor:Ce,matcapFactor:We,matcapTexture:Oe,rimLightingMixFactor:yt,rimMultiplyTexture:pn,parametricRimColorFactor:bn,parametricRimFresnelPowerFactor:Gc,parametricRimLiftFactor:kc,outlineWidthMode:ha,outlineWidthFactor:Qi,outlineWidthMultiplyTexture:fa,outlineColorFactor:pa,outlineLightingMixFactor:ks,uvAnimationMaskTexture:ma,uvAnimationScrollXSpeedFactor:Ir,uvAnimationScrollYSpeedFactor:er,uvAnimationRotationSpeedFactor:Lr};return wm(hi({},e),{pbrMetallicRoughness:{baseColorFactor:ge,baseColorTexture:te},normalTexture:Ve,emissiveTexture:ze,emissiveFactor:we,alphaMode:P,alphaCutoff:y,doubleSided:q,extensions:{VRMC_materials_mtoon:ga}})}_parseV0UnlitProperties(n,e){var t,i,r,s,o;let a=n.shader==="VRM/UnlitTransparentZWrite",l=n.shader==="VRM/UnlitTransparent"||a,c=this._v0ParseRenderQueue(n),u=n.shader==="VRM/UnlitCutout",h=l?"BLEND":u?"MASK":"OPAQUE",d=u?(i=(t=n.floatProperties)==null?void 0:t._Cutoff)!=null?i:.5:void 0,f=this._portTextureTransform(n),m=((s=(r=n.vectorProperties)==null?void 0:r._Color)!=null?s:[1,1,1,1]).map(Ls),_=(o=n.textureProperties)==null?void 0:o._MainTex,p=_!=null?{index:_,extensions:hi({},f)}:void 0,g={specVersion:"1.0",transparentWithZWrite:a,renderQueueOffsetNumber:c,shadeColorFactor:m,shadeMultiplyTexture:p};return wm(hi({},e),{pbrMetallicRoughness:{baseColorFactor:m,baseColorTexture:p},alphaMode:h,alphaCutoff:d,extensions:{VRMC_materials_mtoon:g}})}_portTextureTransform(n){var e,t,i,r,s;let o=(e=n.vectorProperties)==null?void 0:e._MainTex;if(o==null)return{};let a=[(t=o?.[0])!=null?t:0,(i=o?.[1])!=null?i:0],l=[(r=o?.[2])!=null?r:1,(s=o?.[3])!=null?s:1];return a[1]=1-l[1]-a[1],{KHR_texture_transform:{offset:a,scale:l}}}_v0ParseRenderQueue(n){var e,t;let i=n.shader==="VRM/UnlitTransparentZWrite",r=((e=n.keywordMap)==null?void 0:e._ALPHABLEND_ON)!=null||n.shader==="VRM/UnlitTransparent"||i,s=((t=n.floatProperties)==null?void 0:t._ZWrite)===1||i,o=0;if(r){let a=n.renderQueue;a!=null&&(s?o=this._renderQueueMapTransparentZWrite.get(a):o=this._renderQueueMapTransparent.get(a))}return o}_populateRenderQueueMap(n){let e=new Set,t=new Set;n.forEach(i=>{var r,s;let o=i.shader==="VRM/UnlitTransparentZWrite",a=((r=i.keywordMap)==null?void 0:r._ALPHABLEND_ON)!=null||i.shader==="VRM/UnlitTransparent"||o,l=((s=i.floatProperties)==null?void 0:s._ZWrite)===1||o;if(a){let c=i.renderQueue;c!=null&&(l?t.add(c):e.add(c))}}),e.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${e.size} render queues for Transparent materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),t.size>10&&console.warn(`VRMMaterialsV0CompatPlugin: This VRM uses ${t.size} render queues for TransparentZWrite materials while VRM 1.0 only supports up to 10 render queues. The model might not be rendered correctly.`),Array.from(e).sort().forEach((i,r)=>{let s=Math.min(Math.max(r-e.size+1,-9),0);this._renderQueueMapTransparent.set(i,s)}),Array.from(t).sort().forEach((i,r)=>{let s=Math.min(Math.max(r,0),9);this._renderQueueMapTransparentZWrite.set(i,s)})}},Am=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(n,e)).next())}),$i=new R,dd=class extends ft{constructor(n){super(),this._attrPosition=new Ke(new Float32Array([0,0,0,0,0,0]),3),this._attrPosition.setUsage(rh);let e=new Qe;e.setAttribute("position",this._attrPosition);let t=new Yt({color:16711935,depthTest:!1,depthWrite:!1});this._line=new Si(e,t),this.add(this._line),this.constraint=n}updateMatrixWorld(n){$i.setFromMatrixPosition(this.constraint.destination.matrixWorld),this._attrPosition.setXYZ(0,$i.x,$i.y,$i.z),this.constraint.source&&$i.setFromMatrixPosition(this.constraint.source.matrixWorld),this._attrPosition.setXYZ(1,$i.x,$i.y,$i.z),this._attrPosition.needsUpdate=!0,super.updateMatrixWorld(n)}};function Rm(n,e){return e.set(n.elements[12],n.elements[13],n.elements[14])}var sE=new R,oE=new R;function aE(n,e){return n.decompose(sE,e,oE),e}function Oc(n){return n.invert?n.invert():n.inverse(),n}var wd=class{constructor(n,e){this.destination=n,this.source=e,this.weight=1}},lE=new R,cE=new R,uE=new R,hE=new Ye,dE=new Ye,fE=new Ye,pE=class extends wd{get aimAxis(){return this._aimAxis}set aimAxis(n){this._aimAxis=n,this._v3AimAxis.set(n==="PositiveX"?1:n==="NegativeX"?-1:0,n==="PositiveY"?1:n==="NegativeY"?-1:0,n==="PositiveZ"?1:n==="NegativeZ"?-1:0)}get dependencies(){let n=new Set([this.source]);return this.destination.parent&&n.add(this.destination.parent),n}constructor(n,e){super(n,e),this._aimAxis="PositiveX",this._v3AimAxis=new R(1,0,0),this._dstRestQuat=new Ye}setInitState(){this._dstRestQuat.copy(this.destination.quaternion)}update(){this.destination.updateWorldMatrix(!0,!1),this.source.updateWorldMatrix(!0,!1);let n=hE.identity(),e=dE.identity();this.destination.parent&&(aE(this.destination.parent.matrixWorld,n),Oc(e.copy(n)));let t=lE.copy(this._v3AimAxis).applyQuaternion(this._dstRestQuat).applyQuaternion(n),i=Rm(this.source.matrixWorld,cE).sub(Rm(this.destination.matrixWorld,uE)).normalize(),r=fE.setFromUnitVectors(t,i).premultiply(e).multiply(n).multiply(this._dstRestQuat);this.destination.quaternion.copy(this._dstRestQuat).slerp(r,this.weight)}};function mE(n,e){let t=[n],i=n.parent;for(;i!==null;)t.unshift(i),i=i.parent;t.forEach(r=>{e(r)})}var gE=class{constructor(){this._constraints=new Set,this._objectConstraintsMap=new Map}get constraints(){return this._constraints}addConstraint(n){this._constraints.add(n);let e=this._objectConstraintsMap.get(n.destination);e==null&&(e=new Set,this._objectConstraintsMap.set(n.destination,e)),e.add(n)}deleteConstraint(n){this._constraints.delete(n),this._objectConstraintsMap.get(n.destination).delete(n)}setInitState(){let n=new Set,e=new Set;for(let t of this._constraints)this._processConstraint(t,n,e,i=>i.setInitState())}update(){let n=new Set,e=new Set;for(let t of this._constraints)this._processConstraint(t,n,e,i=>i.update())}_processConstraint(n,e,t,i){if(t.has(n))return;if(e.has(n))throw new Error("VRMNodeConstraintManager: Circular dependency detected while updating constraints");e.add(n);let r=n.dependencies;for(let s of r)mE(s,o=>{let a=this._objectConstraintsMap.get(o);if(a)for(let l of a)this._processConstraint(l,e,t,i)});i(n),t.add(n)}},_E=new Ye,xE=new Ye,vE=class extends wd{get dependencies(){return new Set([this.source])}constructor(n,e){super(n,e),this._dstRestQuat=new Ye,this._invSrcRestQuat=new Ye}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),Oc(this._invSrcRestQuat.copy(this.source.quaternion))}update(){let n=_E.copy(this._invSrcRestQuat).multiply(this.source.quaternion),e=xE.copy(this._dstRestQuat).multiply(n);this.destination.quaternion.copy(this._dstRestQuat).slerp(e,this.weight)}},yE=new R,ME=new Ye,SE=new Ye,EE=class extends wd{get rollAxis(){return this._rollAxis}set rollAxis(n){this._rollAxis=n,this._v3RollAxis.set(n==="X"?1:0,n==="Y"?1:0,n==="Z"?1:0)}get dependencies(){return new Set([this.source])}constructor(n,e){super(n,e),this._rollAxis="X",this._v3RollAxis=new R(1,0,0),this._dstRestQuat=new Ye,this._invDstRestQuat=new Ye,this._invSrcRestQuatMulDstRestQuat=new Ye}setInitState(){this._dstRestQuat.copy(this.destination.quaternion),Oc(this._invDstRestQuat.copy(this._dstRestQuat)),Oc(this._invSrcRestQuatMulDstRestQuat.copy(this.source.quaternion)).multiply(this._dstRestQuat)}update(){let n=ME.copy(this._invDstRestQuat).multiply(this.source.quaternion).multiply(this._invSrcRestQuatMulDstRestQuat),e=yE.copy(this._v3RollAxis).applyQuaternion(n),i=SE.setFromUnitVectors(e,this._v3RollAxis).premultiply(this._dstRestQuat).multiply(n);this.destination.quaternion.copy(this._dstRestQuat).slerp(i,this.weight)}},bE=new Set(["1.0","1.0-beta"]),$m=class ia{get name(){return ia.EXTENSION_NAME}constructor(e,t){this.parser=e,this.helperRoot=t?.helperRoot}afterRoot(e){return Am(this,null,function*(){e.userData.vrmNodeConstraintManager=yield this._import(e)})}_import(e){return Am(this,null,function*(){var t;let i=this.parser.json;if(!(((t=i.extensionsUsed)==null?void 0:t.indexOf(ia.EXTENSION_NAME))!==-1))return null;let s=new gE,o=yield this.parser.getDependencies("node");return o.forEach((a,l)=>{var c;let u=i.nodes[l],h=(c=u?.extensions)==null?void 0:c[ia.EXTENSION_NAME];if(h==null)return;let d=h.specVersion;if(!bE.has(d)){console.warn(`VRMNodeConstraintLoaderPlugin: Unknown ${ia.EXTENSION_NAME} specVersion "${d}"`);return}let f=h.constraint;if(f.roll!=null){let m=this._importRollConstraint(a,o,f.roll);s.addConstraint(m)}else if(f.aim!=null){let m=this._importAimConstraint(a,o,f.aim);s.addConstraint(m)}else if(f.rotation!=null){let m=this._importRotationConstraint(a,o,f.rotation);s.addConstraint(m)}}),e.scene.updateMatrixWorld(),s.setInitState(),s})}_importRollConstraint(e,t,i){let{source:r,rollAxis:s,weight:o}=i,a=t[r],l=new EE(e,a);if(s!=null&&(l.rollAxis=s),o!=null&&(l.weight=o),this.helperRoot){let c=new dd(l);this.helperRoot.add(c)}return l}_importAimConstraint(e,t,i){let{source:r,aimAxis:s,weight:o}=i,a=t[r],l=new pE(e,a);if(s!=null&&(l.aimAxis=s),o!=null&&(l.weight=o),this.helperRoot){let c=new dd(l);this.helperRoot.add(c)}return l}_importRotationConstraint(e,t,i){let{source:r,weight:s}=i,o=t[r],a=new vE(e,o);if(s!=null&&(a.weight=s),this.helperRoot){let l=new dd(a);this.helperRoot.add(l)}return a}};$m.EXTENSION_NAME="VRMC_node_constraint";var TE=$m,Ic=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{a(t.next(l))}catch(c){r(c)}},o=l=>{try{a(t.throw(l))}catch(c){r(c)}},a=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,o);a((t=t.apply(n,e)).next())}),Ad=class{},fd=new R,Ar=new R,Km=class extends Ad{get type(){return"capsule"}constructor(n){var e,t,i,r;super(),this.offset=(e=n?.offset)!=null?e:new R(0,0,0),this.tail=(t=n?.tail)!=null?t:new R(0,0,0),this.radius=(i=n?.radius)!=null?i:0,this.inside=(r=n?.inside)!=null?r:!1}calculateCollision(n,e,t,i){fd.setFromMatrixPosition(n),Ar.subVectors(this.tail,this.offset).applyMatrix4(n),Ar.sub(fd);let r=Ar.lengthSq();i.copy(e).sub(fd);let s=Ar.dot(i);s<=0||(r<=s||Ar.multiplyScalar(s/r),i.sub(Ar));let o=i.length(),a=this.inside?this.radius-t-o:o-t-this.radius;return a<0&&(i.multiplyScalar(1/o),this.inside&&i.negate()),a}},pd=new R,Cm=new qe,jm=class extends Ad{get type(){return"plane"}constructor(n){var e,t;super(),this.offset=(e=n?.offset)!=null?e:new R(0,0,0),this.normal=(t=n?.normal)!=null?t:new R(0,0,1)}calculateCollision(n,e,t,i){i.setFromMatrixPosition(n),i.negate().add(e),Cm.getNormalMatrix(n),pd.copy(this.normal).applyNormalMatrix(Cm).normalize();let r=i.dot(pd)-t;return i.copy(pd),r}},wE=new R,Qm=class extends Ad{get type(){return"sphere"}constructor(n){var e,t,i;super(),this.offset=(e=n?.offset)!=null?e:new R(0,0,0),this.radius=(t=n?.radius)!=null?t:0,this.inside=(i=n?.inside)!=null?i:!1}calculateCollision(n,e,t,i){i.subVectors(e,wE.setFromMatrixPosition(n));let r=i.length(),s=this.inside?this.radius-t-r:r-t-this.radius;return s<0&&(i.multiplyScalar(1/r),this.inside&&i.negate()),s}},di=new R,AE=class extends Qe{constructor(n){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new R,this._currentTail=new R,this._shape=n,this._attrPos=new Ke(new Float32Array(396),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Ke(new Uint16Array(264),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let n=!1,e=this._shape.radius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,n=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),n=!0);let t=di.copy(this._shape.tail).divideScalar(this.worldScale);this._currentTail.distanceToSquared(t)>1e-10&&(this._currentTail.copy(t),n=!0),n&&this._buildPosition()}_buildPosition(){di.copy(this._currentTail).sub(this._currentOffset);let n=di.length()/this._currentRadius;for(let i=0;i<=16;i++){let r=i/16*Math.PI;this._attrPos.setXYZ(i,-Math.sin(r),-Math.cos(r),0),this._attrPos.setXYZ(17+i,n+Math.sin(r),Math.cos(r),0),this._attrPos.setXYZ(34+i,-Math.sin(r),0,-Math.cos(r)),this._attrPos.setXYZ(51+i,n+Math.sin(r),0,Math.cos(r))}for(let i=0;i<32;i++){let r=i/16*Math.PI;this._attrPos.setXYZ(68+i,0,Math.sin(r),Math.cos(r)),this._attrPos.setXYZ(100+i,n,Math.sin(r),Math.cos(r))}let e=Math.atan2(di.y,Math.sqrt(di.x*di.x+di.z*di.z)),t=-Math.atan2(di.z,di.x);this.rotateZ(e),this.rotateY(t),this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let n=0;n<34;n++){let e=(n+1)%34;this._attrIndex.setXY(n*2,n,e),this._attrIndex.setXY(68+n*2,34+n,34+e)}for(let n=0;n<32;n++){let e=(n+1)%32;this._attrIndex.setXY(136+n*2,68+n,68+e),this._attrIndex.setXY(200+n*2,100+n,100+e)}this._attrIndex.needsUpdate=!0}},RE=class extends Qe{constructor(n){super(),this.worldScale=1,this._currentOffset=new R,this._currentNormal=new R,this._shape=n,this._attrPos=new Ke(new Float32Array(6*3),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Ke(new Uint16Array(10),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let n=!1;this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),n=!0),this._currentNormal.equals(this._shape.normal)||(this._currentNormal.copy(this._shape.normal),n=!0),n&&this._buildPosition()}_buildPosition(){this._attrPos.setXYZ(0,-.5,-.5,0),this._attrPos.setXYZ(1,.5,-.5,0),this._attrPos.setXYZ(2,.5,.5,0),this._attrPos.setXYZ(3,-.5,.5,0),this._attrPos.setXYZ(4,0,0,0),this._attrPos.setXYZ(5,0,0,.25),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this.lookAt(this._currentNormal),this._attrPos.needsUpdate=!0}_buildIndex(){this._attrIndex.setXY(0,0,1),this._attrIndex.setXY(2,1,2),this._attrIndex.setXY(4,2,3),this._attrIndex.setXY(6,3,0),this._attrIndex.setXY(8,4,5),this._attrIndex.needsUpdate=!0}},CE=class extends Qe{constructor(n){super(),this.worldScale=1,this._currentRadius=0,this._currentOffset=new R,this._shape=n,this._attrPos=new Ke(new Float32Array(32*3*3),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Ke(new Uint16Array(64*3),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let n=!1,e=this._shape.radius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,n=!0),this._currentOffset.equals(this._shape.offset)||(this._currentOffset.copy(this._shape.offset),n=!0),n&&this._buildPosition()}_buildPosition(){for(let n=0;n<32;n++){let e=n/16*Math.PI;this._attrPos.setXYZ(n,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+n,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+n,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentOffset.x,this._currentOffset.y,this._currentOffset.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let n=0;n<32;n++){let e=(n+1)%32;this._attrIndex.setXY(n*2,n,e),this._attrIndex.setXY(64+n*2,32+n,32+e),this._attrIndex.setXY(128+n*2,64+n,64+e)}this._attrIndex.needsUpdate=!0}},PE=new R,md=class extends ft{constructor(n){if(super(),this.matrixAutoUpdate=!1,this.collider=n,this.collider.shape instanceof Qm)this._geometry=new CE(this.collider.shape);else if(this.collider.shape instanceof Km)this._geometry=new AE(this.collider.shape);else if(this.collider.shape instanceof jm)this._geometry=new RE(this.collider.shape);else throw new Error("VRMSpringBoneColliderHelper: Unknown collider shape type detected");let e=new Yt({color:16711935,depthTest:!1,depthWrite:!1});this._line=new hn(this._geometry,e),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(n){this.collider.updateWorldMatrix(!0,!1),this.matrix.copy(this.collider.matrixWorld);let e=this.matrix.elements;this._geometry.worldScale=PE.set(e[0],e[1],e[2]).length(),this._geometry.update(),super.updateMatrixWorld(n)}},IE=class extends Qe{constructor(n){super(),this.worldScale=1,this._currentRadius=0,this._currentTail=new R,this._springBone=n,this._attrPos=new Ke(new Float32Array(294),3),this.setAttribute("position",this._attrPos),this._attrIndex=new Ke(new Uint16Array(194),1),this.setIndex(this._attrIndex),this._buildIndex(),this.update()}update(){let n=!1,e=this._springBone.settings.hitRadius/this.worldScale;this._currentRadius!==e&&(this._currentRadius=e,n=!0),this._currentTail.equals(this._springBone.initialLocalChildPosition)||(this._currentTail.copy(this._springBone.initialLocalChildPosition),n=!0),n&&this._buildPosition()}_buildPosition(){for(let n=0;n<32;n++){let e=n/16*Math.PI;this._attrPos.setXYZ(n,Math.cos(e),Math.sin(e),0),this._attrPos.setXYZ(32+n,0,Math.cos(e),Math.sin(e)),this._attrPos.setXYZ(64+n,Math.sin(e),0,Math.cos(e))}this.scale(this._currentRadius,this._currentRadius,this._currentRadius),this.translate(this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.setXYZ(96,0,0,0),this._attrPos.setXYZ(97,this._currentTail.x,this._currentTail.y,this._currentTail.z),this._attrPos.needsUpdate=!0}_buildIndex(){for(let n=0;n<32;n++){let e=(n+1)%32;this._attrIndex.setXY(n*2,n,e),this._attrIndex.setXY(64+n*2,32+n,32+e),this._attrIndex.setXY(128+n*2,64+n,64+e)}this._attrIndex.setXY(192,96,97),this._attrIndex.needsUpdate=!0}},LE=new R,NE=class extends ft{constructor(n){super(),this.matrixAutoUpdate=!1,this.springBone=n,this._geometry=new IE(this.springBone);let e=new Yt({color:16776960,depthTest:!1,depthWrite:!1});this._line=new hn(this._geometry,e),this.add(this._line)}dispose(){this._geometry.dispose()}updateMatrixWorld(n){this.springBone.bone.updateWorldMatrix(!0,!1),this.matrix.copy(this.springBone.bone.matrixWorld);let e=this.matrix.elements;this._geometry.worldScale=LE.set(e[0],e[1],e[2]).length(),this._geometry.update(),super.updateMatrixWorld(n)}},gd=class extends ct{constructor(n){super(),this.colliderMatrix=new He,this.shape=n}updateWorldMatrix(n,e){super.updateWorldMatrix(n,e),UE(this.colliderMatrix,this.matrixWorld,this.shape.offset)}};function UE(n,e,t){let i=e.elements;n.copy(e),t&&(n.elements[12]=i[0]*t.x+i[4]*t.y+i[8]*t.z+i[12],n.elements[13]=i[1]*t.x+i[5]*t.y+i[9]*t.z+i[13],n.elements[14]=i[2]*t.x+i[6]*t.y+i[10]*t.z+i[14])}var DE=new He;function OE(n){return n.invert?n.invert():n.getInverse(DE.copy(n)),n}var FE=class{constructor(n){this._inverseCache=new He,this._shouldUpdateInverse=!0,this.matrix=n;let e={set:(t,i,r)=>(this._shouldUpdateInverse=!0,t[i]=r,!0)};this._originalElements=n.elements,n.elements=new Proxy(n.elements,e)}get inverse(){return this._shouldUpdateInverse&&(OE(this._inverseCache.copy(this.matrix)),this._shouldUpdateInverse=!1),this._inverseCache}revert(){this.matrix.elements=this._originalElements}},_d=new He,Ns=new R,ea=new R,ta=new R,na=new R,BE=new He,HE=class{constructor(n,e,t={},i=[]){this._currentTail=new R,this._prevTail=new R,this._boneAxis=new R,this._worldSpaceBoneLength=0,this._center=null,this._initialLocalMatrix=new He,this._initialLocalRotation=new Ye,this._initialLocalChildPosition=new R;var r,s,o,a,l,c;this.bone=n,this.bone.matrixAutoUpdate=!1,this.child=e,this.settings={hitRadius:(r=t.hitRadius)!=null?r:0,stiffness:(s=t.stiffness)!=null?s:1,gravityPower:(o=t.gravityPower)!=null?o:0,gravityDir:(l=(a=t.gravityDir)==null?void 0:a.clone())!=null?l:new R(0,-1,0),dragForce:(c=t.dragForce)!=null?c:.4},this.colliderGroups=i}get dependencies(){let n=new Set,e=this.bone.parent;e&&n.add(e);for(let t=0;t<this.colliderGroups.length;t++)for(let i=0;i<this.colliderGroups[t].colliders.length;i++)n.add(this.colliderGroups[t].colliders[i]);return n}get center(){return this._center}set center(n){var e;(e=this._center)!=null&&e.userData.inverseCacheProxy&&(this._center.userData.inverseCacheProxy.revert(),delete this._center.userData.inverseCacheProxy),this._center=n,this._center&&(this._center.userData.inverseCacheProxy||(this._center.userData.inverseCacheProxy=new FE(this._center.matrixWorld)))}get initialLocalChildPosition(){return this._initialLocalChildPosition}get _parentMatrixWorld(){return this.bone.parent?this.bone.parent.matrixWorld:_d}setInitState(){this._initialLocalMatrix.copy(this.bone.matrix),this._initialLocalRotation.copy(this.bone.quaternion),this.child?this._initialLocalChildPosition.copy(this.child.position):this._initialLocalChildPosition.copy(this.bone.position).normalize().multiplyScalar(.07);let n=this._getMatrixWorldToCenter();this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(n),this._prevTail.copy(this._currentTail),this._boneAxis.copy(this._initialLocalChildPosition).normalize()}reset(){this.bone.quaternion.copy(this._initialLocalRotation),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix);let n=this._getMatrixWorldToCenter();this.bone.localToWorld(this._currentTail.copy(this._initialLocalChildPosition)).applyMatrix4(n),this._prevTail.copy(this._currentTail)}update(n){if(n<=0)return;this._calcWorldSpaceBoneLength();let e=ea.copy(this._boneAxis).transformDirection(this._initialLocalMatrix).transformDirection(this._parentMatrixWorld);na.copy(this._currentTail).add(Ns.subVectors(this._currentTail,this._prevTail).multiplyScalar(1-this.settings.dragForce)).applyMatrix4(this._getMatrixCenterToWorld()).addScaledVector(e,this.settings.stiffness*n).addScaledVector(this.settings.gravityDir,this.settings.gravityPower*n),ta.setFromMatrixPosition(this.bone.matrixWorld),na.sub(ta).normalize().multiplyScalar(this._worldSpaceBoneLength).add(ta),this._collision(na),this._prevTail.copy(this._currentTail),this._currentTail.copy(na).applyMatrix4(this._getMatrixWorldToCenter());let t=BE.multiplyMatrices(this._parentMatrixWorld,this._initialLocalMatrix).invert();this.bone.quaternion.setFromUnitVectors(this._boneAxis,Ns.copy(na).applyMatrix4(t).normalize()).premultiply(this._initialLocalRotation),this.bone.updateMatrix(),this.bone.matrixWorld.multiplyMatrices(this._parentMatrixWorld,this.bone.matrix)}_collision(n){for(let e=0;e<this.colliderGroups.length;e++)for(let t=0;t<this.colliderGroups[e].colliders.length;t++){let i=this.colliderGroups[e].colliders[t],r=i.shape.calculateCollision(i.colliderMatrix,n,this.settings.hitRadius,Ns);if(r<0){n.addScaledVector(Ns,-r),n.sub(ta);let s=n.length();n.multiplyScalar(this._worldSpaceBoneLength/s).add(ta)}}}_calcWorldSpaceBoneLength(){Ns.setFromMatrixPosition(this.bone.matrixWorld),this.child?ea.setFromMatrixPosition(this.child.matrixWorld):(ea.copy(this._initialLocalChildPosition),ea.applyMatrix4(this.bone.matrixWorld)),this._worldSpaceBoneLength=Ns.sub(ea).length()}_getMatrixCenterToWorld(){return this._center?this._center.matrixWorld:_d}_getMatrixWorldToCenter(){return this._center?this._center.userData.inverseCacheProxy.inverse:_d}};function VE(n,e){let t=[],i=n;for(;i!==null;)t.unshift(i),i=i.parent;t.forEach(r=>{e(r)})}function bd(n,e){n.children.forEach(t=>{e(t)||bd(t,e)})}function zE(n){var e;let t=new Map;for(let i of n){let r=i;do{let s=((e=t.get(r))!=null?e:0)+1;if(s===n.size)return r;t.set(r,s),r=r.parent}while(r!==null)}return null}var Pm=class{constructor(){this._joints=new Set,this._sortedJoints=[],this._hasWarnedCircularDependency=!1,this._ancestors=[],this._objectSpringBonesMap=new Map,this._isSortedJointsDirty=!1,this._relevantChildrenUpdated=this._relevantChildrenUpdated.bind(this)}get joints(){return this._joints}get springBones(){return console.warn("VRMSpringBoneManager: springBones is deprecated. use joints instead."),this._joints}get colliderGroups(){let n=new Set;return this._joints.forEach(e=>{e.colliderGroups.forEach(t=>{n.add(t)})}),Array.from(n)}get colliders(){let n=new Set;return this.colliderGroups.forEach(e=>{e.colliders.forEach(t=>{n.add(t)})}),Array.from(n)}addJoint(n){this._joints.add(n);let e=this._objectSpringBonesMap.get(n.bone);e==null&&(e=new Set,this._objectSpringBonesMap.set(n.bone,e)),e.add(n),this._isSortedJointsDirty=!0}addSpringBone(n){console.warn("VRMSpringBoneManager: addSpringBone() is deprecated. use addJoint() instead."),this.addJoint(n)}deleteJoint(n){this._joints.delete(n),this._objectSpringBonesMap.get(n.bone).delete(n),this._isSortedJointsDirty=!0}deleteSpringBone(n){console.warn("VRMSpringBoneManager: deleteSpringBone() is deprecated. use deleteJoint() instead."),this.deleteJoint(n)}setInitState(){this._sortJoints();for(let n=0;n<this._sortedJoints.length;n++){let e=this._sortedJoints[n];e.bone.updateMatrix(),e.bone.updateWorldMatrix(!1,!1),e.setInitState()}}reset(){this._sortJoints();for(let n=0;n<this._sortedJoints.length;n++){let e=this._sortedJoints[n];e.bone.updateMatrix(),e.bone.updateWorldMatrix(!1,!1),e.reset()}}update(n){this._sortJoints();for(let e=0;e<this._ancestors.length;e++)this._ancestors[e].updateWorldMatrix(e===0,!1);for(let e=0;e<this._sortedJoints.length;e++){let t=this._sortedJoints[e];t.bone.updateMatrix(),t.bone.updateWorldMatrix(!1,!1),t.update(n),bd(t.bone,this._relevantChildrenUpdated)}}_sortJoints(){if(!this._isSortedJointsDirty)return;let n=[],e=new Set,t=new Set,i=new Set;for(let s of this._joints)this._insertJointSort(s,e,t,n,i);this._sortedJoints=n;let r=zE(i);this._ancestors=[],r&&(this._ancestors.push(r),bd(r,s=>{var o,a;return((a=(o=this._objectSpringBonesMap.get(s))==null?void 0:o.size)!=null?a:0)>0?!0:(this._ancestors.push(s),!1)})),this._isSortedJointsDirty=!1}_insertJointSort(n,e,t,i,r){if(t.has(n))return;if(e.has(n)){this._hasWarnedCircularDependency||(console.warn("VRMSpringBoneManager: Circular dependency detected"),this._hasWarnedCircularDependency=!0);return}e.add(n);let s=n.dependencies;for(let o of s){let a=!1,l=null;VE(o,c=>{let u=this._objectSpringBonesMap.get(c);if(u)for(let h of u)a=!0,this._insertJointSort(h,e,t,i,r);else a||(l=c)}),l&&r.add(l)}i.push(n),t.add(n)}_relevantChildrenUpdated(n){var e,t;return((t=(e=this._objectSpringBonesMap.get(n))==null?void 0:e.size)!=null?t:0)>0?!0:(n.updateWorldMatrix(!1,!1),!1)}},Im="VRMC_springBone_extended_collider",GE=new Set(["1.0","1.0-beta"]),kE=new Set(["1.0"]),eg=class Ds{get name(){return Ds.EXTENSION_NAME}constructor(e,t){var i;this.parser=e,this.jointHelperRoot=t?.jointHelperRoot,this.colliderHelperRoot=t?.colliderHelperRoot,this.useExtendedColliders=(i=t?.useExtendedColliders)!=null?i:!0}afterRoot(e){return Ic(this,null,function*(){e.userData.vrmSpringBoneManager=yield this._import(e)})}_import(e){return Ic(this,null,function*(){let t=yield this._v1Import(e);if(t!=null)return t;let i=yield this._v0Import(e);return i??null})}_v1Import(e){return Ic(this,null,function*(){var t,i,r,s,o;let a=e.parser.json;if(!(((t=a.extensionsUsed)==null?void 0:t.indexOf(Ds.EXTENSION_NAME))!==-1))return null;let c=new Pm,u=yield e.parser.getDependencies("node"),h=(i=a.extensions)==null?void 0:i[Ds.EXTENSION_NAME];if(!h)return null;let d=h.specVersion;if(!GE.has(d))return console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${Ds.EXTENSION_NAME} specVersion "${d}"`),null;let f=(r=h.colliders)==null?void 0:r.map((_,p)=>{var g,M,T,x,S,E,A,v,w,C,L,D,H,U,V;let W=u[_.node];if(W==null)return console.warn(`VRMSpringBoneLoaderPlugin: The collider #${p} attempted to reference a node #${_.node} but not found. Skipping the collider`),null;let J=_.shape,se=(g=_.extensions)==null?void 0:g[Im];if(this.useExtendedColliders&&se!=null){let $=se.specVersion;if(!kE.has($))console.warn(`VRMSpringBoneLoaderPlugin: Unknown ${Im} specVersion "${$}". Fallbacking to the ${Ds.EXTENSION_NAME} definition`);else{let j=se.shape;if(j.sphere)return this._importSphereCollider(W,{offset:new R().fromArray((M=j.sphere.offset)!=null?M:[0,0,0]),radius:(T=j.sphere.radius)!=null?T:0,inside:(x=j.sphere.inside)!=null?x:!1});if(j.capsule)return this._importCapsuleCollider(W,{offset:new R().fromArray((S=j.capsule.offset)!=null?S:[0,0,0]),radius:(E=j.capsule.radius)!=null?E:0,tail:new R().fromArray((A=j.capsule.tail)!=null?A:[0,0,0]),inside:(v=j.capsule.inside)!=null?v:!1});if(j.plane)return this._importPlaneCollider(W,{offset:new R().fromArray((w=j.plane.offset)!=null?w:[0,0,0]),normal:new R().fromArray((C=j.plane.normal)!=null?C:[0,0,1])})}}if(J.sphere)return this._importSphereCollider(W,{offset:new R().fromArray((L=J.sphere.offset)!=null?L:[0,0,0]),radius:(D=J.sphere.radius)!=null?D:0,inside:!1});if(J.capsule)return this._importCapsuleCollider(W,{offset:new R().fromArray((H=J.capsule.offset)!=null?H:[0,0,0]),radius:(U=J.capsule.radius)!=null?U:0,tail:new R().fromArray((V=J.capsule.tail)!=null?V:[0,0,0]),inside:!1});console.warn(`VRMSpringBoneLoaderPlugin: The collider #${p} has no valid shape. Skipping the collider`)}),m=(s=h.colliderGroups)==null?void 0:s.map((_,p)=>{var g;return{colliders:((g=_.colliders)!=null?g:[]).map(T=>{let x=f?.[T];return x??(console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${p} attempted to reference a collider #${T} but not found. Skipping the collider`),null)}).filter(T=>T!=null),name:_.name}});return(o=h.springs)==null||o.forEach((_,p)=>{var g;let M=_.joints,T=(g=_.colliderGroups)==null?void 0:g.map(E=>{let A=m?.[E];return A??(console.warn(`VRMSpringBoneLoaderPlugin: The spring #${p} attempted to reference a collider group #${E} but not found. Skipping the collider group`),null)}).filter(E=>E!=null),x=_.center!=null?u[_.center]:void 0,S;M.forEach(E=>{if(S){let A=S.node,v=u[A],w=E.node,C=u[w],L={hitRadius:S.hitRadius,dragForce:S.dragForce,gravityPower:S.gravityPower,stiffness:S.stiffness,gravityDir:S.gravityDir!=null?new R().fromArray(S.gravityDir):void 0},D=this._importJoint(v,C,L,T);x&&(D.center=x),c.addJoint(D)}S=E})}),c.setInitState(),c})}_v0Import(e){return Ic(this,null,function*(){var t,i,r;let s=e.parser.json;if(!(((t=s.extensionsUsed)==null?void 0:t.indexOf("VRM"))!==-1))return null;let a=(i=s.extensions)==null?void 0:i.VRM,l=a?.secondaryAnimation;if(!l)return null;let c=l?.boneGroups;if(!c)return null;let u=new Pm,h=yield e.parser.getDependencies("node"),d=(r=l.colliderGroups)==null?void 0:r.map((f,m)=>{var _;let p=h[f.node];return p==null?(console.warn(`VRMSpringBoneLoaderPlugin: The collider group #${m} attempted to reference a node #${f.node} but not found. Skipping the collider group`),null):{colliders:((_=f.colliders)!=null?_:[]).map((M,T)=>{var x,S,E;let A=new R(0,0,0);return M.offset&&A.set((x=M.offset.x)!=null?x:0,(S=M.offset.y)!=null?S:0,M.offset.z?-M.offset.z:0),this._importSphereCollider(p,{offset:A,radius:(E=M.radius)!=null?E:0,inside:!1})})}});return c?.forEach((f,m)=>{let _=f.bones;_&&_.forEach(p=>{var g,M,T,x;let S=h[p];if(S==null){console.warn(`VRMSpringBoneLoaderPlugin: The spring bone group #${m} attempted to reference a node #${p} but not found. Skipping the node`);return}let E=new R;f.gravityDir?E.set((g=f.gravityDir.x)!=null?g:0,(M=f.gravityDir.y)!=null?M:0,(T=f.gravityDir.z)!=null?T:0):E.set(0,-1,0);let A=f.center!=null?h[f.center]:void 0,v={hitRadius:f.hitRadius,dragForce:f.dragForce,gravityPower:f.gravityPower,stiffness:f.stiffiness,gravityDir:E},w=(x=f.colliderGroups)==null?void 0:x.map(C=>{let L=d?.[C];return L??(console.warn(`VRMSpringBoneLoaderPlugin: The spring #${m} attempted to reference a collider group #${C} but not found. Skipping the collider group`),null)}).filter(C=>C!=null);S.traverse(C=>{var L;let D=(L=C.children[0])!=null?L:null,H=this._importJoint(C,D,v,w);A&&(H.center=A),u.addJoint(H)})})}),e.scene.updateMatrixWorld(),u.setInitState(),u})}_importJoint(e,t,i,r){let s=new HE(e,t,i,r);if(this.jointHelperRoot){let o=new NE(s);this.jointHelperRoot.add(o),o.renderOrder=this.jointHelperRoot.renderOrder}return s}_importSphereCollider(e,t){let i=new Qm(t),r=new gd(i);if(e.add(r),this.colliderHelperRoot){let s=new md(r);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return r}_importCapsuleCollider(e,t){let i=new Km(t),r=new gd(i);if(e.add(r),this.colliderHelperRoot){let s=new md(r);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return r}_importPlaneCollider(e,t){let i=new jm(t),r=new gd(i);if(e.add(r),this.colliderHelperRoot){let s=new md(r);this.colliderHelperRoot.add(s),s.renderOrder=this.colliderHelperRoot.renderOrder}return r}};eg.EXTENSION_NAME="VRMC_springBone";var WE=eg,tg=class{get name(){return"VRMLoaderPlugin"}constructor(n,e){var t,i,r,s,o,a,l,c,u,h;this.parser=n;let d=e?.helperRoot,f=e?.autoUpdateHumanBones;this.expressionPlugin=(t=e?.expressionPlugin)!=null?t:new aS(n),this.firstPersonPlugin=(i=e?.firstPersonPlugin)!=null?i:new cS(n),this.humanoidPlugin=(r=e?.humanoidPlugin)!=null?r:new gS(n,{helperRoot:d,autoUpdateHumanBones:f}),this.lookAtPlugin=(s=e?.lookAtPlugin)!=null?s:new IS(n,{helperRoot:d}),this.metaPlugin=(o=e?.metaPlugin)!=null?o:new US(n),this.mtoonMaterialPlugin=(a=e?.mtoonMaterialPlugin)!=null?a:new JS(n),this.materialsHDREmissiveMultiplierPlugin=(l=e?.materialsHDREmissiveMultiplierPlugin)!=null?l:new KS(n),this.materialsV0CompatPlugin=(c=e?.materialsV0CompatPlugin)!=null?c:new rE(n),this.springBonePlugin=(u=e?.springBonePlugin)!=null?u:new WE(n,{colliderHelperRoot:d,jointHelperRoot:d}),this.nodeConstraintPlugin=(h=e?.nodeConstraintPlugin)!=null?h:new TE(n,{helperRoot:d})}beforeRoot(){return Rc(this,null,function*(){yield this.materialsV0CompatPlugin.beforeRoot(),yield this.mtoonMaterialPlugin.beforeRoot()})}loadMesh(n){return Rc(this,null,function*(){return yield this.mtoonMaterialPlugin.loadMesh(n)})}getMaterialType(n){let e=this.mtoonMaterialPlugin.getMaterialType(n);return e??null}extendMaterialParams(n,e){return Rc(this,null,function*(){yield this.materialsHDREmissiveMultiplierPlugin.extendMaterialParams(n,e),yield this.mtoonMaterialPlugin.extendMaterialParams(n,e)})}afterRoot(n){return Rc(this,null,function*(){yield this.metaPlugin.afterRoot(n),yield this.humanoidPlugin.afterRoot(n),yield this.expressionPlugin.afterRoot(n),yield this.lookAtPlugin.afterRoot(n),yield this.firstPersonPlugin.afterRoot(n),yield this.springBonePlugin.afterRoot(n),yield this.nodeConstraintPlugin.afterRoot(n),yield this.mtoonMaterialPlugin.afterRoot(n);let e=n.userData.vrmMeta,t=n.userData.vrmHumanoid;if(e&&t){let i=new OS({scene:n.scene,expressionManager:n.userData.vrmExpressionManager,firstPerson:n.userData.vrmFirstPerson,humanoid:t,lookAt:n.userData.vrmLookAt,meta:e,materials:n.userData.vrmMToonMaterials,springBoneManager:n.userData.vrmSpringBoneManager,nodeConstraintManager:n.userData.vrmNodeConstraintManager});n.userData.vrm=i}})}};function XE(n){let e=new Set;return n.traverse(t=>{if(!t.isMesh)return;let i=t;e.add(i)}),e}function Lm(n,e,t){if(e.size===1){let o=e.values().next().value;if(o.weight===1)return n[o.index]}let i=new Float32Array(n[0].count*3),r=0;if(t)r=1;else for(let o of e)r+=o.weight;for(let o of e){let a=n[o.index],l=o.weight/r;for(let c=0;c<a.count;c++)i[c*3+0]+=a.getX(c)*l,i[c*3+1]+=a.getY(c)*l,i[c*3+2]+=a.getZ(c)*l}return new Ke(i,3)}function qE(n){var e;let t=XE(n.scene),i=new Map,r=(e=n.expressionManager)==null?void 0:e.expressionMap;if(r!=null)for(let[s,o]of Object.entries(r)){let a=new Set;for(let l of o.binds)if(l instanceof Dc){if(l.weight!==0)for(let c of l.primitives){let u=i.get(c);u==null&&(u=new Map,i.set(c,u));let h=u.get(s);h==null&&(h=new Set,u.set(s,h)),h.add(l)}a.add(l)}for(let l of a)o.deleteBind(l)}for(let s of t){let o=i.get(s);if(o==null)continue;let a=s.geometry.morphAttributes;s.geometry.morphAttributes={};let l=s.geometry.clone();s.geometry=l;let c=l.morphTargetsRelative,u=a.position!=null,h=a.normal!=null,d={},f={},m=[];if(u||h){u&&(d.position=[]),h&&(d.normal=[]);let _=0;for(let[p,g]of o)u&&(d.position[_]=Lm(a.position,g,c)),h&&(d.normal[_]=Lm(a.normal,g,c)),r?.[p].addBind(new Dc({index:_,weight:1,primitives:[s]})),f[p]=_,m.push(0),_++}l.morphAttributes=d,s.morphTargetDictionary=f,s.morphTargetInfluences=m}}function Fc(n,e,t){if(n.getComponent)return n.getComponent(e,t);{let i=n.array[e*n.itemSize+t];return n.normalized&&(i=mt.denormalize(i,n.array)),i}}function ng(n,e,t,i){n.setComponent?n.setComponent(e,t,i):(n.normalized&&(i=mt.normalize(i,n.array)),n.array[e*n.itemSize+t]=i)}function YE(n){var e;let t=ZE(n),i=new Set;for(let h of t)i.has(h.geometry)&&(h.geometry=eb(h.geometry)),i.add(h.geometry);let r=new Map;for(let h of i){let d=h.getAttribute("skinIndex"),f=(e=r.get(d))!=null?e:new Map;r.set(d,f);let m=h.getAttribute("skinWeight"),_=JE(d,m);f.set(m,_)}let s=new Map;for(let h of t){let d=$E(h,r);s.set(h,d)}let o=[];for(let[h,d]of s){let f=!1;for(let m of o)if(KE(d,m.boneInverseMap)){f=!0,m.meshes.add(h);for(let[p,g]of d)m.boneInverseMap.set(p,g);break}f||o.push({boneInverseMap:d,meshes:new Set([h])})}let a=new Map,l=new xd,c=new xd,u=new xd;for(let h of o){let{boneInverseMap:d,meshes:f}=h,m=Array.from(d.keys()),_=Array.from(d.values()),p=new zn(m,_),g=c.getOrCreate(p);for(let M of f){let T=M.geometry.getAttribute("skinIndex"),x=l.getOrCreate(T),S=M.skeleton.bones,E=S.map(w=>u.getOrCreate(w)).join(","),A=`${x};${g};${E}`,v=a.get(A);v==null&&(v=T.clone(),jE(v,S,m),a.set(A,v)),M.geometry.setAttribute("skinIndex",v)}for(let M of f)M.bind(p,new He)}}function ZE(n){let e=new Set;return n.traverse(t=>{if(!t.isSkinnedMesh)return;let i=t;e.add(i)}),e}function JE(n,e){let t=new Set;for(let i=0;i<n.count;i++)for(let r=0;r<n.itemSize;r++){let s=Fc(n,i,r);Fc(e,i,r)!==0&&t.add(s)}return t}function $E(n,e){let t=new Map,i=n.skeleton,r=n.geometry,s=r.getAttribute("skinIndex"),o=r.getAttribute("skinWeight"),a=e.get(s),l=a?.get(o);if(!l)throw new Error("Unreachable. attributeUsedIndexSetMap does not know the skin index attribute or the skin weight attribute.");for(let c of l)t.set(i.bones[c],i.boneInverses[c]);return t}function KE(n,e){for(let[t,i]of n.entries()){let r=e.get(t);if(r!=null&&!QE(i,r))return!1}return!0}function jE(n,e,t){let i=new Map;for(let s of e)i.set(s,i.size);let r=new Map;for(let[s,o]of t.entries()){let a=i.get(o);r.set(a,s)}for(let s=0;s<n.count;s++)for(let o=0;o<n.itemSize;o++){let a=Fc(n,s,o),l=r.get(a);ng(n,s,o,l)}n.needsUpdate=!0}function QE(n,e,t){if(t=t||1e-4,n.elements.length!=e.elements.length)return!1;for(let i=0,r=n.elements.length;i<r;i++)if(Math.abs(n.elements[i]-e.elements[i])>t)return!1;return!0}var xd=class{constructor(){this._objectIndexMap=new Map,this._index=0}get(n){return this._objectIndexMap.get(n)}getOrCreate(n){let e=this._objectIndexMap.get(n);return e==null&&(e=this._index,this._objectIndexMap.set(n,e),this._index++),e}};function eb(n){var e,t,i,r;let s=new Qe;s.name=n.name,s.setIndex(n.index);for(let[o,a]of Object.entries(n.attributes))s.setAttribute(o,a);for(let[o,a]of Object.entries(n.morphAttributes)){let l=o;s.morphAttributes[l]=a.concat()}s.morphTargetsRelative=n.morphTargetsRelative,s.groups=[];for(let o of n.groups)s.addGroup(o.start,o.count,o.materialIndex);return s.boundingSphere=(t=(e=n.boundingSphere)==null?void 0:e.clone())!=null?t:null,s.boundingBox=(r=(i=n.boundingBox)==null?void 0:i.clone())!=null?r:null,s.drawRange.start=n.drawRange.start,s.drawRange.count=n.drawRange.count,s.userData=n.userData,s}function Nm(n){if(Object.values(n).forEach(e=>{e?.isTexture&&e.dispose()}),n.isShaderMaterial){let e=n.uniforms;e&&Object.values(e).forEach(t=>{let i=t.value;i?.isTexture&&i.dispose()})}n.dispose()}function tb(n){let e=n.geometry;e&&e.dispose();let t=n.skeleton;t&&t.dispose();let i=n.material;i&&(Array.isArray(i)?i.forEach(r=>Nm(r)):i&&Nm(i))}function nb(n){n.traverse(tb)}function ib(n,e){var t,i;console.warn("VRMUtils.removeUnnecessaryJoints: removeUnnecessaryJoints is deprecated. Use combineSkeletons instead. combineSkeletons contributes more to the performance improvement. This function will be removed in the next major version.");let r=(t=e?.experimentalSameBoneCounts)!=null?t:!1,s=[];n.traverse(l=>{l.type==="SkinnedMesh"&&s.push(l)});let o=new Map,a=0;for(let l of s){let u=l.geometry.getAttribute("skinIndex");if(o.has(u))continue;let h=new Map,d=new Map;for(let f=0;f<u.count;f++)for(let m=0;m<u.itemSize;m++){let _=Fc(u,f,m),p=h.get(_);p==null&&(p=h.size,h.set(_,p),d.set(p,_)),ng(u,f,m,p)}u.needsUpdate=!0,o.set(u,d),a=Math.max(a,h.size)}for(let l of s){let u=l.geometry.getAttribute("skinIndex"),h=o.get(u),d=[],f=[],m=r?a:h.size;for(let p=0;p<m;p++){let g=(i=h.get(p))!=null?i:0;d.push(l.skeleton.bones[g]),f.push(l.skeleton.boneInverses[g])}let _=new zn(d,f);l.bind(_,new He)}}function rb(n,e){let t=n.position.count,i=new Array(t),r=0,s=e.array;for(let o=0;o<s.length;o++){let a=s[o];i[a]||(i[a]=!0,r++)}return{isVertexUsed:i,vertexCount:t,verticesUsed:r}}function sb(n){let e=[],t=[],i=0;for(let r=0;r<n.length;r++)if(n[r]){let s=i++;e[r]=s,t[s]=r}return{originalIndexNewIndexMap:e,newIndexOriginalIndexMap:t}}function ob(n,e){var t,i,r,s;e.name=n.name,e.morphTargetsRelative=n.morphTargetsRelative,n.groups.forEach(o=>{e.addGroup(o.start,o.count,o.materialIndex)}),e.boundingBox=(i=(t=n.boundingBox)==null?void 0:t.clone())!=null?i:null,e.boundingSphere=(s=(r=n.boundingSphere)==null?void 0:r.clone())!=null?s:null,e.setDrawRange(n.drawRange.start,n.drawRange.count),e.userData=n.userData}function ab(n,e,t){let i=e.array,r=new i.constructor(i.length);for(let s=0;s<i.length;s++){let o=i[s];r[s]=t[o]}n.setIndex(new Ke(r,e.itemSize,e.normalized))}function Bc(n,e,t){let i=n.constructor,r=new i(e.length*t),s=!0;for(let o=0;o<e.length;o++){let l=e[o]*t,c=o*t;for(let u=0;u<t;u++){let h=n[l+u];r[c+u]=h,s=s&&h===0}}return[r,s]}function lb(n){var e;let t=new Map,i=[];for(let[r,s]of Object.entries(n))if(s.isInterleavedBufferAttribute){let o=s,a=o.data,l=(e=t.get(a))!=null?e:[];t.set(a,l),l.push([r,o])}else{let o=s;i.push([r,o])}return[t,i]}function cb(n,e,t){let[i,r]=lb(e);for(let[s,o]of i){let a=s.array,{stride:l}=s,[c,u]=Bc(a,t,l),h=new ei(c,l);h.setUsage(s.usage);for(let[d,f]of o){let{itemSize:m,offset:_,normalized:p}=f,g=new Vn(h,m,_,p);n.setAttribute(d,g)}}for(let[s,o]of r){let a=o.array,{itemSize:l,normalized:c}=o,[u,h]=Bc(a,t,l);n.setAttribute(s,new Ke(u,l,c))}}function ub(n){var e;let t=new Map,i=[];for(let[r,s]of Object.entries(n)){let o=r;for(let a=0;a<s.length;a++){let l=s[a];if(l.isInterleavedBufferAttribute){let c=l,u=c.data,h=(e=t.get(u))!=null?e:[];t.set(u,h),h.push([o,a,c])}else{let c=l;i.push([o,a,c])}}}return[t,i]}function hb(n,e,t){var i,r;let s=!0,[o,a]=ub(e),l={};for(let[c,u]of o){let h=c.array,{stride:d}=c,[f,m]=Bc(h,t,d);s=s&&m;let _=new ei(f,d);_.setUsage(c.usage);for(let[p,g,M]of u){let{itemSize:T,offset:x,normalized:S}=M,E=new Vn(_,T,x,S);(i=l[p])!=null||(l[p]=[]),l[p][g]=E}}for(let[c,u,h]of a){let d=h,f=d.array,{itemSize:m,normalized:_}=d,[p,g]=Bc(f,t,m);s=s&&g,(r=l[c])!=null||(l[c]=[]),l[c][u]=new Ke(p,m,_)}n.morphAttributes=s?{}:l}function db(n){let e=new Map;n.traverse(t=>{if(!t.isMesh)return;let i=t,r=i.geometry,s=r.index;if(s==null)return;let o=e.get(r);if(o!=null){i.geometry=o;return}let{isVertexUsed:a,vertexCount:l,verticesUsed:c}=rb(r.attributes,s);if(c===l)return;let{originalIndexNewIndexMap:u,newIndexOriginalIndexMap:h}=sb(a),d=new Qe;ob(r,d),e.set(r,d),ab(d,s,u),cb(d,r.attributes,h),hb(d,r.morphAttributes,h),i.geometry=d}),Array.from(e.keys()).forEach(t=>{t.dispose()})}function fb(n){var e;((e=n.meta)==null?void 0:e.metaVersion)==="0"&&(n.scene.rotation.y=Math.PI)}var Yn=class{constructor(){}};Yn.combineMorphs=qE;Yn.combineSkeletons=YE;Yn.deepDispose=nb;Yn.removeUnnecessaryJoints=ib;Yn.removeUnnecessaryVertices=db;Yn.rotateVRM0=fb;var Rd=["happy","sad","relaxed","surprised"],ig={happy:0,sad:0,relaxed:0,surprised:0},pb={neutral:{},warm:{happy:.35,relaxed:.35},happy:{happy:.75},playful:{happy:.55,surprised:.1},curious:{surprised:.3,happy:.1},thoughtful:{relaxed:.3},concerned:{sad:.45},surprised:{surprised:.7}},mb={luna:{relaxed:.12,happy:.08},nova:{happy:.15},rio:{happy:.18}},rg=7e3,gb=2500;function sg(n,e,t){let i={...ig,...mb[n]};if(!e)return i;let r=t-e.at,s=r<=rg?1:Math.max(0,1-(r-rg)/gb);if(s===0)return i;let o=pb[e.emotion]??{},a=Math.min(1,Math.max(0,e.intensity))*s,l={...ig};for(let c of Rd){let u=(o[c]??0)*a+i[c]*(1-a);l[c]=Math.min(1,u)}return l}function Hs(n,e,t,i){let r=1-Math.exp(-i*t);return n+(e-n)*r}var Os,Ki,Fs,Bs,Hc=class{constructor(e=Math.random,t=0){qt(this,Os);qt(this,Ki,-1);qt(this,Fs,!1);qt(this,Bs);rn(this,Bs,e),rn(this,Os,t+1+e()*2)}weight(e){if(dt(this,Ki)<0&&e>=dt(this,Os)&&(rn(this,Ki,e),rn(this,Fs,dt(this,Bs).call(this)<.2)),dt(this,Ki)<0)return 0;let t=dt(this,Fs)?.42:.16,i=(e-dt(this,Ki))/t;if(i>=1)return rn(this,Ki,-1),rn(this,Os,e+2.5+dt(this,Bs).call(this)*3.5),0;let r=dt(this,Fs)?2:1;return Math.abs(Math.sin(i*Math.PI*r))}};Os=new WeakMap,Ki=new WeakMap,Fs=new WeakMap,Bs=new WeakMap;var _b={nod:.9,tilt_head:1.8,laugh_soft:1.2,lean_in:1.6,shrug:1.2};function og(n,e){let t=n?_b[n]:void 0;if(!n||t===void 0||e<0||e>t)return{x:0,y:0,z:0};let i=e/t,r=Math.sin(i*Math.PI);switch(n){case"nod":return{x:Math.sin(i*Math.PI*2)*.12*r,y:0,z:0};case"tilt_head":return{x:0,y:0,z:.14*r};case"laugh_soft":return{x:-.05*r+Math.sin(i*Math.PI*6)*.02*r,y:0,z:0};case"lean_in":return{x:.08*r,y:0,z:0};case"shrug":return{x:0,y:0,z:-.06*r};default:return{x:0,y:0,z:0}}}function ag(n){switch(n){case"listening":case"endpoint":return{x:.03,y:0,z:.07};case"thinking":return{x:-.06,y:.08,z:0};default:return{x:0,y:0,z:0}}}function lg(n,e){let t=Math.min(1,Math.max(0,n)),i=(Math.sin(e*11)+1)/2;return{aa:t*(.55+.35*i),oh:t*.35*(1-i),ih:t*.2*i}}var cg={luna:"luna-office",nova:"nova-room",rio:"rio-outdoors"},Vc={"luna-office":{fog:15328474,fogNear:3.2,fogFar:9,sky:16052714,ground:10259060,hemiIntensity:.45,rim:16773852,rimIntensity:1,key:16774890,keyIntensity:.85,grade:{blur:.7,bloom:.25,bloomThreshold:.85,saturation:1.05,contrast:1.07,warmth:.02,vignette:.22}},"nova-room":{fog:1838882,fogNear:3,fogFar:8,sky:6961786,ground:2757408,hemiIntensity:.55,rim:16736174,rimIntensity:1.3,key:16773866,keyIntensity:1.6,grade:{blur:.8,bloom:1,bloomThreshold:.45,saturation:1.12,contrast:1.08,warmth:0,vignette:.45}},"rio-outdoors":{fog:15776138,fogNear:5,fogFar:26,sky:11126504,ground:6967864,hemiIntensity:.75,rim:16756832,rimIntensity:3,key:16773340,keyIntensity:1.8,grade:{blur:.6,bloom:.6,bloomThreshold:.7,saturation:1.08,contrast:1.05,warmth:.03,vignette:.3}}},ug={"luna-office":null,"nova-room":null,"rio-outdoors":null};function Vs(n){let e=n>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function ra(n,e,t=.72){let i=Math.sin(n*7.3+e)*.5+Math.sin(n*13.1+e*2.1)*.3+Math.sin(n*23.7+e*3.7)*.2;return t+(i+1)/2*(1-t)}function hg(n){return .85+.15*(.5+.5*Math.sin(n*1.1))}function sa(n,e,t){return(Math.sin(n*.9+e)*.7+Math.sin(n*1.7+e*1.3)*.3)*t}var ji,oa,aa,la,Cd=class{constructor(e){this.random=e;Xc(this,"group",new ft);Xc(this,"updaters",[]);qt(this,ji,[]);qt(this,oa,new Map);qt(this,aa,null);qt(this,la,!1)}matte(e,t=.9,i=0){let r=`m${e}-${t}-${i}`,s=dt(this,oa).get(r);return s||(s=new Pn({color:e,roughness:t,metalness:i}),dt(this,oa).set(r,s),dt(this,ji).push(s)),s}glow(e,t=1,i=!0){let r=new Tt({color:e,transparent:t<1,opacity:t,fog:i});return dt(this,ji).push(r),r}canvasTexture(e,t,i){let r=document.createElement("canvas");r.width=e,r.height=t;let s=r.getContext("2d");i(s,e,t);let o=new vo(r);return o.colorSpace=At,this.track(o)}glowSprite(){return dt(this,aa)??rn(this,aa,this.canvasTexture(64,64,(e,t)=>{let i=e.createRadialGradient(t/2,t/2,0,t/2,t/2,t/2);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.25,"rgba(255,255,255,0.8)"),i.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=i,e.fillRect(0,0,t,t)})),dt(this,aa)}movingLights(e,t,i,r){let s=new Float32Array(e*3),o=new Float32Array(e*3),a=Array.from({length:e},(f,m)=>new Me(i(m))),l=this.track(new Qe);l.setAttribute("position",new Ke(s,3)),l.setAttribute("color",new Ke(o,3));let c=this.track(new Ei({size:t,map:this.glowSprite(),vertexColors:!0,transparent:!0,depthWrite:!1,blending:_r,fog:!1})),u=new Vi(l,c);u.frustumCulled=!1,this.group.add(u);let h=new R,d=f=>{for(let m=0;m<e;m++){let _=r(m,f,h);s[m*3]=h.x,s[m*3+1]=h.y,s[m*3+2]=h.z,o[m*3]=a[m].r*_,o[m*3+1]=a[m].g*_,o[m*3+2]=a[m].b*_}l.attributes.position.needsUpdate=!0,l.attributes.color.needsUpdate=!0};return d(0),this.updaters.push(d),u}plate(e,t){e&&new gr().load(e,i=>{if(dt(this,la)){i.dispose();return}i.colorSpace=At,this.track(i),t(i)},void 0,()=>console.info("[escena] sin vista pintada, sigue la dibujada:",e))}track(e){return dt(this,ji).push(e),e}mesh(e,t,i=0,r=0,s=0,o=this.group){this.track(e);let a=new Ct(e,t);return a.position.set(i,r,s),o.add(a),a}box(e,t,i,r,s,o,a,l){return this.mesh(new Gi(e,t,i),r,s,o,a,l)}dispose(){rn(this,la,!0);for(let e of dt(this,ji))e.dispose();dt(this,ji).length=0}};ji=new WeakMap,oa=new WeakMap,aa=new WeakMap,la=new WeakMap;function fg(n,e,t){let i=cg[n];if(!i)return null;let r=Vc[i],s=new Cd(Vs(i.length*7919+17));e.fog=new fo(r.fog,r.fogNear,r.fogFar),e.background=new Me(r.fog);let o=new Lo(r.sky,r.ground,r.hemiIntensity),a=new ri(r.key,r.keyIntensity);a.position.set(t.x+.7,t.y+.9,t.z+1.8),a.target.position.copy(t);let l=new ri(r.rim,r.rimIntensity);return l.position.set(t.x-1.2,t.y+.8,t.z-1.6),l.target.position.copy(t),s.group.add(o,a,a.target,l,l.target),Mb[i](s,t,ug[i]),e.add(s.group),{id:i,update(c,u){let h=u?0:c;for(let d of s.updaters)d(h)},dispose(){e.remove(s.group),e.fog=null,e.background=null,s.dispose()}}}function xb(n,e,t){let r=n.matte(15261648),s=n.matte(10120005,.7),o=n.matte(7227952,.75);n.box(8,.05,8,n.matte(12161386,.8),0,-.025,-1.5),n.box(8,4,.1,r,0,2,-2.6),n.box(8,.12,.04,n.matte(16183784),0,.06,-2.6+.07);let a={x:-1.05,y:e.y+.15,w:1.5,h:1.55},l=-2.6+.06,c=Vs(4242),u=n.canvasTexture(64,256,(ae,he,Re)=>{let X=ae.createLinearGradient(0,0,0,Re);X.addColorStop(0,"#8fbfe6"),X.addColorStop(.6,"#cfe4f2"),X.addColorStop(1,"#fbf3e3"),ae.fillStyle=X,ae.fillRect(0,0,he,Re)});n.mesh(new Nt(a.w,a.h),n.track(new Tt({map:u,fog:!1})),a.x,a.y,l);let h=n.canvasTexture(512,256,(ae,he,Re)=>{for(let X=0;X<9;X++){let ne=c()*he,fe=Re*(.15+c()*.45);for(let Le=0;Le<7;Le++){let me=18+c()*34,De=ne+(c()-.5)*90,tt=fe+(c()-.5)*20;for(let ie of[-he,0,he]){let G=ae.createRadialGradient(De+ie,tt,0,De+ie,tt,me);G.addColorStop(0,"rgba(255,255,255,0.85)"),G.addColorStop(1,"rgba(255,255,255,0)"),ae.fillStyle=G,ae.fillRect(De+ie-me,tt-me,me*2,me*2)}}}});h.wrapS=Hn;let d=n.mesh(new Nt(a.w,a.h),n.track(new Tt({map:h,transparent:!0,fog:!1,depthWrite:!1})),a.x,a.y,l+.002);n.updaters.push(ae=>{h.offset.x=ae*.004});let f=n.canvasTexture(512,512,(ae,he,Re)=>{let X=(ne,fe)=>{ae.fillStyle=fe,ae.beginPath(),ae.moveTo(0,Re);for(let Le=0;Le<=he;Le+=16)ae.lineTo(Le,ne+Math.sin(Le*.012+ne)*14);ae.lineTo(he,Re),ae.fill()};X(Re*.7,"#b9cfb0"),X(Re*.78,"#9dbc92");for(let ne=0;ne<26;ne++){let fe=c()*he,Le=Re*(.72+c()*.2),me=22+c()*34,De=ae.createRadialGradient(fe-me*.3,Le-me*.4,me*.1,fe,Le,me);De.addColorStop(0,"#a9cf8f"),De.addColorStop(.7,"#6f9c63"),De.addColorStop(1,"rgba(79,122,74,0)"),ae.fillStyle=De,ae.beginPath(),ae.ellipse(fe,Le,me,me*.85,0,0,Math.PI*2),ae.fill()}}),m=n.track(new Tt({map:f,transparent:!0,fog:!1,depthWrite:!1}));n.mesh(new Nt(a.w,a.h),m,a.x,a.y,l+.004),n.plate(t,ae=>{pg(ae,a.w/a.h),m.map=ae,m.transparent=!1,m.needsUpdate=!0,d.visible=!1});let _=new ft;_.position.set(a.x+a.w/2-.1,a.y+a.h/2-.1,l+.01),n.group.add(_);let p=n.glow(8367726,.95,!1),g=n.glow(6262613,.95,!1);for(let ae=0;ae<18;ae++){let he=n.mesh(new xn(.035+c()*.03,10),ae%3?p:g,-c()*.45,-c()*.3,0,_);he.scale.set(1.6,.8,1),he.rotation.z=c()*Math.PI}n.updaters.push(ae=>{_.rotation.z=sa(ae,.8,.05)});let M=n.matte(16513266,.6);n.box(a.w+.1,.06,.08,M,a.x,a.y+a.h/2,-2.6+.08),n.box(a.w+.1,.08,.14,M,a.x,a.y-a.h/2,-2.6+.1),n.box(.06,a.h,.08,M,a.x-a.w/2,a.y,-2.6+.08),n.box(.06,a.h,.08,M,a.x+a.w/2,a.y,-2.6+.08),n.box(.035,a.h,.06,M,a.x,a.y,-2.6+.08),n.box(a.w,.035,.06,M,a.x,a.y+a.h*.12,-2.6+.08);let T=n.mesh(new Nt(.34,a.h+.25,1,6),n.matte(15985888,1),a.x-a.w/2-.1,a.y-.05,-2.6+.16);T.material.side=Ut,n.updaters.push(ae=>{T.rotation.y=sa(ae,.3,.05)});let x=n.canvasTexture(64,256,(ae,he,Re)=>{let X=ae.createLinearGradient(0,0,0,Re);X.addColorStop(0,"rgba(255,244,220,0.55)"),X.addColorStop(1,"rgba(255,244,220,0)"),ae.fillStyle=X,ae.fillRect(0,0,he,Re)}),S=[];for(let ae=0;ae<3;ae++){let he=n.mesh(new Nt(.28+ae*.08,2.2),n.track(new Tt({map:x,transparent:!0,depthWrite:!1,blending:_r,fog:!1,side:Ut})),a.x+.25+ae*.28,a.y-.25,-2+ae*.1);he.rotation.z=.55,S.push(he)}n.updaters.push(ae=>{S.forEach((he,Re)=>{he.material.opacity=.35+.2*(.5+.5*Math.sin(ae*.25+Re*1.7))})});let E=new yn(16773592,4,2.2,1.6);E.position.set(a.x+.2,a.y+.3,-2.6+.8),n.group.add(E);let A={x:1.05,w:1.1,z:-2.6+.22};n.box(A.w,2.3,.34,o,A.x,1.15,A.z-.02);let v=[8166026,13214570,9203599,14075816,7311278,11890778,14734784,6124896];for(let ae=0;ae<5;ae++){let he=.28+ae*.44;n.box(A.w-.06,.03,.3,s,A.x,he-.02,A.z+.02);let Re=A.x-A.w/2+.07;for(;Re<A.x+A.w/2-.12;){if(n.random()<.12){Re+=.1;continue}let X=.035+n.random()*.035,ne=.24+n.random()*.12,fe=n.box(X,ne,.22,n.matte(v[Math.floor(n.random()*v.length)]),Re+X/2,he+ne/2,A.z+.04);n.random()<.08&&(fe.rotation.z=.25),Re+=X+.006}}n.mesh(new Vt(.07,.055,.12,16),n.matte(14273459),A.x+.3,1.2+.06,A.z+.04);for(let ae=0;ae<6;ae++)n.mesh(new Cn(.05,10,8),n.matte(7314026),A.x+.3+(n.random()-.5)*.12,1.36+n.random()*.08,A.z+.04).scale.set(1,.6,1);let w=new ft;w.position.set(-1.05,0,-1.9),n.group.add(w),n.mesh(new Vt(.2,.16,.42,20),n.matte(13482138,.85),0,.21,0,w),n.mesh(new Vt(.015,.02,1.2,6),n.matte(7035460),0,1,0,w);let C=n.matte(6197082,.8),L=n.matte(4879689,.8),D=[];for(let ae=0;ae<16;ae++){let he=new ft,Re=.7+ae/16*.95;he.position.set(0,Re,0),he.rotation.set(0,ae*2.4%(Math.PI*2),.9+n.random()*.5),w.add(he),n.mesh(new Cn(.1,12,8),ae%2?C:L,0,.16,0,he).scale.set(.75,1.5,.18),D.push(he)}n.box(1.3,.05,.6,s,.25,.76,-2),n.box(.05,.74,.55,o,-.35,.37,-2),n.box(.05,.74,.55,o,.85,.37,-2),n.mesh(new Vt(.07,.09,.03,16),n.matte(4012598,.5,.3),.7,.8,-2.1),n.mesh(new Vt(.012,.012,.42,8),n.matte(4012598,.5,.3),.7,1,-2.1),n.mesh(new Vt(.07,.13,.16,24,1,!0),n.glow(16769200,1),.7,1.24,-2.1);let H=new yn(16763274,1.6,2.2,2);H.position.set(.7,1.16,-2.05),n.group.add(H);let U={x:.84,y:.82,z:-2.02};n.mesh(new Vt(.04,.035,.08,16),n.matte(15920612,.5),U.x,U.y,U.z),n.mesh(new xn(.036,16),n.matte(9067066,.3),U.x,U.y+.041,U.z).rotation.x=-Math.PI/2;let V=n.glowSprite(),W=n.track(new ur({map:V,color:16777215,transparent:!0,depthWrite:!1,opacity:0})),J=Array.from({length:6},(ae,he)=>{let Re=new as(W.clone());return n.track(Re.material),n.group.add(Re),{sp:Re,phase:he/6}});n.updaters.push(ae=>{for(let he of J){let Re=(ae*.18+he.phase)%1;he.sp.position.set(U.x+Math.sin(ae*.9+he.phase*9)*.02*Re,U.y+.06+Re*.28,U.z);let X=.04+Re*.1;he.sp.scale.set(X,X*1.3,1),he.sp.material.opacity=Math.sin(Re*Math.PI)*.3}}),n.box(.28,.02,.2,n.matte(16249575),.3,.79,-1.9).rotation.y=.2;let se=new ft;se.position.set(.15,e.y+.55,-2.6+.07),n.group.add(se),n.box(.62,.42,.03,n.matte(16447214),0,0,0,se),n.box(.54,.34,.01,n.matte(15325632),0,0,.02,se),n.box(.54,.1,.012,n.matte(11124128),0,-.1,.022,se),n.mesh(new xn(.05,20),n.matte(15776138),.12,.07,.024,se);let $=40,j=new Float32Array($*3);for(let ae=0;ae<$;ae++)j[ae*3]=a.x+(n.random()-.3)*1.2,j[ae*3+1]=.8+n.random()*1.6,j[ae*3+2]=-2.6+.4+n.random()*1.2;let ee=n.track(new Qe);ee.setAttribute("position",new Ke(j,3));let Ie=n.track(new Ei({color:16774880,size:.012,transparent:!0,opacity:.7})),Te=new Vi(ee,Ie);n.group.add(Te),n.updaters.push(ae=>{Te.position.y=Math.sin(ae*.15)*.05,Te.position.x=Math.sin(ae*.1)*.04})}function dg(n){let e=new Gn,t=0,i=-n*.5;return e.moveTo(t,i),e.bezierCurveTo(t-n*.9,i+n*.55,t-n*.55,i+n*1.25,t,i+n*.9),e.bezierCurveTo(t+n*.55,i+n*1.25,t+n*.9,i+n*.55,t,i),e}function vb(n,e,t){n.box(8,4,.1,n.matte(3873599),0,2,-2.6),n.box(8,.05,8,n.matte(2364184,.6),0,-.025,-1.5),n.mesh(new xn(1.1,40),n.matte(9063015,1),.2,.002,-1.6).rotation.x=-Math.PI/2;let r={x:1,y:e.y+.2,w:1.2,h:1.5},s=-2.6+.12,o=-2.6+.06,a={y:r.y-r.h/2+.26},l=Vs(90210),c=n.canvasTexture(512,640,(N,O,k)=>{let ue=N.createLinearGradient(0,0,0,k);ue.addColorStop(0,"#0b0f26"),ue.addColorStop(.55,"#231a45"),ue.addColorStop(.8,"#4a2f5e"),ue.addColorStop(1,"#2a1d3a"),N.fillStyle=ue,N.fillRect(0,0,O,k);for(let pe=0;pe<14;pe++){let I=N.createRadialGradient(l()*O,k*(.15+l()*.4),0,l()*O,k*.3,90+l()*120);I.addColorStop(0,"rgba(120,90,150,0.18)"),I.addColorStop(1,"rgba(120,90,150,0)"),N.fillStyle=I,N.fillRect(0,0,O,k)}let de=(pe,I,Xe,Ze,P,y)=>{N.filter=y>0?`blur(${y}px)`:"none",N.fillStyle=Ze,N.fillRect(pe,Xe,I,k-Xe);let z=["#ffd28a","#ffe7b8","#9fd0ff","#ffb3d1"];for(let q=Xe+8;q<k-60;q+=12)for(let K=pe+5;K<pe+I-6;K+=9)l()<P&&(N.fillStyle=z[Math.floor(l()*z.length)],N.globalAlpha=.55+l()*.45,N.fillRect(K,q,4,6),N.globalAlpha=1);N.filter="none"};for(let pe=-10;pe<O;){let I=30+l()*50;de(pe,I,k*(.35+l()*.25),"#1c1638",.25,2),pe+=I+2}for(let pe=-20;pe<O;){let I=50+l()*70;de(pe,I,k*(.18+l()*.4),"#0a0a1a",.33,0),pe+=I+6+l()*20}let xe=N.createLinearGradient(0,k-150,0,k);xe.addColorStop(0,"#15101f"),xe.addColorStop(1,"#241a2e"),N.fillStyle=xe,N.fillRect(0,k-150,O,150);for(let pe=0;pe<60;pe++)N.fillStyle=pe%2?"rgba(255,200,140,0.16)":"rgba(255,90,120,0.13)",N.fillRect(l()*O,k-140+l()*130,2,10+l()*24);for(let pe=30;pe<O;pe+=110){N.fillStyle="#0a0a14",N.fillRect(pe,k-215,3,70);let I=N.createRadialGradient(pe+1,k-215,0,pe+1,k-215,26);I.addColorStop(0,"rgba(255,215,160,0.95)"),I.addColorStop(1,"rgba(255,215,160,0)"),N.fillStyle=I,N.fillRect(pe-26,k-241,54,54)}}),u=n.track(new Tt({map:c,fog:!1}));n.mesh(new Nt(r.w,r.h),u,r.x,r.y,o);let h=[],d=14,f=Array.from({length:d},()=>.12+n.random()*.1),m=Array.from({length:d},()=>n.random()),_=n.movingLights(d*2,.17,N=>Math.floor(N/2)%2?16726843:16773846,(N,O,k)=>{let ue=Math.floor(N/2),de=ue%2?-1:1,xe=(m[ue]+O*f[ue]*de+10)%1,pe=ue%2?0:.045;return k.set(r.x-r.w/2+xe*r.w+N%2*.028*de,a.y-.12+pe,o+.01),Math.min(1,xe*8,(1-xe)*8)}),p=[[r.x-.3,r.y+.1],[r.x+.15,r.y-.05],[r.x+.4,r.y+.25],[r.x-.1,r.y+.3]];h.push(_);let g=n.movingLights(p.length,.09,()=>16765578,(N,O,k)=>(k.set(p[N][0],p[N][1],o+.01),Math.sin(O*.21+N*2.3)>.3?.9:0)),M=n.movingLights(1,.14,()=>16719904,(N,O,k)=>(k.set(r.x-.05,r.y+r.h/2-.35,o+.01),Math.sin(O*3)>.6?1:.15));h.push(g,M),n.plate(t,N=>{pg(N,r.w/r.h),u.map=N,u.needsUpdate=!0;for(let O of h)O.visible=!1});let T=160,x=new Float32Array(T*6),S=Array.from({length:T},()=>[n.random(),n.random(),.8+n.random()*.6]),E=n.track(new Qe);E.setAttribute("position",new Ke(x,3));let A=new hn(E,n.track(new Yt({color:12109055,transparent:!0,opacity:.35,fog:!1})));A.frustumCulled=!1,n.group.add(A),n.updaters.push(N=>{for(let O=0;O<T;O++){let[k,ue,de]=S[O],xe=(ue+N*de)%1,pe=r.x-r.w/2+(k+xe*.08)%1*r.w,I=r.y+r.h/2-xe*r.h,Xe=.05+de*.03;x.set([pe,I,o+.02,pe-Xe*.18,I-Xe,o+.02],O*6)}E.attributes.position.needsUpdate=!0});let v=45,w=Array.from({length:v},()=>({x:n.random(),y:n.random(),speed:.01+n.random()*.05,phase:n.random()*10}));n.movingLights(v,.07,()=>13621503,(N,O,k)=>{let ue=w[N],de=O*ue.speed*6+ue.phase,xe=Math.floor(de)+Math.min(1,de%1*3),pe=(ue.y+xe*.06)%1;return k.set(r.x-r.w/2+.03+ue.x*(r.w-.06),r.y+r.h/2-.03-pe*(r.h-.06),s),.55}),n.mesh(new Nt(r.w,r.h),n.glow(8425664,.08,!1),r.x,r.y,s-.005);let C=n.matte(1707292,.5);n.box(r.w+.08,.05,.08,C,r.x,r.y+r.h/2,-2.6+.09),n.box(r.w+.08,.05,.08,C,r.x,r.y-r.h/2,-2.6+.09),n.box(.05,r.h,.08,C,r.x-r.w/2,r.y,-2.6+.09),n.box(.05,r.h,.08,C,r.x+r.w/2,r.y,-2.6+.09);let L=n.track(new Pn({color:15902408,transparent:!0,opacity:.35,side:Ut,roughness:1})),D=[];for(let N of[-1,1])for(let O=0;O<4;O++){let k=n.mesh(new Nt(.13,r.h+.5,1,6),L,r.x+N*(r.w/2-.02+O*.09),r.y-.1,-2.42+O%2*.04);k.rotation.y=(O%2?.5:-.5)*N,D.push(k)}let H=D.map(N=>N.rotation.y);n.updaters.push(N=>{D.forEach((O,k)=>{O.rotation.y=H[k]+sa(N,k*1.3,.06)})});let U=n.matte(8003389,.95),V=n.matte(6034736,.95),W=new ft;W.position.set(-.75,0,-2.25),W.rotation.y=.15,n.group.add(W),n.box(1.7,.36,.8,U,0,.3,0,W),n.box(1.7,.6,.22,V,0,.72,-.3,W),n.box(.2,.5,.8,V,-.85,.5,0,W),n.box(.2,.5,.8,V,.85,.5,0,W),n.box(.34,.3,.1,n.matte(15771844,1),-.45,.66,-.14,W).rotation.set(-.25,0,.18),n.box(.3,.26,.1,n.matte(13214282,.55,.25),.15,.63,-.14,W).rotation.set(-.25,0,-.12),n.box(.26,.4,.84,n.matte(15324900,1),.78,.55,0,W).rotation.z=-.2;let $=n.mesh(new ps(dg(.26),{depth:.02,bevelEnabled:!1}),n.glow(16736174,1,!1),-.55,e.y+.45,-2.6+.1);n.mesh(new ki(dg(.21)),n.matte(3873599),-.55,e.y+.45+.02,-2.6+.125).scale.set(1,1,1);let ee=new yn(16732067,1.5,3,2);ee.position.set(-.55,e.y+.5,-2.6+.4),n.group.add(ee);let Ie=$.material,Te=new Me(16736174);n.updaters.push(N=>{let O=hg(N);ee.intensity=1.5*O,Ie.color.copy(Te).multiplyScalar(.8+.2*O)});let ae=n.glow(16762762,1,!1);for(let N=0;N<22;N++){let O=N/21,k=-1.9+O*3.2,ue=e.y+.95-Math.sin(O*Math.PI)*.22;n.mesh(new Cn(.018,8,6),ae,k,ue,-2.6+.12)}let he=r.y-r.h/2;n.box(r.w+.2,.04,.26,n.matte(2758176,.5),r.x,he-.02,-2.6+.2);let Re=n.matte(16181724,.7),X=n.glow(16757850,1,!1),ne=[];[[r.x-.42,.16],[r.x-.3,.24],[r.x-.18,.12]].forEach(([N,O],k)=>{let ue=-2.38+k%2*.05;n.mesh(new Vt(.03,.03,O,14),Re,N,he+O/2,ue);let de=n.mesh(new Cn(.013,10,8),X,N,he+O+.02,ue);de.scale.set(.8,1.8,.8);let xe=null;k===1&&(xe=new yn(16752714,1.2,1.6,2),xe.position.set(N,he+O+.08,ue+.05),n.group.add(xe)),ne.push({mesh:de,light:xe,phase:k*1.9})}),n.updaters.push(N=>{for(let O of ne){let k=ra(N,O.phase);O.mesh.scale.set(.8,1.5+k*.5,.8),O.light&&(O.light.intensity=1.2*k)}});let Le=r.x+.2,me=-2.6+.22;n.mesh(new Vt(.025,.035,.2,16),n.track(new Pn({color:14271464,transparent:!0,opacity:.55,roughness:.1,metalness:.1})),Le,he+.1,me),n.mesh(new Vt(.004,.004,.22,5),n.matte(4025146),Le,he+.3,me),n.mesh(new Cn(.035,14,10),n.matte(11735610,.7),Le,he+.42,me).scale.set(1,.85,1),n.mesh(new Cn(.018,8,6),n.matte(4025146),Le+.03,he+.34,me).scale.set(1.6,.5,.7);let tt=new ft;tt.position.set(r.x+.02,he,-2.6+.26),n.group.add(tt),n.box(.07,.09,.04,n.track(new Pn({color:16234194,transparent:!0,opacity:.75,roughness:.05,metalness:.2})),0,.045,0,tt),n.mesh(new Vt(.012,.012,.03,10),n.matte(13938487,.3,.9),0,.105,0,tt),n.mesh(new Co(.2,.025,10,40),n.matte(13938487,.35,.8),-1.2,e.y+.2,-2.6+.08);let ie=n.canvasTexture(128,128,(N,O,k)=>{let ue=N.createLinearGradient(0,0,0,k);ue.addColorStop(0,"#b77aa6"),ue.addColorStop(.5,"#6d3f6a"),ue.addColorStop(1,"#2a1528"),N.fillStyle=ue,N.fillRect(0,0,O,k),N.save(),N.translate(O/2,k/2),N.rotate(-.7);let de=N.createLinearGradient(-O,0,O,0);de.addColorStop(.35,"rgba(255,255,255,0)"),de.addColorStop(.47,"rgba(255,235,245,0.45)"),de.addColorStop(.53,"rgba(255,235,245,0.45)"),de.addColorStop(.65,"rgba(255,255,255,0)"),N.fillStyle=de,N.fillRect(-O,-k,2*O,2*k),N.restore();let xe=N.createRadialGradient(O*.72,k*.3,0,O*.72,k*.3,O*.25);xe.addColorStop(0,"rgba(255,110,180,0.7)"),xe.addColorStop(1,"rgba(255,110,180,0)"),N.fillStyle=xe,N.fillRect(0,0,O,k)});n.mesh(new xn(.2,32),n.track(new Tt({map:ie})),-1.2,e.y+.2,-2.6+.07);let G=new yn(10116351,1.2,4,2);G.position.set(1.2,.6,-.8),n.group.add(G)}function yb(n,e,t){let i=new Cn(40,32,16,0,Math.PI*2,0,Math.PI/2),r=i.attributes.position,s=[],o=new Me(5998276),a=new Me(15905402),l=new Me(16765594);for(let G=0;G<r.count;G++){let N=Math.max(0,r.getY(G)/40),O=N<.25?l.clone().lerp(a,N/.25):a.clone().lerp(o,Math.min(1,(N-.25)/.5));s.push(O.r,O.g,O.b)}i.setAttribute("color",new nt(s,3));let c=n.mesh(i,n.track(new Tt({vertexColors:!0,side:zt,fog:!1})),0,-2,0);c.renderOrder=-1;let u=[];u.push(n.mesh(new xn(.9,32),n.glow(16773576,1,!1),-3.2,3.2,-30)),u.push(n.mesh(new xn(2.4,32),n.glow(16767392,.35,!1),-3.2,3.2,-30.1));let h=[{z:-26,color:13212320,height:7,seed:1},{z:-20,color:10125205,height:5.5,seed:2},{z:-14,color:6253432,height:4,seed:3}];for(let G of h){let N=new Gn;N.moveTo(-30,-2);let O=26;for(let Xe=0;Xe<=O;Xe++){let Ze=-30+60*Xe/O,P=G.height*(.45+.55*Math.abs(Math.sin(Xe*.9+G.seed*1.7))*(.6+n.random()*.4));N.lineTo(Ze,P)}N.lineTo(30,-2);let k=new ki(N),ue=k.attributes.position,de=new Me(G.color),xe=new Me(15776138),pe=de.clone().lerp(new Me(16769224),.35),I=[];for(let Xe=0;Xe<ue.count;Xe++){let Ze=Math.max(0,Math.min(1,ue.getY(Xe)/G.height)),P=Ze>.55?de.clone().lerp(pe,(Ze-.55)/.45):xe.clone().lerp(de,.35+Ze/.55*.65);I.push(P.r,P.g,P.b)}k.setAttribute("color",new nt(I,3)),u.push(n.mesh(k,n.track(new Tt({vertexColors:!0,fog:!1})),0,0,G.z))}n.plate(t,G=>{let O=G.image,k=36*(O?.width&&O.height?O.width/O.height:2),ue=n.mesh(new Nt(k,36),n.track(new Tt({map:G,fog:!1,depthWrite:!1})),0,e.y+36*.02,-34);ue.renderOrder=-.5;for(let de of u)de.visible=!1});let d=n.mesh(new xn(12,48),n.matte(8359861,.15,.3),.5,.01,-12);d.rotation.x=-Math.PI/2,d.scale.set(1.4,.7,1);let f=n.mesh(new Nt(1.6,.05),n.glow(16769200,.7,!1),-2.4,.03,-10);f.rotation.x=-Math.PI/2;let m=n.mesh(new Nt(.9,.04),n.glow(16769200,.5,!1),-2,.03,-8.5);m.rotation.x=-Math.PI/2,n.updaters.push(G=>{f.material.opacity=.45+.3*(.5+.5*Math.sin(G*1.3)),m.material.opacity=.3+.25*(.5+.5*Math.sin(G*1.7+1))});let _=n.mesh(new xn(30,48),n.matte(6057530,1),0,0,-6);_.rotation.x=-Math.PI/2,d.position.y=.02;let p=(G,N,O,k)=>{let ue=Vs(G);return n.canvasTexture(256,512,(de,xe,pe)=>{de.fillStyle="#3b2a1e",de.fillRect(xe/2-7,pe*.8,14,pe*.2);let I=11;for(let Xe=0;Xe<I;Xe++){let Ze=pe*.04+Xe/I*pe*.8,P=xe*(.06+.42*((Xe+1)/I)),y=Ze+pe*.13,z=(q,K,ge)=>{de.fillStyle=q,de.beginPath(),de.moveTo(xe/2+ge,Ze);let _e=9;for(let te=0;te<=_e;te++){let oe=xe/2+ge-P*K+2*P*K*te/_e,ve=y-(te%2?ue()*pe*.03:0);de.lineTo(oe,ve)}de.closePath(),de.fill()};z(N,1,0),z(O,.8,-P*.12),z(k,.35,-P*.45)}})},g=[n.track(new ms({map:p(11,"#1f3526","#2c4a33","#5b7a45"),alphaTest:.5,side:Ut})),n.track(new ms({map:p(29,"#243b2a","#35553a","#6d8a4c"),alphaTest:.5,side:Ut}))],M=[],T=(G,N,O)=>{let k=new ft;k.position.set(G,0,N),n.group.add(k),n.mesh(new Nt(O*.5,O),g[M.length%2],0,O/2,0,k),M.push({g:k,phase:n.random()*6})},x=[[-2.6,-6,2.9],[-3.2,-7.5,4],[-2.1,-9.5,3.3],[-4.3,-6.2,3.6],[-1.9,-12,2.8],[2.4,-5.8,3.3],[3.4,-7.6,4.1],[2.2,-10.2,3],[4.4,-5.4,3.4],[3.9,-11.5,3.8]];for(let[G,N,O]of x)T(G,N,O);n.updaters.push(G=>{for(let N of M)N.g.rotation.z=sa(G,N.phase,.012)});let S=n.matte(9077624,.95),E=n.matte(7169886,.95);n.mesh(new pr(.6,1),S,1.35,.35,-2.4).scale.set(1.3,.95,1),n.mesh(new pr(.5,1),E,-2.4,.3,-3.2).scale.set(1.5,.8,1);let w=.35+.6*.95-.04,C=new ft;C.position.set(1.15,w,-2.2),C.rotation.set(0,-.5,.08),n.group.add(C),n.mesh(new fr(.13,.2,6,14),n.matte(11817775,.95),0,.24,0,C).scale.set(1.1,1,.7),n.mesh(new fr(.08,.06,4,12),n.matte(9387810,.95),0,.16,.08,C).scale.set(1.2,1,.5),n.mesh(new Cn(.14,14,8,0,Math.PI*2,0,Math.PI/2),n.matte(10241318,.95),0,.4,0,C).scale.set(1.05,.5,.75);let H=n.mesh(new fr(.06,.24,4,12),n.matte(4151882,.95),0,.5,-.02,C);H.rotation.z=Math.PI/2;let U=1.55,V=-2.25;n.mesh(new Vt(.05,.06,.03,12),n.matte(2894374,.5,.5),U,w+.015,V);let W=n.mesh(new Vt(.045,.045,.1,12),n.glow(16760944,.9,!1),U,w+.08,V);n.mesh(new hs(.06,.05,12),n.matte(2894374,.5,.5),U,w+.155,V);let J=new yn(16754768,1.2,2.2,2);J.position.set(U,w+.1,V+.1),n.group.add(J),n.updaters.push(G=>{let N=ra(G,.4,.85);J.intensity=1.2*N,W.material.opacity=.75+.2*N});let se=n.matte(7308612,1);for(let G=0;G<70;G++){let N=(n.random()-.5)*4,O=-1-n.random()*3,k=n.mesh(new hs(.012,.12+n.random()*.12,3),se,N,.08,O);k.rotation.z=(n.random()-.5)*.4}let $=Vs(777),j=n.canvasTexture(1024,256,(G,N,O)=>{for(let k=0;k<12;k++){let ue=$()*N,de=O*(.3+$()*.4);for(let xe=0;xe<9;xe++){let pe=40+$()*70,I=ue+($()-.5)*160,Xe=de+($()-.5)*24;for(let Ze of[-N,0,N]){let P=G.createRadialGradient(I+Ze,Xe,0,I+Ze,Xe,pe);P.addColorStop(0,"rgba(255,214,186,0.55)"),P.addColorStop(.6,"rgba(236,160,150,0.25)"),P.addColorStop(1,"rgba(236,160,150,0)"),G.fillStyle=P,G.fillRect(I+Ze-pe,Xe-pe,pe*2,pe*2)}}}});j.wrapS=Hn,n.mesh(new Nt(70,10),n.track(new Tt({map:j,transparent:!0,depthWrite:!1,fog:!1})),0,e.y+7,-32),n.updaters.push(G=>{j.offset.x=G*.0015});let ee={x:-1.35,y:0,z:-4.6},Ie=n.matte(3877406,1);for(let G=0;G<4;G++)n.mesh(new Vt(.05,.05,.55,8),Ie,ee.x,.05,ee.z).rotation.set(Math.PI/2,G*Math.PI/4,.35);for(let G=0;G<9;G++){let N=G/9*Math.PI*2;n.mesh(new pr(.07,0),n.matte(6117200,1),ee.x+Math.cos(N)*.36,.04,ee.z+Math.sin(N)*.36)}let Te=n.canvasTexture(64,128,(G,N,O)=>{let k=G.createRadialGradient(N/2,O*.72,2,N/2,O*.6,O*.55);k.addColorStop(0,"rgba(255,250,210,1)"),k.addColorStop(.25,"rgba(255,196,90,0.95)"),k.addColorStop(.6,"rgba(255,110,40,0.55)"),k.addColorStop(1,"rgba(255,60,20,0)"),G.fillStyle=k,G.beginPath(),G.moveTo(N/2,0),G.quadraticCurveTo(N,O*.65,N/2,O),G.quadraticCurveTo(0,O*.65,N/2,0),G.fill()}),ae=Array.from({length:5},(G,N)=>{let O=new as(n.track(new ur({map:Te,transparent:!0,depthWrite:!1,blending:_r,fog:!1})));return n.group.add(O),{sp:O,phase:N*1.37,dx:(N-2)*.07}}),he=new yn(16747066,3,7,1.6);he.position.set(ee.x,.5,ee.z+.3),n.group.add(he),n.updaters.push(G=>{for(let N of ae){let O=ra(G,N.phase,.6);N.sp.scale.set(.22+.06*O,.45+.25*O,1),N.sp.position.set(ee.x+N.dx+Math.sin(G*5+N.phase)*.015,.2+.1*O,ee.z)}he.intensity=3*ra(G,.9,.7)});let Re=Array.from({length:24},()=>({phase:n.random(),dx:(n.random()-.5)*.2,speed:.25+n.random()*.35}));n.movingLights(Re.length,.09,()=>16752704,(G,N,O)=>{let k=Re[G],ue=(k.phase+N*k.speed)%1;return O.set(ee.x+k.dx+Math.sin(N*2+G)*.08*ue,.3+ue*1.6,ee.z+Math.cos(N*1.5+G)*.05),(1-ue)*(.6+.4*Math.sin(N*20+G))});let X=new Gn;X.moveTo(-.55,0),X.lineTo(0,.7),X.lineTo(.55,0),X.lineTo(-.55,0);let ne=n.mesh(new ps(X,{depth:1.1,bevelEnabled:!1}),n.matte(14254666,.95),-2.3,0,-6.6);ne.rotation.y=.5;let fe=new Gn;fe.moveTo(-.22,0),fe.lineTo(0,.42),fe.lineTo(.22,0),fe.lineTo(-.22,0);let Le=n.mesh(new ki(fe),n.matte(2759186,1),0,0,1.101,ne),me=Array.from({length:22},()=>({x:(n.random()-.5)*5,y:.5+n.random()*1.4,z:-3-n.random()*4,phase:n.random()*20}));n.movingLights(me.length,.08,()=>15269786,(G,N,O)=>{let k=me[G];O.set(k.x+Math.sin(N*.3+k.phase)*.35,k.y+Math.sin(N*.5+k.phase*1.3)*.18,k.z+Math.cos(N*.25+k.phase)*.3);let ue=Math.sin(N*1.3+k.phase*2.1);return ue>.2?(ue-.2)*1.25:0});let De=Array.from({length:40},()=>({x:-3.2+n.random()*2.4,z:-8-n.random()*5,phase:n.random()*30}));n.movingLights(De.length,.12,()=>16773320,(G,N,O)=>{let k=De[G];O.set(k.x+Math.sin(N*.2+k.phase)*.08,.04,k.z);let ue=Math.sin(N*2.2+k.phase);return ue>.7?(ue-.7)*3.3:0});let tt=n.glow(3812400,.8,!1),ie=[];for(let G=0;G<3;G++){let N=new Gn;N.moveTo(-.12,.02),N.quadraticCurveTo(-.06,.06,0,0),N.quadraticCurveTo(.06,.06,.12,.02),N.quadraticCurveTo(.06,.03,0,.01),N.quadraticCurveTo(-.06,.03,-.12,.02),ie.push(n.mesh(new ki(N),tt,0,0,-18))}n.updaters.push(G=>{ie.forEach((N,O)=>{let k=(G*.02+O*.07)%1*2-1;N.position.set(k*9+O*.4,e.y+3.2+O*.25+Math.sin(G*.8+O)*.1,-18),N.scale.y=1+Math.sin(G*6+O*2)*.5})})}function pg(n,e){let t=n.image;if(!t?.width||!t.height)return;let i=t.width/t.height;i>e?(n.repeat.set(e/i,1),n.offset.set((1-n.repeat.x)/2,0)):(n.repeat.set(1,i/e),n.offset.set(0,(1-n.repeat.y)/2))}var Mb={"luna-office":xb,"nova-room":vb,"rio-outdoors":yb};var mg=1,Sb=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Eb=`
uniform sampler2D src;
uniform vec2 dir;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(src, vUv).rgb * 0.2270270270;
  vec2 o1 = dir * 1.3846153846;
  vec2 o2 = dir * 3.2307692308;
  c += texture2D(src, vUv + o1).rgb * 0.3162162162;
  c += texture2D(src, vUv - o1).rgb * 0.3162162162;
  c += texture2D(src, vUv + o2).rgb * 0.0702702703;
  c += texture2D(src, vUv - o2).rgb * 0.0702702703;
  gl_FragColor = vec4(c, 1.0);
}`,bb=`
uniform sampler2D src;
uniform float threshold;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(src, vUv).rgb;
  float l = max(c.r, max(c.g, c.b));
  float k = smoothstep(threshold, threshold + 0.25, l);
  gl_FragColor = vec4(c * k, 1.0);
}`,Tb=`
uniform sampler2D sharpBg;
uniform sampler2D blurBg;
uniform sampler2D bloom;
uniform sampler2D character;
uniform float blurAmount;
uniform float bloomAmount;
uniform float saturation;
uniform float contrast;
uniform float warmth;
uniform float vignette;
uniform float time;
uniform vec2 aspect;
varying vec2 vUv;

vec3 shoulder(vec3 c) {
  // Igual que antes hasta 0,8; por encima se redondea en lugar de quemarse.
  vec3 over = max(c - 0.8, 0.0);
  return min(c, 0.8) + 0.2 * (1.0 - exp(-over / 0.2));
}

vec3 toSRGB(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 bg = mix(texture2D(sharpBg, vUv).rgb, texture2D(blurBg, vUv).rgb, blurAmount);
  vec4 ch = texture2D(character, vUv);
  // El personaje llega premultiplicado (se dibujo sobre transparente).
  vec3 c = ch.rgb + bg * (1.0 - ch.a);
  // El halo del fondo apenas pasa por encima del personaje (lo dejaria lechoso).
  c += texture2D(bloom, vUv).rgb * bloomAmount * (1.0 - ch.a * 0.75);
  c = shoulder(c);
  vec3 s = toSRGB(c);
  float luma = dot(s, vec3(0.2126, 0.7152, 0.0722));
  s = mix(vec3(luma), s, saturation);
  s = (s - 0.5) * contrast + 0.5;
  s += vec3(warmth, warmth * 0.3, -warmth);
  vec2 d = (vUv - 0.5) * aspect;
  s *= 1.0 - vignette * smoothstep(0.35, 0.95, length(d));
  s += (hash(vUv * 997.0 + time) - 0.5) / 255.0 * 1.5;
  gl_FragColor = vec4(clamp(s, 0.0, 1.0), 1.0);
}`;function zs(n,e=0){let t=n.extensions.has("EXT_color_buffer_float")||n.extensions.has("EXT_color_buffer_half_float"),i=new Qt(1,1,{type:t?Sn:en,minFilter:Rt,magFilter:Rt,depthBuffer:!0,samples:Math.min(e,n.capabilities.maxSamples)});return i.texture.generateMipmaps=!1,i}function gg(n,e){if(!n.capabilities.isWebGL2)return null;let t=zs(n),i=zs(n),r=zs(n),s=zs(n),o=zs(n),a=zs(n,4),l=[t,i,r,s,o,a],c=new ii(-1,1,1,-1,0,1),u=new cr,h=new Ct(new Nt(2,2));h.frustumCulled=!1,u.add(h);let d=(x,S)=>new Zt({vertexShader:Sb,fragmentShader:x,uniforms:S,depthTest:!1,depthWrite:!1}),f=d(Eb,{src:{value:null},dir:{value:new ce}}),m=d(bb,{src:{value:null},threshold:{value:e.bloomThreshold}}),_=d(Tb,{sharpBg:{value:t.texture},blurBg:{value:r.texture},bloom:{value:s.texture},character:{value:a.texture},blurAmount:{value:e.blur},bloomAmount:{value:e.bloom},saturation:{value:e.saturation},contrast:{value:e.contrast},warmth:{value:e.warmth},vignette:{value:e.vignette},time:{value:0},aspect:{value:new ce(1,1)}}),p=[f,m,_],g=(x,S)=>{h.material=x,n.setRenderTarget(S),n.render(u,c)},M=(x,S,E,A)=>{f.uniforms.src.value=x.texture,f.uniforms.dir.value.set(E/x.width,A/x.height),g(f,S)},T=new Me;return{setSize(x,S){let E=Math.max(1,Math.round(x)),A=Math.max(1,Math.round(S));t.setSize(Math.max(1,E>>1),Math.max(1,A>>1)),i.setSize(Math.max(1,E>>2),Math.max(1,A>>2)),r.setSize(Math.max(1,E>>2),Math.max(1,A>>2)),s.setSize(Math.max(1,E>>3),Math.max(1,A>>3)),o.setSize(Math.max(1,E>>3),Math.max(1,A>>3)),a.setSize(E,A);let v=E/A;_.uniforms.aspect.value.set(v>=1?v:1,v>=1?1:1/v)},render(x,S,E){let A=n.getClearColor(T).getHex(),v=n.getClearAlpha(),w=n.autoClear;n.autoClear=!0,S.layers.set(0),n.setRenderTarget(t),n.render(x,S),M(t,i,1,0),M(i,r,0,1),m.uniforms.src.value=r.texture,g(m,s),M(s,o,1.5,0),M(o,s,0,1.5);let C=x.background;x.background=null,S.layers.set(mg),n.setClearColor(0,0),n.setRenderTarget(a),n.render(x,S),x.background=C,S.layers.set(0),_.uniforms.time.value=E%100,g(_,null),n.setClearColor(A,v),n.autoClear=w},dispose(){for(let x of l)x.dispose();for(let x of p)x.dispose();h.geometry.dispose()}}}function _g(n,e){e.traverse(t=>t.layers.set(mg)),n.traverse(t=>{t.isLight&&t.layers.enableAll()})}var xg=["Index","Middle","Ring","Little"],vg=["Proximal","Intermediate","Distal"],wb={Index:.14,Middle:.22,Ring:.28,Little:.34},Ab={Proximal:1,Intermediate:1.25,Distal:.8},Cr,Pr,ca,ua,Gs,Jt,cn,zc=class{constructor(e){qt(this,Jt);qt(this,Cr,new Map);qt(this,Pr,0);qt(this,ca,0);qt(this,ua,{x:0,y:0});qt(this,Gs,3107613);let t=["hips","spine","chest","upperChest","leftShoulder","rightShoulder","leftUpperArm","rightUpperArm","leftLowerArm","rightLowerArm","leftHand","rightHand"];for(let i of["left","right"])for(let r of xg)for(let s of vg)t.push(`${i}${r}${s}`);for(let i of t){let r=e(i);r&&dt(this,Cr).set(i,{bone:r,x:r.rotation.x,y:r.rotation.y,z:r.rotation.z})}for(let i of["left","right"]){let r=i==="left"?-1:1;for(let s of xg)for(let o of vg){let a=dt(this,Cr).get(`${i}${s}${o}`);a&&(a.z+=r*wb[s]*Ab[o],a.bone.rotation.z=a.z)}}}get boneCount(){return dt(this,Cr).size}update(e,t,i){let r=Math.sin(e*1.6);if(i.still){sn(this,Jt,cn).call(this,"spine",r*.006,0,0),sn(this,Jt,cn).call(this,"chest",r*.009,0,0);return}let s=i.speaking?Math.min(1,.35+i.level*.6):0,o=s>dt(this,Pr)?5:1.5;rn(this,Pr,dt(this,Pr)+(s-dt(this,Pr))*Math.min(1,t*o));let a=dt(this,Pr),l=Math.sin(e*Math.PI*2/9),c=Math.sin(e*.21+1.3);sn(this,Jt,cn).call(this,"hips",0,c*.025,l*.02),sn(this,Jt,cn).call(this,"spine",r*.012,Math.sin(e*.27)*.02,-l*.012),sn(this,Jt,cn).call(this,"chest",r*.018-a*.01,Math.sin(e*.33+.4)*.012,-l*.006),sn(this,Jt,cn).call(this,"upperChest",r*.008,0,0),sn(this,Jt,cn).call(this,"leftShoulder",0,0,-r*.008),sn(this,Jt,cn).call(this,"rightShoulder",0,0,r*.008);let u=Math.sin(e*3.1)*a*Math.min(1,i.level),h=Math.sin(e*.5)*.015+r*.006,d=Math.sin(e*.5+1.7)*.015+r*.006;sn(this,Jt,cn).call(this,"leftUpperArm",-a*.06,0,-h+l*.01+a*.05),sn(this,Jt,cn).call(this,"rightUpperArm",-a*.06,0,d+l*.01-a*.05),sn(this,Jt,cn).call(this,"leftLowerArm",0,-a*.35-u*.08-Math.sin(e*.7)*.02,0),sn(this,Jt,cn).call(this,"rightLowerArm",0,a*.3+u*.06+Math.sin(e*.7+2)*.02,0),sn(this,Jt,cn).call(this,"leftHand",Math.sin(e*.9)*.03+u*.05,0,-a*.08),sn(this,Jt,cn).call(this,"rightHand",Math.sin(e*.9+1.1)*.03-u*.05,0,a*.08)}glance(e){if(e>=dt(this,ca)){let t=()=>(rn(this,Gs,dt(this,Gs)*1664525+1013904223>>>0),dt(this,Gs)/4294967296),i=t()<.45;rn(this,ua,i?{x:(t()-.5)*.08,y:(t()-.5)*.04}:{x:0,y:0}),rn(this,ca,e+1.2+t()*2.3)}return dt(this,ua)}};Cr=new WeakMap,Pr=new WeakMap,ca=new WeakMap,ua=new WeakMap,Gs=new WeakMap,Jt=new WeakSet,cn=function(e,t,i,r){let s=dt(this,Cr).get(e);s&&s.bone.rotation.set(s.x+t,s.y+i,s.z+r)};function Rb(n){return Math.tan(n/2*Math.PI/180)}function yg(n,e,t){let i=t-.03;if(n==="portrait")return{fov:20,y:i+.03,z:1.5,targetY:i};if(n==="stage")return{fov:e>2.1?15:26,y:i+.03,z:1.35,targetY:i};let r=30,o=1-Math.min(1,Math.max(0,(e-.7)/.9))*.24,c=t+.11+o*.17-o/2,u=o/2/Rb(r);return{fov:r,y:c+.04,z:u,targetY:c}}function Mg(n,e,t,i){let r=i>0?i:1;if(n==="portrait")return Math.min(r,2);let s=Math.min(r,1.5),o=Math.sqrt(16e5/Math.max(1,e*t));return Math.max(Math.min(1,r),Math.min(s,o))}function Cb(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch{return!1}}async function Sg(n,e,t){let i=new Sc({canvas:n,alpha:!0,antialias:!0,powerPreference:"low-power"}),r=t().background===!0,s=r?t().immersive?"immersive":"stage":"portrait";i.setClearColor(0,0),i.outputColorSpace=At;let o=new cr,a=new Bt(20,1,.05,80),l=null,c=1.4,u=new ce,h=()=>{let A=t(),v=A.width??A.size;i.setPixelRatio(Mg(s,v,A.size,window.devicePixelRatio||1)),i.setSize(v,A.size,!1),a.aspect=v/A.size;let w=yg(s,a.aspect,c);a.fov=w.fov,a.position.set(0,w.y,w.z),a.lookAt(0,w.targetY,0),a.updateProjectionMatrix(),i.getDrawingBufferSize(u),l?.setSize(u.x,u.y)};h(),n.addEventListener("kotaru-resize",h);let d=new ri(16777215,Math.PI*.7);d.position.set(.6,1.2,1.6);let f=new Do(16777215,.35);o.add(d,f);let m=new Tc;m.register(A=>new tg(A));let _;try{_=await m.loadAsync(e)}catch(A){throw i.dispose(),A}let p=_.userData.vrm;if(!p)throw i.dispose(),new Error("el archivo no es un VRM");Yn.removeUnnecessaryVertices(_.scene),Yn.combineSkeletons(_.scene),Yn.rotateVRM0(p),p.scene.traverse(A=>{A.frustumCulled=!1}),o.add(p.scene);let g=A=>p.humanoid.getNormalizedBoneNode(A);Ib(g),p.update(0);let M=g("head"),T=new R;(M??p.scene).getWorldPosition(T),c=T.y;let x=T.clone().add(new R(0,-.03,0));h();let S=null;r&&(S=fg(t().companion,o,x),S&&(o.remove(d,f),i.setClearColor(0,1),Pb()&&(l=gg(i,Vc[S.id].grade),l&&(_g(o,p.scene),h()))));let E=new ct;return o.add(E),p.lookAt&&(p.lookAt.target=E),Lb(i,o,a,p,E,t,S,l,()=>{n.removeEventListener("kotaru-resize",h),l?.dispose(),S?.dispose(),o.remove(p.scene),Yn.deepDispose(p.scene),i.dispose(),i.forceContextLoss()})}function Pb(){try{return new URLSearchParams(window.location.search).get("post")!=="0"}catch{return!0}}function Ib(n){let e=(t,i,r,s)=>n(t)?.rotation.set(i,r,s);e("leftUpperArm",0,0,-1.2),e("rightUpperArm",0,0,1.2),e("leftLowerArm",0,-.25,0),e("rightLowerArm",0,.25,0),e("leftHand",0,0,-.1),e("rightHand",0,0,.1)}function Lb(n,e,t,i,r,s,o,a,l){let c=new Fo;c.connect(document);let u=new Hc,h=Cb(),d=i.expressionManager,f={happy:0,sad:0,relaxed:0,surprised:0},m=0,_=0,p=0,g=0,M=0,T=!0,x=new zc(D=>i.humanoid.getNormalizedBoneNode(D)),S=i.humanoid.getNormalizedBoneNode("neck"),E=i.humanoid.getNormalizedBoneNode("head"),A=o?1e3/30-2:0,v=0,w=!0,C=o&&typeof IntersectionObserver<"u"?new IntersectionObserver(D=>{w=D.some(H=>H.isIntersecting)}):null;C?.observe(n.domElement);let L=()=>{if(!T)return;M=requestAnimationFrame(L);let D=performance.now();if(!w||D-v<A)return;v=D,c.update();let H=Math.min(c.getDelta(),.1),U=c.getElapsed(),V=performance.now(),W=s(),J=sg(W.companion,W.affect,V);for(let he of Rd)f[he]=Hs(f[he]??0,J[he],H,4),d?.setValue(he,f[he]);d?.setValue("blink",u.weight(U)*(1-(f.happy??0)*.6));let se=W.state==="speaking";m=Hs(m,se?W.level()*1.3:0,H,18);let $=lg(m,U);d?.setValue("aa",$.aa),d?.setValue("oh",$.oh),d?.setValue("ih",$.ih);let j=ag(W.state),ee=h||!W.affect?{x:0,y:0,z:0}:og(W.affect.gesture,(V-W.affect.at)/1e3),Ie=h?0:1;_=Hs(_,j.x+ee.x+Math.sin(U*.8)*.015*Ie,H,6),p=Hs(p,j.y+ee.y+Math.sin(U*.45)*.05*Ie,H,6),g=Hs(g,j.z+ee.z+Math.sin(U*.6)*.02*Ie,H,6),S&&S.rotation.set(_*.4,p*.4,g*.4),E&&E.rotation.set(_*.6,p*.6,g*.6),x.update(U,H,{still:h,speaking:se,level:m});let Te=W.state==="thinking",ae=h?{x:0,y:0}:x.glance(U);r.position.set(t.position.x+(Te?.25:ae.x),t.position.y+(Te?.2:ae.y),t.position.z),o?.update(U,h),i.update(H),a?a.render(e,t,U):n.render(e,t)};return M=requestAnimationFrame(L),()=>{T=!1,cancelAnimationFrame(M),C?.disconnect(),c.dispose(),l()}}var Nb=[{id:"luna",name:"Luna",place:"Una oficina tranquila de d\xEDa: ventana, plantas, libros y una l\xE1mpara c\xE1lida."},{id:"nova",name:"Nova",place:"Su cuarto al anochecer: luz rosa y \xE1mbar, velas, ne\xF3n y la ciudad por la ventana."},{id:"rio",name:"Rio",place:"Un claro de monta\xF1a al atardecer: pinos, lago, monta\xF1as y su campamento."}];async function Ub(){let n=document.getElementById("escenarios");if(n)for(let e of Nb){let t=document.createElement("section");t.className="card";let i=document.createElement("h2");i.textContent=e.name;let r=document.createElement("p");r.textContent=e.place;let s=document.createElement("canvas"),o=Math.min(520,n.clientWidth||520),a=Math.round(o*.62);s.style.width=`${o}px`,s.style.height=`${a}px`;let l=document.createElement("p");l.className="status",l.textContent="Cargando\u2026";let c=document.createElement("button");c.type="button",c.textContent="Hablar",t.append(i,s,r,c,l),n.append(t);let u={companion:e.id,size:a,width:o,background:!0,state:"idle",affect:null,level:()=>0,fallback:null};c.addEventListener("click",()=>{let h=u.state!=="speaking";u.state=h?"speaking":"idle",u.affect=h?{emotion:"warm",intensity:.8,at:performance.now()}:null,u.level=h?()=>{let d=performance.now()/1e3;return(Math.sin(d*.9)>-.6?1:0)*(.35+.35*Math.abs(Math.sin(d*12.5))+.15*Math.sin(d*5.3))}:()=>0,c.textContent=h?"Callar":"Hablar"});try{await Sg(s,`/avatars/${e.id}.vrm`,()=>u),l.remove()}catch(h){l.textContent="No se pudo cargar el 3D en este navegador.",console.warn(h)}}}Ub();})();
/*! Bundled license information:

three/build/three.core.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

@pixiv/three-vrm/lib/three-vrm.module.js:
  (*!
   * @pixiv/three-vrm v3.5.5
   * VRM file loader for three.js.
   *
   * Copyright (c) 2019-2026 pixiv Inc.
   * @pixiv/three-vrm is distributed under MIT License
   * https://github.com/pixiv/three-vrm/blob/release/LICENSE
   *)

@pixiv/three-vrm/lib/three-vrm.module.js:
  (*!
   * @pixiv/three-vrm-core v3.5.5
   * The implementation of core features of VRM, for @pixiv/three-vrm
   *
   * Copyright (c) 2019-2026 pixiv Inc.
   * @pixiv/three-vrm-core is distributed under MIT License
   * https://github.com/pixiv/three-vrm/blob/release/LICENSE
   *)
  (*!
   * @pixiv/three-vrm-materials-mtoon v3.5.5
   * MToon (toon material) module for @pixiv/three-vrm
   *
   * Copyright (c) 2019-2026 pixiv Inc.
   * @pixiv/three-vrm-materials-mtoon is distributed under MIT License
   * https://github.com/pixiv/three-vrm/blob/release/LICENSE
   *)
  (*!
   * @pixiv/three-vrm-materials-hdr-emissive-multiplier v3.5.5
   * Support VRMC_hdr_emissiveMultiplier for @pixiv/three-vrm
   *
   * Copyright (c) 2019-2026 pixiv Inc.
   * @pixiv/three-vrm-materials-hdr-emissive-multiplier is distributed under MIT License
   * https://github.com/pixiv/three-vrm/blob/release/LICENSE
   *)
  (*!
   * @pixiv/three-vrm-materials-v0compat v3.5.5
   * VRM0.0 materials compatibility layer plugin for @pixiv/three-vrm
   *
   * Copyright (c) 2019-2026 pixiv Inc.
   * @pixiv/three-vrm-materials-v0compat is distributed under MIT License
   * https://github.com/pixiv/three-vrm/blob/release/LICENSE
   *)
  (*!
   * @pixiv/three-vrm-node-constraint v3.5.5
   * Node constraint module for @pixiv/three-vrm
   *
   * Copyright (c) 2019-2026 pixiv Inc.
   * @pixiv/three-vrm-node-constraint is distributed under MIT License
   * https://github.com/pixiv/three-vrm/blob/release/LICENSE
   *)
  (*!
   * @pixiv/three-vrm-springbone v3.5.5
   * Spring bone module for @pixiv/three-vrm
   *
   * Copyright (c) 2019-2026 pixiv Inc.
   * @pixiv/three-vrm-springbone is distributed under MIT License
   * https://github.com/pixiv/three-vrm/blob/release/LICENSE
   *)
*/
