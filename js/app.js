var FORM_ENDPOINT=""; // optional: paste a Formspree URL (https://formspree.io/f/xxxx) to send without opening a mail app
var PAGES={home:"Aldane Hutchinson — Full Stack Engineer",work:"Work — Aldane Hutchinson",about:"About — Aldane Hutchinson",contact:"Contact — Aldane Hutchinson"};
var FEATURED=[["Flaxon++","screen-terminal"],["MinifyJS","screen-compiler"],["Flaxon","screen-web"],["syro-Flow","screen-cms"],["EduCore","screen-education"],["CorePress CMS","screen-dashboard"],["RubyDB","screen-inventory"],["WebShield Scanner","screen-security"],["Sova","screen-sova"]];
document.addEventListener("alpine:init",function(){
Alpine.data("site",function(){return{
 route:"home",f:{name:"",email:"",msg:""},sent:"",copied:false,dark:true,open:false,role:"",cat:"All",q:"",
 roles:["Go backend engineer","Full stack developer","Security-minded builder","Open-source author"],
 cats:["All"].concat(PROJECTS.map(function(p){return p[3]}).filter(function(c,i,a){return a.indexOf(c)===i})),
 featured:FEATURED.map(function(f){var p=PROJECTS.filter(function(x){return x[0]===f[0]})[0];return{p:p,scene:f[1]}}),
 get list(){var s=this.q.toLowerCase(),c=this.cat;return PROJECTS.filter(function(p){return(c==="All"||p[3]===c)&&(!s||p.slice(0,4).join(" ").toLowerCase().indexOf(s)>-1)})},
 go:function(){var h=location.hash.replace(/^#\/?/,"")||"home";this.route=PAGES[h]?h:"home";document.title=PAGES[this.route];this.open=false;scrollTo(0,0)},
 copy:function(){var s=this;(navigator.clipboard?navigator.clipboard.writeText("aldanehutchinson5@gmail.com"):Promise.reject()).then(function(){s.copied=true;setTimeout(function(){s.copied=false},1800)},function(){})},
 send:function(){var s=this,f=this.f,sub="Portfolio message from "+f.name,body=f.msg+"\n\n— "+f.name+" ("+f.email+")";
  if(!FORM_ENDPOINT){location.href="mailto:aldanehutchinson5@gmail.com?subject="+encodeURIComponent(sub)+"&body="+encodeURIComponent(body);s.sent="Your email app should open with the message ready to send.";return}
  s.sent="Sending…";fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({name:f.name,email:f.email,message:f.msg})}).then(function(r){if(!r.ok)throw 0;s.sent="Thanks! Your message was sent.";s.f={name:"",email:"",msg:""}}).catch(function(){s.sent="Something went wrong. Please email me directly."})},
 url:function(r){return r.indexOf("O:")===0?ORG+r.slice(2):U+r},
 spot:function(e){var r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--mx",e.clientX-r.left+"px");e.currentTarget.style.setProperty("--my",e.clientY-r.top+"px")},
 toggle:function(){this.dark=!this.dark;document.documentElement.dataset.theme=this.dark?"dark":"light";try{localStorage.setItem("theme",this.dark?"dark":"light")}catch(e){}},
 init:function(){var self=this,i=0,j=0,del=false;
  this.go();addEventListener("hashchange",function(){self.go()});
  try{if(localStorage.getItem("theme")==="light"){this.dark=false;document.documentElement.dataset.theme="light"}}catch(e){}
  (function tick(){var w=self.roles[i];self.role=w.slice(0,j);if(!del&&j===w.length){del=true;return setTimeout(tick,1400)}if(del&&j===0){del=false;i=(i+1)%self.roles.length}j+=del?-1:1;setTimeout(tick,del?35:70)})();
  this.$nextTick(function(){setTimeout(function(){if(window.initProjectScenes)initProjectScenes();if(window.initSecurityScene)initSecurityScene();
   var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
   document.querySelectorAll(".rv").forEach(function(n){io.observe(n)})},80)});
  addEventListener("scroll",function(){var h=document.documentElement;document.getElementById("bar").style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+"%"},{passive:true});
 }}});
Alpine.data("count",function(to,suf){return{n:0,suf:suf||"",init:function(){var s=this,io=new IntersectionObserver(function(e){if(!e[0].isIntersecting)return;io.disconnect();var t0=performance.now();(function f(t){var k=Math.min((t-t0)/1200,1);s.n=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)})(t0)});io.observe(this.$el)}}});
});
// ambient particle field that follows the pointer
document.addEventListener("DOMContentLoaded",function(){var c=document.getElementById("bg");if(!c||!window.THREE||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
var r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true}),s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,1,.1,100),N=700,g=new THREE.BufferGeometry(),a=new Float32Array(N*3),mx=0,my=0;
cam.position.z=7;r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
for(var i=0;i<N*3;i++)a[i]=(Math.random()-.5)*(i%3===2?14:22);
g.setAttribute("position",new THREE.BufferAttribute(a,3));
var p=new THREE.Points(g,new THREE.PointsMaterial({color:0x41e6a2,size:.04,transparent:true,opacity:.8}));s.add(p);
function rs(){r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener("resize",rs);rs();
addEventListener("pointermove",function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
(function f(t){p.rotation.y=t*.00004+mx*.5;p.rotation.x=my*.3;p.position.y=-scrollY*.002;r.render(s,cam);requestAnimationFrame(f)})(0)});