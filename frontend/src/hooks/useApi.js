// import { useState, useCallback } from 'react';
// import { toast } from 'sonner';

// const useApi = (apiFunction) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const request = useCallback(
//     async (...args) => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await apiFunction(...args);
//         setData(response.data);
//         return { data: response.data, error: null };
//       } catch (err) {
//         const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
//         setError(errorMessage);
//         if (err.response?.status !== 401) {
//           toast.error(errorMessage);
//         }
//         return { data: null, error: errorMessage };
//       } finally {
//         setLoading(false);
//       }
//     },
//     [apiFunction]
//   );

//   return { data, error, loading, request };
// };

// export default useApi;
