'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { register, sendVerificationEmail } from '@/lib/api/auth'; // register 함수 임포트 및 sendVerificationEmail 임포트 추가

export default function UserJoinPage() {
  // 폼 상태
  const [form, setForm] = useState({
    userEmail: '',
    userId: '',
    userName: '',
    userPw: '',
    pwdConfirm: '',
    userTel: '',
    userBirth: '',
    userZipCode: '',
    userAddress: '',
    userDetailAddress: '',
  });

  const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 완료 여부
  const [verificationCode, setVerificationCode] = useState(''); // 사용자가 입력한 인증번호
  const [serverCode, setServerCode] = useState(''); // 서버에서 발송한 인증번호 (실제 백엔드 연동 시 필요)
  const [showVerificationInput, setShowVerificationInput] = useState(false); // 인증번호 입력 필드 보이기/숨기기
  const [emailError, setEmailError] = useState(''); // 이메일 관련 에러 메시지
  const [emailSuccess, setEmailSuccess] = useState(''); // 이메일 관련 성공 메시지
  const [passwordMatchError, setPasswordMatchError] = useState(''); // 비밀번호 일치 에러

  const [error, setError] = useState(''); // 일반 에러 메시지
  const [success, setSuccess] = useState(''); // 일반 성공 메시지
  const [loading, setLoading] = useState(false); // 회원가입 제출 로딩

  const router = useRouter();

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    // 비밀번호 확인 실시간 체크
    if (name === 'pwdConfirm' || name === 'userPw') {
      if (name === 'pwdConfirm' && value !== form.userPw) {
        setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      } else if (name === 'userPw' && value !== form.pwdConfirm && form.pwdConfirm !== '') {
        // userPw 변경 시 pwdConfirm이 이미 입력되어 있다면 다시 일치 여부 확인
        setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      } else {
        setPasswordMatchError('');
      }
    }
  };

  // 이메일 인증번호 발송 요청
  const handleSendCode = async () => {
    // 이메일 유효성 검사 (클라이언트 측)
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(form.userEmail)) {
      setEmailError('올바른 이메일 주소 형식으로 입력해주세요.');
      setEmailSuccess('');
      return;
    }

    setEmailError(''); // 기존 에러 초기화
    setEmailSuccess('인증번호 발송 중...');
    setLoading(true);

    try {
      // sendVerificationEmail 함수를 사용하여 백엔드에 이메일 인증 요청
      const response = await sendVerificationEmail(form.userEmail);

      if (response.success) {
        // 서버에서 받은 인증번호를 저장 (실제로는 클라이언트에서 알 필요는 없으나, 테스트를 위해 저장)
        setServerCode(response.code); // 백엔드에서 code 필드에 인증번호를 담아준다고 가정
        setShowVerificationInput(true); // 인증번호 입력 필드 보이도록 설정
        setEmailSuccess(`인증번호가 발송되었습니다. 이메일을 확인해주세요.`);
        // 테스트 목적으로만 (실제 서비스에서는 보안상 제거): setEmailSuccess(`인증번호가 발송되었습니다. 이메일을 확인해주세요. (테스트 코드: ${response.code})`);
      } else {
        setEmailError(response.message || '인증번호 발송에 실패했습니다.');
        setEmailSuccess('');
      }
    } catch (err: any) {
      console.error('인증번호 발송 실패:', err.response?.data || err.message);
      setEmailError(err.response?.data?.message || '인증번호 발송에 실패했습니다. 다시 시도해주세요.');
      setEmailSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (verificationCode === serverCode && verificationCode !== '') {
      setEmailVerified(true);
      setEmailError('');
      setEmailSuccess('이메일 인증이 완료되었습니다!');
      setShowVerificationInput(false); // 인증 완료 후 입력 필드 숨김
    } else {
      setEmailVerified(false);
      setEmailError('인증번호가 일치하지 않거나 유효하지 않습니다.');
      setEmailSuccess('');
    }
  };

  // 주소 검색
  const handleOpenPostcode = () => {
    if (typeof window !== 'undefined' && window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data: any) {
          let fullAddress = data.address;
          let extraAddress = '';

          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddress +=
              extraAddress !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          if (extraAddress !== '') {
            fullAddress += ' (' + extraAddress + ')';
          }

          setForm((prevForm) => ({
            ...prevForm,
            userZipCode: data.zonecode,
            userAddress: fullAddress,
          }));
        },
      }).open();
    } else {
      console.warn('Daum Postcode API가 아직 로드되지 않았습니다.');
      // API 로딩이 완료될 때까지 기다리거나 사용자에게 안내
    }
  };

  // 전화번호 자동 하이픈 추가
  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value.replace(/\D/g, ''); // 숫자만 남기기

    if (newValue.length > 11) {
      newValue = newValue.substring(0, 11); // 11자리 초과 방지
    }

    if (newValue.length <= 3) {
      // 010
      newValue = newValue;
    } else if (newValue.length <= 7) {
      // 010-XXXX
      newValue = `${newValue.substring(0, 3)}-${newValue.substring(3)}`;
    } else {
      // 010-XXXX-XXXX
      newValue = `${newValue.substring(0, 3)}-${newValue.substring(3, 7)}-${newValue.substring(7)}`;
    }
    setForm((prevForm) => ({ ...prevForm, [name]: newValue }));
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setPasswordMatchError(''); // 제출 전 에러 초기화

    // 폼 유효성 검사 (React 상태와 HTML5 pattern 속성 활용)
    // HTML5 pattern으로 기본적인 유효성 검사는 되지만, 수동으로도 확인
    if (!emailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    if (form.userPw !== form.pwdConfirm) {
      setPasswordMatchError('비밀번호가 일치하지 않습니다.');
      setError('비밀번호를 확인해주세요.'); // 전체 에러 메시지도 추가
      return;
    }

    // 비밀번호 강도, 패턴 등 추가 유효성 검사는 필요에 따라 여기에 추가
    // (JSP의 checkPasswordStrength 함수 로직을 React에 맞게 변환하여 사용)

    setLoading(true);
    try {
      // register 함수는 'lib/api/auth'에 정의되어 있고,
      // 'application/x-www-form-urlencoded' 타입으로 전송한다고 가정합니다.
      await register(form);
      setSuccess('회원가입이 완료되었습니다!');
      // 1초 후에 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/user/login');
      }, 1000);
    } catch (err: any) {
      console.error('회원가입 중 오류 발생:', err.response?.data || err.message);
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        {/* 이메일 인증 섹션 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            이메일 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              name="userEmail"
              id="userEmail" // ID 추가
              value={form.userEmail}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
              className="flex-1 border rounded px-3 py-2"
              disabled={emailVerified} // 인증 완료 시 이메일 입력 비활성화
            />
            <button
              type="button"
              id="checkEmail" // ID 추가
              className="bg-blue-600 text-white px-3 py-2 rounded disabled:bg-gray-400" // Tailwind CSS 스타일
              onClick={handleSendCode}
              disabled={loading || emailVerified || !form.userEmail} // 로딩 중, 인증 완료 시, 이메일 미입력 시 비활성화
            >
              인증번호 발송
            </button>
          </div>
          {/* 이메일 관련 메시지 출력 */}
          {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
          {emailSuccess && <div className="text-green-600 text-sm mt-1">{emailSuccess}</div>}
        </div>

        {/* 인증번호 입력 필드 (조건부 렌더링) */}
        {showVerificationInput && !emailVerified && (
          <div id="verificationCodeGroup" className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                id="verificationCode" // ID 추가
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증번호 입력"
                required
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="button"
                id="verifyEmailBtn" // ID 추가
                className="bg-green-600 text-white px-3 py-2 rounded disabled:bg-gray-400" // Tailwind CSS 스타일
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length === 0} // 로딩 중, 인증번호 미입력 시 비활성화
              >
                인증 확인
              </button>
            </div>
            <div id="memailconfirmTxt" className="text-sm mt-1"></div> {/* 메시지 표시 영역, 필요시 React 상태로 관리 */}
          </div>
        )}

        {/* 나머지 폼 필드 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            아이디 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
            pattern="^[a-zA-Z0-9]{4,12}$"
            className="w-full border rounded px-3 py-2"
            placeholder="영문, 숫자로 4~12자 입력"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            required
            pattern="^[가-힣]{2,4}$"
            className="w-full border rounded px-3 py-2"
            placeholder="한글 2~4자 입력"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            비밀번호 <span className="text-red-500">*</span>
          </label>
          <div className="password-input-container relative">
            <input
              type="password"
              name="userPw"
              id="userPw"
              value={form.userPw}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 pr-10"
              placeholder="영문, 숫자, 특수문자 포함 8~16자"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            비밀번호 확인 <span className="text-red-500">*</span>
          </label>
          <div className="password-input-container relative">
            <input
              type="password"
              name="pwdConfirm"
              id="pwdConfirm"
              value={form.pwdConfirm}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 pr-10"
              placeholder="비밀번호를 다시 입력"
            />
          </div>
          {passwordMatchError && (
            <div id="pwMatchError" className="text-red-500 text-sm mt-1">
              {passwordMatchError}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="userTel"
            value={form.userTel}
            onChange={handleTelChange}
            required
            pattern="^010-\d{4}-\d{4}$"
            className="w-full border rounded px-3 py-2"
            placeholder="010-0000-0000"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            생년월일 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="userBirth"
            value={form.userBirth}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            우편번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="userZipCode"
            id="zipCode"
            value={form.userZipCode}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="우편번호 입력"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="userAddress"
            id="userAddress"
            value={form.userAddress}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="도로명 또는 지번 주소 입력"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">상세 주소</label>
          <input
            type="text"
            name="userDetailAddress"
            value={form.userDetailAddress}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="상세 주소 입력 (선택사항)"
          />
        </div>
        <button
          type="button"
          className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 mb-4"
          onClick={handleOpenPostcode}
        >
          주소 검색
        </button>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-600">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading || !emailVerified || !!passwordMatchError}
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>
      <div className="text-center mt-6">
        <p>
          이미 계정이 있으신가요?{' '}
          <Link href="/user/login" className="text-blue-700 underline">
            로그인
          </Link>
        </p>
      </div>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="beforeInteractive"
      />
    </div>
  );
}

declare global {
  interface Window {
    daum: any;
  }
}