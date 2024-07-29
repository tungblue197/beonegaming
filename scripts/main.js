const superbase_password = `Zvjun59Br9MEK1xM`;
const superbase_api_key = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcGJieWNmdGl3Z2h6dXRqa2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIyNDQ2MjEsImV4cCI6MjAzNzgyMDYyMX0.2TzmVPk0c9giBB16v8CMND81NHyj4iFelTlPsTU3A7Y`;
const superbase_api = `https://gppbbycftiwghzutjklv.supabase.co`;

const sb = supabase.createClient(superbase_api, superbase_api_key);

document.addEventListener("DOMContentLoaded", () => {
  renderRanks();

  const btn_register = document.querySelector(".register-form");
  if (btn_register) {
    btn_register.addEventListener("submit", (e) => {
      e.preventDefault();
      register(e);
    });
  }

  const tabs = document.querySelectorAll(".tab-title");
  const tabContent1 = document.querySelector(".tab__content-1");
  const tabContent2 = document.querySelector(".tab__content-2");
  const tabContents = document.querySelectorAll(".tab-content");

  for (const tab of tabs) {
    tab.addEventListener("click", (e) => {
      console.log(e);
      for (const t of tabs) {
        t.classList.remove("selected");
      }
      e.target.classList.add("selected");

      for (const tc of tabContents) {
        tc.classList.remove("selected");
      }

      console.log(e.target.attributes["data-tab"].value);
      if (e.target.attributes["data-tab"].value === "1") {
        tabContent1.classList.add("selected");
      }
      if (e.target.attributes["data-tab"].value === "2") {
        tabContent2.classList.add("selected");
      }
    });
  }
});

const RANKS = [
  {
    name: "Iron",
    image: "../../assets/icon/v-ranks/1854-valorant-iron-3.png",
  },
  {
    name: "Bronze",
    image: "../../assets/icon/v-ranks/4590-valorant-bronze-3.png",
  },
  {
    name: "Silver",
    image: "../../assets/icon/v-ranks/3293-valorant-silver-3.png",
  },
  {
    name: "Gold",
    image: "../../assets/icon/v-ranks/3293-valorant-gold-3.png",
  },
  {
    name: "Platinum",
    image: "../../assets/icon/v-ranks/5816-valorant-platinum-3.png",
  },
  {
    name: "Diamond",
    image: "../../assets/icon/v-ranks/6354-valorant-diamond-3.png",
  },
  {
    name: "Ascendant",
    image: "../../assets/icon/v-ranks/2309-valorant-ascendant-3.png",
  },
  {
    name: "Immortal",
    image: "../../assets/icon/v-ranks/5979-valorant-immortal-3.png",
  },
  {
    name: "Radiant",
    image: "../../assets/icon/v-ranks/5979-valorant-radiant.png",
  },
];

function renderRanks() {
  const rankList = document.querySelector(".rank-list");
  const r = loadRank(RANKS);
  rankList.innerHTML = r;
}
function loadRank(ranks) {
  let _rank = "";
  ranks.forEach((rank) => {
    _rank += `
    <input type="radio"  name="rank" style="background-image: url(${rank.image});" value="${rank.name}"/>
   `;
  });
  return _rank;
}

async function register(e) {
  e.preventDefault();
  const name = document.querySelector("input[name='name']").value;
  const ingame = document.querySelector("input[name='ingame']").value;
  const rank = document.querySelector("input[name='rank']:checked")?.value;

  if (!name || !ingame || !rank) {
    Toastify({
      text: "Vui lòng điền đầy đủ thông tin.",
      className: "info",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
    return;
  }

  const { data: member } = await sb
    .from("ResiterdMembers")
    .select()
    .eq("ingame", ingame);

  if (member?.length > 0) {
    Toastify({
      text: `${ingame} đã đăng ký. Vui lý đăng ký tên ingame khác.`,
      className: "info",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
    return;
  }
  const { data, error } = await sb.from("ResiterdMembers").insert([
    {
      name,
      ingame,
      rank,
    },
  ]);

  if (!error) {
    e.target.reset();
    getData();
    Toastify({
      text: "Đăng ký thành công hẹn bạn vào 20h thứ 7 hàng tuần nhé.",
      className: "info",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();

    return;
  }
}

getData();
async function getData() {
  const start = dayjs().startOf("week");
  const end = dayjs().endOf("week");
  console.log(start, end);
  const { data, error } = await sb
    .from("ResiterdMembers")
    .select()
    .lte("created_at", end.toISOString())
    .gte("created_at", start.toISOString());
  console.log(data);
  const total = data.length;
  document.querySelector(
    ".tab-2"
  ).textContent = `Danh sách đăng ký tuần này (${total})`;

  renderList(data);
}

function generateUUID() {
  let array = new Uint8Array(16);
  window.crypto.getRandomValues(array);

  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  return Array.from(array)
    .map((byte, index) => {
      return (byte + 0x100).toString(16).slice(1);
    })
    .reduce((uuid, value, index) => {
      return (
        uuid +
        (index === 4 || index === 6 || index === 8 || index === 10 ? "-" : "") +
        value
      );
    }, "");
}

function renderList(data) {
  const list = document.querySelector(".tab__content-2");

  let content = "";

  if (data && data?.length) {
    data.forEach((item) => {
      const rankIcon = RANKS.find((r) => r.name === item.rank)?.image;
      content += `
      <div class="item">
              <span class="name">${item.name || "-"}</span>
              <span class="ingame">${item.ingame || "-"} <div class="tooltip">
                <button class="copy-btn">
                    <img class="copy" src="./assets/icon/icons8-copy-24.png" />
                    <img class="copy-done" width="20px" src="./assets/icon/352323_done_icon.png" />
                </button>
            </div>

              </span>
              <img
                class="rank"
                src="${rankIcon}"
              />
            </div>
    `;
    });
    list.innerHTML = content;
  } else {
    list.innerHTML = `<h1 class="no-data">Hiện tại chưa có người đăng ký tham gia </h1>`;
  }
}

function myFunction(e) {
  navigator.clipboard.writeText(e);

  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copied: " + copyText.value;
}

function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}
