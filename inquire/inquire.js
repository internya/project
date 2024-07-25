document.addEventListener("DOMContentLoaded", function () {
  const clickTop = document.querySelector(".gotoTop");
  clickTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const inqItems = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("INQUIRE")) {
      const inqData = JSON.parse(localStorage.getItem(key));
      inqItems.push({
        id: key,
        title: inqData.title,
        content: inqData.content,
        category: inqData.category,
        adminAnswer: 0,
      });
    }
  }

  const dlList = document.getElementById("inqList");
  inqItems.forEach((item, index) => {
    const container = document.createElement("div");
    container.classList.add("inq_item_container");

    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.classList.add("inq_title");
    dd.classList.add("inq_view");
    dt.textContent = item.title;
    dd.textContent = item.content;
    dt.id = `dt${index}`;
    dd.style.display = "none";

    dt.addEventListener("click", () => {
      if (dd.style.display == "none") {
        dd.style.display = "block";
      } else {
        dd.style.display = "none";
      }
    });

    container.appendChild(dt);
    container.appendChild(dd);
    dlList.appendChild(container);
  });

  // 버튼 클릭 시 동작
  const btns = document.querySelectorAll(".btn2");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.textContent.trim(); // 클릭한 버튼의 카테고리
      const containers = document.querySelectorAll(".inq_item_container");
      console.log(containers);

      // 모든 FAQ 항목을 숨기기
      containers.forEach((container) => {
        container.style.display = "none";
      });

      // 클릭한 버튼의 카테고리와 일치하는 FAQ 항목만 보이기
      inqItems.forEach((item, index) => {
        if (item.category == category) {
          containers[index].style.display = "block";
        }
      });

      // 클릭한 버튼의 스타일 변경
      btns.forEach((b) => {
        b.style.backgroundColor = "white";
        b.style.color = "black";
      });
      btn.style.backgroundColor = "rgb(255, 183, 0)";
      btn.style.color = "white";
    });
  });

  //로그인 상태 여부
  const loginLink = document.getElementById("login");
  const signupLink = document.getElementById("mypage");

  let userData = getUserData();

  if (userData && userData.login == "1") {
    // 로그인 상태일 때
    loginLink.innerText = "로그아웃";
    loginLink.addEventListener("click", () => {
      // 로그아웃 처리
      userData.login = "0";
      saveUserData(userData);
      location.reload(); // 페이지 새로고침
    });

    signupLink.innerText = "마이페이지";
    signupLink.href = "#";
  } else {
    // 로그아웃 상태일 때
    loginLink.innerText = "로그인";
    loginLink.href = "/login/2.로그인/로그인.html";

    signupLink.innerText = "회원가입";
    signupLink.href = "/login/1.회원가입/회원가입.html";
  }

  // ///////////////////////////////admin 이면 button 보이게 하는거 추가 수정 필요 sesssion 보고 되면 하고 안되면 ㅅㅂ 모르겠다 진짜 aaa한테도 버튼보임 조졌.

  const writeBtn = document.getElementById("writeBtn");
  console.log(getUserData());
  for (let i = 0; i < localStorage.length; i++) {
    const userData = JSON.parse(localStorage.getItem(i));
    console.log(userData);
    if (userData.login) {
      writeBtn.style.display = "none";
      continue;
    }
    if (userData.login == "1") {
      const userId = userData.id;
      if (userId != "admin") {
        writeBtn.style.display = "none";
      }
    }
  }
});

function getUserData() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    const userData = JSON.parse(localStorage.getItem(key));
    if (userData) {
      return userData;
    }
  }
  return null; // 사용자 데이터가 없거나 null인 경우
}

function saveUserData(userData) {
  localStorage.setItem(`user${getUserCount()}`, JSON.stringify(userData));
}

function getUserCount() {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    count++;
  }
  return count;
}
