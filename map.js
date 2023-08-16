/* ================================================== Variables ================================================== */

const id = `1ZBjofp1FBsvT2v03q18pHe1Y2z08_8IL32yOGAd6qzU`;
const api = `AIzaSyBbMf67jPrNOb9QTxAO3itGsNy70bYhaEw`;

const html = document.querySelector("html");

const sectionButtons = document.querySelectorAll("nav a");
const sections = document.querySelector("main");

const partyColor = document.querySelector("#party-color");
const partySelect = document.querySelector("select");

var selected;
var mode = 0;

const icons = document.querySelectorAll("#tools span:not(#trash)");

const name = document.querySelector("#name");

var provinces = document.querySelectorAll("path");

const text = document.querySelector("text");

const inputs = [document.querySelectorAll("#presidency input"), document.querySelectorAll("#presidency p")];

const table = document.querySelectorAll("table tr:not(:first-of-type)");

const tableButtons = document.querySelectorAll("#refresh, #previous, #next");

const loading = document.querySelector("#loading");

const notification = document.querySelector("#notification");
var notificate;

var map = [[], [], [], [], [], [], [], [25, 25, 25, 25]];

color = ["#ef7f0f", "#0f5fcf", "#cf2f3f", "#0fbfcf", "#3F4F5F", "#9f2f8f", "#1f8f1f"];

var sended = false;

var pointer = 0;
var commentPointer = 0;

const regex = ` -()_,.:;#'"^+%&/=?!*|~@`;

const responsiveTable = document.querySelector("#responsive-table");

const commentName = document.querySelector("#comment input");
const commentText = document.querySelector("#comment textarea");

/* ================================================== Functions ================================================== */

function selectParty() {
  selected = partySelect.value.split("|");
  partyColor.style.backgroundColor = selected[1];
  mode = 0;
}

function selectMode(type) {
  mode = type;

  icons[type].style.color = "var(--light-blue)";
  icons[type ? 0 : 1].style.color = "var(--black)";
}

function clean() {
  provinces.forEach((province) => {
    province.style.removeProperty("fill");

    delete province.dataset.index;
  });

  map = [[], [], [], [], [], [], [], map[7]];
}

function ratio(input, index) {
  let difference = map[7][index] - input.value;

  if (difference == 0) return;
  else if (difference > 0) {
    for (let a = 1; a < map[7].length; a++) {
      let n = (index + a) % map[7].length;

      let capacity = 60 - map[7][n];

      if (difference <= capacity) {
        map[7][n] += difference;

        break;
      } else {
        difference -= capacity;

        map[7][n] = 60;
      }
    }
  } else {
    for (let b = 1; b < map[7].length; b++) {
      let n = (index + b) % map[7].length;

      if (-difference <= map[7][n]) {
        map[7][n] += difference;

        break;
      } else {
        difference += map[7][n];

        map[7][n] = 0;
      }
    }
  }

  map[7][index] = parseInt(input.value);

  map[7].forEach((ratio, n) => {
    inputs[0][n].style.setProperty("--progress", `calc((${map[7][n]} / 60) * 100%)`);
    inputs[1][n].textContent = `${map[7][n]}%`;
  });
}

function notify(message) {
  if (notificate) return;

  notification.innerHTML = message;
  notification.classList.add("show");
  notificate = setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notificate = 0;
    }, 200);
  }, 1500);
}

