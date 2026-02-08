/**
 * 2026 주휴수당 계산기 통합 로직
 * 방식: 1. 고정형(주간 고정 근무) / 2. 변동형(월간 총 시간 기준)
 */

let currentMode = 'fixed'; // 현재 선택된 모드 (기본값: 고정형)

/**
 * 탭 전환 함수: 사용자가 선택한 모드에 따라 UI를 변경함
 * @param {string} mode - 'fixed' 또는 'flex'
 */
function switchMode(mode) {
    currentMode = mode;
    const fixedFields = document.getElementById('fixed-fields');
    const flexFields = document.getElementById('flex-fields');
    const desc = document.getElementById('mode-desc');
    const buttons = document.querySelectorAll('.tab-btn');

    // 모든 탭 버튼에서 활성화 스타일(active) 제거
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (mode === 'fixed') {
        // 고정형 선택 시: 주간 입력창 표시, 변동형 숨김
        fixedFields.style.display = 'block';
        flexFields.style.display = 'none';
        desc.innerText = "매주 정해진 시간에 근무하는 경우에 적합합니다.";
        buttons[0].classList.add('active'); // 첫 번째 버튼 활성화
    } else {
        // 변동형 선택 시: 월간 입력창 표시, 고정형 숨김
        fixedFields.style.display = 'none';
        flexFields.style.display = 'block';
        desc.innerText = "매달 스케줄이 불규칙한 분들을 위한 월 총합 기준 계산입니다.";
        buttons[1].classList.add('active'); // 두 번째 버튼 활성화
    }
}

/**
 * 메인 계산 함수: 선택된 모드에 따라 적절한 수식을 적용하여 결과를 도출
 */
function calculate() {
    // 공통 입력값: 시급
    const wage = Number(document.getElementById('hourlyWage').value);
    
    // 월급 산정 기준: 1년 365일 ÷ 12개월 ÷ 7일 = 약 4.345주
    const avgWeeks = 4.345; 
    
    let totalMonthlyPay = 0;   // 최종 세전 월급
    let monthlyAllowance = 0; // 한 달치 주휴수당 총합

    if (currentMode === 'fixed') {
        /**
         * [고정형 로직]
         * 주간 근무시간이 일정하므로 (주간 근로시간)을 기준으로 주휴수당 판정
         */
        const dailyH = Number(document.getElementById('dailyHours').value);
        const weeklyD = Number(document.getElementById('weeklyDays').value);
        const weeklyHours = dailyH * weeklyD; // 1주일 총 근로시간

        // 주휴수당 판정: 주 15시간 이상 근무 시 발생
        // 공식: (주간 근로시간 / 40시간) * 8시간 * 시급
        const weeklyAllowance = weeklyHours >= 15 ? (weeklyHours / 40) * 8 * wage : 0;
        
        monthlyAllowance = weeklyAllowance * avgWeeks; // 주당 주휴수당을 월 평균 주 수로 곱함
        totalMonthlyPay = (weeklyHours * wage * avgWeeks) + monthlyAllowance; // 기본급 + 주휴수당
        
    } else {
        /**
         * [변동형 로직]
         * 월간 총 시간을 입력받으므로, 이를 월 평균 주 수(4.345)로 나눠 주간 평균 근로시간을 구함
         */
        const totalH = Number(document.getElementById('monthlyTotalHours').value);
        
        // 월 총 시간을 4.345주로 나눠서 주 평균 근로시간 산출
        const avgWeeklyHours = totalH / avgWeeks; 
        
        // 주 평균 15시간 이상인지 확인하여 주휴수당 발생 여부 결정
        const weeklyAllowance = avgWeeklyHours >= 15 ? (avgWeeklyHours / 40) * 8 * wage : 0;
        
        monthlyAllowance = weeklyAllowance * avgWeeks; // 월간 총 주휴수당
        totalMonthlyPay = (totalH * wage) + monthlyAllowance; // 월 기본급(총시간*시급) + 주휴수당
    }

    displayResult(totalMonthlyPay, monthlyAllowance);
}

/**
 * 화면 출력 함수: 계산된 값을 포맷팅하여 HTML에 표시
 * @param {number} total - 세전 총 월급
 * @param {number} allowance - 총 주휴수당
 */
function displayResult(total, allowance) {
    // 결과 영역을 화면에 보이게 함
    document.getElementById('result-area').style.display = 'block';
    
    // 세전 월급 및 주휴수당 표시 (반올림 및 콤마 추가)
    document.getElementById('totalPay').innerText = Math.round(total).toLocaleString();
    document.getElementById('allowance').innerText = Math.round(allowance).toLocaleString();
    
    /**
     * [실수령액 계산]
     * 2026년 예상 4대보험 및 세금 공제율 9.32% 적용
     * (국민연금 4.5% + 건강보험 약 3.5% + 고용보험 0.9% 등 합산 기준)
     */
    const afterTax = total * (1 - 0.0932);
    document.getElementById('afterTax').innerText = Math.round(afterTax).toLocaleString();
}
