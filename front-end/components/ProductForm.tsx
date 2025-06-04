// components/ProductForm.tsx
'use client'; // <-- 이 지시어를 추가하여 클라이언트 컴포넌트임을 명시합니다.
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Product 인터페이스는 기존과 동일하게 유지
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function ProductForm() {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8485';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    setMessage('');
    setError('');

    // 간단한 유효성 검사
    if (!productName || !productPrice || !productDescription) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    const newProduct: Product = {
      // ID는 백엔드에서 생성하는 것이 일반적이지만, 여기서는 임시로 타임스탬프 사용
      id: Date.now().toString(),
      name: productName,
      price: parseFloat(productPrice), // 문자열을 숫자로 변환
      description: productDescription,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/test/products`, {
        method: 'POST', // POST 요청
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 데이터를 보낸다고 명시
        },
        body: JSON.stringify(newProduct), // Product 객체를 JSON 문자열로 변환하여 본문에 담기
      });

      if (response.ok) {
        const responseText = await response.text(); // 백엔드에서 보낸 응답 메시지 받기
        setMessage(`상품이 성공적으로 전송되었습니다: ${responseText}`);
        // 폼 초기화
        setProductName('');
        setProductPrice('');
        setProductDescription('');
      } else {
        const errorBody = await response.text();
        setError(`데이터 전송 실패: ${response.status} ${response.statusText} - ${errorBody}`);
        console.error('Failed to send product:', errorBody);
      }
    } catch (err) {
      console.error('Error sending product:', err);
      setError('네트워크 오류 또는 서버 연결 실패.');
    }
  };

  return (
    <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      <h2>새로운 상품 추가 (클라이언트 컴포넌트)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
        <Input
          type="text"
          placeholder="상품 이름"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <Input
          type="number" // 숫자를 입력받도록 타입 설정
          placeholder="가격"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
          step="0.01" // 소수점 두 자리까지 허용
        />
        <textarea
          placeholder="상품 설명"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
          rows={3}
        />
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          상품 정보 전송
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}