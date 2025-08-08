

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useAuthGuard = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  return checked;
};

//вставить на все страницы
// import { useAuthGuard } from '@/hooks/useAuthGuard';

// const checked = useAuthGuard();

// if (!checked) return null;
