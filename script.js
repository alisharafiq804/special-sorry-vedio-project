const pages = [...document.querySelectorAll(".page")];
const nextButtons = [...document.querySelectorAll("[data-next]")];
const prevButtons = [...document.querySelectorAll("[data-prev]")];
const progress = document.getElementById("progress-bar");
const pageNum = document.getElementById("page-num");
let current = 0;
let audioUnlocked = false;

const content = {
  letterLines: [
    "Hey, friend,",
    "I’m writing this without excuses because sometimes the simplest thing to do is just admit that I was wrong.",
    "If my words or actions annoyed you, hurt you, or simply crossed a line, I’m genuinely sorry. I never meant to make things awkward between us.",
    "I know saying sorry doesn’t magically fix everything. I’m not asking you to forget it instantly — I just want you to know that I mean this apology for real.",
    "Our friendship matters to me, and I’d rather clear the air than let one bad moment make things weird between us.",
    "So, no long speech and no excuses: I’m sorry. Whenever you’re ready, let’s just be good again.",
    "— Your friend"
  ],
  memories: [
    ["images (4).jpg","I’m sorry for the moment when my actions made things difficult for you."],
    ["images (5).jpg","I’m sorry for the things I should have understood better."],
    ["images (6).jpg","I’m sorry if I ever made you feel like I wasn’t being a good friend."],
    ["images (7).jpg","I’m sorry for letting a small misunderstanding turn into a bigger issue."],
    ["images (1).jpg","I’m sorry if I turned a normal moment into unnecessary stress."],
    ["download.jpg","I’m sorry — and I’ll try to handle things better next time."],
    ["download (1).jpg","I’m sorry for every time I was stubborn instead of simply listening."],
    ["images (8).jpg","I’m sorry for anything I said without thinking it through first."],
    ["images (3).jpg","I’m sorry. Sometimes the simplest apology is the most honest one."],
    ["images (2).jpg","I’m sorry for the awkwardness, the silence, and everything that got unnecessarily weird."],
    ["sorry.jpg","I’m sorry for the hurt. If I could redo that moment, I would handle it differently."],
    ["images.jpg","One last time, honestly: I’m sorry. I hope we can put this behind us."]
  ]
};

function renderContent(){
  const letter = document.getElementById("letter-text");
  letter.innerHTML = content.letterLines.map((line,i)=>`<p class="${i===0?'salute':''}">${line}</p>`).join("");
  const memories = document.getElementById("memories");
  memories.innerHTML = content.memories.map((m,i)=>`
    <article class="memory-item">
      <img class="memory-img" src="assets/${m[0]}" alt="Memory ${i+1}">
      <div class="memory-copy">
        <div class="memory-index">SORRY • ${String(i+1).padStart(2,"0")}</div>
        <p>${m[1]}</p>
      </div>
    </article>`).join("");
}
renderContent();

function stopOtherVideos(except){
  document.querySelectorAll("video").forEach(v=>{ if(v!==except){v.pause();} });
}
function activateMedia(pageIndex){
  const page = pages[pageIndex];
  const video = page.querySelector("video");
  if(video){
    stopOtherVideos(video);
    video.currentTime = 0;
    const play = video.play();
    if(play) play.catch(()=>{});
  } else {
    stopOtherVideos(null);
  }
}

function goTo(index){
  current = Math.max(0, Math.min(pages.length-1,index));
  pages.forEach((p,i)=>p.classList.toggle("active",i===current));
  pageNum.textContent = current+1;
  progress.style.width = `${((current+1)/pages.length)*100}%`;
  const active = pages[current];
  active.scrollTo({top:0,behavior:"instant"});
  activateMedia(current);
  createPetals(5);
}

nextButtons.forEach(b=>b.addEventListener("click",()=>goTo(current+1)));
prevButtons.forEach(b=>b.addEventListener("click",()=>goTo(current-1)));

document.getElementById("restart").addEventListener("click",()=>goTo(0));

// Keyboard navigation
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight") goTo(current+1);
  if(e.key==="ArrowLeft") goTo(current-1);
});

// Unlock media after the first intentional click.
document.querySelector("[data-page='0'] .primary-btn").addEventListener("click",()=>{
  audioUnlocked = true;
});

// If a video is long, do not force a page change; the viewer controls the timing.
// This keeps songs from being cut off.

let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
const dot=document.getElementById("cursor-dot"), ring=document.getElementById("cursor-ring");
document.addEventListener("mousemove",e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+"px";dot.style.top=my+"px";
  if(Math.random()<.16){
    const h=document.createElement("span");h.className="trail-heart";h.textContent=Math.random()>.5?"♡":"·";
    h.style.left=mx+"px";h.style.top=my+"px";document.getElementById("trail").appendChild(h);
    setTimeout(()=>h.remove(),850);
  }
});
(function cursorLoop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(cursorLoop)})();
document.addEventListener("mouseover",e=>{
 if(e.target.closest("button,a,video,img")){ring.style.width="46px";ring.style.height="46px";ring.style.borderColor="rgba(224,115,153,.85)"}
 else{ring.style.width="32px";ring.style.height="32px";ring.style.borderColor="rgba(224,115,153,.55)"}
});

function createPetals(count=4){
 for(let i=0;i<count;i++){
   const p=document.createElement("span");p.className="petal";p.textContent=Math.random()>.5?"♡":"•";
   p.style.left=(Math.random()*100)+"vw";p.style.setProperty("--x",(Math.random()*180-90)+"px");
   p.style.fontSize=(9+Math.random()*12)+"px";p.style.animationDuration=(4+Math.random()*4)+"s";
   document.querySelector(".petals").appendChild(p);setTimeout(()=>p.remove(),9000);
 }
}
setInterval(()=>createPetals(1),1800);
goTo(0);
