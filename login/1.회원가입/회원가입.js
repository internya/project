let user = {
  id: "",
  pw: "",
  name: "",
  gender: "",
  birth: "",
  phone: "",
  email: "",
  delete: "0",
  login: "0",
  profile: "0",
};
let userNo = -1;
const signId = document.getElementById("signUp_id"); //입력받는 아이디
const signPw = document.getElementById("signUp_pw"); //입력받는 비밀번호
const pwCheck = document.getElementById("signUp_pw_check"); // 입력받는 비밀번호 확인
const signName = document.getElementById("signUp_name"); // 입력받는 이름
const signBirth = document.getElementById("userBirth"); // 입력받는 생년월일
const signPh = document.getElementById("signUp_phoneNo"); // 입력받는 전화번호
const certiPh = document.getElementById("certiNo"); // 입력받는 인증번호
const signEmail = document.getElementById("signUp_email"); //입력받는 이메일
const signGender = document.querySelectorAll("[name='gender']"); //성별

//아이디 확인 함수
let idConfrim = false;
function idCheck() {
  const newId = signId.value; //입력받은 아이디
  for (let i = 0; i < localStorage.length; i++) {
    const storedItem = localStorage.getItem(i);
    if (storedItem === null) {
      // console.log("null");
      continue;
    }
    try {
      const userData = JSON.parse(storedItem);
      const userId = userData.id;
      if (userId == newId) {
        alert("이미 존재하는 아이디입니다.");
        idConfrim = false;
        return;
      }
    } catch (error) {
      // console.error(`${error.message}`);
      //예외처리
    }
  }
  idConfrim = true;
  alert("사용 가능한 아이디입니다.");
}

//비밀번호 확인 함수
signPw.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}|:"<>?/`~.-]/g, ""); //비밀번호 조건
});

pwCheck.addEventListener("input", function () {
  this.value = this.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}|:"<>?/`~.-]/g, "");
});

let pwConfirm = false; //비밀번호 확인여부
function rePw() {
  const pw = signPw.value;
  const pCheck = pwCheck.value;
  if (pw == pCheck) {
    alert("비밀번호가 일치합니다.");
    pwConfirm = true;
    return;
  } else {
    alert("비밀번호가 일치하지 않습니다.");
    pwConfirm = false;
  }
}

let count = 1;
function pwEye() {
  if (count % 2 != 0) {
    signPw.type = "text";
  } else {
    signPw.type = "password";
  }
  count++;
}

//이름 입력(한글만 입력하게 해뒀음)
signName.addEventListener("input", function () {
  this.value = this.value.replace(/[^가-힣]/g, "");
});

signName.addEventListener("blur", function (e) {
  let name = this.value;
  if (name.length < 2 || name.length > 4) {
    alert("이름은 2~5글자까지 입력가능합니다.");
    return;
  }
});

// //성별체크 값 받는 함수
function genderCehck() {
  for (item of signGender) {
    if (item.checked) {
      return item.value;
    }
  }
}

//생년월일
signBirth.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
  if (this.value.length > 6) {
    alert("생년월일은 6자리 숫자로 입력해야 합니다.");
  }
});

//전화번호 입력함수
let phNo = "";
signPh.addEventListener("input", function () {
  const inputValue = this.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
  let result = ""; //화면에 보이는 숫자(하이픈 포함)
  let index = 0;

  for (let i = 0; i < inputValue.length; i++) {
    if (index === 3 || index === inputValue.length - 4) {
      result += "-"; // 3번째와 마지막 4자리 앞에 하이픈 추가
    }
    result += inputValue[i];
    index++;
  }
  phNo = result.replaceAll("-", "");
  this.value = result; // 하이픈 입력한 값을 value로 설정
  return phNo;
});

//전화번호 형식(3,4,3) 맞는지 확인
function checkPh() {
  const expHp = /^\d{3}-\d{3,4}-\d{4}$/; // 휴대폰 번호 형식 정규 표현식
  if (!expHp.test(signPh.value)) {
    alert(
      "휴대폰 번호 형식을 확인하세요. (예: 010-1234-5678, 10자리 또는 11자리)"
    );
    return false;
  }
  return true;
}

//전화번호 중복 제거