async function send(button) {
  if (name != document.activeElement && !button) return;

  if (!name.value) {
    notify("İsim / Başlık boş olamaz.");
    return;
  }

  if (name.value.length > 20) {
    notify("İsim / Başlık 20 karakteri aşmamalı.");
    return;
  }

  // Geçersiz !/^[a-zA-Z0-9ığüşöçİĞÜŞÖÇ`\-_\(\),.:;#"']+$/u.test(name.value)

  for (let c = 0; c < name.value.length; c++) {
    let code = name.value[c].charCodeAt(0);
    if (
      !(code >= 97 && code <= 122) &&
      !(code >= 65 && code <= 90) &&
      !(code >= 48 && code <= 57) &&
      !regex.includes(name.value[c]) &&
      code != 199 &&
      code != 231 &&
      code != 286 &&
      code != 287 &&
      code != 304 &&
      code != 305 &&
      code != 214 &&
      code != 246 &&
      code != 350 &&
      code != 351 &&
      code != 220 &&
      code != 252
    ) {
      notify(
        `Lütfen geçersiz karakter girmeyin. [ a-z A-Z 0-9 boşluk - _ ( ) , . ? ! : ; " ' ^ + % & / = * @ # | ve ~ sembolleri geçerlidir.]`
      );
      return;
    }
  }

  let same;

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Tablo!A:A?key=${api}`).then((response) =>
    response.json().then((data) => {
      if (data.values) {
        for (let d = 0; d < data.values.length; d++) {
          if (name.value == data.values[d]) {
            same = true;
            break;
          }
        }
      }
    })
  );

  if (same) {
    notify("Bu isim / başlık kullanılmış");
    return;
  }

  document.querySelector("#share-guess").classList.add("fade");

  setTimeout(() => {
    document.querySelector("#share-guess").remove();
  }, 200);

  document.body.focus();

  if (localStorage.getItem("sended") == "0") {
    notify("Beşten fazla tahmin yollanamaz.");
    return;
  }

  if (sended) return;

  name.blur();

  let data = new FormData();

  data.append("entry.1844654472", name.value);
  data.append("entry.948774232", JSON.stringify(map));
  fetch("https://docs.google.com/forms/d/e/1FAIpQLSeeok46pEyuj61jW3iHkxBCZgbLYbAGpm-eWLDT-qWEh6amPQ/formResponse", {
    method: "POST",
    body: data,
  });

  localStorage.setItem("sended", parseInt(localStorage.getItem("sended") - 1));

  notify("Tahmininiz kaydedildi.");

  sended = true;

  action("Tahmin");
}

function like(name, icon) {
  icon.parentElement.innerHTML = `<i class="fa-regular fa-heart" style="font-weight: bold"></i>${
    parseInt(icon.parentElement.textContent) + 1
  }`;

  let data = new FormData();

  data.append("entry.685866798", name);

  fetch("https://docs.google.com/forms/u/2/d/e/1FAIpQLSfZFSzUjjVUx6D8u7Ms0OYvB6y7P-mFlDioyRCSrawgKWFaSw/formResponse", {
    method: "POST",
    body: data,
  });

  localStorage.setItem("liked", localStorage.getItem("liked") + name + `\\EA\\`);

  action("Beğenme");
}

async function guesses(direction, disabled) {
  if (disabled) return;

  tableButtons[0].classList.add("disabled");
  tableButtons[1].classList.add("disabled");
  tableButtons[2].classList.add("disabled");
  loading.classList.add("loading");

  if (direction == -1) pointer = Math.max(pointer - 1, 0);
  else if (direction == 1) pointer++;

  let last;

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/Tablo!A${pointer * 10 + 1}:C${
      (pointer + 1) * 10
    }?key=${api}`
  )
    .then((response) =>
      response.json().then((response) => {
        if (response.values) {
          for (let e = 0; e < 10; e++) {
            let value = response.values[e];

            if (value) {
              table[e].classList.remove("blank");

              table[
                e
              ].children[0].innerHTML = `<i class="fa-solid fa-magnifying-glass" onclick='display(\`${value[1]}\`)'></i>`;

              table[e].children[1].textContent = value[0];

              let liked = localStorage.getItem("liked").split(`\\EA\\`);
              let like;
              for (let f = 0; f < liked.length - 1; f++) {
                if (value[0] == liked[f]) {
                  like = true;
                  break;
                }
              }

              table[e].children[2].innerHTML = `<i class="fa-regular fa-heart" ${
                like ? `style="font-weight: bold"` : `onclick="like('${value[0]}', this)"`
              }></i>${value[2]}`;

              table[e].children[3].innerHTML = "-";

              let ratios = JSON.parse(value[1])[7];

              table[
                e
              ].children[4].innerHTML = `<i class="fa-solid fa-circle" style="color: var(--party-ak-parti)"></i>${ratios[0]}%
              <i class="fa-solid fa-circle" style="color: var(--party-memleket-partisi)"></i>${ratios[1]}%
              <i class="fa-solid fa-circle chp-iyi-parti"></i>${ratios[2]}%
              <i class="fa-solid fa-circle" style="color: var(--party-zafer-partisi)"></i>${ratios[3]}%`;
            } else {
              table[e].innerHTML = `<td></td><td></td><td></td><td></td><td></td>`;
              table[e].classList.add("blank");
              last = true;
            }
          }
        } else {
          table.forEach((row) => {
            row.innerHTML = `<td></td><td></td><td></td><td></td><td></td>`;
            row.classList.add("blank");
          });
          last = true;
        }
      })
    )
    .catch(() => notify("Veriler getirilirken bir hata oluştu, lütfen tekrar deneyiniz."));

  tableButtons[0].classList.remove("disabled");
  if (pointer) tableButtons[1].classList.remove("disabled");
  if (!last) tableButtons[2].classList.remove("disabled");
  loading.classList.remove("loading");
}

function display(data) {
  data = JSON.parse(data);

  clean();

  for (let g = 0; g < data.length - 1; g++) {
    data[g].forEach((province) => {
      for (let h = 0; h < provinces.length; h++) {
        if (province == provinces[h].id) {
          province = provinces[h];
          break;
        }
      }

      province.dataset.index = g;
      province.style.fill = color[g];
    });
  }

  inputs[0].forEach((input, index) => {
    input.value = data[7][index];
    inputs[1][index].textContent = `${data[7][index]}%`;
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  });

  map = data;

  html.scroll(0, 0);
}

function download() {
  notify("Dosya indirmede bir hata oluştu.");
}

