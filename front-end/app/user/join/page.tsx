'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // next/navigation에서 useRouter를 가져옵니다.
import Script from 'next/script'; // Script 컴포넌트 추가
import { register } from '@/lib/api/auth';

export default function UserJoinPage() {
  // 폼 상태
  const [form, setForm] = useState({
    userEmail: '',
    userId: '',
    userName: '',
    userPw: '',
    pwdConfirm: '',
    userTel: '',
    userBirth: '', // 생년월일 추가
    userZipCode: '', // 우편번호
    userAddress: '', // 주소
    userDetailAddress: '', // 상세주소
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [serverCode, setServerCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // useRouter 훅을 초기화합니다.

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 이메일 인증 요청 (실제 API 연동 필요)
  const handleSendCode = async () => {
    // TODO: 이메일 인증 API 연동
    setServerCode('123456'); // 예시
    setSuccess('인증번호가 발송되었습니다. (테스트: 123456)');
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (verificationCode === serverCode) {
      setEmailVerified(true);
      setSuccess('이메일 인증이 완료되었습니다.');
    } else {
      setError('인증번호가 일치하지 않습니다.');
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

          setForm({
            ...form,
            userZipCode: data.zonecode,
            userAddress: fullAddress,
          });
        },
      }).open();
    } else {
      console.warn('Daum Postcode API가 아직 로드되지 않았습니다.');
    }
  };

  // 회원가입 제출 (실제 API 연동 필요)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!emailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    if (form.userPw !== form.pwdConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    try {
      await register(form); // 실제 회원가입 API 연동
      setSuccess('회원가입이 완료되었습니다.');
      // 1초 후에 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/user/login');
      }, 1000);
    } catch (err: any) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            이메일 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
              required
              className="flex-1 border rounded px-3 py-2"
              placeholder="example@email.com"
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-3 rounded"
              onClick={handleSendCode}
            >
              인증번호 발송
            </button>
          </div>
        </div>
        <div className="mb-4" style={{ display: serverCode ? 'block' : 'none' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="인증번호 입력"
            />
            <button
              type="button"
              className="bg-green-600 text-white px-3 rounded"
              onClick={handleVerifyCode}
            >
              인증 확인
            </button>
          </div>
        </div>
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
          <input
            type="password"
            name="userPw"
            value={form.userPw}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="영문, 숫자, 특수문자 포함 8~16자"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            비밀번호 확인 <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="pwdConfirm"
            value={form.pwdConfirm}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="비밀번호를 다시 입력"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="userTel"
            value={form.userTel}
            onChange={handleChange}
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
            value={form.userZipCode}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="우편번호 입력"
            readOnly // 수정 불가
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="userAddress"
            value={form.userAddress}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="도로명 또는 지번 주소 입력"
            readOnly // 수정 불가
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
          disabled={loading}
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