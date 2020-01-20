const AMOUNT_BARS = 100;

function generateSizes() {
  const sizes = [];

  while (sizes.length < AMOUNT_BARS) {
    const size = Math.floor(Math.random() * AMOUNT_BARS + 1);
    if (!sizes.includes(size)) sizes.push(size);
  }

  return sizes;
}

function printBars() {
  document.getElementById("resolve").removeAttribute("disabled");
  const sizes = generateSizes();
  let bars = "";

  sizes.forEach(size => {
    const part1 = '<div class="bar" data-active="false" ';
    const part2 = `data-size="${size}" `;
    const part3 = `style="height: ${size + 1}%"`;
    const part4 = "></div>";

    bars = bars + part1 + part2 + part3 + part4;
  });

  document.getElementById("area").innerHTML = bars;
}

function getBarSize(i) {
  const bar = document.getElementsByClassName("bar").item(i);
  return bar ? parseInt(bar.getAttribute("data-size")) : null;
}

function setBarSize(i, size) {
  const bar = document.getElementsByClassName("bar").item(i);

  bar.setAttribute("data-size", size);
  bar.setAttribute("style", `height: ${parseInt(size) + 1}%;`);

  return true;
}

function setActiveBar(i, status, speed = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      const bar = document.getElementsByClassName("bar").item(i);

      if (!bar) return resolve(false);
      bar.setAttribute("data-active", status);

      resolve(true);
    }, speed);
  });
}

function changePosition(i) {
  const current = getBarSize(i);
  const next = getBarSize(i + 1);
  setBarSize(i, next);
  setBarSize(i + 1, current);

  return true;
}

function getMilliseconds(speed) {
  const speeds = {
    slow: 50,
    medium: 25,
    fast: 1
  };

  return speeds[speed];
}

async function scanlist(speed, length) {
  let changed = false;

  for (let i = 0; i < length; i++) {
    if (speed) {
      await setActiveBar(i, true, 0);
      await setActiveBar(i, false, speed);
    }
    let current = getBarSize(i);
    let next = getBarSize(i + 1);
    let change = next ? current > next : false;
    if (change) {
      changePosition(i);
      changed = true;
    }
  }

  return changed;
}

async function done() {
  let length = document.getElementsByClassName("bar").length;

  for (let i = 0; i < length; i++) {
    await setActiveBar(i, true, 0);
    await setActiveBar(i, false, 25);
  }
}

async function sortBars() {
  let length = document.getElementsByClassName("bar").length;
  const speed = document.getElementById("speed").value;
  const milliseconds = getMilliseconds(speed);
  let changed = true;

  while (changed) {
    changed = await scanlist(milliseconds, length);
    length--;
  }

  done();
}
