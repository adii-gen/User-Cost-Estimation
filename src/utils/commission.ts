// // import { CommissionSummary, CreateCommissionRequest, SalesCommission } from './types';

// import { CommissionSummary, CreateCommissionRequest } from "@/app/api/commissions/route";

// export interface DateFilter {
//   startDate?: Date;
//   endDate?: Date;
// }

// interface CommissionService {
//   getOverallSummary(dateFilter?: DateFilter): Promise<CommissionSummary>;
//   getSalesPersonSummary(salesPersonId: string, dateFilter?: DateFilter): Promise<CommissionSummary>;
//   createCommission(data: CreateCommissionRequest): Promise<any>;
// }

// export const commissionService: CommissionService = {
//   async getOverallSummary(dateFilter?: DateFilter): Promise<CommissionSummary> {
//     const params = new URLSearchParams();
//     if (dateFilter?.startDate) {
//       params.append('startDate', dateFilter.startDate.toISOString());
//     }
//     if (dateFilter?.endDate) {
//       params.append('endDate', dateFilter.endDate.toISOString());
//     }

//     const response = await fetch(`/api/commissions?${params}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch overall commission summary');
//     }
//     return response.json();
//   },

//   async getSalesPersonSummary(
//     salesPersonId: string, 
//     dateFilter?: DateFilter
//   ): Promise<CommissionSummary> {
//     const params = new URLSearchParams();
//     params.append('salesPersonId', salesPersonId);
//     if (dateFilter?.startDate) {
//       params.append('startDate', dateFilter.startDate.toISOString());
//     }
//     if (dateFilter?.endDate) {
//       params.append('endDate', dateFilter.endDate.toISOString());
//     }

//     const response = await fetch(`/api/commissions?${params}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch sales person commission summary');
//     }
//     return response.json();
//   },

//   async createCommission(data: CreateCommissionRequest): Promise<any> {
//     const response = await fetch('/api/commissions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to create commission record');
//     }

//     return response.json();
//   },
// };

// // Error handling utility
// export class CommissionServiceError extends Error {
//   constructor(
//     message: string,
//     public statusCode?: number,
//     public details?: unknown
//   ) {
//     super(message);
//     this.name = 'CommissionServiceError';
//   }
// }

// // Helper functions
// export const buildCommissionQueryParams = (
//   dateFilter?: DateFilter,
//   salesPersonId?: string
// ): URLSearchParams => {
//   const params = new URLSearchParams();
  
//   if (salesPersonId) {
//     params.append('salesPersonId', salesPersonId);
//   }
//   if (dateFilter?.startDate) {
//     params.append('startDate', dateFilter.startDate.toISOString());
//   }
//   if (dateFilter?.endDate) {
//     params.append('endDate', dateFilter.endDate.toISOString());
//   }
  
//   return params;
// };