function phDup() {
  const ph = signPh.value; // 입력받은 전화번호
  let checkPh = []; // 비교할 로컬 전화번호 목록

  for (let i = 0; i < localStorage.length; i++) {
    const storedItem = localStorage.getItem(i);
    if (storedItem === null) {
      // console.log(`로컬 스토리지에서 ${i} 인덱스의 데이터가 null입니다.`);
      continue; // null일 경우 다음 반복으로 넘어감
    }
    try {
      const userData = JSON.parse(storedItem);
      const userPhone = userData.phone;
      if (userPhone) {
        // phone 필드가 유효한 경우에만 배열에 추가
        checkPh.push(userPhone);
      }
    } catch (error) {
      console.error(`로컬 스토리지 데이터 처리 중 오류 발생: ${error.message}`);
      // 예외 처리
    }
  }
  if (checkPh.includes(ph)) {
    alert("이미 사용중인 전화번호 입니다.");
    return false;
  }
  return true;
}

//인증번호 생성
function randomNo() {
  let random = "";
  while (random.length < 5) {
    random += Math.floor(Math.random() * 10);
  }
  return random;
}

//전화번호 형식이 맞을때 인증번호 발송
let phConfrim = false;
let random = "";

/////////////////////////////////////////////////////////
const smsBtn = document.getElementById("smsBtn");
smsBtn.addEventListener("click", () => {
  const validPh = checkPh();
  if (!validPh) {
    return; //전화번호 형식이 유효하지 않으면 함수 종료
  }
  //전화번호 중복 확인
  const duplicate = phDup();
  if (!duplicate) {
    return; //전화번호가 이미 사용중이면 함수 종료
  }
  //전화번호 유효성 및 중복 확인 후 실행

  //1.숫자 형식 확인
  const ph = checkPh();
  if (ph) {
    // 2.전화중복확인
    const dupli = phDup();
    if (signPh.value && dupli) {
      let ranNo = randomNo();
      console.log("인증번호: ", ranNo);
      random = ranNo;
      phConfrim = true;
      return ranNo;
    }
  }
});

//인증번호 일치여부
let cerConfrim = false;
function phCheck() {
  if (random != certiPh.value) {
    alert("인증번호가 일치하지 않습니다.");
    cerConfrim = false;
  } else {
    alert("인증번호가 일치합니다.");
    cerConfrim = true;
  }
}

//이메일 입력
signEmail.addEventListener("input", function () {
  const inputValue = this.value.replace(/[^A-Za-z0-9\-@._]+/g, "");
  this.value = inputValue; //
});

//이메일 검증
// "문제 kr만 안 걸림"
signEmail.addEventListener("blur", function () {
  const expEmail = /^[A-Za-z-0-9\-\.]+@[A-Ja-z-0-9\-\.]+\.[com||net||kr]+$/; // 이메일양식확인
  if (!expEmail.test(signEmail.value)) {
    alert(
      "이메일 형식을 확인하세요. @와 .com, net, kr을 포함해야 합니다. \n(예: abcd@naver.com)"
    );
    return false;
  }
});

//유효성검사
const wId = document.getElementById("warnId");
const wPw = document.getElementById("warnPw");
const wName = document.getElementById("warnName");
const wBir = document.getElementById("warnBirth");
const wGen = document.getElementById("warnGend");
const wCer = document.getElementById("warnCer");
const wPh = document.getElementById("warnPh");
const wEm = document.getElementById("warnEmail");

function valCheck() {
  if (!signId.value) {
    wId.classList.remove("hidden");
    return false;
  } else {
    wId.classList.add("hidden");
  }

  if (!signPw.value) {
    wPw.classList.remove("hidden");
    return false;
  } else {
    wPw.classList.add("hidden");
  }
  if (!signName.value) {
    wName.classList.remove("hidden");
    return false;
  } else {
    wName.classList.add("hidden");
  }
  const res = genderCehck();
  if (!res) {
    wGen.classList.remove("hidden");
    return false;
  } else {
    wGen.classList.add("hidden");
  }
  if (!signBirth.value) {
    wBir.classList.remove("hidden");
    return false;
  } else {
    wBir.classList.add("hidden");
  }
  if (!signPh.value) {
    wPh.classList.remove("hidden");
    return false;
  } else {
    wPh.classList.add("hidden");
  }

  if (!certiPh.value) {
    wCer.classList.remove("hidden");
    return false;
  } else {
    wCer.classList.add("hidden");
  }

  if (!signEmail.value) {
    wEm.classList.remove("hidden");
    return false;
  } else {
    wEm.classList.add("hidden");
  }
  return true;
}

//회원가입 완료 전, 키값 설정
function findMaxKey() {
  // 모든 키값을 순회한다.
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // 숫자 키만 확인한다.
    if (!isNaN(key)) {
      // 키값을 숫자로 변환한다.
      const keyNum = parseInt(key);

      // 최대 키값을 저장하는 변수를 초기화하거나 갱신한다.
      if (userNo === undefined || keyNum > userNo) {
        userNo = keyNum;
      }
    }
  }
  // 최대 키값을 반환한다.
  return userNo;
}

