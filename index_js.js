const hourlyWage = document.getElementById("hourlyWage");
const dailyHours = document.getElementById("dailyHours");
const weeklyDays = document.getElementById("weeklyDays");
const calcBtn = document.getElementById("calcBtn");
const shareBtn = document.getElementById("shareBtn");
const resultBox = document.getElementById("resultBox");
const adBox = document.getElementById("adBox");

[hourlyWage, dailyHours, weeklyDays].forEach(input => {
  input.addEventListener("input", () => {
    validateInputs();
    previewCalculate();
  });
});

function validateInputs() {
  const w = Number(hourlyWage.value);
  const h = Number(dailyHours.value);
  const d = Number(weeklyDays.value);
  calcBtn.disabled = !(w > 0 && h > 0 && d > 0);
}

function resetInputs() {
  hourlyWage.value = "";
  dailyHours.value = "";
  weeklyDays.value = "";
  resultBox.innerHTML = "입력하면 자동으로 계산 미리보기가 표시됩니다.";
  shareBtn.disabled = true;
  calcBtn.disabled = true;
  adBox.style.display = "none";
}

function previewCalculate() {
  const w = Number(hourlyWage.value);
  const h = Number(dailyHours.value);
  const d = Number(weeklyDays.value);

  if (!(w > 0 && h > 0 && d > 0)) {
    resultBox.innerText = "조건을 모두 입력하면 실시간 미리보기가 표시됩니다.";
    return;
  }

  const weeklyHours = h * d;
  const weeklyAllowance = weeklyHours >= 15 ? (w * 8 * (weeklyHours / 40 > 1 ? 1 : weeklyHours / 40)) : 0;
  resultBox.innerHTML = `🔍 <b>미리보기:</b> 예상 주휴수당 약 ${Math.round(weeklyAllowance).toLocaleString()}원`;
}

function calculate() {
  const w = Number(hourlyWage.value);
  const h = Number(dailyHours.value);
  const d = Number(weeklyDays.value);

  const weeklyHours = h * d;
  const weeklyAllowance = weeklyHours >= 15 ? (weeklyHours / 40 * 8 * w) : 0;
  const weeklyPay = (w * weeklyHours) + weeklyAllowance;
  const monthly = weeklyPay * 4.345;
  const tax = monthly * 0.0932; 

  resultBox.innerHTML = `
    <div style="text-align:left; font-size:14px;">
      💰 주휴수당: <b>${Math.round(weeklyAllowance).toLocaleString()}원</b><br>
      📅 주급 합계: <b>${Math.round(weeklyPay).toLocaleString()}원</b>
    </div>
    <div class="highlight-res">
      당신의 이번 달 예상 월급은<br>
      <strong>${Math.round(monthly).toLocaleString()}원</strong>(세전) 입니다!
    </div>
    <p style="font-size:11px; color:gray; margin-top:8px;">
      * 4대보험 공제 후 예상 실수령액: 약 ${Math.round(monthly - tax).toLocaleString()}원
    </p>
  `;

  shareBtn.disabled = false;
  adBox.style.display = "block";
}

function shareResult() {
  const text = resultBox.innerText.trim();
  navigator.clipboard.writeText(text);
  alert("계산 결과가 복사되었습니다! SNS나 메모장에 공유해보세요.");
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}