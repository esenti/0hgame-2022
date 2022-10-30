(function() {
  const canvas = document.getElementById('draw');
  canvas.width = 800;
  canvas.height = 600;

  const ctx = canvas.getContext('2d');

  let delta = 0;
  let now = 0;

  let before = Date.now();

  let elapsed = 0;
  let loading = 0;

  const DEBUG = false;
  // const DEBUG = true;

  const keysDown = {};
  let keysPressed = {};

  const images = [];
  const audios = [];

  let framesThisSecond = 0;
  let fpsElapsed = 0;
  let fps = 0;

  const particles = []

  let controls;
  let colors;

  window.addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
    return keysPressed[e.keyCode] = true;
  }, false);

  window.addEventListener("keyup", function(e) {
    return delete keysDown[e.keyCode];
  }, false);

  const setDelta = function() {
    now = Date.now();
    delta = (now - before) / 1000;
    return before = now;
  };

  if (!DEBUG) {
    console.log = function() {
      return null;
    };
  }

  let ogre = false;
  let fired = false;

  let x;
  let y;
  let step;
  let dir;

  const init = function() {
    elapsed = 0;

    score = 0;

    x = 400;
    y = 300;
    step = 0;
    dir = 1;

    controls = {
      shoot: 32,
    }

    colors = {
      bg: "#000000",
      player: "#ffffff",
      target: "#999999",
      score: "#ffffff",
    }

    document.getElementsByTagName("html")[0].style.background = colors.bg;
    document.getElementById("instructions").style.color = colors.score;
    document.getElementById("instructions").textContent = "SPACE to shoot";

    particles.splice(0, particles.length);

    ogre = false;
    fired = false;
  }

  const explode = (x, y) => {
    for(var k = 0; k < 30; k++) {
      particles.push({
        x: x,
        y: y,
        w: Math.random() * 4 + 1,
        h: Math.random() * 4 + 1,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        ttl: Math.random() * 0.1 + 0.1,
        speed: 400,
      })
    }
  }

  const tick = function() {
    setDelta();
    elapsed += delta;
    update(delta);
    draw(delta);
    keysPressed = {};
    click = null;
    return window.requestAnimationFrame(tick);
  };

  let points = 0;

  const update = function(delta) {

     framesThisSecond += 1;
     fpsElapsed += delta;

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }

    if(keysDown[controls.shoot] && ogre == false)
    {
      delete keysDown[controls.shoot];

      if (step == 0) {
        step = 1;
      } else if (step == 1) {
        step = 2;

        score = 1000 - 4 * (Math.abs(400 - x) + Math.abs(300 - y));

        explode(x, y);
      } else {
        x = 400;
        y = 300;
        step = 0;
        score = 0;
      }
    }

    if (step == 0) {
      x += delta * 500 * dir;
      if (x > 799) {
        x = 799;
        dir = -dir;
      } else if (x < 0) {
        x = 0;
        dir = -dir;
      }
    }

    if (step == 1) {
      y += delta * 500 * dir;
      if (y > 599) {
        y = 599;
        dir = -dir;
      } else if (y < 0) {
        y = 0;
        dir = -dir;
      }
    }

    for(var i = particles.length - 1; i >= 0; i--) {
      particles[i].ttl -= delta;

      if(particles[i].ttl <= 0) {
        particles.splice(i, 1)
        continue;
      }

      particles[i].x += particles[i].dx * particles[i].speed * delta;
      particles[i].y += particles[i].dy * particles[i].speed * delta;
      particles[i].a += delta * Math.random();
    }
 };

  const draw = function(delta) {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fafafa";

    ctx.fillStyle = colors.target;
    ctx.strokeStyle = colors.target;

    ctx.beginPath();
    ctx.arc(400, 300, 6, 0, 2 * Math.PI, false);
    ctx.fill();

    const w = 10;
    ctx.lineWidth = w;

    for (let i = 0; i < 10; i++)
    {
      ctx.beginPath();
      ctx.arc(400, 300, 4 + w * 2 * i, 0, 2 * Math.PI, false);
      ctx.stroke();
    }

    ctx.fillStyle = colors.player;

    if (step < 2) {
      ctx.fillRect(x, 0, 1, 600);
    }

    if (step > 0 && step < 2) {
      ctx.fillRect(0, y, 800, 1);
    }

    ctx.fillStyle = colors.particles;

    particles.forEach(function(particle) {
      ctx.fillStyle = colors.particles;
      ctx.fillRect(particle.x, particle.y, particle.w, particle.h);
    })

    if (step == 2) {
      ctx.fillStyle = colors.bg;
      ctx.fillRect(350, 0, 100, 80);

      ctx.fillStyle = colors.player;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI, false);
      ctx.fill();
    }

    if (score != 0) {
      ctx.fillStyle = colors.score;
      ctx.textAlign = "center";
      ctx.font = "40px Visitor";
      ctx.fillText(score, 400, 50);
    }

     if(ogre) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "80px Visitor";
        ctx.fillText("oh no", 400, 350);
     }
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

  const loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }

  const load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 init();
 load();

}).call(this);