const maxKey = findMaxKey();
let USERno = parseInt(localStorage.getItem("USERno")) || 0;

function goSign() {
  const res = valCheck();
  //빠진 부분이 없을경우 비밀번호, 인증번호 확인
  if (res) {
    if (signBirth.value.length != 6) {
      alert("생년월일은 6자리 숫자를 입력해주세요.");
      return;
    }
    if (!idConfrim) {
      alert("아이디 확인 버튼을 누르세요.");
      return;
    }
    if (!pwConfirm) {
      alert("비밀번호를 확인 버튼을 누르세요");
      return;
    }
    if (!phConfrim) {
      alert("인증번호받기 버튼을 누르세요.");
      return;
    }
    if (!cerConfrim) {
      alert("인증번호확인 버튼을 누르세요.");
      return;
    }
    user = {
      id: signId.value,
      pw: signPw.value,
      name: signName.value,
      gender: genderCehck(),
      birth: signBirth.value,
      phone: signPh.value,
      email: signEmail.value,
      delete: "0",
      login: "0",
      profile: "0",
    };
    localStorage.setItem(`${USERno}`, JSON.stringify(user));
    USERno++;
    localStorage.setItem("USERno", USERno);
    alert("회원가입완료");
    window.location.href = "/DCS_main/메인.html";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const clickTop = document.querySelector(".gotoTop");
  clickTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  ////////////////////////////////// 로그인 관련 ////////////////////////////////////

  //로그인 상태 여부
  const loginLink = document.getElementById("login");
  const signupLink = document.getElementById("mypage");

  let userData = getUserData();
  let keyNo = 0;
  function keyCheck() {
    for (let key = 0; key < localStorage.length; key++) {
      const storeDate = JSON.parse(localStorage.getItem(key));
      if (storeDate && storeDate.id == userData.id) {
        keyNo = key;
        return keyNo;
      }
    }
  }
  if (userData && userData.login) {
    keyNo = keyCheck();
    const user = JSON.parse(localStorage.getItem(keyNo));
    if (userData.login == "1" && user.delete == "0") {
      // 로그인 상태일 때
      loginLink.innerText = "로그아웃";
      loginLink.href = "#";
      loginLink.addEventListener("click", () => {
        // 로그아웃 처리
        userData.login = "0";
        saveUserData(userData);
        logoutUser(userData);
        sessionStorage.removeItem("loginUser");
        // localStorage.setItem(`loginUser`, JSON.stringify(userData));
        location.reload(); // 페이지 새로고침
      });
      signupLink.innerText = "마이페이지";
      signupLink.href = "/mypage/회원정보수정및조회/회원정보메인.html";
    } else {
      // 로그아웃 상태일 때
      loginLink.innerText = "로그인";
      loginLink.href = "/login/2.로그인/로그인.html";

      signupLink.innerText = "회원가입";
      signupLink.href = "/login/1.회원가입/회원가입.html";
    }
  } else {
    loginLink.innerText = "로그인";
    loginLink.href = "/login/2.로그인/로그인.html";

    signupLink.innerText = "회원가입";
    signupLink.href = "/login/1.회원가입/회원가입.html";
  }
});

function getUserData() {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key == "loginUser") {
      const userData = JSON.parse(sessionStorage.getItem(key));
      if (userData) {
        return userData;
      }
    } else {
      continue;
    }
  }
  return null; // 사용자 데이터가 없거나 null인 경우
}

function saveUserData(userData) {
  sessionStorage.setItem(`loginUser`, JSON.stringify(userData));
}

// 로그아웃 클릭시 session에서 0으로 바뀐것을 local로 전달
function logoutUser(userData) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // localstorage 에 담긴 값.
    const localStorageData = localStorage.getItem(key);
    if (localStorageData) {
      try {
        // JSON문자열을 객체로 변환
        const localStorageObject = JSON.parse(localStorageData);
        // localStorage 객체와 session객체 비교.
        if (localStorageObject.id == userData.id) {
          // usreData의 login 값을 local에 업데이트
          localStorageObject.login = userData.login;

          // localStorageObject를 JSON문자열로 변환
          const updateLocalStorage = JSON.stringify(localStorageObject);

          localStorage.setItem(key, updateLocalStorage);
          break;
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("if문 통과 못함");
    }
  }
}
