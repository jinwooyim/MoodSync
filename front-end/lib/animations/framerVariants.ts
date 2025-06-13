// lib/animations/framerVariants.ts

import { Variants } from 'framer-motion';

// 메인 컨테이너의 등장 애니메이션
export const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 120,
            when: "beforeChildren",
            staggerChildren: 0.1
        } as const
    },
};

// 컬렉션 카드 자체의 등장 및 삭제 애니메이션
export const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

// 모달 배경 (오버레이) 애니메이션
export const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

// 모달 내용의 등장 및 삭제 애니메이션
export const modalContentVariants: Variants = { 
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 100 } as const },
    exit: { opacity: 0, y: -50, transition: { duration: 0.2 } },
};