async function action(type) {
  let client;

  await fetch("https://api-bdc.net/data/client-info").then((response) =>
    response.json().then((data) => (client = data))
  );

  let data = new FormData();

  data.append("entry.30751858", client.ipString);
  data.append("entry.427624341", client.device + " | " + client.os + " | " + client.family);
  data.append("entry.2014892008", type);

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSeQPZKg-O9hcwZ1QpDvuejHEvR3bPB07WvD6JJ7gZxhRfyUJg/formResponse", {
    method: "POST",
    body: data,
  });
}

function comment(button) {
  if (commentText != document.activeElement && !button) return;

  if (!commentName.value) {
    notify("İsim / Başlık boş olamaz.");
    return;
  }

  if (!commentText.value) {
    notify("Yorum boş olamaz.");
    return;
  }

  if (commentName.value.length > 20) {
    notify("İsim / Başlık 20 karakteri aşmamalı.");
    return;
  }

  if (commentText.value.length > 300) {
    notify("Yorum 300 karakteri aşmamalı.");
    return;
  }

  for (let h = 0; h < commentName.value.length; h++) {
    let code = commentName.value[h].charCodeAt(0);
    if (
      !(code >= 97 && code <= 122) &&
      !(code >= 65 && code <= 90) &&
      !(code >= 48 && code <= 57) &&
      !regex.includes(commentName.value[h]) &&
      code != 199 &&
      code != 231 &&
      code != 286 &&
      code != 287 &&
      code != 304 &&
      code != 305 &&
      code != 214 &&
      code != 246 &&
      code != 350 &&
      code != 351 &&
      code != 220 &&
      code != 252
    ) {
      notify(
        `Lütfen geçersiz karakter girmeyin. [ a-z A-Z 0-9 boşluk - _ ( ) , . ? ! : ; " ' ^ + % & / = * @ # | ve ~ sembolleri geçerlidir.]`
      );

      return;
    }
  }

  for (let i = 0; i < commentText.value.length; i++) {
    let code = commentText.value[i].charCodeAt(0);
    if (
      !(code >= 97 && code <= 122) &&
      !(code >= 65 && code <= 90) &&
      !(code >= 48 && code <= 57) &&
      !regex.includes(commentText.value[i]) &&
      code != 199 &&
      code != 231 &&
      code != 286 &&
      code != 287 &&
      code != 304 &&
      code != 305 &&
      code != 214 &&
      code != 246 &&
      code != 350 &&
      code != 351 &&
      code != 220 &&
      code != 252
    ) {
      notify(
        `Lütfen geçersiz karakter girmeyin. [ a-z A-Z 0-9 boşluk - _ ( ) , . ? ! : ; " ' ^ + % & / = * @ # | ve ~ sembolleri geçerlidir.]`
      );

      return;
    }
  }

  let data = new FormData();

  data.append("entry.1767825299", commentName.value);
  data.append("entry.832562686", commentText.value);

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSdzfOCQSbmzush7EYSFPQeNx8VRRa1HMOrPaKWV4TVTEdcVTA/formResponse", {
    method: "POST",
    body: data,
  });

  notify("Yorumunuz kaydedildi.");
}

function section(index) {
  sectionButtons.forEach((button, i) => {
    if (index == i) button.classList.add("selected");
    else button.classList.remove("selected");
  });

  sections.style.transform = `translateX(calc(${-index} * var(--screen)))`;
}

/* ================================================== Events ================================================== */

provinces.forEach((province) => {
  province.addEventListener("click", (event) => {
    if (!selected) return;

    let index = province.dataset.index;

    if (!mode) {
      if (index) {
        if (index == selected[0]) return;

        map[index].splice(map[index].indexOf(province.id), 1);
      }

      province.dataset.index = selected[0];
      province.style.fill = selected[1];

      map[selected[0]].push(event.target.id);
    } else if (index) {
      map[index].splice(map[index].indexOf(province.id), 1);

      province.style.removeProperty("fill");
      delete province.dataset.index;
    }
  });

  province.addEventListener("mouseenter", (event) => {
    text.innerHTML = province.id;
    text.style.fill = "var(--black)";
    text.style.fontSize = "1vw";
  });

  province.addEventListener("mouseleave", (event) => {
    text.style.fill = "transparent";
    text.style.fontSize = ".8vw";
  });
});

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "Enter":
      send();
      comment();
      break;
  }
});

responsiveTable.addEventListener("scroll", (event) => {
  responsiveTable.style.background = `linear-gradient(to right, transparent 80%, rgba(0, 0, 0, ${
    0.3 - (Math.min(responsiveTable.scrollLeft, 500) * 0.3) / 500
  }) 100%), linear-gradient(to left, transparent 80%, rgba(0, 0, 0, ${
    (Math.min(responsiveTable.scrollLeft, 500) * 0.3) / 500
  }) 100%)`;
});

/* ================================================== Initiations ================================================== */

guesses();

if (!localStorage.getItem("sended")) localStorage.setItem("sended", "5");
if (!localStorage.getItem("liked")) localStorage.setItem("liked", "");
if (!localStorage.getItem("initiated")) {
  localStorage.setItem("initiated", true);
  action("Giriş");
}

setTimeout(() => document.querySelector("#responsive").scroll(75, 0), 200);
