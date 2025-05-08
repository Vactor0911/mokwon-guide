import CryptoJS from 'crypto-js'; // 추가된 부분

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


/**
 * 문자열 암호화 함수 (AES)
 * @param text 암호화할 문자열
 * @returns AES 암호화된 문자열
 */
export function encrypt(text: string): string {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error("암호화 중 오류 발생", error);
    return text; // 오류 시 원본 반환
  }
}

/**
 * 문자열 복호화 함수 (AES)
 * @param encoded AES 암호화된 문자열
 * @returns 복호화된 문자열
 */
export function decrypt(encoded: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encoded, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("복호화 중 오류 발생", error);
    return ''; // 오류 시 빈 문자열 반환
  }
}


/**
 * 타입 호환성을 갖춘 암호화 스토리지 핸들러
 * @param index 반복문 인덱스
 * @returns 목원 길잡이 Mokwon Guide {index + 1}
 */
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