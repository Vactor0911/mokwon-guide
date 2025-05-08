/**
 * 샘플 텍스트 생성 함수
 * @param index 반복문 인덱스
 * @returns 목원 길잡이 Mokwon Guide {index + 1}
 */
export const getSampleText = (index: number) => {
  return `목원 길잡이 Mokwon Guide ${index + 1}`;
};



// 환경 변수에서 암호화 키 가져오기
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

// 문자열 암호화 함수
export function encrypt(text: string): string {
  try {
    // XOR 기반 암호화 구현
    const result = [];
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result.push(String.fromCharCode(charCode));
    }
    
    // 유니코드 문자를 처리하기 위해 encodeURIComponent 사용
    return btoa(encodeURIComponent(result.join('')));
  } catch (error) {
    console.error("암호화 중 오류 발생", error);
    return text; // 오류 시 원본 반환
  }
}

// 문자열 복호화 함수
export function decrypt(encoded: string): string {
  try {
    // Base64 디코딩 후 URI 디코딩
    const text = decodeURIComponent(atob(encoded));
    const result = [];
    
    // XOR 복호화
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result.push(String.fromCharCode(charCode));
    }
    
    return result.join('');
  } catch (error) {
    console.error("복호화 중 오류 발생", error);
    return '[]'; // 오류 시 빈 배열 문자열 반환
  }
}

// 타입 호환성을 갖춘 암호화 스토리지 핸들러
export const encryptedStorage = {
  getItem: (key: string) => {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    
    try {
      const decrypted = decrypt(item);
      // 문자열을 객체로 파싱
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("복호화 또는 파싱 중 오류 발생", error);
      return []; // 오류 시 기본값 반환
    }
  },
  
  setItem: (key: string, value: string[]): void => {
    try {
      // 객체를 문자열로 직렬화 후 암호화
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, encrypt(serialized));
    } catch (error) {
      console.error("직렬화 또는 암호화 중 오류 발생", error);
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};